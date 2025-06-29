"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Github } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./button";

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

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    const userName =
      data.user?.user_metadata.first_name ||
      data.user?.user_metadata.name ||
      data.user?.email;

    toast.success(`Signed in successfully! Welcome ${userName}`);
    router.push("/");
    router.refresh();
    setIsLoading(false);
  };

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback?next=/?signed_in=true`,
      },
    });

    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <Card className="w-full border-[var(--color-emerald)] bg-[var(--color-deep)] sm:w-96">
      <CardHeader>
        <CardTitle className="text-[var(--color-light)]">
          Sign in to HyperWear
        </CardTitle>
        <CardDescription className="text-[var(--color-accent)]">
          Welcome back! Please sign in to continue
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-y-4 pb-0">
        <div className="grid grid-cols-2 gap-x-4">
          <button
            className="group/btn relative flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-[var(--color-emerald)] bg-[var(--color-deep)] px-4 font-medium text-[var(--color-light)] shadow-lg transition-all duration-300 ease-in-out hover:bg-[var(--color-emerald)]"
            type="button"
            onClick={() => handleOAuthSignIn("github")}
          >
            <Github className="h-4 w-4 text-[var(--color-light)]" />
            <span className="text-sm">GitHub</span>
          </button>
          <button
            className="group/btn relative flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-[var(--color-emerald)] bg-[var(--color-deep)] px-4 font-medium text-[var(--color-light)] shadow-lg transition-all duration-300 ease-in-out hover:bg-[var(--color-emerald)]"
            type="button"
            onClick={() => handleOAuthSignIn("google")}
          >
            <GoogleIcon className="mr-2 size-4" />
            <span className="text-sm">Google</span>
          </button>
        </div>

        <p className="flex items-center gap-x-3 text-sm text-[var(--color-accent)] before:h-px before:flex-1 before:bg-[var(--color-emerald)] after:h-px after:flex-1 after:bg-[var(--color-emerald)]">
          or
        </p>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[var(--color-light)]">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
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
            <Label htmlFor="password" className="text-[var(--color-light)]">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...form.register("password")}
                className="mt-2 border-[var(--color-mint)] bg-[var(--color-emerald)] pr-10 text-[var(--color-light)] placeholder:text-[var(--color-accent)]"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-[var(--color-accent)]" />
                ) : (
                  <Eye className="h-4 w-4 text-[var(--color-accent)]" />
                )}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="pt-1 text-xs text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end">
            <Link
              href="/password-reset"
              className="text-sm text-gray-400 hover:text-white"
            >
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-[var(--color-mint)] text-[var(--color-dark)] hover:bg-[var(--color-secondary)]"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center pt-4 pb-4">
        <Link
          href="/sign-up"
          className="text-sm text-white hover:text-[var(--color-secondary)]"
        >
          Don&apos;t have an account? Sign up
        </Link>
      </CardFooter>
    </Card>
  );
}
