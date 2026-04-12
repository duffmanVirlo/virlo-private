// Batch 3 Calibration Test — 8 products (7 new + 1 repeat anchor)
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
  {
    label: "[ANCHOR] Oil Sprayer (B1/B2 repeat)",
    product: {
      url: "", title: "Olive Oil Sprayer Mister for Cooking — 200ml Glass Bottle",
      description: "Fine even mist replaces messy pouring. Adjustable nozzle. Works with any oil or vinegar.",
      price: 12.99, currency: "USD", images: [], category_tags: ["kitchen"],
      ingredients_or_materials: "Borosilicate glass, stainless steel nozzle",
      claims: ["Fine mist covers entire pan evenly", "Uses 80% less oil", "Adjustable nozzle", "Dishwasher safe"],
      review_signals: { rating: 4.5, review_count: 1823, recurring_phrases: ["way less oil", "even coating"] },
      badges: [], sold_count: null, raw_text: "Oil sprayer mister 200ml glass"
    }
  },
  {
    label: "Kitchen: Silicone Baking Mat (2-Pack)",
    product: {
      url: "", title: "Silicone Baking Mat — 2 Pack, Non-Stick, Reusable, Fits Half Sheet Pan",
      description: "Non-stick silicone baking mat replaces parchment paper and cooking spray. Heat resistant to 480°F. Fits standard half-sheet pan. Food-grade silicone with fiberglass mesh core.",
      price: 11.99, currency: "USD", images: [], category_tags: ["kitchen", "baking"],
      ingredients_or_materials: "Food-grade silicone, fiberglass mesh core",
      claims: ["Replaces parchment paper forever", "Nothing sticks — cookies slide right off", "Heat resistant to 480°F", "Fits standard half-sheet pan perfectly", "Reusable for years"],
      review_signals: { rating: 4.6, review_count: 7200, recurring_phrases: ["cookies slide right off", "no more parchment", "best baking purchase"] },
      badges: ["bestseller"], sold_count: "250K+ sold", raw_text: "Silicone baking mat 2 pack non-stick reusable"
    }
  },
  {
    label: "Home: Under-Sink Organizer (2-Tier Pull-Out)",
    product: {
      url: "", title: "2-Tier Pull-Out Under-Sink Organizer — Adjustable Height, Fits Most Cabinets",
      description: "Sliding organizer turns chaotic under-sink cabinet into accessible storage. Two tiers with adjustable height to fit around pipes. Pull-out design means nothing gets lost in the back.",
      price: 29.99, currency: "USD", images: [], category_tags: ["home", "organization", "kitchen"],
      ingredients_or_materials: "Powder-coated steel frame, BPA-free plastic trays, anti-slip feet",
      claims: ["Fits around pipes — adjustable height", "Pull-out design — nothing lost in the back", "Two independent tiers", "Supports up to 30 lbs per tier", "No tools needed for assembly"],
      review_signals: { rating: 4.4, review_count: 3100, recurring_phrases: ["finally organized under sink", "actually fits around my pipes", "should have bought sooner"] },
      badges: [], sold_count: "60K+ sold", raw_text: "Under sink organizer 2 tier pull out adjustable"
    }
  },
  {
    label: "Auto: Blind Spot Mirrors (2-Pack, Stick-On)",
    product: {
      url: "", title: "Blind Spot Mirrors — 2 Pack, Adjustable Convex, Stick-On",
      description: "Small convex mirrors that stick onto your existing side mirrors to eliminate blind spots. 360-degree adjustable angle. HD glass with anti-glare coating. Weatherproof adhesive.",
      price: 7.99, currency: "USD", images: [], category_tags: ["auto", "safety"],
      ingredients_or_materials: "HD convex glass, ABS frame, 3M weatherproof adhesive",
      claims: ["Eliminates blind spots on both sides", "360-degree adjustable angle", "HD glass with anti-glare", "Sticks on in 10 seconds", "Weatherproof — survives car washes"],
      review_signals: { rating: 4.3, review_count: 11000, recurring_phrases: ["can finally see my blind spot", "should come standard", "easy to install"] },
      badges: ["bestseller"], sold_count: "400K+ sold", raw_text: "Blind spot mirrors 2 pack stick on adjustable convex"
    }
  },
  {
    label: "Tool: Precision Screwdriver Set (25-in-1)",
    product: {
      url: "", title: "25-in-1 Precision Screwdriver Set — Magnetic Tips, Aluminum Handle",
      description: "Compact precision screwdriver kit for electronics, glasses, watches, laptops, and phones. Magnetic tips hold tiny screws. Aluminum alloy handle with swivel cap. Includes Phillips, Torx, hex, pentalobe, tri-wing bits.",
      price: 9.99, currency: "USD", images: [], category_tags: ["tools", "electronics"],
      ingredients_or_materials: "S2 steel bits, aluminum alloy handle, magnetic tip holder",
      claims: ["25 precision bits for every tiny screw type", "Magnetic tips hold screws in place", "Swivel cap for one-hand turning", "Fits in a pocket", "Works on phones, laptops, glasses, game controllers"],
      review_signals: { rating: 4.5, review_count: 4300, recurring_phrases: ["fixed my glasses", "perfect for electronics", "so compact", "magnetic tip is clutch"] },
      badges: [], sold_count: "80K+ sold", raw_text: "Precision screwdriver set 25 in 1 magnetic aluminum"
    }
  },
  {
    label: "Visual: Teeth Whitening Strips (14-Day)",
    product: {
      url: "", title: "Teeth Whitening Strips — 14-Day Treatment, Enamel-Safe, No Sensitivity",
      description: "Professional-grade whitening strips with hydrogen peroxide gel. Visible results in 3 days. Full treatment in 14 days. Designed to minimize sensitivity. Non-slip grip stays on teeth.",
      price: 24.99, currency: "USD", images: [], category_tags: ["beauty", "wellness", "dental"],
      ingredients_or_materials: "Hydrogen peroxide gel, polyethylene strip, non-slip adhesive layer",
      claims: ["Visible whitening in 3 days", "Full shade improvement in 14 days", "Enamel-safe formula", "No sensitivity design", "Non-slip — stays on teeth during use"],
      review_signals: { rating: 4.2, review_count: 5800, recurring_phrases: ["actually works", "no sensitivity", "visible difference fast", "stays on teeth"] },
      badges: [], sold_count: "120K+ sold", raw_text: "Teeth whitening strips 14 day treatment enamel safe"
    }
  },
  {
    label: "Low-Excitement: Cord Organizer Pouch (Travel)",
    product: {
      url: "", title: "Travel Cord Organizer Pouch — Waterproof, Fits Chargers + Cables + Adapters",
      description: "Compact zippered pouch organizes all your travel cables, chargers, adapters, and earbuds in one place. Waterproof nylon exterior. Elastic loops hold each item separately. Fits in carry-on pocket.",
      price: 13.99, currency: "USD", images: [], category_tags: ["travel", "organization"],
      ingredients_or_materials: "Waterproof nylon, YKK zippers, elastic interior loops",
      claims: ["Fits all your chargers and cables in one pouch", "Elastic loops keep everything separated", "Waterproof exterior", "Fits in carry-on side pocket", "No more tangled cable bags"],
      review_signals: { rating: 4.4, review_count: 2900, recurring_phrases: ["no more cable mess", "perfect for travel", "everything has a spot"] },
      badges: [], sold_count: "45K+ sold", raw_text: "Travel cord organizer pouch waterproof cables chargers"
    }
  },
  {
    label: "Gadget: Portable Neck Fan (Bladeless)",
    product: {
      url: "", title: "Portable Neck Fan — Bladeless, 3 Speeds, USB Rechargeable, 8-Hour Battery",
      description: "Wearable bladeless neck fan for hands-free cooling. Three speed settings. USB-C rechargeable with 8-hour battery life. Lightweight at 8oz. No hair-catching blades.",
      price: 19.99, currency: "USD", images: [], category_tags: ["outdoor", "wellness", "gadget"],
      ingredients_or_materials: "ABS body, brushless motor, silicone neck band, USB-C charging",
      claims: ["Bladeless — no hair catching", "8-hour battery life", "Only 8 ounces", "3 speed settings", "USB-C fast charging"],
      review_signals: { rating: 4.1, review_count: 6500, recurring_phrases: ["actually keeps you cool", "no hair getting caught", "battery lasts all day", "great for outdoor events"] },
      badges: [], sold_count: "180K+ sold", raw_text: "Portable neck fan bladeless USB rechargeable 8 hour"
    }
  },
];

