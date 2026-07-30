import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="mesh-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="text-display text-[10rem] leading-none text-foreground/5 font-black">
            404
          </div>
          <h1 className="text-display -mt-8 text-4xl">Off the stage</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This page doesn&apos;t exist. Maybe it was improvised.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-full bg-foreground px-6 py-3 text-sm text-background"
            >
              Home
            </Link>
            <Link
              href="/book"
              className="rounded-full border px-6 py-3 text-sm"
            >
              Book a class
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
