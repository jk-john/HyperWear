"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./button";

const formSchema = z.object({
  wallet_address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
    message: "Please enter a valid EVM wallet address.",
  }),
  purr_nft_count: z.number().min(1, {
    message: "Please enter a valid number of PURR NFTs (minimum 1).",
  }),
  additional_info: z.string().max(500, {
    message: "Additional information must be 500 characters or less.",
  }).optional(),
});

type FormData = z.infer<typeof formSchema>;

export function PurrNftForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissionDate, setSubmissionDate] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wallet_address: "",
      purr_nft_count: 1,
      additional_info: "",
    },
  });

  // Check authentication status and existing submissions
  useEffect(() => {
    async function checkAuthAndSubmissions() {
      const supabase = createClient();
      
      // Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        setIsAuthenticated(false);
        return;
      }
      
      setIsAuthenticated(true);
      
      // Check for existing submissions
      try {
        const response = await fetch("/api/eligibility-submission");
        if (response.ok) {
          const data = await response.json();
          const purrSubmission = data.submissions?.find(
            (sub: { submission_type: string }) => sub.submission_type === "purr_nft"
          );
          
          if (purrSubmission) {
            setHasSubmitted(true);
            setSubmissionDate(new Date(purrSubmission.created_at).toLocaleDateString());
          }
        }
      } catch (error) {
        console.error("Error checking submissions:", error);
      }
    }

    checkAuthAndSubmissions();
  }, []);

  const handleSubmit = async (values: FormData) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to submit your information.");
      return;
    }

    if (hasSubmitted) {
      toast.error("You have already submitted your eligibility information.");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/eligibility-submission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet_address: values.wallet_address,
          purr_nft_count: values.purr_nft_count,
          additional_info: values.additional_info,
          submission_type: "purr_nft",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          // User has already submitted
          setHasSubmitted(true);
          if (data.submittedAt) {
            setSubmissionDate(new Date(data.submittedAt).toLocaleDateString());
          }
          toast.error(data.error);
        } else if (response.status === 401) {
          setIsAuthenticated(false);
          toast.error("Please sign in to submit your information.");
        } else if (data.details) {
          // Validation errors
          data.details.forEach((detail: { field: string; message: string }) => {
            toast.error(`${detail.field}: ${detail.message}`);
          });
        } else {
          toast.error(data.error || "Failed to submit information");
        }
        return;
      }

      // Success
      setHasSubmitted(true);
      setSubmissionDate(new Date(data.submission.created_at).toLocaleDateString());
      toast.success(data.message);
      form.reset();

    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-4 w-1/3 rounded bg-gray-700" />
          <div className="h-10 w-full rounded bg-gray-700" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-1/4 rounded bg-gray-700" />
          <div className="h-10 w-full rounded bg-gray-700" />
        </div>
        <div className="h-12 w-full rounded-full bg-gray-700" />
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">Sign In Required</h3>
          <p className="text-gray-300 text-sm">
            Please sign in to submit your PURR NFT holder information.
          </p>
        </div>
        <Link href="/sign-in" className="block">
          <Button className="text-jungle bg-mint hover:bg-mint/80 hover:shadow-cream/40 w-full rounded-full py-6 text-lg font-bold transition-colors hover:text-white">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  // Show success message if already submitted
  if (hasSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">Already Submitted</h3>
          <p className="text-gray-300 text-sm">
            You have already submitted your eligibility information
            {submissionDate && ` on ${submissionDate}`}.
          </p>
          <p className="text-gray-400 text-xs">
            We&apos;ll contact you when the promotion is available.
          </p>
        </div>
      </div>
    );
  }

  // Show the form
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="wallet_address" className="font-body text-md text-white">
          EVM Wallet Address *
        </Label>
        <Input
          id="wallet_address"
          placeholder="0x..."
          {...form.register("wallet_address")}
          className="border-mint placeholder:text-mint hover:border-mint/80 mt-4 bg-transparent text-white"
          disabled={isLoading}
        />
        {form.formState.errors.wallet_address && (
          <p className="pt-1 text-xs text-red-400">
            {form.formState.errors.wallet_address.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="purr_nft_count" className="font-body text-md text-white">
          Number of PURR NFTs *
        </Label>
        <Input
          id="purr_nft_count"
          type="number"
          min="1"
          placeholder="1"
          {...form.register("purr_nft_count", { valueAsNumber: true })}
          className="border-mint placeholder:text-mint hover:border-mint/80 mt-4 bg-transparent text-white"
          disabled={isLoading}
        />
        {form.formState.errors.purr_nft_count && (
          <p className="pt-1 text-xs text-red-400">
            {form.formState.errors.purr_nft_count.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="additional_info" className="font-body text-md text-white">
          Additional Information (Optional)
        </Label>
        <Textarea
          id="additional_info"
          placeholder="Any additional information you'd like to share..."
          rows={3}
          {...form.register("additional_info")}
          className="border-mint placeholder:text-mint hover:border-mint/80 mt-4 bg-transparent text-white resize-none"
          disabled={isLoading}
          maxLength={500}
        />
        {form.formState.errors.additional_info && (
          <p className="pt-1 text-xs text-red-400">
            {form.formState.errors.additional_info.message}
          </p>
        )}
        <p className="text-xs text-gray-400">
          {form.watch("additional_info")?.length || 0}/500 characters
        </p>
      </div>

      <Button
        type="submit"
        className="text-jungle bg-mint hover:bg-mint/80 hover:shadow-cream/40 w-full rounded-full py-6 text-lg font-bold transition-colors hover:text-white"
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Submit Information"}
      </Button>

      <p className="text-xs text-gray-400 text-center">
        * Required fields. Your information will be kept confidential and used only for eligibility verification.
      </p>
    </form>
  );
}