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
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
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
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" {...props}>
    <path
      fill="#4285F4"
      d="M24 9.5c3.9 0 6.9 1.6 9.1 3.7l6.8-6.8C35.9 2.5 30.4 0 24 0 14.9 0 7.2 5.4 3 13l8.2 6.3C12.6 13.5 17.9 9.5 24 9.5z"
    />
    <path
      fill="#34A853"
      d="M46.6 25.1c0-1.7-.2-3.4-.4-5.1H24v9.6h12.7c-.5 3.1-2.1 5.7-4.6 7.5l7.9 6.1c4.6-4.3 7.3-10.4 7.3-18.1z"
    />
    <path
      fill="#FBBC05"
      d="M11.2 28.1c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8L3 12.2C1.1 16.1 0 20.6 0 25.3c0 4.7 1.1 9.2 3 13.1l8.2-6.3z"
    />
    <path
      fill="#EA4335"
      d="M24 48c6.5 0 12-2.1 15.9-5.7l-7.9-6.1c-2.1 1.4-4.9 2.3-8 2.3-6.1 0-11.4-4-13.2-9.6L3 38.3C7.2 44.6 14.9 48 24 48z"
    />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

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
          className="text-muted-foreground/80 hover:text-foreground focus-visible:outline-ring/70 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg outline-offset-2 transition-colors focus:z-10 focus-visible:outline-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
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
        className="bg-border h-1 w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={strengthScore}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-label="Password strength"
      >
        <div
          className={`h-full ${getStrengthColor(
            strengthScore,
          )} transition-all duration-500 ease-out`}
          style={{ width: `${(strengthScore / 4) * 100}%` }}
        ></div>
      </div>

      {error && <p className="pt-1 text-xs text-red-500">{error}</p>}

      <p
        id={`${id}-description`}
        className="text-foreground text-sm font-medium"
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
          full_name: `${values.firstName} ${values.lastName}`,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    toast.success(
      "Signed up successfully! Please check your email to verify your account.",
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
    <div className="mx-auto w-full max-w-md rounded-2xl border border-[var(--color-emerald)] bg-[var(--color-deep)] p-8 text-[var(--color-light)] shadow-lg">
      <h2 className="mb-2 text-2xl font-bold text-[var(--color-light)]">
        Create Your Account
      </h2>
      <p className="mb-8 text-sm text-[var(--color-accent)]">
        Join us today and start your journey with HyperWear.
      </p>

      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <LabelInputContainer>
            <Label htmlFor="firstname" className="text-[var(--color-light)]">
              First name
            </Label>
            <Input
              id="firstname"
              placeholder="John"
              type="text"
              {...form.register("firstName")}
              className="border-[var(--color-mint)] bg-[var(--color-emerald)] text-[var(--color-light)] placeholder:text-[var(--color-accent)]"
            />
            {form.formState.errors.firstName && (
              <p className="pt-1 text-xs text-red-500">
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
              className="border-[var(--color-mint)] bg-[var(--color-emerald)] text-[var(--color-light)] placeholder:text-[var(--color-accent)]"
            />
            {form.formState.errors.lastName && (
              <p className="pt-1 text-xs text-red-500">
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
            className="border-[var(--color-mint)] bg-[var(--color-emerald)] text-[var(--color-light)] placeholder:text-[var(--color-accent)]"
          />
          {form.formState.errors.email && (
            <p className="pt-1 text-xs text-red-500">
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
            className="border-[var(--color-mint)] bg-[var(--color-emerald)] text-[var(--color-light)] placeholder:text-[var(--color-accent)]"
          />
          {form.formState.errors.confirmPassword && (
            <p className="pt-1 text-xs text-red-500">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </LabelInputContainer>

        <button
          className="group/btn relative h-10 w-full rounded-md bg-[var(--color-mint)] font-medium text-[var(--color-dark)] shadow-lg transition-all duration-300 ease-in-out hover:bg-[var(--color-secondary)] disabled:opacity-50"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign up →"}
          <BottomGradient />
        </button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-emerald)] to-transparent" />

        <div className="flex flex-col space-y-4">
          <button
            className="group/btn relative flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-[var(--color-emerald)] bg-[var(--color-deep)] px-4 font-medium text-[var(--color-light)] shadow-lg transition-all duration-300 ease-in-out hover:bg-[var(--color-emerald)]"
            type="button"
            onClick={() => handleOAuthSignIn("github")}
          >
            <Github className="h-4 w-4 text-[var(--color-light)]" />
            <span className="text-sm">GitHub</span>
            <BottomGradient />
          </button>
          <button
            className="group/btn relative flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-[var(--color-emerald)] bg-[var(--color-deep)] px-4 font-medium text-[var(--color-light)] shadow-lg transition-all duration-300 ease-in-out hover:bg-[var(--color-emerald)]"
            type="button"
            onClick={() => handleOAuthSignIn("google")}
          >
            <GoogleIcon className="h-4 w-4" />
            <span className="text-sm">Google</span>
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
  );
};
