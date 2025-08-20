import Link from "next/link";

export default function AuthCodeErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const errorMessage = searchParams?.error;
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-950/50 to-red-900/50 p-8 text-center shadow-xl backdrop-blur-sm">
        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.924-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">
              Authentication Error
            </h1>
            <p className="text-red-200">
              We couldn&apos;t verify your email confirmation link.
            </p>
            {errorMessage && (
              <div className="mt-4 rounded-md bg-red-900/50 p-3">
                <p className="text-sm text-red-300">Error: {errorMessage}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 text-sm text-red-100">
          <p>This could happen because:</p>
          <ul className="space-y-1 text-left">
            <li>• The link has expired</li>
            <li>• The link has already been used</li>
            <li>• The link is invalid or corrupted</li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-red-200">
            Don&apos;t worry! You can try these options:
          </p>
          
          <div className="space-y-2">
            <Link
              href="/sign-up"
              className="block w-full rounded-md bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:from-blue-700 hover:to-blue-800"
            >
              Sign up again
            </Link>
            
            <Link
              href="/sign-in"
              className="block w-full rounded-md border border-gray-600 px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
            >
              Try signing in
            </Link>
            
            <Link
              href="/password-reset"
              className="block w-full text-sm text-blue-400 transition-colors hover:text-blue-300"
            >
              Reset your password
            </Link>
          </div>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="text-sm text-gray-400 transition-colors hover:text-white"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}