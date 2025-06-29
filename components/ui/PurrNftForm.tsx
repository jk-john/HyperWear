"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./button";

const formSchema = z.object({
  evm_address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
    message: "Please enter a valid EVM address.",
  }),
  email_address: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

async function addPurrHolder(data: z.infer<typeof formSchema>) {
  const supabase = createClient();
  const { error } = await supabase.from("purr_holders").insert(data);
  if (error) {
    throw error;
  }
}

export function PurrNftForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      evm_address: "",
      email_address: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await addPurrHolder(values);
      toast.success("Your information has been submitted successfully!");
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="evm_address" className="font-body text-md text-white">
          EVM Address
        </Label>
        <Input
          id="evm_address"
          placeholder="0x..."
          {...form.register("evm_address")}
          className="border-mint placeholder:text-mint hover:border-mint/80 mt-4 bg-transparent text-white"
        />
        {form.formState.errors.evm_address && (
          <p className="pt-1 text-xs text-red-400">
            {form.formState.errors.evm_address.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email_address" className="font-body text-md text-white">
          Email Address
        </Label>
        <Input
          id="email_address"
          type="email"
          placeholder="your@email.com"
          {...form.register("email_address")}
          className="border-mint placeholder:text-mint hover:border-mint/80 mt-4 bg-transparent text-white"
        />
        {form.formState.errors.email_address && (
          <p className="pt-1 text-xs text-red-400">
            {form.formState.errors.email_address.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="text-jungle bg-mint hover:bg-mint/80 hover:shadow-cream/40 w-full rounded-full py-6 text-lg font-bold transition-colors hover:text-white"
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
