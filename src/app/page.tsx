"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Play,
  Clock,
  MapPin,
  IndianRupee,
} from "lucide-react";
import { Reveal, SplitReveal } from "@/components/site/reveal";
import { FeatureCarousel } from "@/components/ui/feature-carousel";
import { DisciplineMasonry } from "@/components/ui/discipline-masonry";
import { Scroll01 } from "@/components/ui/scroll-01";
import TeamShowcase, { type TeamMember } from "@/components/ui/team-showcase";
import { createClient } from "@/lib/supabase";

const IMG = {
  hero: "https://hvansfddxwulquacakou.supabase.co/storage/v1/object/public/gallery/hero1.png",
  hip: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80",
  contemp:
    "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1200&q=80",
  house:
    "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&w=1200&q=80",
  bolly:
    "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
  locking:
    "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&w=1200&q=80",
  popping:
    "https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&w=1200&q=80",
  breaking:
    "https://images.unsplash.com/photo-1571266028243-e4bb35f78b91?auto=format&fit=crop&w=1200&q=80",
  freestyle:
    "https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?auto=format&fit=crop&w=1200&q=80",
};

type Workshop = {
  slug: string;
  title: string;
  instructor: string;
  instructorImg: string;
  time: string;
  date: string;
  price: number;
  desc: string;
  tag: string;
};

function bookLink(slug: string) {
  return { pathname: "/book" as const, query: { workshop: slug } };
}

