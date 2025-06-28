import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PasswordResetForm } from "@/components/ui/PasswordResetForm";
import Link from "next/link";

export default function PasswordResetPage() {
  return (
    <div className="mt-10 flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <Card className="w-full border-[var(--color-emerald)] bg-[var(--color-deep)] sm:w-96">
        <CardHeader>
          <CardTitle className="text-[var(--color-light)]">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-[var(--color-accent)]">
            Enter your email to receive a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordResetForm />
        </CardContent>
      </Card>
      <Link
        href="/sign-in"
        className="self-center pt-4 text-sm text-white hover:text-[var(--color-secondary)]"
        legacyBehavior>
        <Button className="bg-mint hover:bg-secondary/80 rounded-full text-white hover:text-black">
          Remembered your password? Sign In
        </Button>
      </Link>
    </div>
  );
}
