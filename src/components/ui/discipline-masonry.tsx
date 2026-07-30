"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type DisciplineItem = {
  name: string;
  desc: string;
  img: string;
  span?: "tall" | "short";
};

export function DisciplineMasonry({
  items,
  className,
}: {
  items: DisciplineItem[];
  className?: string;
}) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [columns, setColumns] = React.useState(4);

  React.useEffect(() => {
    const get = (w: number) => (w < 640 ? 1 : w < 1024 ? 2 : w < 1280 ? 3 : 4);
    const on = () => setColumns(get(window.innerWidth));
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  return (
    <div
      className={cn("w-full", className)}
      style={{ columnCount: columns, columnGap: "1.25rem" }}
      onMouseLeave={() => setHovered(null)}
    >
      {items.map((item, i) => {
        const isActive = hovered === i;
        const dimmed = hovered !== null && !isActive;
        return (
          <motion.figure
            key={item.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (i % 4) * 0.05 }}
            className="mb-5 break-inside-avoid overflow-hidden rounded-3xl bg-background/5"
            onMouseEnter={() => setHovered(i)}
          >
            <div className="group relative block cursor-pointer">
              <img
                src={item.img}
                alt={item.name}
                className={cn(
                  "w-full object-cover transition-all duration-700 ease-out",
                  item.span === "tall" ? "aspect-[3/4]" : item.span === "short" ? "aspect-[4/3]" : "aspect-[4/5]",
                  dimmed ? "grayscale contrast-[0.9] brightness-90" : "grayscale-0",
                  isActive ? "scale-[1.02]" : ""
                )}
              />
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 bg-gradient-to-t transition-opacity duration-500",
                  isActive ? "from-black/70 via-black/10 to-transparent opacity-100" : "from-black/50 via-transparent to-transparent opacity-90"
                )}
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-5">
                <div className="text-display text-2xl md:text-3xl leading-none text-background">
                  {item.name}
                </div>
                <motion.p
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 6 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="mt-2 max-w-xs text-xs leading-relaxed text-background/85"
                >
                  {item.desc}
                </motion.p>
              </figcaption>
            </div>
          </motion.figure>
        );
      })}
    </div>
  );
}
