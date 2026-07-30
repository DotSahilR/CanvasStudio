import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { FloatingNav } from "@/components/site/floating-nav";
import { FooterWrapper } from "@/components/site/footer-wrapper";

const siteUrl = "https://canvasart.studio";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "CanvasArtStudio — Move Without Limits",
  description:
    "A creative dance studio for movement, community, and self-expression. Classes, workshops, and events across contemporary, hip hop, ballet, and more.",
  authors: [{ name: "CanvasArtStudio" }],
  openGraph: {
    title: "CanvasArtStudio — Move Without Limits",
    description:
      "A creative dance studio for movement, community, and self-expression.",
    url: siteUrl,
    siteName: "CanvasArtStudio",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: "/og-image.png",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <ScrollProgress />
          <FloatingNav />
          <main className="min-h-screen">{children}</main>
          <FooterWrapper />
        </Providers>
      </body>
    </html>
  );
}
