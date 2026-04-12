// Batch 5 Calibration Test — 8 products (mostly new)
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
    label: "Kitchen: Ice Cube Tray (Large Sphere, 2-Pack)",
    product: {
      url: "", title: "Large Sphere Ice Cube Tray — 2 Pack, Silicone, Slow-Melt",
      description: "Makes 2.5-inch sphere ice cubes that melt 4x slower than regular cubes. Silicone mold with leak-proof lid. Perfect for whiskey, cocktails, and iced coffee.",
      price: 10.99, currency: "USD", images: [], category_tags: ["kitchen", "barware"],
      ingredients_or_materials: "Food-grade silicone, BPA-free lid",
      claims: ["2.5-inch sphere melts 4x slower", "Leak-proof lid", "No cracks or cloudy ice", "Works for whiskey, cocktails, iced coffee"],
      review_signals: { rating: 4.4, review_count: 4200, recurring_phrases: ["look amazing in glass", "melts so slow", "clear ice every time"] },
      badges: [], sold_count: "60K+ sold", raw_text: "Large sphere ice cube tray silicone"
    }
  },
  {
    label: "Beauty: Scalp Massager (Silicone, Shampoo Brush)",
    product: {
      url: "", title: "Scalp Massager Shampoo Brush — Silicone Bristles, Wet & Dry Use",
      description: "Soft silicone bristle scalp massager that exfoliates buildup, stimulates blood flow, and distributes shampoo evenly. Works on wet or dry hair. Ergonomic handle.",
      price: 7.99, currency: "USD", images: [], category_tags: ["beauty", "hair care"],
      ingredients_or_materials: "Medical-grade silicone bristles, ABS handle",
      claims: ["Removes product buildup and flakes", "Stimulates blood flow to scalp", "Distributes shampoo evenly with less product", "Works wet or dry", "Feels incredible"],
      review_signals: { rating: 4.6, review_count: 8700, recurring_phrases: ["feels so good", "scalp has never been this clean", "less flakes after a week"] },
      badges: ["bestseller"], sold_count: "250K+ sold", raw_text: "Scalp massager silicone shampoo brush"
    }
  },
  {
    label: "Auto: Car Seat Gap Filler (2-Pack, Universal)",
    product: {
      url: "", title: "Car Seat Gap Filler — 2 Pack, Universal Fit, Prevents Items from Falling",
      description: "Foam gap filler blocks the space between your car seat and center console. Prevents phone, keys, fries, and change from falling into the gap. Universal fit, installs in seconds.",
      price: 12.99, currency: "USD", images: [], category_tags: ["auto", "organization"],
      ingredients_or_materials: "Memory foam core, neoprene exterior, adjustable buckle strap",
      claims: ["Blocks the seat gap completely", "Universal fit — works in any vehicle", "Installs in 10 seconds", "Won't interfere with seat adjustments", "Prevents phone, keys, food from falling"],
      review_signals: { rating: 4.2, review_count: 5600, recurring_phrases: ["no more reaching under seat", "finally no gap", "phone stopped falling"] },
      badges: [], sold_count: "100K+ sold", raw_text: "Car seat gap filler foam 2 pack"
    }
  },
  {
    label: "Tool: Magnetic Pickup Tool (Telescoping, LED)",
    product: {
      url: "", title: "Magnetic Pickup Tool — Telescoping, LED Light, 15lb Pull Force",
      description: "Extends from 7 to 30 inches. Strong 15lb magnet picks up dropped screws, bolts, and metal parts in tight spaces. Built-in LED illuminates dark areas. Pocket clip.",
      price: 9.99, currency: "USD", images: [], category_tags: ["tools", "auto"],
      ingredients_or_materials: "Stainless steel shaft, neodymium magnet tip, LED light, pocket clip",
      claims: ["Extends 7 to 30 inches", "15lb pull magnetic tip", "Built-in LED for dark spaces", "Pocket clip for easy carry"],
      review_signals: { rating: 4.5, review_count: 3100, recurring_phrases: ["saved me so many times", "light is clutch", "actually strong magnet"] },
      badges: [], sold_count: "45K+ sold", raw_text: "Magnetic pickup tool telescoping LED"
    }
  },
  {
    label: "Home: Motion Sensor Night Light (Rechargeable, Stick-On)",
    product: {
      url: "", title: "Motion Sensor Night Light — Rechargeable, Magnetic Stick-On, Warm White",
      description: "Small rechargeable LED that activates on motion. Magnetic back sticks to any metal surface or use included adhesive. Warm white light. Auto-off after 20 seconds. USB-C rechargeable.",
      price: 14.99, currency: "USD", images: [], category_tags: ["home", "lighting"],
      ingredients_or_materials: "ABS body, LED strip, PIR motion sensor, lithium battery, USB-C port",
      claims: ["Motion-activated — only on when you need it", "Magnetic mount or adhesive — no wiring", "Warm white — won't wake you up", "USB-C rechargeable — no batteries", "Auto-off after 20 seconds"],
      review_signals: { rating: 4.3, review_count: 6100, recurring_phrases: ["perfect for hallway", "doesn't blind you at night", "easy to install"] },
      badges: [], sold_count: "120K+ sold", raw_text: "Motion sensor night light rechargeable stick on"
    }
  },
  {
    label: "Boring Commodity: Microfiber Cloths (12-Pack)",
    product: {
      url: "", title: "Microfiber Cleaning Cloths — 12 Pack, Multi-Surface, Lint-Free",
      description: "Premium microfiber cloths that clean glass, screens, counters, and stainless steel without streaks or lint. Machine washable hundreds of times. 16x16 inch.",
      price: 9.99, currency: "USD", images: [], category_tags: ["home", "cleaning"],
      ingredients_or_materials: "80% polyester, 20% polyamide microfiber, 300 GSM",
      claims: ["Streak-free on glass and screens", "Lint-free on all surfaces", "Machine washable 500+ times", "Works without chemicals — just water", "12 cloths in 4 colors"],
      review_signals: { rating: 4.5, review_count: 12000, recurring_phrases: ["no more paper towels", "actually streak-free", "last forever"] },
      badges: ["bestseller"], sold_count: "300K+ sold", raw_text: "Microfiber cleaning cloths 12 pack"
    }
  },
  {
    label: "Visual: Teeth Whitening Pen (Touch-Up)",
    product: {
      url: "", title: "Teeth Whitening Pen — On-the-Go Touch-Up, 35% Carbamide Peroxide",
      description: "Portable whitening pen for quick touch-ups. Twist bottom to dispense gel, brush onto teeth, let dry 60 seconds. No strips, no trays. 20+ applications per pen.",
      price: 12.99, currency: "USD", images: [], category_tags: ["beauty", "dental"],
      ingredients_or_materials: "35% carbamide peroxide gel, portable twist-pen applicator",
      claims: ["Visible whitening in 1 week", "Apply in 60 seconds — no strips or trays", "20+ applications per pen", "Portable — fits in pocket or purse", "Enamel-safe formula"],
      review_signals: { rating: 4.1, review_count: 3400, recurring_phrases: ["so easy to use", "noticed difference fast", "way easier than strips"] },
      badges: [], sold_count: "50K+ sold", raw_text: "Teeth whitening pen portable touch up"
    }
  },
  {
    label: "[ANCHOR] Silicone Stretch Lids",
    product: {
      url: "", title: "Silicone Stretch Lids — 6 Pack",
      description: "Reusable silicone lids fit any round container. Replace plastic wrap. Airtight seal.",
      price: 8.99, currency: "USD", images: [], category_tags: ["kitchen"],
      ingredients_or_materials: "Food-grade silicone",
      claims: ["Fits any round container", "Airtight seal", "Reusable hundreds of times", "Dishwasher safe"],
      review_signals: { rating: 4.4, review_count: 3200, recurring_phrases: ["actually stays on"] },
      badges: [], sold_count: null, raw_text: "Silicone stretch lids"
    }
  },
];

