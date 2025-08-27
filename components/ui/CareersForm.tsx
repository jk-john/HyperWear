"use client";

// Removed server action import to fix HMR issues
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  fullName: z.string().min(1, { message: "Please enter your full name." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z
    .string()
    .min(1, { message: "Please enter the role you are applying for." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

export default function CareersForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: "",
      message: "",
    },
  });

  const {
    formState: { isSubmitting },
    reset,
  } = form;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'career',
          fullName: values.fullName,
          email: values.email,
          role: values.role,
          message: values.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const result = await response.json();
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Your career application has been submitted successfully!');
        reset();
      }
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
      console.error('Career application error:', error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-[var(--color-light)]">
          Full Name
        </Label>
        <Input
          id="fullName"
          {...form.register("fullName")}
          className="mt-2 border-[var(--color-mint)] bg-[var(--color-emerald)] text-[var(--color-light)] placeholder:text-[var(--color-accent)]"
        />
        {form.formState.errors.fullName && (
          <p className="pt-1 text-xs text-red-500">
            {form.formState.errors.fullName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-[var(--color-light)]">
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          {...form.register("email")}
          className="mt-2 border-[var(--color-mint)] bg-[var(--color-emerald)] text-[var(--color-light)] placeholder:text-[var(--color-accent)]"
        />
        {form.formState.errors.email && (
          <p className="pt-1 text-xs text-red-500">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role" className="text-[var(--color-light)]">
          Role
        </Label>
        <Input
          id="role"
          {...form.register("role")}
          className="mt-2 border-[var(--color-mint)] bg-[var(--color-emerald)] text-[var(--color-light)] placeholder:text-[var(--color-accent)]"
        />
        {form.formState.errors.role && (
          <p className="pt-1 text-xs text-red-500">
            {form.formState.errors.role.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-[var(--color-light)]">
          Message
        </Label>
        <textarea
          id="message"
          {...form.register("message")}
          className="mt-2 block w-full rounded-md border-[var(--color-mint)] bg-[var(--color-emerald)] p-2 text-[var(--color-light)] placeholder:text-[var(--color-accent)] focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={4}
        />
        {form.formState.errors.message && (
          <p className="pt-1 text-xs text-red-500">
            {form.formState.errors.message.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-[var(--color-mint)] text-[var(--color-dark)] hover:bg-[var(--color-secondary)]"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
