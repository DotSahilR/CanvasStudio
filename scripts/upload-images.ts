import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const PUBLIC_DIR = path.resolve("public");

async function upload(bucket: string, filename: string) {
  const filePath = path.join(PUBLIC_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`  SKIP ${filename} — not found`);
    return null;
  }
  const buffer = fs.readFileSync(filePath);
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filename, buffer, { upsert: true, contentType: "image/png" });

  if (error) {
    console.error(`  FAIL ${filename}:`, error.message);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filename);

  console.log(`  OK   ${filename} → ${publicUrl}`);
  return publicUrl;
}

async function ensureBucket(name: string) {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (buckets?.some((b) => b.name === name)) return;
  await supabase.storage.createBucket(name, { public: true });
  console.log(`Created bucket: ${name}`);
}

async function main() {
  await ensureBucket("workshops");
  await ensureBucket("gallery");
  await ensureBucket("team");

  // 1. Upload workshop images
  console.log("\n=== Workshop images ===");
  const workshopFiles = [
    "daryaa.png", "bin-tere.png", "ik-vaari-aa-kolkata.png",
    "ik-vaari-aa-delhi.png", "humraah.png", "prem-ki-leela.png",
  ];
  const workshopUrls: Record<string, string> = {};
  for (const f of workshopFiles) {
    const url = await upload("workshops", f);
    if (url) workshopUrls[f] = url;
  }

  // 2. Upload gallery images
  console.log("\n=== Gallery images ===");
  const galleryUrls: string[] = [];
  for (let i = 1; i <= 13; i++) {
    const url = await upload("gallery", `${i}.png`);
    if (url) galleryUrls.push(url);
  }

  // 3. Upload team images
  console.log("\n=== Team images ===");
  const teamUrls: Record<string, string> = {};
  for (const name of ["Team1.png", "Team2.png"]) {
    const url = await upload("team", name);
    if (url) teamUrls[name] = url;
  }

  // 4. Upload about gallery images
  console.log("\n=== About gallery images ===");
  for (let i = 1; i <= 4; i++) {
    await upload("gallery", `abt${i}.png`);
  }

  // 5. Update workshop table with new URLs
  console.log("\n=== Updating workshop table ===");
  for (const [file, url] of Object.entries(workshopUrls)) {
    const slug = file.replace(".png", "");
    const { error } = await supabase
      .from("workshops")
      .update({ poster_url: url })
      .eq("slug", slug);
    if (error) console.error(`  FAIL update ${slug}:`, error.message);
    else console.log(`  OK   ${slug} updated`);
  }

  console.log("\nDone! Copy these URLs to your code if needed:");
  console.log("\nWorkshop URLs:", workshopUrls);
  console.log("Gallery URLs:", galleryUrls);
  console.log("Team URLs:", teamUrls);
}

main().catch(console.error);
