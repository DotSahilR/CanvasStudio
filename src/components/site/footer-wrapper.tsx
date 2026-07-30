"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./site-footer";

export function FooterWrapper() {
  const pathname = usePathname();
  const hide = pathname === "/auth" || pathname === "/book";
  if (hide) return null;
  return <SiteFooter />;
}
