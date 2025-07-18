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
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./button";
import { Icons } from "./icons";



const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export function SignInForm({ callbackUrl }: { callbackUrl?: string }) {
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
    router.push(callbackUrl || "/");
    router.refresh();
    setIsLoading(false);
  };

  const handleOAuthSignIn = async (provider: "google" | "twitter") => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback${callbackUrl ? `?next=${encodeURIComponent(callbackUrl)}` : ""}`,
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
            onClick={() => handleOAuthSignIn("twitter")}
          >
            <Icons.twitter className="h-4 w-4 text-[var(--color-light)]" />
            <span className="text-sm">X</span>
          </button>
          <button
            className="group/btn relative flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-[var(--color-emerald)] bg-[var(--color-deep)] px-4 font-medium text-[var(--color-light)] shadow-lg transition-all duration-300 ease-in-out hover:bg-[var(--color-emerald)]"
            type="button"
            onClick={() => handleOAuthSignIn("google")}
          >
            <Icons.google className="mr-2 size-4" />
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
