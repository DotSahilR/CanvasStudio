"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useRef, useState, type Dispatch, type SetStateAction } from "react";

export type Scroll01Item = {
  title: string;
  description: string;
  media: string;
  date?: string;
  location?: string;
  meta?: string;
  cta?: { label: string; to: string };
};

export interface Scroll01Props {
  items: Scroll01Item[];
}

function ScrollItem({
  item,
  index,
  activeIndex,
  setActive,
}: {
  item: Scroll01Item;
  index: number;
  activeIndex: number;
  setActive: Dispatch<SetStateAction<number>>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 15%"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [25, -25]);

  const opacityValues = index === 0 ? [1, 0.6, 1, 0.15] : [0.15, 0.6, 1, 0.15];
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    opacityValues,
  );

  const isActive = useTransform(scrollYProgress, (v) => v > 0.35 && v < 0.75);

  useMotionValueEvent(isActive, "change", (v) => {
    if (v) setActive((prev) => (prev === index ? prev : index));
  });

  const active = activeIndex === index;
  const alt = index % 2 === 1;

  return (
    <div
      ref={ref}
      className="flex min-h-[70svh] flex-col justify-center py-10 md:min-h-[80svh] md:py-16"
    >
      <img
        src={item.media}
        alt={item.title}
        className="mb-6 aspect-[4/5] w-full rounded-2xl object-cover md:hidden"
      />

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        <motion.div
          style={{ y, opacity }}
          className={`relative pl-5 md:pl-7 ${alt ? "md:order-2" : ""}`}
        >
          <span
            className={`absolute left-0 top-0 h-full w-0.5 rounded-full transition-all duration-700 ${
              active ? "bg-electric shadow-[0_0_12px_2px] shadow-electric/50" : "bg-border"
            }`}
          />

          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span
              className={`font-mono font-semibold transition-colors duration-700 ${
                active ? "text-electric" : "text-muted-foreground"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="h-px w-6 bg-border" />
            {item.date && <span>{item.date}</span>}
            {item.location && <span>{item.location}</span>}
            {!item.date && item.meta && <span>{item.meta}</span>}
          </div>

          <h3
            className={`text-display mt-4 font-black leading-[0.95] transition-all duration-700 text-[clamp(2rem,7vw,4rem)] md:text-6xl ${
              active
                ? "text-foreground blur-0"
                : "text-foreground/30 blur-[1px]"
            }`}
          >
            {item.title}
          </h3>

          <p
            className={`mt-5 max-w-md text-base leading-relaxed transition-all duration-700 ${
              active
                ? "text-muted-foreground opacity-100"
                : "text-muted-foreground/20 opacity-0"
            }`}
          >
            {item.description}
          </p>

          {item.cta && (
            <motion.div
              initial={false}
              animate={{
                opacity: active ? 1 : 0,
                y: active ? 0 : 12,
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8"
            >
              <a
                href={item.cta.to}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm text-background transition-all hover:bg-foreground/90 active:scale-[0.97]"
              >
                {item.cta.label}
              </a>
            </motion.div>
          )}
        </motion.div>

        <div className={`hidden md:block ${alt ? "" : "md:order-1"}`}>
          <div className="sticky top-24 h-[80svh] overflow-hidden rounded-[2rem] bg-muted shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]">
            <img
              src={item.media}
              alt={item.title}
              className={`h-full w-full object-cover transition-all duration-700 ${
                active ? "scale-100 opacity-100" : "scale-105 opacity-30"
              }`}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Scroll01({ items }: Readonly<Scroll01Props>) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="overflow-hidden pb-20 md:pb-28">
      <div className="relative mx-auto max-w-7xl px-6">
        {items.map((item, index) => (
          <ScrollItem
            key={item.title + index}
            item={item}
            index={index}
            activeIndex={activeIndex}
            setActive={setActiveIndex}
          />
        ))}
      </div>
    </section>
  );
}

export default Scroll01;
