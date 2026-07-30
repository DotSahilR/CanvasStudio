"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FireIcon,
  MusicNote01Icon,
  StarIcon,
  FlashIcon,
  HeartCheckIcon,
  SparklesIcon,
  Rocket01Icon,
  DiamondIcon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { ArrowUpRight, Clock, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

export type CarouselFeature = {
  id: string;
  label: string;
  image: string;
  description: string;
  meta?: string;
  price?: string;
  href?: { pathname: string; query: Record<string, string> };
  instructor?: string;
};

const ICONS = [
  FireIcon,
  MusicNote01Icon,
  StarIcon,
  FlashIcon,
  HeartCheckIcon,
  SparklesIcon,
  Rocket01Icon,
  DiamondIcon,
];


const AUTO_PLAY_INTERVAL = 4000;

export function FeatureCarousel({ features }: { features: CarouselFeature[] }) {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex = ((step % features.length) + features.length) % features.length;

  const nextStep = useCallback(() => setStep((prev) => prev + 1), []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + features.length) % features.length;
    if (diff > 0) setStep((s) => s + diff)
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = features.length;
    let n = diff;
    if (diff > len / 2) n -= len;
    if (diff < -len / 2) n += len;
    if (n === 0) return "active";
    if (n === -1) return "prev";
    if (n === 1) return "next";
    return "hidden";
  };

  return (
    <div className="relative w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0b0b12] via-[#131324] to-[#1f1140] p-6 md:p-10">
      <div className="mesh-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-12">
        <div
          className="flex flex-col gap-3"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="text-[11px] uppercase tracking-[0.35em] text-white/50">
            The line-up
          </div>
          {features.map((feature, index) => {
            const isActive = index === currentIndex;
            const Icon = ICONS[index % ICONS.length];
            return (
              <button
                key={feature.id}
                onClick={() => handleChipClick(index)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-full border px-5 py-3.5 text-left transition-all duration-500",
                  isActive
                    ? "z-10 border-white bg-white text-[#1f1140] shadow-[0_20px_60px_-20px_rgba(255,255,255,0.35)]"
                    : "border-white/15 bg-transparent text-white/60 hover:border-white/40 hover:text-white",
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors",
                    isActive ? "bg-[#1f1140] text-white" : "bg-white/5 text-white/70",
                  )}
                >
                  <HugeiconsIcon icon={Icon} size={16} />
                </span>
                <span className="flex-1 text-sm font-medium">{feature.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="carousel-chip-arrow"
                    className="grid h-7 w-7 place-items-center rounded-full bg-[#1f1140] text-white"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </motion.span>
                )}
              </button>
            );
          })}
        </div>

        <div
          className="relative h-[460px] w-full md:h-[520px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {features.map((feature, index) => {
            const status = getCardStatus(index);
            const isActive = status === "active";
            const offset =
              status === "prev" ? -40 : status === "next" ? 40 : 0;
            const rotate =
              status === "prev" ? -6 : status === "next" ? 6 : 0;
            const scale = isActive ? 1 : status === "hidden" ? 0.85 : 0.92;
            const opacity = status === "hidden" ? 0 : isActive ? 1 : 0.35;
            const zIndex = isActive ? 30 : status === "hidden" ? 0 : 10;

            return (
              <motion.div
                key={feature.id}
                animate={{ x: offset, rotate, scale, opacity }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ zIndex }}
                className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_40px_100px_-40px_rgba(0,0,0,0.7)]"
              >
                <img
                  src={feature.image}
                  alt={feature.label}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] uppercase tracking-widest text-white backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-electric" />
                  Live line-up
                </div>

                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.div
                      key={feature.id + "-copy"}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.5, delay: 0.15 }}
                      className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8"
                    >
                      <div className="text-[11px] uppercase tracking-[0.3em] text-white/70">
                        {String(index + 1).padStart(2, "0")} · {feature.meta ?? "Workshop"}
                      </div>
                      <div className="text-display mt-2 text-3xl leading-tight md:text-5xl">
                        {feature.label}
                      </div>
                      {feature.instructor && (
                        <div className="mt-1 text-sm text-white/70">with {feature.instructor}</div>
                      )}
                      <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75">
                        {feature.description}
                      </p>
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        {feature.meta && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs backdrop-blur-md">
                            <Clock className="h-3 w-3" /> {feature.meta}
                          </span>
                        )}
                        {feature.price && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs backdrop-blur-md">
                            <IndianRupee className="h-3 w-3" /> {feature.price}
                          </span>
                        )}
                        {feature.href && (
                          <Link
                            href={feature.href}
                            className="group ml-auto inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-medium text-[#1f1140]"
                          >
                            Reserve Now
                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FeatureCarousel;
