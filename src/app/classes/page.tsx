"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { SplitReveal } from "@/components/site/reveal";
import { DisciplineMasonry } from "@/components/ui/discipline-masonry";
import { Scroll01, type Scroll01Item } from "@/components/ui/scroll-01";
import { createClient } from "@/lib/supabase";

type Discipline = {
  name: string;
  desc: string;
  img: string;
  span: "tall" | "short";
  cat: string;
};

const disciplines: Discipline[] = [
  { name: "Hip Hop", desc: "Foundations, freestyle and choreography from OGs of the scene.", img: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1600&q=80", span: "tall", cat: "Urban" },
  { name: "Contemporary", desc: "Where technique meets emotion. Move with intention.", img: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1600&q=80", span: "short", cat: "Theatre" },
  { name: "Ballet", desc: "Classical training reimagined for modern bodies.", img: "https://images.unsplash.com/photo-1518398046578-8cca57782e17?auto=format&fit=crop&w=1600&q=80", span: "tall", cat: "Classical" },
  { name: "Heels", desc: "Power, poise and unapologetic presence.", img: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1600&q=80", span: "short", cat: "Urban" },
  { name: "K-Pop", desc: "Sharp formations, glossy grooves and camera-ready cuts.", img: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&w=1600&q=80", span: "short", cat: "Urban" },
  { name: "Breaking", desc: "Rounds, footwork and freezes on Marley floors.", img: "https://images.unsplash.com/photo-1571266028243-e4bb35f78b91?auto=format&fit=crop&w=1600&q=80", span: "tall", cat: "Urban" },
  { name: "House", desc: "Jack, lofting and the pulse of Chicago in your feet.", img: "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&w=1600&q=80", span: "tall", cat: "Urban" },
  { name: "Bollywood", desc: "Story-driven choreography with color and character.", img: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1600&q=80", span: "short", cat: "Fusion" },
  { name: "Jazz", desc: "Broadway to street. Musicality first.", img: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&w=1600&q=80", span: "short", cat: "Theatre" },
  { name: "Salsa", desc: "Partnering, timing and Latin joy.", img: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=1600&q=80", span: "tall", cat: "Ballroom" },
  { name: "Kids Dance", desc: "Playful classes for ages 5–12. Confidence + creativity.", img: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?auto=format&fit=crop&w=1600&q=80", span: "short", cat: "Kids" },
  { name: "Waacking", desc: "Armography, drama and disco-era attitude. Fierce and precise.", img: "https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=1600&q=80", span: "tall", cat: "Urban" },
  { name: "Afro Fusion", desc: "Rhythm from the continent. Highlife, amapiano and kuduro grooves.", img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1600&q=80", span: "short", cat: "Fusion" },
  { name: "Tutting", desc: "Finger tuts, geometric angles and illusion-based hand styles.", img: "https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?auto=format&fit=crop&w=1600&q=80", span: "tall", cat: "Urban" },
  { name: "Flamenco", desc: "Footwork, claps and raw emotion from the heart of Andalusia.", img: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&w=1600&q=80", span: "short", cat: "Ballroom" },
  { name: "Yoga Flow", desc: "Movement + breath. Cross-train for every dancer.", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80", span: "short", cat: "Wellness" },
];

const cats = ["All", "Urban", "Theatre", "Classical", "Fusion", "Ballroom", "Kids", "Wellness"];

export default function ClassesPage() {
  return (
    <>
      <HeroClasses />
      <FeatureStrip />
      <Disciplines />
      <WorkshopsRail />
      <BookingCTA />
    </>
  );
}

function HeroClasses() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
      <div className="mesh-bg absolute inset-0 opacity-70" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          The Catalogue
        </div>
        <SplitReveal
          text="Twelve disciplines. One canvas."
          className="text-display mt-4 font-black leading-[0.9] text-[clamp(2.5rem,10vw,9rem)]"
        />
        <p className="mt-8 max-w-xl text-base text-muted-foreground md:text-lg">
          This isn&apos;t a class list. It&apos;s a menu of experiences — pick a
          mood, pick a tempo, and step in.
        </p>
      </div>
    </section>
  );
}

function FeatureStrip() {
  return (
    <section className="border-y border-black/5 bg-cream/50 py-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 text-xs uppercase tracking-widest text-muted-foreground">
        <span>· Drop-in from ₹799</span>
        <span>· 6 studios</span>
        <span>· All levels welcome</span>
        <span>· No long-term commits</span>
      </div>
    </section>
  );
}

function Disciplines() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = disciplines.filter(
    (d) =>
      (cat === "All" || d.cat === cat) &&
      d.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className="bg-foreground py-20 text-background md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
          <div>
            <div className="text-xs uppercase tracking-widest text-background/50">
              Disciplines
            </div>
            <SplitReveal
              text="Move in every language."
              className="text-display mt-3 max-w-2xl font-black leading-[0.9] text-[clamp(2.25rem,8vw,5.5rem)] md:text-7xl"
            />
          </div>
          <Link
            href="/book"
            className="text-sm text-background/80 underline underline-offset-8"
          >
            Book a class
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-background/20 bg-background/5 px-4 py-2 text-sm text-background/70">
            <Search className="h-4 w-4" />
            <input
              placeholder="Search disciplines…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-background/40"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-1.5 text-xs transition ${
                  cat === c
                    ? "border-background bg-background text-foreground"
                    : "border-background/20 text-background/60 hover:text-background"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <DisciplineMasonry items={filtered} />
      </div>
    </section>
  );
}

function WorkshopsRail() {
  const [items, setItems] = useState<Scroll01Item[]>([]);
  useEffect(() => {
    createClient().from("workshops").select("*").then(({ data }) => {
      if (data) setItems(data.map((w) => ({
        title: w.title, description: w.title, media: w.img,
        meta: `${w.date} · ${w.time} · with ${w.instructor}`,
        cta: { label: `Reserve · ₹${w.price.toLocaleString("en-IN")}`, to: `/book?workshop=${w.slug}` },
      })));
    });
  }, []);
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto mb-10 max-w-7xl px-6 md:mb-16">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          Workshops
        </div>
        <SplitReveal
          text="Guest artists · limited seats."
          className="text-display mt-3 font-black leading-[0.9] text-[clamp(2.25rem,8vw,5.5rem)] md:text-7xl"
        />
      </div>
      <Scroll01 items={items} />
    </section>
  );
}

function BookingCTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-foreground p-8 text-background md:p-16">
        <div className="mesh-bg absolute inset-0 opacity-30" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <SplitReveal
            text="Your first class is one tap away."
            className="text-display max-w-3xl font-black leading-[0.9] text-[clamp(2rem,7vw,4rem)] md:text-6xl"
          />
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm text-foreground"
          >
            Book now <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
