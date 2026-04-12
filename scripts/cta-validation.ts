// CTA Demo-Echo Validation — 5 products
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
    label: "Control: Oil Sprayer (strong CTA product)",
    product: {
      url: "", title: "Olive Oil Sprayer Mister — 200ml Glass",
      description: "Fine even mist replaces messy pouring. Adjustable nozzle.",
      price: 12.99, currency: "USD", images: [], category_tags: ["kitchen"],
      ingredients_or_materials: "Glass, stainless steel", claims: ["Fine mist covers pan evenly", "Uses 80% less oil", "Adjustable nozzle"],
      review_signals: { rating: 4.5, review_count: 1823, recurring_phrases: ["even coating"] },
      badges: [], sold_count: null, raw_text: "Oil sprayer mister"
    }
  },
  {
    label: "Low-Excitement: Drawer Organizers (weak CTA product)",
    product: {
      url: "", title: "Drawer Organizer Trays — Set of 8, Clear, Interlocking",
      description: "Clear interlocking trays in 4 sizes. Non-slip rubber feet.",
      price: 15.99, currency: "USD", images: [], category_tags: ["home", "organization"],
      ingredients_or_materials: "BPA-free plastic", claims: ["8 trays in 4 sizes", "Interlocking stays in place", "Non-slip feet"],
      review_signals: { rating: 4.4, review_count: 3800, recurring_phrases: ["organized my junk drawer"] },
      badges: [], sold_count: null, raw_text: "Drawer organizer trays"
    }
  },
  {
    label: "Hard-to-Prove: Travel Cord Pouch (weak CTA product)",
    product: {
      url: "", title: "Travel Cord Organizer Pouch — Waterproof",
      description: "Compact pouch organizes cables, chargers, adapters. Elastic loops. Fits carry-on.",
      price: 13.99, currency: "USD", images: [], category_tags: ["travel", "organization"],
      ingredients_or_materials: "Waterproof nylon, YKK zippers", claims: ["Elastic loops keep everything separated", "Waterproof exterior", "Fits carry-on pocket"],
      review_signals: { rating: 4.4, review_count: 2900, recurring_phrases: ["no more cable mess"] },
      badges: [], sold_count: null, raw_text: "Cord organizer pouch"
    }
  },
  {
    label: "Visual Demo: Silicone Stretch Lids (strong demo product)",
    product: {
      url: "", title: "Silicone Stretch Lids — 6 Pack",
      description: "Reusable silicone lids fit any round container 2.6-9.8 inches. Replace plastic wrap.",
      price: 8.99, currency: "USD", images: [], category_tags: ["kitchen"],
      ingredients_or_materials: "Food-grade silicone", claims: ["Fits any round container", "Creates airtight seal", "Reusable hundreds of times"],
      review_signals: { rating: 4.4, review_count: 3200, recurring_phrases: ["actually stays on"] },
      badges: [], sold_count: null, raw_text: "Silicone stretch lids"
    }
  },
  {
    label: "Problem-Solver: Blind Spot Mirrors (generic CTA prone)",
    product: {
      url: "", title: "Blind Spot Mirrors — 2 Pack, Stick-On Convex",
      description: "Convex mirrors stick onto side mirrors to eliminate blind spots. 360-degree adjustable.",
      price: 7.99, currency: "USD", images: [], category_tags: ["auto", "safety"],
      ingredients_or_materials: "HD convex glass, 3M adhesive", claims: ["Eliminates blind spots", "360-degree adjustable", "Sticks on in 10 seconds"],
      review_signals: { rating: 4.3, review_count: 11000, recurring_phrases: ["can finally see my blind spot"] },
      badges: [], sold_count: null, raw_text: "Blind spot mirrors"
    }
  },
];

async function runTest(label: string, product: ExtractedProduct) {
  console.log(`\n--- ${label} ---`);
  try {
    const classification = await runClassification(product);
    const analysis = await runAnalysis(product, classification);
    const modality = await runModalitySelection(classification, analysis);
    const showSay = await runShowSayMapping(product, classification, analysis, modality);
    const angle = await runAngleSelection(product, classification, analysis, modality, showSay);
    const script = await runScriptGeneration(product, classification, analysis, modality, showSay, angle);
    const qa = await runQAPass(script, angle, analysis, showSay);

    console.log(`  Angle: "${angle.selected.name}"`);
    console.log(`  Proof Beat Echoed: "${script.cta_logic.proof_beat_echoed}"`);
    console.log(`  CTA: "${script.cta_logic.cta_text}"`);
    console.log(`  CTA Score: ${qa.scores.cta_naturalness}/10`);
    console.log(`  Overall: ${qa.overall_score}`);

    // Classify CTA quality
    const ctaText = script.cta_logic.cta_text.toLowerCase();
    const proofBeat = (script.cta_logic.proof_beat_echoed || "").toLowerCase();
    const echoesProof = proofBeat && (
      ctaText.includes(proofBeat.substring(0, 15)) ||
      ctaText.includes("after seeing") ||
      ctaText.includes("after watching") ||
      ctaText.includes("once i saw") ||
      ctaText.includes("when it did") ||
      ctaText.includes("that sold me")
    );
    const isGeneric = ctaText.includes("i linked") && !echoesProof;

    let verdict = "Generic";
    if (echoesProof) verdict = "Demo-Echo Strong";
    else if (ctaText.includes("after") || ctaText.includes("seeing") || ctaText.includes("that")) verdict = "Demo-Echo Partial";

    console.log(`  CTA VERDICT: ${verdict}`);
    return { label, cta: script.cta_logic.cta_text, proofBeat: script.cta_logic.proof_beat_echoed, ctaScore: qa.scores.cta_naturalness, verdict };
  } catch (e) {
    console.error(`  ERROR: ${e instanceof Error ? e.message : e}`);
    return null;
  }
}

async function main() {
  console.log("CTA DEMO-ECHO VALIDATION — 5 Products\n");
  const results = [];
  for (const { label, product } of PRODUCTS) { results.push(await runTest(label, product)); }

  console.log("\n=== CTA SUMMARY ===");
  results.filter(r => r).forEach(r => {
    console.log(`  ${r!.label.substring(0,35).padEnd(37)} | CTA Score: ${r!.ctaScore} | ${r!.verdict}`);
  });
  const demoEcho = results.filter(r => r?.verdict?.includes("Demo-Echo")).length;
  console.log(`\n  Demo-Echo: ${demoEcho}/${results.filter(r=>r).length} | Generic: ${results.filter(r=>r).length - demoEcho}/${results.filter(r=>r).length}`);
}

main().catch(console.error);
