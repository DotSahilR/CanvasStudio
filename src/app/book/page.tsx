"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  CreditCard,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase";

const styles = [
  { id: "hip", name: "Hip Hop" },
  { id: "con", name: "Contemporary" },
  { id: "bal", name: "Ballet" },
  { id: "hee", name: "Heels" },
  { id: "kpo", name: "K-Pop" },
  { id: "bre", name: "Breaking" },
  { id: "hou", name: "House" },
  { id: "bol", name: "Bollywood" },
  { id: "jaz", name: "Jazz" },
  { id: "sal", name: "Salsa" },
  { id: "kid", name: "Kids Dance" },
  { id: "fre", name: "Freestyle" },
];

const timeSlots = [
  "09:00 AM – 10:00 AM",
  "10:00 AM – 11:00 AM",
  "11:00 AM – 12:00 PM",
  "12:00 PM – 01:00 PM",
  "02:00 PM – 03:00 PM",
  "03:00 PM – 04:00 PM",
  "04:00 PM – 05:00 PM",
  "05:00 PM – 06:00 PM",
  "06:00 PM – 07:00 PM",
  "07:00 PM – 08:00 PM",
  "08:00 PM – 09:00 PM",
];

const STEPS = ["Style", "Class", "Date & Time", "Review", "Payment"];

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32" />}>
      <BookPageContent />
    </Suspense>
  );
}

type W = { slug: string; title: string; instructor: string; price: number; img: string; style_id: string; klass: string; date: string; time: string; duration: string; desc: string };

function BookPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workshopSlug = searchParams.get("workshop");

  const [preselect, setPreselect] = useState<W | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace("/auth");
    });
    if (workshopSlug) {
      supabase.from("workshops").select("*").eq("slug", workshopSlug).single()
        .then(({ data }) => {
          if (data) setPreselect(data as unknown as W);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [router, workshopSlug]);

  const initialStep = preselect ? 2 : 0;
  const [step, setStep] = useState(0);
  const [style, setStyle] = useState("");
  const [klass, setKlass] = useState("");
  const [instructor, setInstructor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (preselect) {
      setStep(2);
      setStyle(preselect.style_id ?? "");
      setKlass(preselect.klass ?? "");
      setInstructor(preselect.instructor ?? "");
      setDate(preselect.date ?? "");
      setTime(preselect.time ?? "");
    }
  }, [preselect]);

  if (loading) return <div className="min-h-screen pt-28 pb-24" />;

  if (done) {
    return (
      <SuccessScreen
        name={preselect?.title}
        instructor={preselect?.instructor}
        price={preselect?.price}
        onReset={() => setDone(false)}
      />
    );
  }

  return (
    <div className="relative min-h-screen pt-28 pb-24">
      <div className="mesh-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-7xl px-6">
        <Stepper current={step} steps={STEPS} />
        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_340px]">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <StepWrap key="style">
                <StyleStep value={style} onChange={setStyle} />
                <StepNav step={step} setStep={setStep} canNext={!!style} />
              </StepWrap>
            )}
            {step === 1 && (
              <StepWrap key="class">
                <ClassStep value={klass} onChange={setKlass} />
                <StepNav step={step} setStep={setStep} canNext={!!klass} />
              </StepWrap>
            )}
            {step === 2 && (
              <StepWrap key="datetime">
                <DateTimeStep
                  date={date}
                  time={time}
                  onDate={setDate}
                  onTime={setTime}
                  preselect={preselect}
                />
                <StepNav step={step} setStep={setStep} canNext={!!(date && time)} />
              </StepWrap>
            )}
            {step === 3 && (
              <StepWrap key="review">
                <ReviewStep
                  style={style}
                  klass={klass}
                  instructor={instructor}
                  date={date}
                  time={time}
                  preselect={preselect}
                />
                <StepNav step={step} setStep={setStep} canNext />
              </StepWrap>
            )}
            {step === 4 && (
              <StepWrap key="payment">
                <PaymentStep
                  price={preselect?.price ?? 1499}
                  onSubmit={async () => {
                    setSubmitting(true);
                    const supabase = createClient();
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                      const { user_metadata } = user;
                      await supabase.from("bookings").insert({
                        user_id: user.id,
                        user_name: user_metadata?.full_name ?? user.email,
                        workshop_slug: workshopSlug,
                        style,
                        klass,
                        instructor,
                        date,
                        time,
                        price: preselect?.price ?? 1499,
                      });
                    }
                    setSubmitting(false);
                    setDone(true);
                  }}
                  submitting={submitting}
                />
              </StepWrap>
            )}
          </AnimatePresence>

          <aside className="block">
            <div className="sticky top-28">
              <SummaryCard
                style={style}
                klass={klass}
                instructor={instructor}
                date={date}
                time={time}
                preselect={preselect}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Stepper({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="flex items-center gap-0 overflow-x-auto [scrollbar-width:none]">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s} className="flex items-center">
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-medium transition ${
                  done
                    ? "bg-foreground text-background"
                    : active
                      ? "bg-foreground text-background"
                      : "border bg-background text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              <span
                className={`whitespace-nowrap text-xs transition ${
                  active || done ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`mx-3 h-px w-8 transition ${
                  i < current ? "bg-foreground" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="flex flex-col gap-6"
    >
      {children}
    </motion.div>
  );
}

function StepNav({
  step,
  setStep,
  canNext,
}: {
  step: number;
  setStep: (n: number) => void;
  canNext: boolean;
}) {
  return (
    <div className="flex items-center gap-3 pt-2">
      {step > 0 && (
        <button
          onClick={() => setStep(step - 1)}
          className="inline-flex items-center gap-1.5 rounded-full border px-5 py-3 text-sm transition hover:bg-cream"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
      )}
      {step < 4 ? (
        <button
          onClick={() => { if (!canNext) return; setStep(step + 1); }}
          className={`inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-sm transition active:scale-[0.97] ${
            canNext
              ? "bg-foreground text-background hover:bg-foreground/90"
              : "bg-muted text-muted-foreground pointer-events-none"
          }`}
        >
          Continue <ChevronRight className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

function Chips({
  items,
  value,
  onChange,
}: {
  items: { id: string; name: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((s) => (
        <button
          key={s.id}
          onClick={() => onChange(s.id)}
          className={`rounded-full border px-5 py-2.5 text-sm transition ${
            value === s.id
              ? "bg-foreground text-background border-foreground"
              : "bg-background hover:bg-cream"
          }`}
        >
          {s.name}
        </button>
      ))}
    </div>
  );
}

function StyleStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">
        Step 01
      </div>
      <h2 className="text-display mt-2 text-3xl md:text-4xl">
        Choose a style
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick the discipline that moves you.
      </p>
      <div className="mt-6">
        <Chips items={styles} value={value} onChange={onChange} />
      </div>
    </div>
  );
}

function ClassStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const classTypes = [
    { id: "Regulars", name: "Regulars", desc: "Weekly ongoing classes" },
    { id: "Workshop", name: "Workshop", desc: "Featured choreography" },
    { id: "Masterclass", name: "Masterclass", desc: "Intensive technique" },
    { id: "Battle", name: "Battle", desc: "Competition & cypher" },
    { id: "Showcase", name: "Showcase", desc: "Performance prep" },
    { id: "Community", name: "Community", desc: "Open sessions" },
  ];
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">
        Step 02
      </div>
      <h2 className="text-display mt-2 text-3xl md:text-4xl">
        Select class type
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        What kind of session are you looking for?
      </p>
      <div className="mt-6 grid gap-2">
        {classTypes.map((c) => (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
              value === c.id
                ? "border-foreground bg-foreground/5"
                : "hover:bg-cream"
            }`}
          >
            <div
              className={`h-4 w-4 shrink-0 rounded-full border-2 transition ${
                value === c.id ? "border-foreground bg-foreground" : "border-muted-foreground"
              }`}
            />
            <div>
              <div className="text-sm font-medium">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function DateTimeStep({
  date,
  time,
  onDate,
  onTime,
  preselect,
}: {
  date: string;
  time: string;
  onDate: (v: string) => void;
  onTime: (v: string) => void;
  preselect?: W;
}) {
  const dates = [
    { id: "Mon, 17 Feb", label: "Mon 17" },
    { id: "Tue, 18 Feb", label: "Tue 18" },
    { id: "Wed, 19 Feb", label: "Wed 19" },
    { id: "Thu, 20 Feb", label: "Thu 20" },
    { id: "Fri, 21 Feb", label: "Fri 21" },
    { id: "Sat, 22 Feb", label: "Sat 22" },
    { id: "Sun, 23 Feb", label: "Sun 23" },
  ];
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">
        Step 03
      </div>
      <h2 className="text-display mt-2 text-3xl md:text-4xl">
        Pick date & time
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {preselect
          ? `Pre-selected for "${preselect.title}"`
          : "Choose when to come in."}
      </p>

      <div className="mt-6">
        <div className="text-xs uppercase tracking-widest text-foreground/60">
          Date
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {dates.map((d) => (
            <button
              key={d.id}
              onClick={() => onDate(d.id)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                date === d.id
                  ? "bg-foreground text-background border-foreground"
                  : "hover:bg-cream"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="text-xs uppercase tracking-widest text-foreground/60">
          Time
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3">
          {timeSlots.map((t) => (
            <button
              key={t}
              onClick={() => onTime(t)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                time === t
                  ? "bg-foreground text-background border-foreground"
                  : "hover:bg-cream"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewStep({
  style,
  klass,
  instructor,
  date,
  time,
  preselect,
}: {
  style: string;
  klass: string;
  instructor: string;
  date: string;
  time: string;
  preselect?: W;
}) {
  const styleName = styles.find((s) => s.id === style)?.name ?? style;
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">
        Step 04
      </div>
      <h2 className="text-display mt-2 text-3xl md:text-4xl">
        Review your booking
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Double-check everything before we proceed.
      </p>
      <div className="mt-6 space-y-3">
        <ReviewRow label="Style" value={styleName} />
        <ReviewRow label="Class" value={klass || (preselect?.klass ?? "—")} />
        <ReviewRow
          label="Instructor"
          value={instructor || (preselect?.instructor ?? "—")}
        />
        <ReviewRow label="Date" value={date || (preselect?.date ?? "—")} />
        <ReviewRow label="Time" value={time || (preselect?.time ?? "—")} />
        <ReviewRow
          label="Price"
          value={`₹${(preselect?.price ?? 1499).toLocaleString("en-IN")}`}
        />
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border bg-background px-5 py-3">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function PaymentStep({
  price,
  onSubmit,
  submitting,
}: {
  price: number;
  onSubmit: () => void;
  submitting: boolean;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">
        Step 05
      </div>
      <h2 className="text-display mt-2 text-3xl md:text-4xl">Payment</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Secure checkout. Your info is encrypted.
      </p>
      <div className="mt-6 max-w-md space-y-4">
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Full name
          </span>
          <input
            defaultValue="Alex Morgan"
            className="mt-2 w-full rounded-full border bg-background px-5 py-3 text-sm outline-none transition focus:border-foreground"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Email
          </span>
          <input
            type="email"
            defaultValue="alex@example.com"
            className="mt-2 w-full rounded-full border bg-background px-5 py-3 text-sm outline-none transition focus:border-foreground"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Card number
          </span>
          <div className="mt-2 flex items-center rounded-full border bg-background px-5 transition focus-within:border-foreground">
            <CreditCard className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              defaultValue="4242 4242 4242 4242"
              className="w-full bg-transparent px-3 py-3 text-sm outline-none"
            />
          </div>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              Expiry
            </span>
            <input
              defaultValue="12/28"
              className="mt-2 w-full rounded-full border bg-background px-5 py-3 text-sm outline-none transition focus:border-foreground"
            />
          </label>
          <label>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              CVC
            </span>
            <input
              defaultValue="123"
              className="mt-2 w-full rounded-full border bg-background px-5 py-3 text-sm outline-none transition focus:border-foreground"
            />
          </label>
        </div>
      </div>
      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-sm text-background transition hover:bg-foreground/90 active:scale-[0.97] disabled:opacity-60"
        >
          {submitting
            ? "Processing…"
            : `Pay ₹${price.toLocaleString("en-IN")}`}
        </button>
      </div>
    </div>
  );
}

function SummaryCard({
  style,
  klass,
  instructor,
  date,
  time,
  preselect,
}: {
  style: string;
  klass: string;
  instructor: string;
  date: string;
  time: string;
  preselect?: W;
}) {
  const styleName = styles.find((s) => s.id === style)?.name ?? "—";
  return (
    <div className="rounded-3xl border bg-background/60 p-6 backdrop-blur shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">
        Your pick
      </div>
      {preselect && preselect.img && (
        <div className="mt-3 overflow-hidden rounded-xl bg-muted">
          <img
            src={preselect.img}
            alt={preselect.title}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      )}
      <div className="mt-4 space-y-3 text-sm">
        {preselect && (
          <div className="pb-3 border-b">
            <div className="text-display text-lg">{preselect.title}</div>
            <div className="mt-0.5 text-muted-foreground">{preselect.instructor}</div>
          </div>
        )}
        <SumRow label="Style" value={styleName} />
        <SumRow label="Class" value={klass || preselect?.klass} />
        <SumRow label="Instructor" value={instructor || preselect?.instructor} />
        <SumRow label="Date" value={date || preselect?.date} />
        <SumRow label="Time" value={time || preselect?.time} />
      </div>
      <div className="mt-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-display text-2xl">
            ₹{(preselect?.price ?? 1499).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}

function SumRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value || "—"}</span>
    </div>
  );
}

function SuccessScreen({
  name,
  instructor,
  price,
  onReset,
}: {
  name?: string;
  instructor?: string;
  price?: number;
  onReset: () => void;
}) {
  const [confirmationNum] = useState(() => Math.floor(Math.random() * 9000) + 1000);
  return (
    <div className="relative min-h-screen pt-32 pb-24">
      <div className="mesh-bg pointer-events-none absolute inset-0 opacity-60" />
      <Confetti />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-foreground text-background"
        >
          <Check className="h-8 w-8" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-display mt-8 text-5xl md:text-7xl"
        >
          You&apos;re in.
        </motion.h1>
        <p className="mt-4 text-muted-foreground">
          A confirmation is on its way to your inbox.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-10 max-w-md rounded-3xl border bg-background p-6 text-left shadow-xl"
        >
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Confirmation · CN-{confirmationNum}
          </div>
          <div className="text-display mt-2 text-2xl">{name}</div>
          {instructor && (
            <div className="mt-1 text-sm text-muted-foreground">
              with {instructor}
            </div>
          )}
          <div className="mt-6 space-y-2 text-sm">
            <SumRow label="Paid" value={price ? `₹${price.toLocaleString("en-IN")}` : undefined} />
          </div>
        </motion.div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm">
            <Download className="h-4 w-4" /> Download receipt
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm">
            Add to calendar
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm">
            <Share2 className="h-4 w-4" /> Share
          </button>
        </div>

        <div className="mt-10 flex justify-center gap-3">
          <button
            onClick={onReset}
            className="rounded-full bg-foreground px-6 py-3 text-sm text-background"
          >
            Book another
          </button>
          <Link href="/" className="rounded-full border px-6 py-3 text-sm">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}

function Confetti() {
  const [configs] = useState(() =>
    Array.from({ length: 40 }, () => ({
      x: `${Math.random() * 100}%`,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 0.6,
    })),
  );
  const colors = ["bg-lavender", "bg-electric", "bg-coral", "bg-orange-soft", "bg-sky"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {configs.map((cfg, i) => (
        <motion.span
          key={i}
          initial={{ y: -40, x: cfg.x, rotate: 0, opacity: 1 }}
          animate={{ y: "110vh", rotate: 720, opacity: 0.7 }}
          transition={{ duration: cfg.duration, delay: cfg.delay, ease: "easeIn" }}
          className={`absolute top-0 h-3 w-2 rounded-sm ${colors[i % colors.length]}`}
        />
      ))}
    </div>
  );
}