async function runTest(label: string, product: ExtractedProduct) {
  console.log(`\n${"=".repeat(70)}`);
  console.log(`TESTING: ${label}`);
  console.log(`${"=".repeat(70)}\n`);
  try {
    const classification = await runClassification(product);
    console.log(`Classification: ${classification.primary_category} / ${classification.product_type} (${classification.confidence}%)`);
    const analysis = await runAnalysis(product, classification);
    const modality = await runModalitySelection(classification, analysis);
    console.log(`Modality: ${modality.selected}`);
    const showSay = await runShowSayMapping(product, classification, analysis, modality);
    const angle = await runAngleSelection(product, classification, analysis, modality, showSay);
    console.log(`Angle: "${angle.selected.name}" (${angle.selected.score.composite.toFixed(1)})`);
    const script = await runScriptGeneration(product, classification, analysis, modality, showSay, angle);
    const qa = await runQAPass(script, angle, analysis, showSay);
    console.log(`QA: ${qa.passed ? "PASS" : "FAIL"} | Overall: ${qa.overall_score} (server-side)`);
    console.log(`Hooks: ${script.hook_options.length}`);
    console.log(`\n--- HOOKS ---`);
    script.hook_options.forEach((h) => console.log(`  ${h.rank}. [${h.hook_format}] "${h.hook_text}"`));
    console.log(`\n--- CTA ---\n  "${script.cta_logic.cta_text}"`);
    console.log(`\n--- CAPTION ---\n  ${script.caption.substring(0, 180)}`);
    console.log(`\n--- SCORES ---\n  h=${qa.scores.hook_strength} b=${qa.scores.belief_loop_completeness} p=${qa.scores.proof_authenticity} g=${qa.scores.generic_language} f=${qa.scores.filming_feasibility} c=${qa.scores.cta_naturalness}`);
    if (qa.flags.length > 0) { console.log(`--- FLAGS ---`); qa.flags.forEach((f) => console.log(`  [${f.severity}] ${f.component}: ${f.issue.substring(0, 100)}`)); }
    const allText = [...script.hook_options.map(h => h.hook_text), script.cta_logic.cta_text, script.caption, ...script.beats.map(b => b.content + (b.spoken || "") + (b.text_overlay || ""))].join(" ").toLowerCase();
    const pr = allText.includes("$") || allText.includes("price") || allText.includes("deal");
    const rr = allText.includes("star") || allText.includes("review") || allText.includes("rating") || allText.includes("sold");
    console.log(`\n--- METADATA ---\n  Price: ${pr ? "YES" : "no"} | Rating: ${rr ? "YES" : "no"}`);
    return { label, hooks: script.hook_options.length, score: qa.overall_score, scores: qa.scores, passed: qa.passed, cta: script.cta_logic.cta_text, pr, rr, flags: qa.flags.length };
  } catch (e) { console.error(`FAILED: ${e instanceof Error ? e.message : e}`); return { label, hooks: 0, score: 0, passed: false, error: true }; }
}

