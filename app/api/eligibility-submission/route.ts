import { createClient } from "@/utils/supabase/server";
import { rateLimit, getClientIdentifier, sanitizeError } from "@/lib/security";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for eligibility submission
const submissionSchema = z.object({
  wallet_address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
    message: "Please enter a valid EVM wallet address.",
  }),
  purr_nft_count: z.number().min(1, {
    message: "Please enter a valid number of PURR NFTs (minimum 1).",
  }).optional(),
  additional_info: z.string().max(500, {
    message: "Additional info must be 500 characters or less.",
  }).optional(),
  submission_type: z.string().default("purr_nft"),
});

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(clientId, { maxRequests: 10, windowMs: 60000 }); // 10 requests per minute
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        sanitizeError('rate_limit', 'rate_limit'),
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      );
    }

    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        sanitizeError(authError, 'auth'),
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = submissionSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    const { wallet_address, purr_nft_count, additional_info, submission_type } = validationResult.data;

    // Check if user has already submitted for this submission type
    const { data: existingSubmission, error: checkError } = await supabase
      .from("purr_nft_eligible_addresses")
      .select("id, created_at")
      .eq("user_id", user.id)
      .eq("submission_type", submission_type)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is expected if no submission exists
      console.error("Error checking existing submission:", checkError);
      return NextResponse.json(
        sanitizeError(checkError, 'server'),
        { status: 500 }
      );
    }

    if (existingSubmission) {
      return NextResponse.json(
        { 
          error: "You have already submitted your eligibility information.",
          submittedAt: existingSubmission.created_at 
        },
        { status: 409 } // Conflict status
      );
    }

    // Insert the new submission
    const { data: newSubmission, error: insertError } = await supabase
      .from("purr_nft_eligible_addresses")
      .insert({
        user_id: user.id,
        wallet_address,
        purr_nft_count,
        additional_info,
        submission_type,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting submission:", insertError);
      return NextResponse.json(
        sanitizeError(insertError, 'server'),
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your eligibility information has been submitted successfully!",
      submission: {
        id: newSubmission.id,
        created_at: newSubmission.created_at,
        submission_type: newSubmission.submission_type,
      }
    });

  } catch (error) {
    console.error("Unexpected error in eligibility submission:", error);
    return NextResponse.json(
      sanitizeError(error, 'server'),
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user's submissions
    const { data: submissions, error: fetchError } = await supabase
      .from("purr_nft_eligible_addresses")
      .select("id, wallet_address, purr_nft_count, submission_type, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Error fetching submissions:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch submissions" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      submissions: submissions || []
    });

  } catch (error) {
    console.error("Unexpected error fetching submissions:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}