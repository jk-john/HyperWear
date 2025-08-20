import { SignInForm } from "@/components/ui/SignInForm";

export default async function SignInPage(
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  const callbackUrl = searchParams.callbackUrl as string;
  const message = searchParams.message as string;

  return (
    <div className="flex justify-center py-20">
      <SignInForm callbackUrl={callbackUrl} successMessage={message} />
    </div>
  );
}
