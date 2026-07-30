"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="text-display text-8xl text-muted-foreground/20">:(</div>
        <h1 className="text-display mt-4 text-3xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred."}
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-foreground px-6 py-3 text-sm text-background"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border px-6 py-3 text-sm"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
