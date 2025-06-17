import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-dark text-light flex min-h-[100dvh] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="max-w-md">
        <h1 className="text-secondary text-9xl font-bold tracking-tighter">
          <span className="text-secondary">404</span>
        </h1>
        <p className="text-cream mt-4 text-2xl font-medium tracking-wide">
          Oops, page not found!
        </p>
        <p className="mt-2 text-white">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="focus-visible:ring-accent text-dark hover:bg-primary mt-8 inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium shadow transition-colors hover:text-white focus-visible:ring-1 focus-visible:outline-none"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
