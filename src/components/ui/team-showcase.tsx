"use client";

import { useState } from "react";
import { FaLinkedinIn, FaTwitter, FaBehance, FaInstagram } from "react-icons/fa";
import { cn } from "@/lib/utils";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    behance?: string;
  };
}

interface TeamShowcaseProps {
  members: TeamMember[];
}

export default function TeamShowcase({ members }: TeamShowcaseProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const col1 = members.filter((_, i) => i % 3 === 0);
  const col2 = members.filter((_, i) => i % 3 === 1);
  const col3 = members.filter((_, i) => i % 3 === 2);

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <div className="flex flex-col gap-3 md:gap-4 pt-8">
          {col1.map((m) => (
            <PhotoCard key={m.id} member={m} className="aspect-[3/4]" hoveredId={hoveredId} onHover={setHoveredId} />
          ))}
        </div>
        <div className="flex flex-col gap-3 md:gap-4">
          {col2.map((m) => (
            <PhotoCard key={m.id} member={m} className="aspect-[3/4]" hoveredId={hoveredId} onHover={setHoveredId} />
          ))}
        </div>
        <div className="flex flex-col gap-3 md:gap-4 pt-14">
          {col3.map((m) => (
            <PhotoCard key={m.id} member={m} className="aspect-[3/4]" hoveredId={hoveredId} onHover={setHoveredId} />
          ))}
        </div>
      </div>

      <div className="flex flex-col divide-y divide-border">
        {members.map((m) => (
          <MemberRow key={m.id} member={m} hoveredId={hoveredId} onHover={setHoveredId} />
        ))}
      </div>
    </div>
  );
}

function PhotoCard({
  member,
  className,
  hoveredId,
  onHover,
}: {
  member: TeamMember;
  className: string;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-muted cursor-pointer transition-all duration-500",
        className,
        isActive && "scale-[1.03] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)]",
        isDimmed && "opacity-40 grayscale",
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      <img
        src={member.image}
        alt={member.name}
        className="h-full w-full object-cover transition-transform duration-700"
      />
    </div>
  );
}

function MemberRow({
  member,
  hoveredId,
  onHover,
}: {
  member: TeamMember;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;
  const s = member.social;
  const hasSocial = s?.twitter || s?.linkedin || s?.instagram || s?.behance;

  return (
    <div
      className={cn(
        "flex items-center justify-between py-5 md:py-6 cursor-pointer transition-all duration-300",
        isDimmed && "opacity-40",
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={cn(
            "text-display leading-none tracking-tight truncate transition-all duration-300",
            isActive ? "text-3xl md:text-5xl" : "text-2xl md:text-4xl",
          )}
        >
          {member.name}
        </span>
        {hasSocial && (
          <div
            className={cn(
              "flex items-center gap-1 transition-opacity duration-300",
              isActive ? "opacity-100" : "opacity-0",
            )}
          >
            {s?.twitter && (
              <a href={s.twitter} onClick={(e) => e.stopPropagation()} className="p-1.5 rounded text-muted-foreground hover:text-foreground transition" title="Twitter">
                <FaTwitter className="h-3.5 w-3.5" />
              </a>
            )}
            {s?.linkedin && (
              <a href={s.linkedin} onClick={(e) => e.stopPropagation()} className="p-1.5 rounded text-muted-foreground hover:text-foreground transition" title="LinkedIn">
                <FaLinkedinIn className="h-3.5 w-3.5" />
              </a>
            )}
            {s?.instagram && (
              <a href={s.instagram} onClick={(e) => e.stopPropagation()} className="p-1.5 rounded text-muted-foreground hover:text-foreground transition" title="Instagram">
                <FaInstagram className="h-3.5 w-3.5" />
              </a>
            )}
            {s?.behance && (
              <a href={s.behance} onClick={(e) => e.stopPropagation()} className="p-1.5 rounded text-muted-foreground hover:text-foreground transition" title="Behance">
                <FaBehance className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
      <div className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-muted-foreground text-right shrink-0 ml-4">
        {member.role}
      </div>
    </div>
  );
}
