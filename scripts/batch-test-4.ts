// Batch 4 Calibration Test — 8 products (7 new + 1 anchor)
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
    label: "[ANCHOR] Drain Hair Catcher",
    product: {
      url: "", title: "TubShroom — Silicone Drain Hair Catcher",
      description: "Sits inside drain, catches every hair before it clogs. Easy clean — wipe and replace.",
      price: 12.99, currency: "USD", images: [], category_tags: ["home", "bathroom"],
      ingredients_or_materials: "Medical-grade silicone",
      claims: ["Catches every hair", "Fits standard drains", "No tools", "Easy clean", "Eliminates clogs"],
      review_signals: { rating: 4.3, review_count: 8900, recurring_phrases: ["gross but works", "wish I found sooner"] },
      badges: [], sold_count: null, raw_text: "TubShroom drain hair catcher"
    }
  },
  {
    label: "Kitchen: Garlic Press (Stainless Steel, No-Peel)",
    product: {
      url: "", title: "Garlic Press — Stainless Steel, No Need to Peel Cloves First",
      description: "Heavy-duty garlic press that works with unpeeled cloves. Squeeze and minced garlic comes out, peel stays inside. Stainless steel, dishwasher safe.",
      price: 14.99, currency: "USD", images: [], category_tags: ["kitchen", "cooking"],
      ingredients_or_materials: "304 stainless steel, zinc alloy handles",
      claims: ["No peeling required — press unpeeled cloves", "Minces garlic in one squeeze", "Peel stays inside chamber", "Heavy-duty — won't bend", "Dishwasher safe"],
      review_signals: { rating: 4.5, review_count: 5400, recurring_phrases: ["no more peeling", "comes out perfect", "so easy to clean"] },
      badges: [], sold_count: "90K+ sold", raw_text: "Garlic press stainless steel no peel"
    }
  },
  {
    label: "Home: Mattress Vacuum (UV Sanitizer, Handheld)",
    product: {
      url: "", title: "Handheld Mattress Vacuum with UV Sanitizer — Kills 99.9% Dust Mites",
      description: "Handheld vacuum with UV-C light designed specifically for mattresses, pillows, and upholstery. Powerful suction removes dust mites, dead skin, and allergens. Built-in HEPA filter. 12 minutes per mattress.",
      price: 49.99, currency: "USD", images: [], category_tags: ["home", "cleaning", "wellness"],
      ingredients_or_materials: "ABS body, UV-C lamp, HEPA filter, 400W motor",
      claims: ["UV-C light kills 99.9% of dust mites", "HEPA filter traps allergens", "Removes dead skin cells from mattress", "12 minutes per queen mattress", "Built-in vibration loosens embedded particles"],
      review_signals: { rating: 4.2, review_count: 3600, recurring_phrases: ["the stuff that came out was disgusting", "my allergies improved", "use it every week now"] },
      badges: [], sold_count: "70K+ sold", raw_text: "Mattress vacuum UV sanitizer handheld dust mites"
    }
  },
  {
    label: "Auto: Tire Pressure Gauge (Digital, Lighted)",
    product: {
      url: "", title: "Digital Tire Pressure Gauge — Backlit Display, Fits All Valve Types",
      description: "Digital tire gauge with backlit LCD display for reading in any lighting. Reads PSI, BAR, KPA. Fits Schrader and Presta valves. Auto-off. Includes batteries.",
      price: 8.99, currency: "USD", images: [], category_tags: ["auto", "tools"],
      ingredients_or_materials: "ABS body, LCD display, CR2032 battery included",
      claims: ["Accurate to 0.5 PSI", "Backlit display reads in the dark", "Fits all valve types", "Auto-off saves battery", "Reads PSI, BAR, and KPA"],
      review_signals: { rating: 4.4, review_count: 7200, recurring_phrases: ["way better than gas station gauge", "can finally check at night", "accurate"] },
      badges: ["bestseller"], sold_count: "150K+ sold", raw_text: "Digital tire pressure gauge backlit"
    }
  },
  {
    label: "Tool: Deburring Tool (Universal, Metal/Plastic)",
    product: {
      url: "", title: "Universal Deburring Tool — Removes Burrs from Metal, Plastic, Wood",
      description: "Rotating blade deburring tool smooths rough edges on cut metal, PVC pipe, 3D prints, and wood. Swivel blade follows edges automatically. Works on inside and outside edges.",
      price: 7.99, currency: "USD", images: [], category_tags: ["tools", "workshop"],
      ingredients_or_materials: "Aluminum handle, HSS swivel blade, 10 replacement blades included",
      claims: ["Swivel blade follows any edge shape", "Works on metal, plastic, wood, and 3D prints", "Removes inside and outside burrs", "Includes 10 replacement blades", "One-handed operation"],
      review_signals: { rating: 4.6, review_count: 2100, recurring_phrases: ["smooth as butter", "should have bought years ago", "works on everything"] },
      badges: [], sold_count: "35K+ sold", raw_text: "Deburring tool universal swivel blade"
    }
  },
  {
    label: "Visual: Pimple Patches (Hydrocolloid, 72-Pack)",
    product: {
      url: "", title: "Hydrocolloid Pimple Patches — 72 Pack, Invisible, Overnight Treatment",
      description: "Transparent hydrocolloid patches that absorb pus and fluid from pimples overnight. Thin enough to be invisible under makeup. Medical-grade adhesive stays on while sleeping.",
      price: 9.99, currency: "USD", images: [], category_tags: ["beauty", "skincare"],
      ingredients_or_materials: "Medical-grade hydrocolloid, transparent polyurethane film, hypoallergenic adhesive",
      claims: ["Absorbs pus and fluid overnight", "Invisible under makeup", "Stays on through sleep", "Prevents picking and scarring", "72 patches per pack"],
      review_signals: { rating: 4.5, review_count: 15000, recurring_phrases: ["woke up and it was flat", "actually invisible", "stopped me from picking"] },
      badges: ["bestseller"], sold_count: "500K+ sold", raw_text: "Pimple patches hydrocolloid 72 pack invisible"
    }
  },
  {
    label: "Low-Excitement: Silicone Coasters (Set of 8, Hex)",
    product: {
      url: "", title: "Silicone Coasters — Set of 8, Hexagonal, Non-Slip, Dishwasher Safe",
      description: "Thick silicone coasters that actually grip the table AND the glass. Hexagonal design with grooved channels catches condensation. Won't slide on any surface. Dishwasher safe.",
      price: 11.99, currency: "USD", images: [], category_tags: ["home", "kitchen"],
      ingredients_or_materials: "Food-grade silicone, 4mm thickness, grooved channel design",
      claims: ["Grips both table and glass — nothing slides", "Grooved channels catch condensation", "Won't stain or absorb odors", "Dishwasher safe", "4mm thick — substantial feel"],
      review_signals: { rating: 4.3, review_count: 2800, recurring_phrases: ["finally coasters that don't slide", "look great", "actually catch water"] },
      badges: [], sold_count: "40K+ sold", raw_text: "Silicone coasters set of 8 hexagonal non-slip"
    }
  },
  {
    label: "Hard-to-Prove: Sleep Mask (Contoured, 100% Blackout)",
    product: {
      url: "", title: "Contoured Sleep Mask — 100% Blackout, No Pressure on Eyes",
      description: "3D contoured sleep mask blocks all light without pressing on eyelids. Deep eye cups let you blink freely. Adjustable strap fits any head size. Breathable fabric won't overheat.",
      price: 12.99, currency: "USD", images: [], category_tags: ["wellness", "sleep"],
      ingredients_or_materials: "Memory foam contour cups, breathable modal fabric, adjustable elastic strap",
      claims: ["100% blackout — zero light leakage", "3D contour — no pressure on eyes", "Deep cups let you blink freely", "Adjustable strap fits any head", "Breathable — won't overheat"],
      review_signals: { rating: 4.4, review_count: 9200, recurring_phrases: ["actually blocks all light", "can blink with it on", "best sleep mask I've tried"] },
      badges: ["bestseller"], sold_count: "200K+ sold", raw_text: "Sleep mask contoured blackout 3D"
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
    console.log(`QA: ${qa.passed ? "PASS" : "FAIL"} | Overall: ${qa.overall_score}`);
    console.log(`Hooks: ${script.hook_options.length}`);
    console.log(`\n--- HOOKS ---`);
    script.hook_options.forEach(h => console.log(`  ${h.rank}. [${h.hook_format}] "${h.hook_text}"`));
    console.log(`\n--- PROOF BEAT ECHOED ---\n  "${script.cta_logic.proof_beat_echoed}"`);
    console.log(`\n--- CTA ---\n  "${script.cta_logic.cta_text}"`);
    console.log(`\n--- CAPTION ---\n  ${script.caption.substring(0, 180)}`);
    console.log(`\n--- SCORES ---\n  h=${qa.scores.hook_strength} b=${qa.scores.belief_loop_completeness} p=${qa.scores.proof_authenticity} g=${qa.scores.generic_language} f=${qa.scores.filming_feasibility} c=${qa.scores.cta_naturalness}`);
    if (qa.flags.length > 0) { console.log(`--- FLAGS ---`); qa.flags.forEach(f => console.log(`  [${f.severity}] ${f.component}: ${f.issue.substring(0, 100)}`)); }
    const allText = [...script.hook_options.map(h => h.hook_text), script.cta_logic.cta_text, script.caption, ...script.beats.map(b => b.content + (b.spoken || "") + (b.text_overlay || ""))].join(" ").toLowerCase();
    const pr = allText.includes("$") || allText.includes("price") || allText.includes("deal");
    const rr = allText.includes("star") || allText.includes("review") || allText.includes("rating") || allText.includes("sold");
    console.log(`\n--- METADATA ---\n  Price: ${pr ? "YES" : "no"} | Rating: ${rr ? "YES" : "no"}`);
    // CTA syntax pattern detection
    const ctaLower = script.cta_logic.cta_text.toLowerCase();
    let syntaxPattern = "other";
    if (ctaLower.startsWith("after seeing")) syntaxPattern = "after-seeing";
    else if (ctaLower.startsWith("after watching")) syntaxPattern = "after-watching";
    else if (ctaLower.startsWith("once i saw")) syntaxPattern = "once-i-saw";
    else if (ctaLower.startsWith("when")) syntaxPattern = "when-X";
    else if (ctaLower.startsWith("that")) syntaxPattern = "that-was";
    else if (ctaLower.includes("after")) syntaxPattern = "mid-after";
    console.log(`  CTA Syntax: ${syntaxPattern}`);
    return { label, hooks: script.hook_options.length, score: qa.overall_score, scores: qa.scores, passed: qa.passed, cta: script.cta_logic.cta_text, proofBeat: script.cta_logic.proof_beat_echoed, pr, rr, syntaxPattern, flags: qa.flags.length };
  } catch (e) { console.error(`FAILED: ${e instanceof Error ? e.message : e}`); return { label, hooks: 0, score: 0, passed: false, error: true }; }
}

