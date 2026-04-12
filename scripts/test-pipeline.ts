// Direct pipeline test bypassing URL extraction
// Usage: npx tsx scripts/test-pipeline.ts

import { readFileSync } from "fs";
// Manual env load since dotenv has compatibility issues with tsx
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
import { runCompliancePass } from "../lib/convertiq/stages/compliance";
import { assembleOutputPackage } from "../lib/convertiq/assemble";
import type { ExtractedProduct } from "../types/product";

const PRODUCTS: { name: string; product: ExtractedProduct }[] = [
  {
    name: "Kitchen Oil Sprayer",
    product: {
      url: "https://www.tiktok.com/shop/product/oil-sprayer",
      title: "Olive Oil Sprayer Mister for Cooking — 200ml Glass Bottle with Adjustable Nozzle",
      description: "Replace messy pouring with a fine, even mist. This 200ml glass oil sprayer lets you control exactly how much oil goes on your pan, salad, or air fryer basket. Adjustable nozzle from fine mist to stream. Works with olive oil, avocado oil, vinegar, and lemon juice.",
      price: 12.99,
      currency: "USD",
      images: ["https://example.com/oil-sprayer.jpg"],
      category_tags: ["kitchen", "cooking", "oil"],
      ingredients_or_materials: "Borosilicate glass body, food-grade stainless steel nozzle, BPA-free pump mechanism",
      claims: [
        "Fine mist covers entire pan surface evenly",
        "Uses 80% less oil than pouring from a bottle",
        "Works with any cooking oil or vinegar",
        "Adjustable nozzle — mist to stream",
        "200ml capacity",
        "Dishwasher safe glass body",
      ],
      review_signals: {
        rating: 4.5,
        review_count: 1823,
        recurring_phrases: ["actually works", "way less oil", "even coating", "great for air fryer", "no more pooling"],
      },
      badges: ["bestseller"],
      sold_count: "25K+ sold",
      raw_text: "Olive Oil Sprayer Mister 200ml glass bottle adjustable nozzle fine mist cooking spray. Uses 80% less oil. Perfect for air fryer, salads, grilling.",
    },
  },
  {
    name: "Posture Corrector",
    product: {
      url: "https://www.tiktok.com/shop/product/posture-corrector",
      title: "Adjustable Posture Corrector for Men and Women — Back Brace for Upper Back Pain Relief",
      description: "Comfortable posture corrector that gently pulls your shoulders back into alignment. Adjustable straps fit chest sizes 28-48 inches. Lightweight breathable mesh fabric wears invisibly under clothing.",
      price: 19.99,
      currency: "USD",
      images: ["https://example.com/posture-corrector.jpg"],
      category_tags: ["wellness", "posture", "back support"],
      ingredients_or_materials: "Breathable mesh fabric, adjustable velcro straps, lightweight plastic support plate",
      claims: [
        "Gently trains muscles to hold correct posture over time",
        "Fits chest sizes 28-48 inches",
        "Wears invisibly under most clothing",
        "Breathable mesh prevents sweating",
        "Lightweight — under 4 oz",
      ],
      review_signals: {
        rating: 4.2,
        review_count: 3421,
        recurring_phrases: ["actually comfortable", "noticed difference after a week", "invisible under shirt", "helps with desk pain", "took time to adjust"],
      },
      badges: [],
      sold_count: "80K+ sold",
      raw_text: "Adjustable Posture Corrector back brace. Breathable mesh. Fits 28-48 inch chest. Invisible under clothing. Trains muscles for correct posture.",
    },
  },
];

async function runTest(name: string, product: ExtractedProduct) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`TESTING: ${name}`);
  console.log(`${"=".repeat(60)}\n`);

  try {
    console.log("Stage 1: Classifying...");
    const classification = await runClassification(product);
    console.log(`  -> ${classification.primary_category} / ${classification.product_type} (${classification.confidence}%)`);

    console.log("Stage 2: Analyzing...");
    const analysis = await runAnalysis(product, classification);
    console.log(`  -> Role: ${analysis.primary_role}, Motivation: ${analysis.buyer_motivation.weighted_primary}`);

    console.log("Stage 3: Modality...");
    const modality = await runModalitySelection(classification, analysis);
    console.log(`  -> ${modality.selected}`);

    console.log("Stage 4: Show/Say...");
    const showSay = await runShowSayMapping(product, classification, analysis, modality);
    console.log(`  -> ${showSay.must_show.length} must-show, ${showSay.can_say.length} can-say, ${showSay.never_say.length} never-say`);

    console.log("Stage 5: Angle...");
    const angle = await runAngleSelection(product, classification, analysis, modality, showSay);
    console.log(`  -> "${angle.selected.name}" (${angle.selected.score.composite.toFixed(1)})`);

    console.log("Stage 6: Script...");
    const script = await runScriptGeneration(product, classification, analysis, modality, showSay, angle);
    console.log(`  -> ${script.beats.length} beats, ${script.total_duration_seconds}s`);

    console.log("Stage 7: QA...");
    const qa = await runQAPass(script, angle, analysis, showSay);
    console.log(`  -> ${qa.passed ? "PASSED" : "FAILED"} (${qa.overall_score.toFixed(1)})`);

    console.log("Stage 8: Compliance...");
    const compliance = await runCompliancePass(script, classification.primary_category);
    console.log(`  -> ${compliance.cleared ? "Cleared" : "Modified"}`);

    const output = assembleOutputPackage({
      sessionId: `test-${Date.now()}`,
      product,
      classification,
      analysis,
      modality,
      showSay,
      angle,
      script,
      qa,
      compliance,
    });

    // Write full output
    const fs = await import("fs");
    const filename = `./test_output_${name.replace(/\s+/g, "_").toLowerCase()}.json`;
    fs.writeFileSync(filename, JSON.stringify(output, null, 2));
    console.log(`\nFull output written to: ${filename}`);

    // Print key output sections
    console.log(`\n--- ANGLE ---`);
    console.log(`Name: ${angle.selected.name}`);
    console.log(`Hypothesis: ${angle.selected.conversion_hypothesis}`);
    console.log(`Entry: ${angle.selected.entry_mechanism}`);

    console.log(`\n--- HOOKS ---`);
    script.hook_options.forEach((h) => {
      console.log(`  ${h.rank}. [${h.hook_format}] "${h.hook_text}"`);
    });

    console.log(`\n--- SCRIPT BEATS ---`);
    script.beats.forEach((b) => {
      console.log(`  [${b.start_seconds}s-${b.end_seconds}s] ${b.type}: ${b.content.substring(0, 100)}`);
    });

    console.log(`\n--- CTA ---`);
    console.log(`"${script.cta_logic.cta_text}"`);
    console.log(`Viewer state: ${script.cta_logic.viewer_state_at_cta}`);

    console.log(`\n--- CAPTION ---`);
    console.log(script.caption);

    console.log(`\n--- QA SCORES ---`);
    console.log(JSON.stringify(qa.scores, null, 2));

    if (qa.flags.length > 0) {
      console.log(`\n--- QA FLAGS ---`);
      qa.flags.forEach((f) => console.log(`  [${f.severity}] ${f.component}: ${f.issue}`));
    }

    return output;
  } catch (error) {
    console.error(`FAILED: ${error instanceof Error ? error.message : error}`);
    return null;
  }
}

async function main() {
  for (const { name, product } of PRODUCTS) {
    await runTest(name, product);
  }
}

main().catch(console.error);
