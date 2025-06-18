"use client";

import { Button } from "@/components/ui/button";
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

const Icons = {
  gitHub: (props: React.SVGProps<SVGSVGElement>) => <Github {...props} />,
  google: (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      />
    </svg>
  ),
};

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
          <Button
            size="sm"
            variant="outline"
            type="button"
            className="border-[var(--color-emerald)] bg-[var(--color-emerald)] text-[var(--color-light)] hover:bg-[var(--color-mint)]"
            onClick={() => handleOAuthSignIn("github")}
          >
            <Icons.gitHub className="mr-2 size-4" />
            GitHub
          </Button>
          <Button
            size="sm"
            variant="outline"
            type="button"
            className="border-[var(--color-emerald)] bg-[var(--color-emerald)] text-[var(--color-light)] hover:bg-[var(--color-mint)]"
            onClick={() => handleOAuthSignIn("google")}
          >
            <Icons.google className="mr-2 size-4" />
            Google
          </Button>
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
              className="border-[var(--color-mint)] bg-[var(--color-emerald)] text-[var(--color-light)] placeholder:text-[var(--color-accent)]"
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
                className="border-[var(--color-mint)] bg-[var(--color-emerald)] pr-10 text-[var(--color-light)] placeholder:text-[var(--color-accent)]"
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
