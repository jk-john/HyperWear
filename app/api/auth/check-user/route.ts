import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const normalizedEmail = String(email ?? "").trim().toLowerCase();
    if (!normalizedEmail) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!baseUrl || !serviceKey) {
      return NextResponse.json({ error: "Server config missing" }, { status: 500 });
    }

    // GoTrue v2 Admin API: GET /auth/v1/admin/users?email=<email>
    // Returns 200 with single user object if found, 404 if not found
    const res = await fetch(`${baseUrl}/auth/v1/admin/users?email=${encodeURIComponent(normalizedEmail)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    // Handle 404 as "user not found"
    if (res.status === 404) {
      return NextResponse.json({ exists: false, providers: [] });
    }

    // Handle other non-200 responses as errors
    if (!res.ok) {
      const text = await res.text();
      console.warn(`Admin API error (${res.status}):`, text);
      return NextResponse.json({ 
        error: `Admin API error (${res.status}): ${text}` 
      }, { status: 500 });
    }

    // Parse response - GoTrue v2 returns single user object, not array
    const userData = await res.json();
    
    // Extract providers from identities array
    const identities = userData?.identities || [];
    const providers: string[] = identities
      .map((identity: unknown) => {
        const typedIdentity = identity as { provider?: string };
        return typedIdentity?.provider;
      })
      .filter((provider: string | undefined): provider is string => Boolean(provider));

    return NextResponse.json({ 
      exists: true, // If we get 200, user exists
      providers 
    });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unexpected error";
    console.error("Check user error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}