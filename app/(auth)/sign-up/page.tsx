import { SignupForm } from "@/components/ui/SignUpForm";

export default async function SignUpPage(
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  const errorType = searchParams.error as string;
  const message = searchParams.message as string;

  return (
    <div className="flex min-h-screen justify-center py-20">
      <SignupForm errorType={errorType} errorMessage={message} />
    </div>
  );
}
