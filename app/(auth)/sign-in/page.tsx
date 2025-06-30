import { SignInForm } from "@/components/ui/SignInForm";

export default function SignInPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const callbackUrl = searchParams.callbackUrl as string;

  return (
    <div className="flex justify-center py-20">
      <SignInForm callbackUrl={callbackUrl} />
    </div>
  );
}
