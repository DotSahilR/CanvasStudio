# CanvasArtStudio

> A premium dance studio website built with Next.js and Supabase.

## Overview

CanvasArtStudio is a production-ready dance studio platform featuring a seamless booking experience, real-time auth, and dynamic content management via Supabase. The site is built as an immersive, motion-first experience with editorial layouts and premium UI.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| Icons | Lucide React, React Icons |
| Components | shadcn/ui (heavily customized) |
| Deployment | Vercel |

## Features

- **Auth** — Email/password signup, signin, forgot password via Supabase Auth
- **Bookings** — Multi-step booking flow with workshop selection, date/time picker, review, and payment placeholder
- **User Profiles** — Avatar upload, name, phone, preferred style, experience level
- **My Bookings** — View all past and upcoming bookings with loading skeleton and empty state
- **Workshops** — Dynamic workshop data fetched live from Supabase (homepage, classes page, book page)
- **SEO** — Sitemap, robots.txt, Open Graph images, metadataBase, apple-touch-icon
- **Responsive** — Full mobile support with hamburger menu, auth, and avatar dropdown
- **Image Storage** — All images served via Supabase Storage CDN (workshops, gallery, team, avatars)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, featured workshops, weekly schedule, upcoming events, disciplines, instructors, gallery, membership, testimonials, team |
| `/classes` | Immersive discipline exploration + workshop rail from Supabase |
| `/book` | Multi-step booking flow (style → workshop → date/time → review → payment) |
| `/about` | Studio story, timeline, team showcase, gallery |
| `/contact` | Contact form, studio hours, map, rental info, FAQ |
| `/auth` | Signup, signin, forgot password |
| `/my-bookings` | Authenticated user's bookings |
| `/profile` | Edit name, phone, style, experience; avatar upload |
| `/sitemap.xml` | Auto-generated sitemap |

## Architecture

```
src/
├── app/             # Next.js App Router pages
│   ├── page.tsx     # Homepage
│   ├── layout.tsx   # Root layout (nav, footer, metadata)
│   ├── book/        # Booking flow
│   ├── classes/     # Classes & workshops
│   ├── about/       # About page
│   ├── contact/     # Contact page
│   ├── auth/        # Authentication
│   ├── my-bookings/ # User bookings
│   └── profile/     # User profile
├── components/
│   ├── site/        # Site-wide components (nav, footer, reveal, scroll-progress)
│   └── ui/          # UI components (feature-carousel, scroll-01, team-showcase, etc.)
├── lib/
│   ├── supabase.ts  # Supabase browser client
│   └── utils.ts     # Utility functions
supabase/
├── migrations/      # SQL migrations (workshops, bookings, user_profiles, regular_classes)
└── seed.sql         # Seed data for workshops
```

## Database Schema

- **workshops** — id, slug, title, instructor, date, time, price, img, description, created_at
- **bookings** — id, user_id, workshop_slug, style, date, time, klass, instructor, price, status, created_at
- **user_profiles** — id, user_id, name, phone, preferred_style, experience_level, avatar_url, updated_at
- **regular_classes** — id, title, instructor, style, day, time, duration, price, level, description

RLS policies protect all tables; profiles auto-create on signup via DB trigger.

## Getting Started

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# Run migrations on your Supabase project
# Execute supabase/migrations/*.sql in the SQL Editor

# Seed workshop data
# Execute supabase/seed.sql in the SQL Editor

# Run dev server
bun run dev
```

## Deployment

Deploy to Vercel with two environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

## Build

```bash
bun run build    # Production build
bun run dev      # Development server
```
