"use client";

import Link from "next/link";
import { Reveal, SplitReveal } from "@/components/site/reveal";
import TeamShowcase from "@/components/ui/team-showcase";
import { ArrowUpRight } from "lucide-react";

const SUPA = "https://hvansfddxwulquacakou.supabase.co/storage/v1/object/public/gallery";
const gallery = [`${SUPA}/abt1.png`, `${SUPA}/abt2.png`, `${SUPA}/abt3.png`, `${SUPA}/abt4.png`];

const team = [
  {
    n: "Gayatri Mane",
    r: "Choreographer · Instructor",
    img: "https://hvansfddxwulquacakou.supabase.co/storage/v1/object/public/team/Team1.png",
  },
  {
    n: "Sarang Lokhande",
    r: "Choreographer · Instructor",
    img: "https://hvansfddxwulquacakou.supabase.co/storage/v1/object/public/team/Team2.png",
  },
];

const timeline = [
  ["2026", "Canvas Studio opens its doors in Pune. A space where art finds its canvas."],
] as const;

export default function About() {
  return (
    <>
      <section className="relative overflow-hidden pt-40 pb-24">
        <div className="mesh-bg absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            About Canvas
          </div>
          <SplitReveal
            text="A studio built by dancers, for dancers."
            className="text-display mt-4 max-w-5xl text-5xl md:text-[8rem]"
          />
          <p className="mt-8 max-w-xl text-lg text-muted-foreground">
            We believe movement is a language everyone can speak. Since 2018
            we&apos;ve built a home for the artists, the beginners and everyone
            in between.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-4">
        {gallery.map((src, i) => {
          const offsets = ["-translate-y-6", "translate-y-4", "-translate-y-3", "translate-y-8"];
          return (
            <Reveal key={i} delay={i * 0.05}>
              <img
                src={src}
                alt="Studio life"
                className={`h-[280px] w-full rounded-3xl object-cover md:h-[380px] ${offsets[i]} transition-transform duration-700 hover:translate-y-0`}
              />
            </Reveal>
          );
        })}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Mission
            </div>
            <h2 className="text-display mt-3 text-4xl md:text-6xl">
              Make dance the way we make art.
            </h2>
            <p className="mt-6 text-muted-foreground">
              We program every season like a group show — with intention,
              contrast and a point of view. Every class is a chance to make
              something you&apos;re proud of.
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Vision
            </div>
            <h2 className="text-display mt-3 text-4xl md:text-6xl">
              A movement community without gatekeepers.
            </h2>
            <p className="mt-6 text-muted-foreground">
              We keep classes accessible, spotlight new voices, and pay our
              teachers what they deserve.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Timeline
          </div>
          <h2 className="text-display mt-3 text-5xl md:text-7xl">
            How we got here.
          </h2>
          <div className="mt-14 divide-y divide-black/10 border-y border-black/10">
            {timeline.map(([year, text]) => (
              <Reveal key={year}>
                <div className="grid grid-cols-12 items-baseline gap-4 py-8">
                  <div className="text-display col-span-3 text-4xl md:col-span-2 md:text-6xl">
                    {year}
                  </div>
                  <div className="col-span-9 text-lg md:col-span-10">
                    {text}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="mb-14">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Team
          </div>
          <SplitReveal
            text="The people behind the practice."
            className="text-display mt-3 text-5xl md:text-7xl"
          />
        </div>
        <TeamShowcase
          members={team.map((t, i) => ({
            id: String(i),
            name: t.n,
            role: t.r,
            image: t.img,
          }))}
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 rounded-[2rem] bg-foreground p-10 text-background md:grid-cols-4 md:p-14">
          {[
            ["Creative Learning", "100%"],
            ["All Ages", "Welcome"],
            ["Workshop Sessions", "Regular"],
            ["Studio Environment", "Inspiring"],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-display text-5xl">{k}</div>
              <div className="mt-2 text-sm text-background/70">{v}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-display text-4xl md:text-6xl">
            Come dance with us.
          </h2>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm text-background"
          >
            Book a class <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