async function runTest(label: string, product: ExtractedProduct) {
  console.log(`\n${"=".repeat(70)}`);
  console.log(`TESTING: ${label}`);
  console.log(`${"=".repeat(70)}\n`);
  try {
    const c = await runClassification(product);
    console.log(`Classification: ${c.primary_category} / ${c.product_type} (${c.confidence}%)`);
    const a = await runAnalysis(product, c);
    const m = await runModalitySelection(c, a);
    console.log(`Modality: ${m.selected}`);
    const ss = await runShowSayMapping(product, c, a, m);
    const ang = await runAngleSelection(product, c, a, m, ss);
    console.log(`Angle: "${ang.selected.name}" (${ang.selected.score.composite.toFixed(1)})`);
    const script = await runScriptGeneration(product, c, a, m, ss, ang);
    const qa = await runQAPass(script, ang, a, ss);
    console.log(`QA: ${qa.passed ? "PASS" : "FAIL"} | Overall: ${qa.overall_score} | Hooks: ${script.hook_options.length}`);
    console.log(`\n--- HOOKS ---`);
    script.hook_options.forEach(h => console.log(`  ${h.rank}. [${h.hook_format}] "${h.hook_text}"`));
    console.log(`\n--- PROOF BEAT ---\n  "${script.cta_logic.proof_beat_echoed}"`);
    console.log(`\n--- CTA ---\n  "${script.cta_logic.cta_text}"`);
    console.log(`\n--- CAPTION ---\n  ${script.caption.substring(0, 160)}`);
    console.log(`\n--- SCORES ---\n  h=${qa.scores.hook_strength} b=${qa.scores.belief_loop_completeness} p=${qa.scores.proof_authenticity} g=${qa.scores.generic_language} f=${qa.scores.filming_feasibility} c=${qa.scores.cta_naturalness}`);
    if (qa.flags.length > 0) { console.log(`--- FLAGS ---`); qa.flags.forEach(f => console.log(`  [${f.severity}] ${f.component}: ${f.issue.substring(0, 100)}`)); }
    const allText = [...script.hook_options.map(h => h.hook_text), script.cta_logic.cta_text, script.caption, ...script.beats.map(b => b.content + (b.spoken || "") + (b.text_overlay || ""))].join(" ").toLowerCase();
    console.log(`\n--- METADATA ---\n  Price: ${allText.includes("$") || allText.includes("price") ? "YES" : "no"} | Rating: ${allText.includes("star") || allText.includes("review") || allText.includes("sold") ? "YES" : "no"}`);
    // CTA syntax
    const cl = script.cta_logic.cta_text.toLowerCase();
    let syn = "other";
    if (cl.startsWith("after seeing") || cl.startsWith("after watching")) syn = "after-X";
    else if (cl.startsWith("that ")) syn = "that-X";
    else if (cl.startsWith("once i")) syn = "once-i";
    else if (cl.startsWith("honestly")) syn = "honestly";
    else if (cl.startsWith("i'm never") || cl.startsWith("i'm done")) syn = "im-never";
    else if (cl.startsWith("if your")) syn = "if-your";
    else if (cl.includes("is why i") || cl.includes("is exactly why")) syn = "is-why-i";
    else if (cl.includes("sold me") || cl.includes("convinced me")) syn = "X-sold-me";
    else if (cl.includes("was all i") || cl.includes("was enough")) syn = "was-all-i";
    else if (cl.includes("after")) syn = "mid-after";
    const tail = cl.includes("i linked the exact");
    console.log(`  CTA Syntax: ${syn} | Generic tail: ${tail ? "YES" : "no"}`);
    return { label, hooks: script.hook_options.length, score: qa.overall_score, scores: qa.scores, passed: qa.passed, cta: script.cta_logic.cta_text, proof: script.cta_logic.proof_beat_echoed, syn, tail, flags: qa.flags.length };
  } catch (e) { console.error(`FAILED: ${e instanceof Error ? e.message : e}`); return { label, hooks: 0, score: 0, passed: false, error: true }; }
}

