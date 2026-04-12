import type { CategoryId } from "@/types/classification";
import type { CategoryModule } from "./auto";

export const WELLNESS_MODULE: CategoryModule = {
  id: "WELLNESS",
  name: "Wellness & Health",
  buyer_psychology: {
    primary_motivation:
      "Mechanism-driven hope — buyers in this category are skeptical of claims but deeply want solutions. They're more likely to buy when they understand HOW something works, not just THAT it claims to work.",
    purchase_anxiety:
      "Is this legitimate or snake oil? Wellness buyers have been burned by miracle claims before. They fear wasting money on pseudoscience, experiencing no results, or worse, side effects. Timeline uncertainty is massive — 'when will I actually feel something?'",
    trust_threshold:
      "Very high — the most skeptical category. Requires mechanism explanation (why it works), honest timelines (how long until results), and personal testimony with specific detail. Generic health claims actively repel this buyer.",
    impulse_vs_considered: "considered",
  },
  proof_hierarchy: [
    "mechanism explanation — how and why the product works on a biological level",
    "personal testimony with specific timeline and measurable detail",
    "third-party evidence — studies, certifications, lab results",
    "before/after with honest timeline acknowledgment",
    "routine integration showing long-term use context",
    "ingredient transparency and sourcing detail",
  ],
  proof_destroyers: [
    "Cure claims or medical language — 'heals', 'treats', 'cures', 'eliminates'",
    "Unrealistic timelines — 'feel the difference in 24 hours' for a supplement",
    "Ignoring individual variation — 'this works for everyone'",
    "Using pseudo-medical authority without real credentials",
    "Showing only the highlight reel without honest timeline context",
    "Claiming proprietary 'secrets' without ingredient transparency",
  ],
  conversion_patterns: [
    {
      name: "The Mechanism First",
      description:
        "Start by explaining the underlying mechanism — what the ingredient does, how it interacts with the body, why the delivery method matters. Then layer personal experience on top of the explanation.",
      when_to_use:
        "Supplements, sleep aids, posture correctors, recovery tools — any product where understanding the 'how' builds more trust than showing the 'what'.",
    },
    {
      name: "The Honest Timeline",
      description:
        "Document your experience over a real timeframe — 'Day 1 I noticed nothing. Week 2, slight improvement. By week 4, here's where I am.' Honesty about the slow build converts harder than claims of instant results.",
      when_to_use:
        "Supplements, sleep products, posture correction, skin-health from within — products where results accumulate over weeks.",
    },
    {
      name: "The Ingredient Audit",
      description:
        "Break down 2-3 key active ingredients, explain what each does in plain language, and why the dosage/form in this product matters. Position yourself as the person who did the research so the viewer doesn't have to.",
      when_to_use:
        "Supplements, protein powders, functional foods, topical health products — anything where ingredients are the primary differentiator.",
    },
    {
      name: "The Routine Stack",
      description:
        "Show the product as one piece of a broader health routine — morning stack, recovery routine, sleep protocol. Context of how it fits alongside other habits builds credibility and normalizes the purchase.",
      when_to_use:
        "Products that work best as part of a system — supplements, recovery tools, sleep aids, hydration products.",
    },
    {
      name: "The Skeptic Convert",
      description:
        "Open with genuine skepticism — 'I didn't think this would work because...' — then walk through what changed your mind with specific evidence. Converts skeptical viewers by modeling their own doubt journey.",
      when_to_use:
        "Products with bold claims that need credibility rescue — collagen, mushroom supplements, grounding mats, red light devices.",
    },
  ],
  anti_patterns: [
    "Using words like 'cures', 'heals', 'treats', or 'eliminates' for any health claim",
    "Claiming results in unrealistic timelines without honest qualification",
    "Generic phrases like 'changed my life' with zero specifics about what changed",
    "Holding up a bottle and reading the label as the entire content",
    "Dismissing legitimate safety concerns or medication interactions",
    "Using medical imagery or doctor-adjacent language without real credentials",
    "Claiming the product replaces medical treatment or professional advice",
    "Showing only peak results without the honest journey of getting there",
  ],
  content_rules: [
    "Never use cure/treat/heal language — describe observed personal improvements only",
    "Always include an honest timeline — when you started noticing changes",
    "Explain at least one mechanism of action in plain language",
    "Acknowledge that individual results vary — never claim universal effectiveness",
    "If the product involves supplements, show the actual ingredients panel",
    "Include a disclaimer that this is personal experience, not medical advice",
    "Never suggest stopping prescribed medication in favor of a supplement",
    "Show the product in the context of a real daily routine, not isolated",
  ],
  demonstration_priority:
    "Show the mechanism of how it works, not just that it claims to work. The first 5 seconds should explain or visually demonstrate WHY this product does what it does — an ingredient breakdown, a physical demonstration of the mechanism, or a clear explanation of the biological pathway.",
} as const;