async function main() {
  console.log("BATCH 3 CALIBRATION TEST — 8 Products (post-11.3 QA fix)\n");
  const results: any[] = [];
  for (const { label, product } of PRODUCTS) { results.push(await runTest(label, product)); }
  console.log(`\n${"=".repeat(70)}`);
  console.log("BATCH 3 SUMMARY");
  console.log(`${"=".repeat(70)}`);
  const passing = results.filter(r => !r.error && r.passed);
  const scores = passing.map(r => r.score);
  results.forEach(r => {
    if (r.error) { console.log(`  ${r.label}: ERROR`); return; }
    console.log(`  ${r.label}: ${r.passed ? "PASS" : "FAIL"} (${r.score}) | Hooks: ${r.hooks} | h=${r.scores?.hook_strength} b=${r.scores?.belief_loop_completeness} p=${r.scores?.proof_authenticity} g=${r.scores?.generic_language} f=${r.scores?.filming_feasibility} c=${r.scores?.cta_naturalness}`);
  });
  if (scores.length > 1) {
    console.log(`\n  SCORE SPREAD: min=${Math.min(...scores).toFixed(2)} max=${Math.max(...scores).toFixed(2)} range=${(Math.max(...scores)-Math.min(...scores)).toFixed(2)}`);
    console.log(`  UNIQUE SCORES: ${new Set(scores.map(s => s.toFixed(2))).size} of ${scores.length}`);
    console.log(`  ALL SAME? ${new Set(scores.map(s => s.toFixed(1))).size === 1 ? "YES — STILL CLUSTERING" : "NO — SPREAD EXISTS"}`);
  }
}

main().catch(console.error);
