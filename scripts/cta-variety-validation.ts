// CTA Syntax Variety Validation — 6 products
import { readFileSync } from "fs";
const envContent = readFileSync(".env.local", "utf8");
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^=\s]+)=(.+)$/);
  if (match) process.env[match[1]] = match[2].trim();
}

import { runClassification } from "../lib/convertiq/stages/classify";
import { runAnalysis } from "../lib/convertiq/stages/analyze";
import { runModalitySelection } from "../lib/convertiq/stages/modality";
import { runShowSayMapping } from "../lib/convertiq/stages/showSay";
import { runAngleSelection } from "../lib/convertiq/stages/angle";
import { runScriptGeneration } from "../lib/convertiq/stages/script";
import { runQAPass } from "../lib/convertiq/stages/qa";
import type { ExtractedProduct } from "../types/product";

const PRODUCTS: { label: string; product: ExtractedProduct }[] = [
  { label: "Oil Sprayer", product: { url: "", title: "Olive Oil Sprayer Mister — 200ml Glass", description: "Fine mist replaces messy pouring. Adjustable nozzle.", price: 12.99, currency: "USD", images: [], category_tags: ["kitchen"], ingredients_or_materials: "Glass, steel", claims: ["Fine mist covers pan evenly", "Uses 80% less oil"], review_signals: { rating: 4.5, review_count: 1823, recurring_phrases: [] }, badges: [], sold_count: null, raw_text: "" } },
  { label: "Drain Catcher", product: { url: "", title: "TubShroom Silicone Drain Hair Catcher", description: "Catches every hair before it clogs.", price: 12.99, currency: "USD", images: [], category_tags: ["home"], ingredients_or_materials: "Silicone", claims: ["Catches every hair", "Easy clean"], review_signals: { rating: 4.3, review_count: 8900, recurring_phrases: [] }, badges: [], sold_count: null, raw_text: "" } },
  { label: "Garlic Press", product: { url: "", title: "Garlic Press — No Need to Peel", description: "Heavy-duty press works with unpeeled cloves.", price: 14.99, currency: "USD", images: [], category_tags: ["kitchen"], ingredients_or_materials: "Stainless steel", claims: ["No peeling required", "Peel stays inside"], review_signals: { rating: 4.5, review_count: 5400, recurring_phrases: [] }, badges: [], sold_count: null, raw_text: "" } },
  { label: "Drawer Organizers", product: { url: "", title: "Drawer Organizer Trays — Set of 8", description: "Clear interlocking trays, 4 sizes.", price: 15.99, currency: "USD", images: [], category_tags: ["home"], ingredients_or_materials: "BPA-free plastic", claims: ["Interlocking stays in place", "Non-slip feet"], review_signals: { rating: 4.4, review_count: 3800, recurring_phrases: [] }, badges: [], sold_count: null, raw_text: "" } },
  { label: "Magnetic Tool Mat", product: { url: "", title: "SEESE Magnetic Tool Mat — N52", description: "Holds tools on any metal surface. Oil resistant.", price: 29.99, currency: "USD", images: [], category_tags: ["auto"], ingredients_or_materials: "N52 magnets, PVC", claims: ["Holds 25 lbs", "Works at any angle"], review_signals: { rating: 4.8, review_count: 12, recurring_phrases: [] }, badges: [], sold_count: null, raw_text: "" } },
  { label: "Pimple Patches", product: { url: "", title: "Hydrocolloid Pimple Patches — 72 Pack", description: "Absorbs pus overnight. Invisible under makeup.", price: 9.99, currency: "USD", images: [], category_tags: ["beauty"], ingredients_or_materials: "Hydrocolloid", claims: ["Absorbs overnight", "Invisible under makeup", "Prevents picking"], review_signals: { rating: 4.5, review_count: 15000, recurring_phrases: [] }, badges: [], sold_count: null, raw_text: "" } },
];

async function runTest(label: string, product: ExtractedProduct) {
  try {
    const c = await runClassification(product);
    const a = await runAnalysis(product, c);
    const m = await runModalitySelection(c, a);
    const ss = await runShowSayMapping(product, c, a, m);
    const ang = await runAngleSelection(product, c, a, m, ss);
    const script = await runScriptGeneration(product, c, a, m, ss, ang);
    const qa = await runQAPass(script, ang, a, ss);

    const ctaLower = script.cta_logic.cta_text.toLowerCase();
    let syntax = "other";
    if (ctaLower.startsWith("after seeing")) syntax = "after-seeing";
    else if (ctaLower.startsWith("after watching")) syntax = "after-watching";
    else if (ctaLower.startsWith("once i saw")) syntax = "once-i-saw";
    else if (ctaLower.startsWith("that ")) syntax = "that-X";
    else if (ctaLower.startsWith("honestly")) syntax = "honestly-X";
    else if (ctaLower.startsWith("i'm never")) syntax = "im-never";
    else if (ctaLower.startsWith("if your")) syntax = "if-your";
    else if (ctaLower.includes("is why i")) syntax = "is-why-i";
    else if (ctaLower.includes("was all i")) syntax = "was-all-i";
    else if (ctaLower.includes("sold me")) syntax = "sold-me";
    else if (ctaLower.includes("after")) syntax = "mid-after";

    const hasLinkedExact = ctaLower.includes("i linked the exact");
    console.log(`\n${label}:`);
    console.log(`  Proof: "${script.cta_logic.proof_beat_echoed}"`);
    console.log(`  CTA:   "${script.cta_logic.cta_text}"`);
    console.log(`  Syntax: ${syntax} | Generic tail: ${hasLinkedExact ? "YES" : "no"} | CTA score: ${qa.scores.cta_naturalness}`);
    return { label, syntax, hasLinkedExact, ctaScore: qa.scores.cta_naturalness };
  } catch (e) { console.error(`  ${label}: ERROR - ${e instanceof Error ? e.message : e}`); return null; }
}

async function main() {
  console.log("CTA SYNTAX VARIETY VALIDATION — 6 Products\n");
  const results = [];
  for (const { label, product } of PRODUCTS) { results.push(await runTest(label, product)); }
  const valid = results.filter(r => r) as NonNullable<typeof results[0]>[];
  console.log("\n=== SYNTAX DISTRIBUTION ===");
  const dist: Record<string, number> = {};
  valid.forEach(r => { dist[r.syntax] = (dist[r.syntax] || 0) + 1; });
  Object.entries(dist).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
  console.log(`\n  Unique patterns: ${Object.keys(dist).length} of ${valid.length}`);
  console.log(`  "after-seeing" count: ${dist["after-seeing"] || 0} of ${valid.length}`);
  console.log(`  "I linked the exact" tail: ${valid.filter(r => r.hasLinkedExact).length} of ${valid.length}`);
  console.log(`  VARIETY: ${Object.keys(dist).length >= 3 ? "GOOD" : Object.keys(dist).length >= 2 ? "PARTIAL" : "STILL CALCIFIED"}`);
}

main().catch(console.error);
