"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseCallbackUrl } from "@/lib/supabase/utils";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useId, useMemo, useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Icons } from "./icons";

async function checkEmailExists(email: string): Promise<{ exists: boolean; providers: string[] } | null> {
  try {
    const res = await fetch("/api/auth/check-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

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

export const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [highlightGoogle, setHighlightGoogle] = useState(false);
  const router = useRouter();
  const id = useId();
  const debounceTimer = useRef<NodeJS.Timeout>();
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

  const debouncedEmailCheck = useCallback(async (email: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(async () => {
      if (!email || !email.includes('@')) return;
      
      const probe = await checkEmailExists(email);
      if (probe?.exists && probe.providers.includes("google")) {
        setHighlightGoogle(true);
        // Auto-hide highlight after 3 seconds
        setTimeout(() => setHighlightGoogle(false), 3000);
      } else {
        setHighlightGoogle(false);
      }
    }, 250);
  }, []);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // Check if email already exists before proceeding with signup
      const probe = await checkEmailExists(values.email);
      if (probe?.exists) {
        if (probe.providers.includes("google")) {
          toast.error("This email is already registered with Google. Please continue with Google.");
          setHighlightGoogle(true);
          setTimeout(() => setHighlightGoogle(false), 3000);
          return;
        }
        if (probe.providers.includes("email")) {
          toast.error("An account with this email already exists. Try signing in or reset your password.");
          return;
        }
        toast.error(`This email is registered with ${probe.providers.join(", ")}. Use that provider to continue.`);
        return;
      }

      // Proceed with existing signup flow
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
        }),
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        toast.success("Check your email to confirm your account.");
        router.push("/sign-in");
      } else if (result.error) {
        toast.error(result.error);
      } else if (response.status >= 500) {
        // Fallback: try client-side signup if API route fails with 500
        await handleClientSideSignUp(values);
      } else {
        toast.error("Something went wrong signing up. Please try again.");
      }
    } catch {
      // Fallback: try client-side signup if API call fails entirely
      await handleClientSideSignUp(values);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientSideSignUp = async (values: z.infer<typeof formSchema>) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: "https://hyperwear.io/auth/callback",
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else if (data.user) {
        toast.success("Check your email to confirm your account.");
        router.push("/sign-in");
      }
    } catch {
      toast.error("Failed to create account. Please try again.");
    }
  };

  const handleOAuthSignIn = async (provider: "google") => {
    const supabase = createClient();
    const redirectTo = getSupabaseCallbackUrl();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
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

      <div className="mb-6 flex flex-col space-y-4">
        <button
          className={cn(
            "group/btn relative flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-[var(--color-emerald)] bg-[var(--color-deep)] px-4 font-medium text-[var(--color-light)] shadow-lg transition-all duration-300 ease-in-out hover:bg-[var(--color-emerald)]",
            highlightGoogle && "animate-pulse ring-2 ring-blue-400 ring-opacity-75"
          )}
          type="button"
          onClick={() => handleOAuthSignIn("google")}
        >
          <Icons.google className="h-4 w-4" />
          <span className="text-sm">Google</span>
          <BottomGradient />
        </button>
      </div>

      <p className="mb-6 flex items-center gap-x-3 text-sm text-[var(--color-accent)] before:h-px before:flex-1 before:bg-[var(--color-emerald)] after:h-px after:flex-1 after:bg-[var(--color-emerald)]">
        or
      </p>

      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        {/* First/Last Name */}
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

        {/* Email */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor={`${id}-email`} className="text-[var(--color-light)]">
            Email Address
          </Label>
          <Input
            id={`${id}-email`}
            placeholder="john.doe@example.com"
            type="email"
            {...form.register("email")}
            onBlur={(e) => debouncedEmailCheck(e.target.value)}
            className="border-[var(--color-mint)] bg-[var(--color-emerald)] text-[var(--color-light)] placeholder:text-[var(--color-accent)]"
          />
          {form.formState.errors.email && (
            <p className="pt-1 text-xs text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </LabelInputContainer>

        {/* Password */}
        <LabelInputContainer className="mb-4">
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

        {/* Confirm Password */}
        <LabelInputContainer className="mb-8">
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
      </form>
    </div>
  );
};
