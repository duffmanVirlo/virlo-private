// Batch 1 Calibration Test — 8 diverse products
// Usage: npx tsx scripts/batch-test.ts

import { readFileSync, writeFileSync } from "fs";
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
    label: "Kitchen: Silicone Stretch Lids (6-Pack)",
    product: {
      url: "", title: "Silicone Stretch Lids — 6 Pack, Fits Any Bowl, Pot, or Container",
      description: "Reusable silicone stretch lids that fit any round container from 2.6 to 9.8 inches. Replace plastic wrap and aluminum foil. Microwave and dishwasher safe. BPA-free food-grade silicone.",
      price: 8.99, currency: "USD", images: [], category_tags: ["kitchen", "food storage"],
      ingredients_or_materials: "Food-grade silicone, BPA-free",
      claims: ["Fits any round container 2.6-9.8 inches", "Replaces plastic wrap and foil", "Microwave safe", "Dishwasher safe", "Creates airtight seal", "Reusable hundreds of times"],
      review_signals: { rating: 4.4, review_count: 3200, recurring_phrases: ["actually stays on", "no more plastic wrap", "great for leftovers"] },
      badges: ["bestseller"], sold_count: "100K+ sold", raw_text: "Silicone stretch lids 6 pack reusable food covers"
    }
  },
  {
    label: "Home: Toilet Brush with Holder (Silicone Flex)",
    product: {
      url: "", title: "Silicone Toilet Brush with Ventilated Holder — Flex Bristle, Quick-Dry Design",
      description: "Flexible silicone bristle toilet brush that doesn't hold water or bacteria like traditional brushes. Wall-mounted ventilated holder keeps it off the floor. TPR flex head conforms to bowl shape.",
      price: 14.99, currency: "USD", images: [], category_tags: ["home", "bathroom", "cleaning"],
      ingredients_or_materials: "TPR silicone bristles, ABS handle, ventilated wall-mount holder",
      claims: ["Silicone bristles don't trap bacteria", "Dries 3x faster than nylon bristles", "Flex head reaches under the rim", "Wall-mounted holder saves floor space", "No drip tray puddle"],
      review_signals: { rating: 4.3, review_count: 1800, recurring_phrases: ["so much cleaner", "no more gross drip tray", "actually reaches under rim"] },
      badges: [], sold_count: "40K+ sold", raw_text: "Silicone toilet brush quick dry ventilated holder"
    }
  },
  {
    label: "Auto: Microfiber Wheel Brush Kit (3-Piece)",
    product: {
      url: "", title: "3-Piece Microfiber Wheel Brush Kit — Barrel Brush + Lug Nut Brush + Fender Brush",
      description: "Soft microfiber barrel brush fits between spokes without scratching. Includes dedicated lug nut brush and fender well brush. Chenille microfiber traps brake dust. Works on all wheel finishes.",
      price: 16.99, currency: "USD", images: [], category_tags: ["auto", "detailing", "car care"],
      ingredients_or_materials: "Chenille microfiber, flexible rubber core, ergonomic grip handle",
      claims: ["Won't scratch any wheel finish", "Barrel brush fits between spokes", "Dedicated lug nut brush", "Traps brake dust instead of spreading it", "Flexible core bends to wheel shape"],
      review_signals: { rating: 4.6, review_count: 920, recurring_phrases: ["actually fits between spokes", "brake dust comes right off", "way better than old brush"] },
      badges: [], sold_count: "15K+ sold", raw_text: "Microfiber wheel brush kit 3 piece car detailing"
    }
  },
  {
    label: "Clean Living: Glass Spray Bottles (Amber, 4-Pack)",
    product: {
      url: "", title: "Amber Glass Spray Bottles 16oz — 4 Pack with Labels and Silicone Sleeve",
      description: "Refillable amber glass spray bottles for homemade cleaners, essential oil mixes, and plant care. UV-protective amber glass. Adjustable nozzle mist-to-stream. Includes silicone protective sleeve and waterproof labels.",
      price: 18.99, currency: "USD", images: [], category_tags: ["home", "clean living", "organization"],
      ingredients_or_materials: "Amber borosilicate glass, BPA-free trigger sprayer, silicone sleeve, waterproof vinyl labels",
      claims: ["UV-protective amber glass preserves contents", "Adjustable nozzle from fine mist to stream", "Silicone sleeve prevents breakage", "Includes waterproof labels for organization", "Replaces single-use plastic bottles"],
      review_signals: { rating: 4.5, review_count: 2100, recurring_phrases: ["look so nice on counter", "no more plastic bottles", "sturdy with the sleeve"] },
      badges: [], sold_count: "30K+ sold", raw_text: "Amber glass spray bottles 16oz 4 pack refillable"
    }
  },
  {
    label: "Workshop: Magnetic Parts Tray (Stainless Steel)",
    product: {
      url: "", title: "Magnetic Parts Tray — Stainless Steel, 6-Inch Round",
      description: "Strong magnetic base holds screws, bolts, nuts, and small metal parts during repairs. Stainless steel won't rust. Padded rubber base protects surfaces. Parts stay put even when tilted.",
      price: 9.99, currency: "USD", images: [], category_tags: ["tools", "workshop", "auto"],
      ingredients_or_materials: "Stainless steel, embedded neodymium magnets, rubber base pad",
      claims: ["Holds parts even when tilted 90 degrees", "Strong enough for socket sets", "Rubber base won't scratch paint", "Stainless steel won't rust in garage conditions"],
      review_signals: { rating: 4.7, review_count: 580, recurring_phrases: ["no more lost screws", "stronger than expected", "use it every project"] },
      badges: [], sold_count: "8K+ sold", raw_text: "Magnetic parts tray stainless steel 6 inch round"
    }
  },
  {
    label: "Convenience: Cable Clips (Self-Adhesive, 16-Pack)",
    product: {
      url: "", title: "Self-Adhesive Cable Clips — 16 Pack, Clear, Multi-Size",
      description: "Clear adhesive cable clips organize charging cables, USB cords, and headphone wires on desks, nightstands, and walls. Three sizes fit different cable thicknesses. Strong 3M adhesive. Removable without residue.",
      price: 6.99, currency: "USD", images: [], category_tags: ["office", "organization", "desk"],
      ingredients_or_materials: "Clear acrylic, 3M VHB adhesive backing",
      claims: ["Holds cables in place on any surface", "Three sizes for different cable thicknesses", "Clear design blends with any surface", "Removable without adhesive residue", "Strong enough for weighted cables"],
      review_signals: { rating: 4.2, review_count: 4500, recurring_phrases: ["finally organized cables", "actually sticks", "looks clean on desk"] },
      badges: ["bestseller"], sold_count: "200K+ sold", raw_text: "Cable clips self adhesive clear 16 pack desk organization"
    }
  },
  {
    label: "Visual Transform: Shower Head with Filter",
    product: {
      url: "", title: "Filtered Shower Head — High Pressure + 15-Stage Filter for Hard Water",
      description: "High-pressure shower head with built-in 15-stage water filter. Removes chlorine, heavy metals, and sediment. Noticeably softer water for hair and skin. Tool-free installation in under 2 minutes.",
      price: 29.99, currency: "USD", images: [], category_tags: ["home", "bathroom", "wellness"],
      ingredients_or_materials: "ABS body, 15-stage filter cartridge (KDF-55, calcium sulfite, activated carbon, ceramic balls), stainless steel panel",
      claims: ["Removes chlorine and heavy metals", "Noticeably softer skin and hair within 1 week", "High-pressure spray with 3 modes", "Tool-free installation in under 2 minutes", "Filter lasts 6 months"],
      review_signals: { rating: 4.5, review_count: 5200, recurring_phrases: ["hair feels so different", "hard water stains gone", "easy install", "water pressure is great"] },
      badges: ["TikTok Made Me Buy It"], sold_count: "150K+ sold", raw_text: "Filtered shower head high pressure 15 stage hard water filter"
    }
  },
  {
    label: "Problem-Solver: Drain Hair Catcher (Silicone)",
    product: {
      url: "", title: "TubShroom — Silicone Drain Hair Catcher, Fits Standard Drains",
      description: "Silicone hair catcher sits inside the drain and catches every hair before it clogs the pipe. No more drain snaking. Fits standard 1.5-inch drains. Easy to clean — just wipe and replace.",
      price: 12.99, currency: "USD", images: [], category_tags: ["home", "bathroom"],
      ingredients_or_materials: "Medical-grade silicone",
      claims: ["Catches every hair before it reaches the pipe", "Fits standard 1.5-inch drains", "No tools needed", "Easy clean — wipe off and replace", "Eliminates drain clogs completely"],
      review_signals: { rating: 4.3, review_count: 8900, recurring_phrases: ["no more clogged drains", "gross but works", "wish I found this sooner"] },
      badges: ["bestseller"], sold_count: "500K+ sold", raw_text: "TubShroom drain hair catcher silicone"
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
    console.log(`QA: ${qa.passed ? "PASSED" : "FAILED"} (${qa.overall_score.toFixed(1)})`);

    // Output key sections
    console.log(`\n--- HOOKS ---`);
    script.hook_options.forEach((h) => {
      console.log(`  ${h.rank}. [${h.hook_format}] "${h.hook_text}"`);
    });

    console.log(`\n--- ANGLE ---`);
    console.log(`  ${angle.selected.name}`);
    console.log(`  ${angle.selected.conversion_hypothesis}`);

    console.log(`\n--- FIRST 3 BEATS ---`);
    script.beats.slice(0, 3).forEach((b, i) => {
      let line = `  [${b.start_seconds}-${b.end_seconds}s] ${b.type}: ${b.content.substring(0, 100)}`;
      if (b.spoken) line += `\n    SAY: "${b.spoken.substring(0, 80)}"`;
      if (b.text_overlay) line += `\n    TEXT: "${b.text_overlay}"`;
      console.log(line);
    });

    console.log(`\n--- CTA ---`);
    console.log(`  "${script.cta_logic.cta_text}"`);

    console.log(`\n--- CAPTION ---`);
    console.log(`  ${script.caption.substring(0, 200)}`);

    console.log(`\n--- QA SCORES ---`);
    console.log(`  hook=${qa.scores.hook_strength} belief=${qa.scores.belief_loop_completeness} proof=${qa.scores.proof_authenticity} generic=${qa.scores.generic_language} film=${qa.scores.filming_feasibility} cta=${qa.scores.cta_naturalness}`);
    if (qa.flags.length > 0) {
      console.log(`--- QA FLAGS ---`);
      qa.flags.forEach((f) => console.log(`  [${f.severity}] ${f.component}: ${f.issue}`));
    }

    console.log(`\n--- METADATA CHECK ---`);
    const allText = [
      ...script.hook_options.map(h => h.hook_text),
      script.cta_logic.cta_text,
      script.caption,
      ...script.beats.map(b => b.content + (b.spoken || "") + (b.text_overlay || "")),
    ].join(" ").toLowerCase();
    const priceRef = allText.includes("$") || allText.includes("price") || allText.includes("deal") || allText.includes("sale");
    const ratingRef = allText.includes("star") || allText.includes("review") || allText.includes("rating") || allText.includes("sold");
    const shippingRef = allText.includes("shipping") || allText.includes("free ship");
    console.log(`  Price reference: ${priceRef ? "YES" : "no"}`);
    console.log(`  Rating/review reference: ${ratingRef ? "YES" : "no"}`);
    console.log(`  Shipping reference: ${shippingRef ? "YES" : "no"}`);

    // Save full output
    const filename = `./batch1_${label.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}.json`;
    writeFileSync(filename, JSON.stringify({ label, classification, analysis: { primary_role: analysis.primary_role, buyer_motivation: analysis.buyer_motivation }, modality, angle: angle.selected, script, qa }, null, 2));

    return { label, passed: qa.passed, score: qa.overall_score, hooks: script.hook_options, cta: script.cta_logic.cta_text, caption: script.caption, priceRef, ratingRef };
  } catch (error) {
    console.error(`FAILED: ${error instanceof Error ? error.message : error}`);
    return { label, passed: false, score: 0, error: true };
  }
}

async function main() {
  console.log("BATCH 1 CALIBRATION TEST — 8 Products\n");
  const results = [];
  for (const { label, product } of PRODUCTS) {
    results.push(await runTest(label, product));
  }

  console.log(`\n${"=".repeat(70)}`);
  console.log("BATCH SUMMARY");
  console.log(`${"=".repeat(70)}`);
  results.forEach(r => {
    if ('error' in r && r.error) {
      console.log(`  ${r.label}: ERROR`);
    } else {
      console.log(`  ${r.label}: ${r.passed ? "PASS" : "FAIL"} (${typeof r.score === 'number' ? r.score.toFixed(1) : 'N/A'}) | Price: ${r.priceRef ? "YES" : "no"} | Ratings: ${r.ratingRef ? "YES" : "no"}`);
    }
  });
}

main().catch(console.error);
