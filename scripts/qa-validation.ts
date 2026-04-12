// Quick QA scoring validation — 3 products to verify spread
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
    label: "Strong Visual: Oil Sprayer",
    product: {
      url: "", title: "Olive Oil Sprayer Mister for Cooking — 200ml Glass Bottle",
      description: "Fine even mist replaces messy pouring. Adjustable nozzle. Works with any oil or vinegar. 200ml glass body.",
      price: 12.99, currency: "USD", images: [], category_tags: ["kitchen"],
      ingredients_or_materials: "Borosilicate glass, stainless steel nozzle",
      claims: ["Fine mist covers entire pan evenly", "Uses 80% less oil", "Adjustable nozzle mist to stream", "Dishwasher safe"],
      review_signals: { rating: 4.5, review_count: 1823, recurring_phrases: ["way less oil", "even coating", "great for air fryer"] },
      badges: [], sold_count: null, raw_text: "Oil sprayer mister 200ml glass"
    }
  },
  {
    label: "Low-Excitement: Drawer Organizers",
    product: {
      url: "", title: "Adjustable Drawer Organizer Trays — Set of 8, Clear",
      description: "Clear interlocking trays in 4 sizes. Non-slip rubber feet.",
      price: 15.99, currency: "USD", images: [], category_tags: ["home", "organization"],
      ingredients_or_materials: "BPA-free plastic, rubber feet",
      claims: ["8 trays in 4 sizes", "Interlocking stays in place", "Non-slip rubber feet"],
      review_signals: { rating: 4.4, review_count: 3800, recurring_phrases: ["organized my junk drawer", "stay in place"] },
      badges: [], sold_count: null, raw_text: "Drawer organizer trays clear 8 pack"
    }
  },
  {
    label: "Repeat Anchor: Magnetic Tool Mat",
    product: {
      url: "", title: "SEESE 3PC Flexible Magnetic Tool Mat & Tray Holder",
      description: "N52 neodymium magnets hold up to 25 lbs on any metal surface. Oil resistant. Rolls up for storage.",
      price: 29.99, currency: "USD", images: [], category_tags: ["auto"],
      ingredients_or_materials: "N52 neodymium magnets, PVC coating",
      claims: ["Holds up to 25 lbs", "Works at any angle", "Oil resistant", "Rolls up for storage"],
      review_signals: { rating: 4.8, review_count: 12, recurring_phrases: ["great for tools"] },
      badges: [], sold_count: null, raw_text: "Magnetic tool mat N52"
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

    console.log(`  QA: ${qa.passed ? "PASS" : "FAIL"} | Overall: ${qa.overall_score}`);
    console.log(`  Dimensions: hook=${qa.scores.hook_strength} belief=${qa.scores.belief_loop_completeness} proof=${qa.scores.proof_authenticity} generic=${qa.scores.generic_language} film=${qa.scores.filming_feasibility} cta=${qa.scores.cta_naturalness}`);
    console.log(`  Hooks: ${script.hook_options.length} | CTA: "${script.cta_logic.cta_text.substring(0, 80)}"`);
    if (qa.flags.length > 0) qa.flags.forEach(f => console.log(`  FLAG [${f.severity}] ${f.component}: ${f.issue.substring(0, 80)}`));

    return qa;
  } catch (e) {
    console.error(`  ERROR: ${e instanceof Error ? e.message : e}`);
    return null;
  }
}

async function main() {
  console.log("QA SCORING VALIDATION — 3 Products\n");
  const results = [];
  for (const { label, product } of PRODUCTS) {
    results.push(await runTest(label, product));
  }

  console.log("\n=== SCORE SPREAD ANALYSIS ===");
  const scores = results.filter(r => r).map(r => r!.overall_score);
  console.log("Scores:", scores.join(", "));
  console.log("Min:", Math.min(...scores).toFixed(2), "Max:", Math.max(...scores).toFixed(2), "Spread:", (Math.max(...scores) - Math.min(...scores)).toFixed(2));
  console.log("All same?", new Set(scores.map(s => s.toFixed(1))).size === 1 ? "YES — STILL CLUSTERING" : "NO — SPREAD ACHIEVED");
}

main().catch(console.error);