async function main() {
  console.log("BATCH 4 CALIBRATION TEST — 8 Products (post-11.4 CTA fix)\n");
  const results: any[] = [];
  for (const { label, product } of PRODUCTS) { results.push(await runTest(label, product)); }
  console.log(`\n${"=".repeat(70)}`);
  console.log("BATCH 4 SUMMARY");
  console.log(`${"=".repeat(70)}`);
  const passing = results.filter(r => !r.error && r.passed);
  const scores = passing.map(r => r.score);
  results.forEach(r => {
    if (r.error) { console.log(`  ${r.label}: ERROR`); return; }
    console.log(`  ${r.label}: ${r.passed ? "PASS" : "FAIL"} (${r.score}) | Hooks: ${r.hooks} | h=${r.scores?.hook_strength} b=${r.scores?.belief_loop_completeness} p=${r.scores?.proof_authenticity} g=${r.scores?.generic_language} f=${r.scores?.filming_feasibility} c=${r.scores?.cta_naturalness} | CTA-syn: ${r.syntaxPattern}`);
  });
  if (scores.length > 1) {
    console.log(`\n  SCORE SPREAD: min=${Math.min(...scores).toFixed(2)} max=${Math.max(...scores).toFixed(2)} range=${(Math.max(...scores)-Math.min(...scores)).toFixed(2)}`);
    console.log(`  UNIQUE SCORES: ${new Set(scores.map(s => s.toFixed(2))).size} of ${scores.length}`);
    // CTA syntax distribution
    const syntaxDist: Record<string, number> = {};
    results.filter(r => !r.error).forEach(r => { syntaxDist[r.syntaxPattern] = (syntaxDist[r.syntaxPattern] || 0) + 1; });
    console.log(`\n  CTA SYNTAX DISTRIBUTION: ${JSON.stringify(syntaxDist)}`);
  }
}

main().catch(console.error);