async function main() {
  console.log("BATCH 5 CALIBRATION TEST — 8 Products (post-11.5)\n");
  const results: any[] = [];
  for (const { label, product } of PRODUCTS) results.push(await runTest(label, product));
  console.log(`\n${"=".repeat(70)}`);
  console.log("BATCH 5 SUMMARY");
  console.log(`${"=".repeat(70)}`);
  const passing = results.filter(r => !r.error && r.passed);
  results.forEach(r => {
    if (r.error) { console.log(`  ${r.label}: ERROR`); return; }
    console.log(`  ${r.label}: ${r.passed ? "PASS" : "FAIL"} (${r.score}) | Hooks: ${r.hooks} | h=${r.scores?.hook_strength} b=${r.scores?.belief_loop_completeness} p=${r.scores?.proof_authenticity} g=${r.scores?.generic_language} f=${r.scores?.filming_feasibility} c=${r.scores?.cta_naturalness} | CTA: ${r.syn} | tail: ${r.tail ? "Y" : "n"}`);
  });
  // Distribution
  const synDist: Record<string,number> = {};
  results.filter(r => !r.error).forEach(r => { synDist[r.syn] = (synDist[r.syn] || 0) + 1; });
  console.log(`\n  CTA SYNTAX DISTRIBUTION: ${JSON.stringify(synDist)}`);
  console.log(`  Unique patterns: ${Object.keys(synDist).length} of ${results.filter(r=>!r.error).length}`);
  console.log(`  "after-X": ${synDist["after-X"] || 0} | "that-X": ${synDist["that-X"] || 0}`);
  console.log(`  Generic tail count: ${results.filter(r => !r.error && r.tail).length} of ${results.filter(r=>!r.error).length}`);
  if (passing.length > 1) {
    const sc = passing.map(r => r.score);
    console.log(`  SCORE SPREAD: min=${Math.min(...sc).toFixed(2)} max=${Math.max(...sc).toFixed(2)} range=${(Math.max(...sc)-Math.min(...sc)).toFixed(2)}`);
  }
}

main().catch(console.error);
