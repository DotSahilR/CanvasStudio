"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Save, ArrowRight, User, Phone, Music, Camera } from "lucide-react";
import Link from "next/link";

const styleOptions = [
  { id: "hip", name: "Hip Hop" }, { id: "con", name: "Contemporary" },
  { id: "bal", name: "Ballet" }, { id: "hee", name: "Heels" },
  { id: "kpo", name: "K-Pop" }, { id: "bre", name: "Breaking" },
  { id: "hou", name: "House" }, { id: "bol", name: "Bollywood" },
  { id: "jaz", name: "Jazz" }, { id: "sal", name: "Salsa" },
  { id: "kid", name: "Kids Dance" }, { id: "fre", name: "Freestyle" },
];

const levelOptions = [
  { id: "beginner", name: "Beginner" },
  { id: "intermediate", name: "Intermediate" },
  { id: "advanced", name: "Advanced" },
];

export default function ProfilePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredStyle, setPreferredStyle] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("beginner");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace("/auth"); return; }
      supabase.from("user_profiles").select("*").eq("id", user.id).single()
        .then(({ data }) => {
          if (data) {
            setAvatarUrl(data.avatar_url ?? "");
            setFullName(data.full_name ?? "");
            setPhone(data.phone ?? "");
            setPreferredStyle(data.preferred_style ?? "");
            setExperienceLevel(data.experience_level ?? "beginner");
          }
        });
    });
  }, [router]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const ext = file.name.split(".").pop();
    const path = `${user.id}.${ext}`;
    await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(publicUrl);
    await supabase.from("user_profiles").upsert({ id: user.id, avatar_url: publicUrl });
    window.dispatchEvent(new Event("avatar-update"));
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("user_profiles").upsert({
        id: user.id,
        full_name: fullName,
        phone,
        preferred_style: preferredStyle,
        experience_level: experienceLevel,
      });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="relative min-h-screen pt-28 pb-24">
      <div className="mesh-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-2xl px-6">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Your account</div>
          <h1 className="text-display mt-2 text-4xl md:text-6xl">Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage your dancer profile.</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted transition hover:border-foreground"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <Camera className="h-6 w-6 text-muted-foreground" />
              )}
              {uploading && (
                <span className="absolute inset-0 grid place-items-center bg-background/60 text-xs">
                  Uploading…
                </span>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <div>
              <div className="text-display text-lg">{fullName || "Your name"}</div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                {avatarUrl ? "Change photo" : "Upload photo"}
              </button>
            </div>
          </div>

          <Field icon={<User className="h-4 w-4" />} label="Full name" value={fullName} onChange={setFullName} />
          <Field icon={<Phone className="h-4 w-4" />} label="Phone" value={phone} onChange={setPhone} placeholder="+91 98765 43210" />

          <label className="block">
            <span className="mb-1.5 flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
              <Music className="h-3.5 w-3.5" /> Preferred style
            </span>
            <select
              value={preferredStyle}
              onChange={(e) => setPreferredStyle(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-background/80 px-4 py-3 text-sm outline-none focus:border-foreground"
            >
              <option value="">Any style</option>
              {styleOptions.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">Experience level</span>
            <div className="flex flex-wrap gap-2">
              {levelOptions.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setExperienceLevel(l.id)}
                  className={`rounded-full border px-5 py-2.5 text-sm transition ${
                    experienceLevel === l.id
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background hover:bg-cream"
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </label>

          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm text-background transition hover:bg-foreground/90 active:scale-[0.97] disabled:opacity-60"
            >
              <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save changes"}
            </button>
            {saved && <span className="text-xs text-green-600">Saved!</span>}
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <Link
            href="/my-bookings"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            View my bookings <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, value, onChange, placeholder }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
        {icon} {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-black/10 bg-background/80 px-4 py-3 text-sm outline-none transition focus:border-foreground"
      />
    </label>
  );
}
