"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Lock, User, Eye, EyeOff, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const marqueeWords = ["move", "flow", "grit", "grace", "rhythm", "rise", "soul", "spark"];

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden pt-24 pb-16">
      <div className="mesh-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto grid min-h-[85svh] max-w-7xl gap-8 px-6 md:grid-cols-[1.1fr_1fr] md:gap-16">
        <div className="relative hidden overflow-hidden rounded-[2.5rem] bg-foreground text-background md:block">
          <img
            src="https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1600&q=80"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-70 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/30 to-transparent" />
          <div className="relative flex h-full flex-col justify-between p-10">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-background/10 px-3 py-1 text-xs backdrop-blur">
              <Sparkles className="h-3 w-3" /> Canvas · members lounge
            </div>
            <div>
              <div className="text-display text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[0.9]">
                Every move<br />
                creates <span className="text-electric">art</span>.
              </div>
              <p className="mt-6 max-w-sm text-sm text-background/70">
                Reserve seats. Track your streak. Unlock member-only drops and open floors.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-widest text-background/60">
              {marqueeWords.map((w) => (
                <span key={w} className="rounded-full border border-background/20 px-3 py-1">
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex items-center">
          <div className="w-full rounded-[2.5rem] border bg-background/70 p-6 backdrop-blur md:p-10">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-sm font-semibold">
                <span className="font-display">
                  Canvas<span className="text-electric">.</span>
                </span>
              </Link>
              <div className="text-xs text-muted-foreground">
                {mode === "forgot" ? (
                  <button onClick={() => setMode("login")} className="font-medium text-foreground underline underline-offset-4">
                    Back to sign in
                  </button>
                ) : mode === "login" ? (
                  <>New here?{" "}
                  <button onClick={() => setMode("signup")} className="font-medium text-foreground underline underline-offset-4">
                    Create account
                  </button></>
                ) : (
                  <>Already a member?{" "}
                  <button onClick={() => setMode("login")} className="font-medium text-foreground underline underline-offset-4">
                    Sign in
                  </button></>
                )}
              </div>
            </div>

            {mode !== "forgot" && (
              <div className="relative mt-8 grid grid-cols-2 rounded-full bg-cream p-1 text-sm">
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-foreground"
                  style={{ left: mode === "login" ? 4 : "calc(50% + 0px)" }}
                />
                <button
                  onClick={() => setMode("login")}
                  className={`relative z-10 rounded-full py-2.5 transition-colors ${
                    mode === "login" ? "text-background" : "text-foreground/70"
                  }`}
                >
                  Sign in
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`relative z-10 rounded-full py-2.5 transition-colors ${
                    mode === "signup" ? "text-background" : "text-foreground/70"
                  }`}
                >
                  Create
                </button>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError("");
                  setLoading(true);
                  const supabase = createClient();
                  const form = e.currentTarget;
                  const email = (form.elements.namedItem("email") as HTMLInputElement).value;
                  const password = (form.elements.namedItem("password") as HTMLInputElement).value;

                  if (mode === "forgot") {
                    const { error } = await supabase.auth.resetPasswordForEmail(email);
                    if (error) setError(error.message);
                    else {
                      setError("");
                      setMode("login");
                    }
                  } else if (mode === "signup") {
                    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value;
                    const { error } = await supabase.auth.signUp({
                      email,
                      password,
                      options: { data: { full_name: name } },
                    });
                    if (error) setError(error.message);
                    else router.replace("/book");
                  } else {
                    const { error } = await supabase.auth.signInWithPassword({ email, password });
                    if (error) setError(error.message);
                    else router.replace("/book");
                  }
                  setLoading(false);
                }}
              >
                <div className="text-display text-3xl md:text-4xl">
                  {mode === "forgot" ? "Forgot password?" : mode === "login" ? "Welcome back." : "Join the floor."}
                </div>
                <p className="text-sm text-muted-foreground">
                  {mode === "forgot"
                    ? "Enter your email and we'll send you a reset link."
                    : mode === "login"
                      ? "Sign in to book classes and manage your dancer profile."
                      : "Create your account in seconds. First class on us."}
                </p>

                {mode === "signup" && (
                  <Field name="name" icon={<User className="h-4 w-4" />} label="Full name" type="text" placeholder="Aditi Sharma" />
                )}
                <Field name="email" icon={<Mail className="h-4 w-4" />} label="Email" type="email" placeholder="you@canvas.dance" />
                {mode !== "forgot" && (
                  <Field name="password" icon={<Lock className="h-4 w-4" />} label="Password"
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowPw((s) => !s)}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="Toggle password"
                      >
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                  />
                )}

                {mode === "login" && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" className="h-3.5 w-3.5 rounded border-black/20" /> Remember me
                    </label>
                    <button type="button" onClick={() => setMode("forgot")} className="underline underline-offset-4">
                      Forgot password?
                    </button>
                  </div>
                )}

                {error && (
                  <p className="text-xs text-red-500">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm text-background transition-transform hover:-translate-y-[1px] disabled:opacity-60"
                >
                  {loading ? "Please wait…" : mode === "forgot" ? "Send reset link" : mode === "login" ? "Sign in" : "Create account"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>

                {mode !== "forgot" && (
                  <>
                    <div className="relative py-2 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
                      <span className="relative bg-background/70 px-3">or continue with</span>
                      <span className="absolute left-0 right-0 top-1/2 -z-10 h-px bg-black/10" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <SocialBtn label="Google" />
                      <SocialBtn label="Apple" />
                    </div>
                  </>
                )}

                {mode !== "forgot" && (
                  <p className="pt-2 text-center text-[11px] text-muted-foreground">
                    By continuing you agree to our{" "}
                    <span className="underline underline-offset-2">Terms</span> &{" "}
                    <span className="underline underline-offset-2">Privacy Policy</span>.
                  </p>
                )}
              </motion.form>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  name,
  icon,
  label,
  type,
  placeholder,
  suffix,
}: {
  name?: string;
  icon: React.ReactNode;
  label: string;
  type: string;
  placeholder: string;
  suffix?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="group flex items-center gap-3 rounded-2xl border border-black/10 bg-background/80 px-4 py-3 transition-colors focus-within:border-foreground">
        <span className="text-muted-foreground">{icon}</span>
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
        />
        {suffix}
      </div>
    </label>
  );
}

function SocialBtn({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-background/80 px-4 py-2.5 text-sm hover:bg-background"
    >
      {label}
    </button>
  );
}
