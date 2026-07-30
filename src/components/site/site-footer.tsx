import Link from "next/link";
import { Instagram, Youtube, Music2, ArrowUpRight } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-foreground text-background">
      <div className="mesh-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-10">
        <div className="border-b border-background/10 pb-16">
          <h2 className="text-display text-[clamp(2rem,6vw,5rem)] leading-none">
            Move Without <span className="text-electric">Limits.</span>
          </h2>
          <Link
            href="/book"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm text-foreground"
          >
            Book your first class <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-10 py-14 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="font-display text-2xl">CanvasArtStudio</div>
            <p className="mt-3 max-w-xs text-sm text-background/60">
              A creative studio for dancers, dreamers and movement makers.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Youtube, Music2].map((I, i) => (
                <a key={i} href="#" className="grid h-10 w-10 place-items-center rounded-full border border-background/20 hover:bg-background hover:text-foreground">
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <FooterCol title="Explore" items={[["Classes","/classes"],["About","/about"],["Contact","/contact"],["Book","/book"]]} />
          <FooterCol title="Studio" items={[["Rental","/contact"],["Community","/about"],["Careers","/about"],["Press","/about"]]} />
          <div>
            <div className="text-xs uppercase tracking-widest text-background/50">Studio hours</div>
            <ul className="mt-3 space-y-1 text-sm text-background/80">
              <li>Mon–Fri · 07:00 — 22:00</li>
              <li>Sat · 08:00 — 20:00</li>
              <li>Sun · 09:00 — 18:00</li>
            </ul>
            <div className="mt-6 text-sm text-background/60">hello@canvasart.studio</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between border-t border-background/10 pt-6 text-xs text-background/50">
          <span>© {new Date().getFullYear()} CanvasArtStudio. All rights reserved.</span>
          <span>Made for movement.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-background/50">{title}</div>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map(([label, to]) => (
          <li key={label}>
            <Link href={to} className="text-background/80 hover:text-background">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
