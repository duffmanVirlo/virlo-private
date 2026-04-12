// Batch 2 Calibration Test — 8 products (6 new + 2 Batch 1 repeats)
// Usage: npx tsx scripts/batch-test-2.ts

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
  // ── BATCH 1 REPEATS (for A/B comparison) ──────────────────────────────
  {
    label: "[REPEAT] Silicone Stretch Lids (6-Pack)",
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
    label: "[REPEAT] Drain Hair Catcher (Silicone)",
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
  // ── NEW PRODUCTS ──────────────────────────────────────────────────────
  {
    label: "Kitchen: Vegetable Chopper (12-in-1)",
    product: {
      url: "", title: "12-in-1 Vegetable Chopper with Container — Onion Dicer, Veggie Slicer, Food Cutter",
      description: "Multi-blade vegetable chopper that dices, slices, and julienne cuts vegetables in seconds. Built-in container catches everything. Interchangeable stainless steel blades. Hand-wash only.",
      price: 24.99, currency: "USD", images: [], category_tags: ["kitchen", "food prep"],
      ingredients_or_materials: "BPA-free plastic body, stainless steel blades, built-in 1.5L container",
      claims: ["12 interchangeable blade configurations", "Dices a full onion in 3 seconds", "Built-in container catches everything", "No more crying from cutting onions", "Uniform cuts every time"],
      review_signals: { rating: 4.3, review_count: 6100, recurring_phrases: ["cuts so fast", "no more uneven chopping", "container catches everything", "blades are sharp"] },
      badges: ["bestseller"], sold_count: "200K+ sold", raw_text: "12 in 1 vegetable chopper dicer slicer with container"
    }
  },
  {
    label: "Home: Lint Roller for Pet Hair (Reusable)",
    product: {
      url: "", title: "ChomChom Reusable Pet Hair Remover Roller — No Adhesive Strips Needed",
      description: "Reusable lint roller for pet hair that works without sticky sheets. Roll back and forth on furniture or clothing and pet hair collects in the built-in chamber. Empty and reuse forever. Works on couches, beds, car seats, and clothing.",
      price: 28.99, currency: "USD", images: [], category_tags: ["home", "pet", "cleaning"],
      ingredients_or_materials: "ABS plastic body, electrostatic fabric roller, built-in collection chamber",
      claims: ["Works without adhesive sheets forever", "Removes pet hair from any fabric surface", "Built-in collection chamber — just open and empty", "Works on furniture, clothing, car seats, bedding", "No refills needed ever"],
      review_signals: { rating: 4.5, review_count: 12000, recurring_phrases: ["actually works better than tape rollers", "never buying refills again", "my couch looks new", "works on everything"] },
      badges: ["bestseller"], sold_count: "300K+ sold", raw_text: "ChomChom reusable pet hair remover roller"
    }
  },
  {
    label: "Auto: Steering Wheel Phone Mount (Magnetic)",
    product: {
      url: "", title: "Magnetic Steering Wheel Phone Mount — Hands-Free GPS View",
      description: "Small magnetic phone mount that clips to the top of your steering wheel for eye-level GPS navigation. Strong N52 neodymium magnet holds phone securely. Doesn't block gauges or vents. 360-degree rotation.",
      price: 11.99, currency: "USD", images: [], category_tags: ["auto", "phone mount", "accessories"],
      ingredients_or_materials: "N52 neodymium magnet, silicone-padded clip, 360-degree ball joint",
      claims: ["Eye-level GPS without looking down", "N52 magnet holds any phone", "Doesn't block gauges or air vents", "Clips on in 2 seconds", "360-degree adjustable angle"],
      review_signals: { rating: 4.1, review_count: 2300, recurring_phrases: ["finally a mount that doesn't block my vent", "GPS right in my line of sight", "holds my heavy phone fine"] },
      badges: [], sold_count: "50K+ sold", raw_text: "Magnetic steering wheel phone mount hands free GPS"
    }
  },
  {
    label: "Low-Excitement: Drawer Organizer Trays (Set of 8)",
    product: {
      url: "", title: "Adjustable Drawer Organizer Trays — Set of 8, Interlocking, Clear",
      description: "Clear interlocking drawer organizer trays in 4 sizes. Customize any drawer layout. Fits kitchen utensil drawers, bathroom vanity drawers, office desk drawers. Non-slip rubber feet.",
      price: 15.99, currency: "USD", images: [], category_tags: ["home", "organization"],
      ingredients_or_materials: "Clear BPA-free plastic, non-slip rubber feet, interlocking design",
      claims: ["8 trays in 4 sizes fit any drawer", "Interlocking design stays in place", "Clear so you can see everything", "Non-slip rubber feet prevent sliding", "Works in kitchen, bathroom, office"],
      review_signals: { rating: 4.4, review_count: 3800, recurring_phrases: ["finally organized my junk drawer", "look so clean", "stay in place", "wish I got these sooner"] },
      badges: [], sold_count: "80K+ sold", raw_text: "Drawer organizer trays set of 8 clear interlocking adjustable"
    }
  },
  {
    label: "Visual: Fridge Deodorizer (Charcoal, Penguin Shape)",
    product: {
      url: "", title: "Fridge Deodorizer — Activated Charcoal Penguin, Absorbs Odors for 60 Days",
      description: "Cute penguin-shaped fridge deodorizer filled with activated bamboo charcoal. Absorbs food odors, ethylene gas, and moisture. Lasts 60 days per fill. Refillable — just replace the charcoal pack.",
      price: 9.99, currency: "USD", images: [], category_tags: ["kitchen", "home"],
      ingredients_or_materials: "BPA-free silicone shell, activated bamboo charcoal fill, refillable",
      claims: ["Absorbs fridge odors for 60 days", "Activated bamboo charcoal — natural, no chemicals", "Cute penguin design", "Refillable — just swap the charcoal pack", "Also absorbs ethylene gas to keep produce fresh longer"],
      review_signals: { rating: 4.2, review_count: 1400, recurring_phrases: ["fridge doesn't smell anymore", "so cute", "actually works", "produce lasts longer"] },
      badges: [], sold_count: "20K+ sold", raw_text: "Fridge deodorizer activated charcoal penguin shape"
    }
  },
  {
    label: "Tool: Magnetic Wristband for Screws",
    product: {
      url: "", title: "Magnetic Wristband — Holds Screws, Nails, Bolts While You Work",
      description: "Wearable magnetic wristband with 15 strong N35 magnets embedded in breathable mesh. Holds screws, nails, bolts, drill bits, and small metal parts on your wrist while you work. Adjustable velcro strap fits any wrist size.",
      price: 13.99, currency: "USD", images: [], category_tags: ["tools", "workshop"],
      ingredients_or_materials: "Breathable nylon mesh, 15 embedded N35 neodymium magnets, adjustable velcro strap",
      claims: ["15 strong magnets hold screws and nails on your wrist", "Breathable mesh — comfortable for long projects", "Adjustable strap fits any wrist", "Holds drill bits, screws, nails, bolts, washers"],
      review_signals: { rating: 4.5, review_count: 950, recurring_phrases: ["no more holding screws in my mouth", "actually useful", "comfortable to wear all day"] },
      badges: [], sold_count: "25K+ sold", raw_text: "Magnetic wristband screws nails bolts workshop tool"
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
    console.log(`Hooks returned: ${script.hook_options.length}`);

    console.log(`\n--- HOOKS ---`);
    script.hook_options.forEach((h) => {
      console.log(`  ${h.rank}. [${h.hook_format}] "${h.hook_text}"`);
    });

    console.log(`\n--- ANGLE ---`);
    console.log(`  ${angle.selected.name}`);
    console.log(`  ${angle.selected.conversion_hypothesis.substring(0, 150)}`);

    console.log(`\n--- FIRST 3 BEATS ---`);
    script.beats.slice(0, 3).forEach((b) => {
      let line = `  [${b.start_seconds}-${b.end_seconds}s] ${b.type}: ${b.content.substring(0, 100)}`;
      if (b.spoken) line += `\n    SAY: "${b.spoken.substring(0, 80)}"`;
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
    console.log(`  Price: ${priceRef ? "YES" : "no"} | Rating: ${ratingRef ? "YES" : "no"} | Shipping: ${shippingRef ? "YES" : "no"}`);

    return { label, hookCount: script.hook_options.length, passed: qa.passed, score: qa.overall_score, scores: qa.scores, cta: script.cta_logic.cta_text, priceRef, ratingRef, flags: qa.flags.length };
  } catch (error) {
    console.error(`FAILED: ${error instanceof Error ? error.message : error}`);
    return { label, hookCount: 0, passed: false, score: 0, error: true };
  }
}

async function main() {
  console.log("BATCH 2 CALIBRATION TEST — 8 Products (6 new + 2 repeats)\n");
  const results: any[] = [];
  for (const { label, product } of PRODUCTS) {
    results.push(await runTest(label, product));
  }

  console.log(`\n${"=".repeat(70)}`);
  console.log("BATCH 2 SUMMARY");
  console.log(`${"=".repeat(70)}`);
  results.forEach(r => {
    if (r.error) {
      console.log(`  ${r.label}: ERROR`);
    } else {
      console.log(`  ${r.label}: ${r.passed ? "PASS" : "FAIL"} (${r.score.toFixed(1)}) | Hooks: ${r.hookCount} | h=${r.scores?.hook_strength} b=${r.scores?.belief_loop_completeness} p=${r.scores?.proof_authenticity} g=${r.scores?.generic_language} f=${r.scores?.filming_feasibility} c=${r.scores?.cta_naturalness} | Price: ${r.priceRef ? "Y" : "n"} | Rating: ${r.ratingRef ? "Y" : "n"}`);
    }
  });
}

main().catch(console.error);