function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedWorkshops />
      <WeeklySchedule />
      <UpcomingEvents />
      <Disciplines />
      <Instructors />
      <GalleryMarquee />
      <Membership />
      <Newsletter />
    </>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  return (
    <section
      ref={ref}
      className="relative h-[100svh] w-full overflow-hidden bg-foreground"
    >
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <img
          src={IMG.hero}
          alt="Dancer mid-motion in a light-filled studio"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_75%)]" />
      </motion.div>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-20 text-background">
        <div className="mb-8 text-[11px] uppercase tracking-[0.35em] text-background/70">
          CanvasArtStudio · India
        </div>

        <SplitReveal
          text="Move Without"
          className="text-display leading-[0.85] tracking-tight text-[clamp(2.75rem,10vw,9rem)] font-black"
        />
        <div className="flex flex-wrap items-baseline gap-x-5">
          <SplitReveal
            text="Limits."
            className="text-display leading-[0.85] tracking-tight text-[clamp(2.75rem,10vw,9rem)] font-black text-electric"
          />
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/classes"
            className="group inline-flex items-center gap-2 rounded-full bg-background px-7 py-4 text-sm font-medium text-foreground transition-transform hover:-translate-y-0.5"
          >
            Explore classes{" "}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full border border-background/30 bg-background/5 px-6 py-3.5 text-sm text-background backdrop-blur-md"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-background text-foreground">
              <Play className="h-3 w-3" />
            </span>
            Our story
          </Link>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = [
    "Contemporary",
    "Hip Hop",
    "Bollywood",
    "House",
    "Locking",
    "Popping",
    "Breaking",
    "Freestyle",
  ];
  const row = [...words, ...words];
  return (
    <section className="border-y border-black/5 py-6 overflow-hidden">
      <div className="flex gap-10 whitespace-nowrap marquee">
        {row.map((w, i) => (
          <span key={i} className="text-display text-3xl md:text-5xl">
            {w} <span className="text-electric">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}

function WorkshopCard({
  w,
  reversed = false,
}: {
  w: Workshop;
  reversed?: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`grid gap-8 rounded-[2rem] border border-black/5 bg-background p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] md:grid-cols-2 md:gap-10 md:p-8 ${
        reversed ? "md:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div className="relative overflow-hidden rounded-[1.5rem] bg-muted">
        <motion.img
          src={w.instructorImg}
          alt={`${w.instructor} — ${w.title}`}
          className="aspect-[4/5] h-full w-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-[10px] uppercase tracking-widest text-foreground backdrop-blur">
          {w.tag}
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-black/50 px-4 py-3 text-background backdrop-blur-md">
          <div className="text-xs uppercase tracking-widest opacity-80">
            Instructor
          </div>
          <div className="text-sm font-medium">{w.instructor}</div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            {w.date}
          </div>
          <h3 className="text-display mt-3 text-4xl md:text-5xl leading-[0.95]">
            {w.title}
          </h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            {w.desc}
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5">
              <Clock className="h-3 w-3" /> {w.time}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5">
              <IndianRupee className="h-3 w-3" /> {formatINR(w.price)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5">
              <MapPin className="h-3 w-3" /> Studio Canvas
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={bookLink(w.slug)}
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm text-background transition-transform hover:-translate-y-0.5"
          >
            Reserve Now{" "}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
          </Link>
          <Link
            href="/classes"
            className="text-xs uppercase tracking-widest text-muted-foreground underline underline-offset-4"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function FeaturedWorkshops() {
  const [features, setFeatures] = useState<{ id: string; label: string; image: string; description: string; meta: string; price: string; instructor: string; href: { pathname: "/book"; query: { workshop: string } } }[]>([]);
  useEffect(() => {
    createClient().from("workshops").select("*").limit(4).then(({ data }) => {
      if (data) setFeatures(data.map((w) => ({
        id: w.slug, label: w.title, image: w.img, description: w.title,
        meta: `${w.date} · ${w.time}`, price: formatINR(w.price).replace("₹", ""),
        instructor: w.instructor, href: bookLink(w.slug),
      })));
    });
  }, []);
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            02 — Featured Workshops
          </div>
          <SplitReveal
            text="Learn from the movers you follow."
            className="text-display mt-3 max-w-3xl text-5xl md:text-7xl"
          />
        </div>
        <Link
          href="/classes"
          className="text-sm underline underline-offset-8"
        >
          See all workshops
        </Link>
      </div>
      <FeatureCarousel features={features} />
    </section>
  );
}

function WeeklySchedule() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const slots = [
    {
      time: "03:00 PM – 05:00 PM",
      title: "Daryaa",
      subtitle: "Friendship Weekend with Prashant Bhagri",
      type: "Workshop",
      color: "bg-orange-soft",
      slug: "daryaa",
    },
    {
      time: "05:00 PM – 07:00 PM",
      title: "Tu Meri",
      subtitle: "Friendship Weekend with Prashant Bhagri",
      type: "Workshop",
      color: "bg-coral",
      slug: "tu-meri",
    },
    {
      time: "07:00 PM – 09:00 PM",
      title: "Roz",
      subtitle: "Friendship Weekend with Prashant Bhagri",
      type: "Workshop",
      color: "bg-lavender",
      slug: "roz",
    },
    {
      time: "05:00 PM – 07:00 PM",
      title: "Humraah",
      subtitle: "Malang Dance Co with Kunal & Nishi",
      type: "Workshop",
      color: "bg-sky",
      slug: "humraah",
    },
  ];
  return (
    <section className="bg-cream py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              04 — Weekly Schedule
            </div>
            <h2 className="text-display mt-3 text-4xl sm:text-5xl md:text-7xl">
              This week at Canvas.
            </h2>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
              17 Feb – 23 Feb 2026
            </div>
            <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {days.map((d, i) => (
              <button
                key={d}
                className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
                  i === 2
                    ? "bg-foreground text-background"
                    : "border border-black/10 hover:bg-background"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          </div>
        </div>

        <div className="grid gap-4">
          {slots.map((s, i) => (
            <Reveal key={s.title + i} delay={i * 0.05}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="group grid grid-cols-12 items-center gap-4 rounded-3xl border border-black/5 bg-background p-6 shadow-[0_1px_0_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35)]"
              >
                <div className="col-span-12 md:col-span-3">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {s.type}
                  </div>
                  <div className="text-display mt-1 text-xl leading-tight">
                    {s.time}
                  </div>
                </div>
                <div
                  className={`col-span-1 hidden h-3 w-3 rounded-full ${s.color} md:block`}
                />
                <div className="col-span-12 md:col-span-6">
                  <div className="text-display text-2xl md:text-3xl">
                    {s.title}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {s.subtitle}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-2 md:text-right">
                  <Link
                    href={bookLink(s.slug)}
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs text-background transition-transform group-hover:-translate-y-0.5"
                  >
                    Reserve <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function UpcomingEvents() {
  const [items, setItems] = useState<{ title: string; description: string; media: string; meta: string; cta: { label: string; to: string } }[]>([]);
  useEffect(() => {
    createClient().from("workshops").select("*").limit(2).then(({ data }) => {
      if (data) setItems(data.map((w) => ({
        title: w.title, description: w.title, media: w.img,
        meta: `${w.date} · ${w.time}`,
        cta: { label: "Reserve · " + formatINR(w.price), to: `/book?workshop=${w.slug}` },
      })));
    });
  }, []);
  return (
    <section className="overflow-hidden py-20 md:py-28">
      <div className="mx-auto mb-10 max-w-7xl px-6 md:mb-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              03 — Upcoming Events
            </div>
            <SplitReveal
              text="Show up. Show out."
              className="text-display mt-3 max-w-3xl font-black leading-[0.9] text-[clamp(2.25rem,10vw,5.5rem)] md:text-7xl"
            />
          </div>
          <Link
            href="/classes"
            className="group text-sm underline underline-offset-8"
          >
            View more <ArrowUpRight className="ml-0.5 inline-block h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
      <Scroll01 items={items} />
      {items.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Link
            href="/classes"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3 text-sm text-background transition-all hover:bg-foreground/90 active:scale-[0.97]"
          >
            View more <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
}

const disciplines = [
  {
    name: "Hip Hop",
    desc: "Grooves, freestyle and choreography from the OGs of the scene.",
    img: IMG.hip,
    span: "tall" as const,
  },
  {
    name: "Bollywood",
    desc: "Story-driven choreography with colour, character and cinema energy.",
    img: IMG.bolly,
    span: "short" as const,
  },
  {
    name: "Contemporary",
    desc: "Where technique meets emotion. Move with intention.",
    img: IMG.contemp,
    span: "tall" as const,
  },
  {
    name: "House",
    desc: "Jack, lofting and the pulse of Chicago in your feet.",
    img: IMG.house,
    span: "short" as const,
  },
  {
    name: "Locking",
    desc: "Points, funk and the pure joy of the pocket.",
    img: IMG.locking,
    span: "short" as const,
  },
  {
    name: "Popping",
    desc: "Hits, dime stops and animation for the illusionists.",
    img: IMG.popping,
    span: "tall" as const,
  },
  {
    name: "Breaking",
    desc: "Toprock, footwork and freezes on sprung Marley floors.",
    img: IMG.breaking,
    span: "tall" as const,
  },
  {
    name: "Freestyle",
    desc: "Cyphers, musicality drills and the freedom to fail.",
    img: IMG.freestyle,
    span: "short" as const,
  },
];

function Disciplines() {
  return (
    <section className="bg-foreground py-28 text-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-background/50">
              05 — Disciplines
            </div>
            <SplitReveal
              text="Move in every language."
              className="text-display mt-3 max-w-2xl text-5xl md:text-7xl"
            />
          </div>
          <Link
            href="/classes"
            className="text-sm text-background/80 underline underline-offset-8"
          >
            View all
          </Link>
        </div>

        <DisciplineMasonry items={disciplines} />
      </div>
    </section>
  );
}

const instructorMembers: TeamMember[] = [
  {
    id: "1",
    name: "Gayatri Mane",
    role: "CHOREOGRAPHER · INSTRUCTOR",
    image: "https://hvansfddxwulquacakou.supabase.co/storage/v1/object/public/team/Team1.png",
  },
  {
    id: "2",
    name: "Sarang Lokhande",
    role: "CHOREOGRAPHER · INSTRUCTOR",
    image: "https://hvansfddxwulquacakou.supabase.co/storage/v1/object/public/team/Team2.png",
  },
];

function Instructors() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            06 — Instructors
          </div>
          <SplitReveal
            text="Meet the movers."
            className="text-display mt-3 text-5xl md:text-7xl"
          />
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">
          A crew of choreographers, hosts and battle-tested performers holding
          down the Canvas floor.
        </p>
      </div>
      <TeamShowcase members={instructorMembers} />
    </section>
  );
}

function GalleryMarquee() {
  const SUPA_STORAGE = "https://hvansfddxwulquacakou.supabase.co/storage/v1/object/public";
  const gallery = Array.from({ length: 13 }, (_, i) => `${SUPA_STORAGE}/gallery/${i + 1}.png`);
  const rowA = gallery.slice(0, 7);
  const rowB = gallery.slice(7);
  return (
    <section className="overflow-hidden bg-cream py-28">
      <div className="mx-auto mb-14 max-w-7xl px-6">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          07 — Gallery
        </div>
        <SplitReveal
          text="Frames from the floor."
          className="text-display mt-3 text-5xl md:text-7xl"
        />
      </div>

      <MarqueeRow images={rowA} direction="left" />
      <div className="h-6" />
      <MarqueeRow images={rowB} direction="right" />
    </section>
  );
}

function MarqueeRow({
  images,
  direction,
}: {
  images: string[];
  direction: "left" | "right";
}) {
  const doubled = [...images, ...images];
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex gap-4 whitespace-nowrap"
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((src, i) => (
          <div
            key={i}
            className="relative w-[160px] shrink-0 overflow-hidden rounded-2xl bg-muted md:w-[220px] aspect-[9/16]"
          >
            <img
              src={src}
              alt="Canvas moment"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function Membership() {
  const plans = [
    {
      name: "Drop-In",
      price: 799,
      per: "/ class",
      perks: ["Any style", "Any studio", "Book 7 days ahead"],
    },
    {
      name: "Canvas Monthly",
      price: 6999,
      per: "/ month",
      perks: ["Unlimited classes", "1 workshop / month", "Guest pass"],
      featured: true,
    },
    {
      name: "Artist Annual",
      price: 69999,
      per: "/ year",
      perks: [
        "Everything monthly",
        "Mentorship track",
        "Studio rental credits",
      ],
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <div className="mb-14">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          09 — Membership
        </div>
        <SplitReveal
          text="Pick a rhythm that fits."
          className="text-display mt-3 text-5xl md:text-7xl"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-3xl p-8 ${
              p.featured ? "bg-foreground text-background" : "border"
            }`}
          >
            <div className="text-sm opacity-70">{p.name}</div>
            <div className="mt-4 flex items-baseline gap-1">
              <div className="text-display text-5xl md:text-6xl">
                {formatINR(p.price)}
              </div>
              <div className="text-sm opacity-70">{p.per}</div>
            </div>
            <ul className="mt-8 space-y-2 text-sm">
              {p.perks.map((k) => (
                <li key={k} className="flex gap-2">
                  <span>✦</span>
                  {k}
                </li>
              ))}
            </ul>
            <Link
              href="/book"
              className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm ${
                p.featured
                  ? "bg-background text-foreground"
                  : "bg-foreground text-background"
              }`}
            >
              Choose {p.name}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-cream p-10 md:p-16">
        <div className="mesh-bg absolute inset-0 opacity-60" />
        <div className="relative grid gap-10 md:grid-cols-2 md:items-end">
          <SplitReveal
            text="Get the drop. First classes, first releases."
            className="text-display text-5xl md:text-6xl"
          />
          <form className="flex w-full items-center gap-2 rounded-full bg-background p-2 shadow-lg">
            <input
              type="email"
              placeholder="you@studio.com"
              className="flex-1 bg-transparent px-4 py-3 text-sm outline-none"
            />
            <button className="rounded-full bg-foreground px-6 py-3 text-sm text-background">
              Join
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
