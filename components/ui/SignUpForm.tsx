"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff, Github, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useId, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Bottom gradient component for buttons
const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

// Label input container
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

// Password strength checker component
const PasswordStrengthInput = ({
  value,
  onChange,
  id,
  error,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  error?: string;
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(value);
  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          id={id}
          className="pe-9"
          placeholder="Password"
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={onChange}
          aria-invalid={!!error || strengthScore < 4}
          aria-describedby={`${id}-description`}
        />
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10  focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          aria-controls="password"
        >
          {isVisible ? (
            <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Eye size={16} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>

      <div
        className="h-1 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={strengthScore}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-label="Password strength"
      >
        <div
          className={`h-full ${getStrengthColor(
            strengthScore
          )} transition-all duration-500 ease-out`}
          style={{ width: `${(strengthScore / 4) * 100}%` }}
        ></div>
      </div>

      {error && <p className="text-red-500 text-xs pt-1">{error}</p>}

      <p
        id={`${id}-description`}
        className="text-sm font-medium text-foreground"
      >
        {getStrengthText(strengthScore)}. Must contain:
      </p>

      <ul className="space-y-1.5" aria-label="Password requirements">
        {strength.map((req, index) => (
          <li key={index} className="flex items-center gap-2">
            {req.met ? (
              <Check
                size={16}
                className="text-emerald-500"
                aria-hidden="true"
              />
            ) : (
              <X
                size={16}
                className="text-muted-foreground/80"
                aria-hidden="true"
              />
            )}
            <span
              className={`text-xs ${
                req.met ? "text-emerald-600" : "text-muted-foreground"
              }`}
            >
              {req.text}
              <span className="sr-only">
                {req.met ? " - Requirement met" : " - Requirement not met"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const formSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

// Main signup form component
export const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordId = useId();
  const confirmPasswordId = useId();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          first_name: values.firstName,
          last_name: values.lastName,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    toast.success(
      "Signed up successfully! Please check your email to verify your account."
    );
    router.push("/sign-in");
    router.refresh();
    setIsLoading(false);
  };

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback?next=/?signed_up=true`,
      },
    });

    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-2xl p-8 shadow-lg bg-[var(--color-deep)] text-[var(--color-light)] border border-[var(--color-emerald)]">
      <h2 className="font-bold text-2xl text-[var(--color-light)] mb-2">
        Create Your Account
      </h2>
      <p className="text-[var(--color-accent)] text-sm mb-8">
        Join us today and start your journey with HyperWear.
      </p>

      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <LabelInputContainer>
            <Label htmlFor="firstname" className="text-[var(--color-light)]">
              First name
            </Label>
            <Input
              id="firstname"
              placeholder="John"
              type="text"
              {...form.register("firstName")}
              className="bg-[var(--color-emerald)] text-[var(--color-light)] border-[var(--color-mint)] placeholder:text-[var(--color-accent)]"
            />
            {form.formState.errors.firstName && (
              <p className="text-red-500 text-xs pt-1">
                {form.formState.errors.firstName.message}
              </p>
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname" className="text-[var(--color-light)]">
              Last name
            </Label>
            <Input
              id="lastname"
              placeholder="Doe"
              type="text"
              {...form.register("lastName")}
              className="bg-[var(--color-emerald)] text-[var(--color-light)] border-[var(--color-mint)] placeholder:text-[var(--color-accent)]"
            />
            {form.formState.errors.lastName && (
              <p className="text-red-500 text-xs pt-1">
                {form.formState.errors.lastName.message}
              </p>
            )}
          </LabelInputContainer>
        </div>

        <LabelInputContainer>
          <Label htmlFor="email" className="text-[var(--color-light)]">
            Email Address
          </Label>
          <Input
            id="email"
            placeholder="john.doe@example.com"
            type="email"
            {...form.register("email")}
            className="bg-[var(--color-emerald)] text-[var(--color-light)] border-[var(--color-mint)] placeholder:text-[var(--color-accent)]"
          />
          {form.formState.errors.email && (
            <p className="text-red-500 text-xs pt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor={passwordId} className="text-[var(--color-light)]">
            Password
          </Label>
          <PasswordStrengthInput
            id={passwordId}
            value={form.watch("password")}
            onChange={(e) => form.setValue("password", e.target.value)}
            error={form.formState.errors.password?.message}
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label
            htmlFor={confirmPasswordId}
            className="text-[var(--color-light)]"
          >
            Confirm Password
          </Label>
          <Input
            id={confirmPasswordId}
            placeholder="Confirm your password"
            type="password"
            {...form.register("confirmPassword")}
            className="bg-[var(--color-emerald)] text-[var(--color-light)] border-[var(--color-mint)] placeholder:text-[var(--color-accent)]"
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-red-500 text-xs pt-1">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </LabelInputContainer>

        <button
          className="bg-[var(--color-mint)] text-[var(--color-dark)] relative group/btn w-full rounded-md h-10 font-medium shadow-lg transition-all duration-300 ease-in-out hover:bg-[var(--color-secondary)] disabled:opacity-50"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign up →"}
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-[var(--color-emerald)] to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <button
            className="relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-[var(--color-light)] rounded-md h-10 font-medium shadow-lg bg-[var(--color-deep)] border border-[var(--color-emerald)] hover:bg-[var(--color-emerald)] transition-all duration-300 ease-in-out"
            type="button"
            onClick={() => handleOAuthSignIn("github")}
          >
            <Github className="h-4 w-4 text-[var(--color-light)]" />
            <span className="text-sm">GitHub</span>
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
  );
};
