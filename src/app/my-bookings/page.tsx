"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";

type Booking = {
  id: string;
  workshop_slug: string | null;
  style: string;
  klass: string;
  instructor: string;
  date: string;
  time: string;
  price: number;
  status: string;
  created_at: string;
};

const styles: Record<string, string> = {
  hip: "Hip Hop", con: "Contemporary", bal: "Ballet",
  hee: "Heels", kpo: "K-Pop", bre: "Breaking",
  hou: "House", bol: "Bollywood", jaz: "Jazz",
  sal: "Salsa", kid: "Kids Dance", fre: "Freestyle",
};

export default function MyBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace("/auth"); return; }
      supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          setBookings(data ?? []);
          setLoading(false);
        });
    });
  }, [router]);

  return (
    <div className="relative min-h-screen pt-28 pb-24">
      <div className="mesh-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-4xl px-6">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Your account
          </div>
          <h1 className="text-display mt-2 text-4xl md:text-6xl">My Bookings</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            All your booked sessions in one place.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-3xl bg-muted" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border bg-background/60 p-12 text-center backdrop-blur"
          >
            <div className="text-display text-5xl text-muted-foreground/30">( )</div>
            <h2 className="text-display mt-4 text-2xl">No bookings yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your booked sessions will appear here.
            </p>
            <Link
              href="/book"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm text-background"
            >
              Book a class <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-3xl border bg-background/60 p-6 backdrop-blur transition hover:shadow-[0_10px_40px_-20px_rgba(0,0,0,0.2)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className={`h-2 w-2 rounded-full ${b.status === "confirmed" ? "bg-green-500" : "bg-amber-500"}`} />
                      <span className="text-xs uppercase tracking-widest text-muted-foreground">
                        {b.klass}
                      </span>
                    </div>
                    <h3 className="text-display mt-1 text-xl">{styles[b.style] || b.style}</h3>
                    <p className="text-sm text-muted-foreground">with {b.instructor}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-display text-lg">₹{b.price.toLocaleString("en-IN")}</div>
                    <div className="text-xs capitalize text-muted-foreground">{b.status}</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> {b.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {b.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
