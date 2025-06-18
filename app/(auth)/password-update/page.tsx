import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UpdatePasswordForm } from "@/components/ui/UpdatePasswordForm";

export default function UpdatePasswordPage() {
  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <Card className="w-full border-[var(--color-emerald)] bg-[var(--color-deep)] sm:w-96">
        <CardHeader>
          <CardTitle className="text-[var(--color-light)]">
            Update Your Password
          </CardTitle>
          <CardDescription className="text-[var(--color-accent)]">
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpdatePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
