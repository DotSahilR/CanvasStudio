"use client";

import { useState } from "react";
import { Reveal, SplitReveal } from "@/components/site/reveal";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Youtube,
  Music2,
  ChevronDown,
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  [
    "Can I try a class before joining?",
    "Yes — your first drop-in is ₹799 with code CANVAS. No membership needed.",
  ],
  [
    "What should I wear?",
    "Comfortable clothing you can move in. Some classes (ballet, heels) recommend specific footwear.",
  ],
  [
    "Do you offer private rentals?",
    "Absolutely. Our 6 studios are available for shoots, rehearsals and workshops. See rental options below.",
  ],
  [
    "Are there beginner classes?",
    "Every discipline has a level 1 track. We label classes clearly so you can pick with confidence.",
  ],
] as const;

export default function Contact() {
  return (
    <>
      <section className="relative overflow-hidden pt-40 pb-16">
        <div className="mesh-bg absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Say hello
          </div>
          <SplitReveal
            text="Let's talk movement."
            className="text-display mt-4 text-6xl md:text-[9rem]"
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-5">
        <div className="md:col-span-3">
          <ContactForm />
        </div>
        <div className="space-y-8 md:col-span-2">
          <InfoRow
            icon={<MapPin className="h-5 w-5" />}
            label="Studio"
            value="909, A2 Boulevard Towers, Camp, Pune"
          />
          <InfoRow
            icon={<Mail className="h-5 w-5" />}
            label="Email"
            value="hello@canvasart.studio"
          />
          <InfoRow
            icon={<Phone className="h-5 w-5" />}
            label="Phone"
            value="+91 91460 — 46040"
          />
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Hours
            </div>
            <ul className="mt-3 space-y-1 text-sm">
              <li>Mon–Fri · 07:00 — 22:00</li>
              <li>Sat · 08:00 — 20:00</li>
              <li>Sun · 09:00 — 18:00</li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Follow
            </div>
            <div className="mt-3 flex gap-3">
              {[Instagram, Youtube, Music2].map((I, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-full border hover:bg-foreground hover:text-background"
                >
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="overflow-hidden rounded-3xl">
          <iframe
            title="Studio map"
            className="h-[420px] w-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.186116738933!2d73.8763899!3d18.5260853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c1b799847345%3A0x8ec789a82b124273!2sCanvas%20Multipurpose%20Studio!5e0!3m2!1sen!2sin!4v1"
          />
        </div>
      </section>

      <section className="bg-cream py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-2 md:items-center">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Studio Rental
            </div>
            <SplitReveal
              text="Rent our floors. Make your thing."
              className="text-display mt-3 text-5xl md:text-6xl"
            />
            <p className="mt-6 max-w-md text-muted-foreground">
              A multipurpose studio where your art finds its canvas. Sprung floors,
              natural light, and a creative community. Perfect for rehearsals,
              shoots and private workshops.
            </p>
            <ul className="mt-8 space-y-2 text-sm">
              <li>· Studio A — 90m² · sprung wood · ₹6,000/hr</li>
              <li>· Studio B — 60m² · marley · ₹4,500/hr</li>
              <li>· The Canvas — 220m² · stage lighting · ₹15,000/hr</li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1600&q=80"
              alt="Studio interior"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            FAQ
          </div>
          <h2 className="text-display mt-3 text-5xl md:text-7xl">
            Good questions.
          </h2>
        </div>
        <div className="divide-y border-y">
          {faqs.map(([q, a]) => (
            <Accordion key={q} q={q} a={a} />
          ))}
        </div>
      </section>
    </>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Reveal>
      <div className="flex items-start gap-4">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-foreground text-background">
          {icon}
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            {label}
          </div>
          <div className="text-display mt-1 text-xl">{value}</div>
        </div>
      </div>
    </Reveal>
  );
}

function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full py-6 text-left"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-display text-2xl md:text-3xl">{q}</span>
        <ChevronDown
          className={`h-5 w-5 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden text-muted-foreground"
          >
            <p className="pt-3 text-base">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="rounded-3xl border p-8"
    >
      <div className="text-display text-3xl">Drop us a line</div>
      <p className="mt-2 text-sm text-muted-foreground">
        We reply within one working day.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Field label="Name" placeholder="Your name" />
        <Field label="Email" type="email" placeholder="you@studio.com" />
      </div>
      <div className="mt-4">
        <Field label="Subject" placeholder="Booking / rental / press…" />
      </div>
      <div className="mt-4">
        <label className="text-xs uppercase tracking-widest text-muted-foreground">
          Message
        </label>
        <textarea
          rows={5}
          className="mt-2 w-full rounded-2xl border bg-background p-4 text-sm outline-none focus:ring-2 focus:ring-foreground"
          placeholder="Tell us more…"
        />
      </div>
      <button
        type="submit"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm text-background"
      >
        {sent ? "Sent — talk soon" : (
          <>
            Send message <Send className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        {...rest}
        className="mt-2 w-full rounded-full border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-foreground"
      />
    </div>
  );
}
