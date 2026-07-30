"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Menu, X, User, LogOut, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase";

const links = [
  { to: "/", label: "Home" },
  { to: "/classes", label: "Classes" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function FloatingNav() {
  const { scrollY } = useScroll();
  const [shrunk, setShrunk] = useState(false);
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useMotionValueEvent(scrollY, "change", (y) => setShrunk(y > 40));

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthed(!!user);
      if (user) {
        supabase.from("user_profiles").select("avatar_url").eq("id", user.id).single()
          .then(({ data }) => setAvatarUrl(data?.avatar_url ?? ""));
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session?.user);
      if (session?.user) {
        supabase.from("user_profiles").select("avatar_url").eq("id", session.user.id).single()
          .then(({ data }) => setAvatarUrl(data?.avatar_url ?? ""));
      } else {
        setAvatarUrl("");
      }
    });

    const handleAvatarUpdate = () => {
      const s = createClient();
      s.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          s.from("user_profiles").select("avatar_url").eq("id", user.id).single()
            .then(({ data }) => setAvatarUrl(data?.avatar_url ?? ""));
        }
      });
    };
    window.addEventListener("avatar-update", handleAvatarUpdate);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener("avatar-update", handleAvatarUpdate);
    };
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-3"
      >
        <motion.nav
          animate={{
            paddingLeft: shrunk ? 12 : 18,
            paddingRight: shrunk ? 6 : 8,
            paddingTop: shrunk ? 6 : 8,
            paddingBottom: shrunk ? 6 : 8,
          }}
          transition={{ duration: 0.3 }}
          className="glass mx-auto flex w-full max-w-fit items-center gap-1 rounded-full shadow-[0_10px_40px_-20px_rgba(0,0,0,0.25)]"
        >
          <Link href="/" className="mr-1 flex items-center gap-2 pl-1 pr-2 text-sm font-semibold tracking-tight sm:mr-2 sm:pr-3">
            <span className="inline-block h-2 w-2 rounded-full bg-electric" />
            <span className="font-display">Canvas<span className="text-electric">.</span></span>
          </Link>
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
              return (
                <li key={l.to} className="relative">
                    <Link
                    href={l.to}
                    className="relative rounded-full px-4 py-2 text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-foreground"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span className={active ? "text-background" : ""}>{l.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="ml-1 flex items-center gap-1 sm:ml-2">
            {authed ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-black/10 transition hover:bg-cream"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </button>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute right-0 top-12 w-44 rounded-2xl border bg-background p-2 shadow-xl"
                  >
                    <Link href="/my-bookings" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-cream">
                      <Calendar className="h-4 w-4 text-muted-foreground" /> My bookings
                    </Link>
                    <Link href="/profile" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-cream">
                      <User className="h-4 w-4 text-muted-foreground" /> Profile
                    </Link>
                    <button
                      onClick={async () => {
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        setAuthed(false);
                        setProfileOpen(false);
                        router.push("/");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-cream"
                    >
                      <LogOut className="h-4 w-4 text-muted-foreground" /> Logout
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="rounded-full px-4 py-2 text-sm text-foreground/70 hover:text-foreground"
              >
                Login
              </Link>
            )}
            <Link
              href="/book"
              className="group relative inline-flex items-center overflow-hidden rounded-full bg-foreground px-4 py-2 text-xs text-background transition-transform hover:-translate-y-[1px] sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <span className="relative z-10">Book Now</span>
              <span className="absolute inset-0 -z-0 bg-gradient-to-r from-electric via-coral to-orange-soft opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="ml-1 grid h-9 w-9 place-items-center rounded-full border border-black/10 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </motion.nav>
      </motion.header>

      {open && (
        <div className="fixed inset-0 z-[60] bg-background md:hidden">
          <div className="flex items-center justify-between p-6">
            <span className="font-display text-xl">Canvas<span className="text-electric">.</span></span>
            <button onClick={() => setOpen(false)} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full border">
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul className="flex flex-col gap-2 p-6">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  href={l.to}
                  onClick={() => setOpen(false)}
                  className="text-display block py-3 text-5xl"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <Link href="/book" onClick={() => setOpen(false)} className="inline-flex rounded-full bg-foreground px-6 py-3 text-background">
                Book a class
              </Link>
            </li>
            {authed ? (
              <>
                <li className="mt-4 border-t pt-4">
                  <Link href="/my-bookings" onClick={() => setOpen(false)} className="block py-2 text-sm text-muted-foreground hover:text-foreground">
                    My Bookings
                  </Link>
                  <Link href="/profile" onClick={() => setOpen(false)} className="block py-2 text-sm text-muted-foreground hover:text-foreground">
                    Profile
                  </Link>
                  <button
                    onClick={async () => {
                      const supabase = createClient();
                      await supabase.auth.signOut();
                      setAuthed(false);
                      setOpen(false);
                      router.push("/");
                    }}
                    className="block py-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="mt-4">
                <Link href="/auth" onClick={() => setOpen(false)} className="block py-2 text-sm text-muted-foreground hover:text-foreground">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
}
