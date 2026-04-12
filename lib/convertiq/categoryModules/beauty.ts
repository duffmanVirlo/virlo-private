import type { CategoryId } from "@/types/classification";
import type { CategoryModule } from "./auto";

export const BEAUTY_MODULE: CategoryModule = {
  id: "BEAUTY",
  name: "Beauty & Personal Care",
  buyer_psychology: {
    primary_motivation:
      "Visible results on real skin — buyers want to see a product perform on someone whose skin or hair resembles theirs, not a model with already-perfect features.",
    purchase_anxiety:
      "Will this work for MY skin type/tone/texture/hair type? Buyers fear irritation, breakouts, wasted money on another product that looked great on someone else but does nothing for them.",
    trust_threshold:
      "Moderate-to-high — requires close-up, unfiltered application on real skin. Filtered or heavily-lit results instantly erode trust. Credibility comes from specificity about skin type and honest commentary about texture, scent, and feel.",
    impulse_vs_considered: "hybrid",
  },
  proof_hierarchy: [
    "close-up result display on real skin with natural lighting",
    "personal testimony with specific skin type/concern context",
    "before/after with consistent lighting and no filter change",
    "texture and application feel demonstration",
    "ingredient mechanism explanation for skeptical buyers",
    "wear test over time (how it looks after 4, 8, 12 hours)",
  ],
  proof_destroyers: [
    "Filter-enhanced skin that makes any product look miraculous",
    "Ring light or studio lighting that washes out texture and hides real results",
    "Claiming results in unrealistic timelines — 'instant wrinkle removal' or 'overnight transformation'",
    "Ignoring skin type entirely — no mention of oily, dry, combination, sensitive, or tone",
    "Using a creator with already-flawless skin to demo a problem-solving product",
    "Before/after where makeup, lighting, or angle changes between shots",
  ],
  conversion_patterns: [
    {
      name: "The Skin Truth",
      description:
        "Start with a bare-face close-up in natural lighting showing real texture, pores, and concerns. Apply the product on camera and show the immediate result without cuts or filter changes.",
      when_to_use:
        "Skincare products where the visual transformation is the primary selling point — serums, moisturizers, primers, color correctors.",
    },
    {
      name: "The Type Match",
      description:
        "Open by explicitly stating your skin type, concerns, and what hasn't worked before. Position this product as the solution that finally worked for your specific situation.",
      when_to_use:
        "When targeting a specific skin concern audience — acne-prone, aging, hyperpigmentation, sensitivity.",
    },
    {
      name: "The Wear Test",
      description:
        "Apply the product at the start of the day, then check in at multiple time points showing how it holds up through real activities — work, gym, eating, outdoors.",
      when_to_use:
        "Makeup, SPF, setting sprays, foundations, concealers — any product that claims longevity.",
    },
    {
      name: "The Texture Reveal",
      description:
        "Focus on the sensory experience — show the product's texture on fingertips, demonstrate how it spreads, absorbs, and feels. Describe the finish honestly (dewy, matte, tacky, silky).",
      when_to_use:
        "Products where feel and finish matter as much as results — moisturizers, primers, body lotions, hair treatments.",
    },
    {
      name: "The Ingredient Decoder",
      description:
        "Explain one or two key active ingredients in plain language, why they work, and show your personal results. Bridges the gap between clinical claims and real-world proof.",
      when_to_use:
        "Higher-priced skincare, serums, treatments — products where buyers need to justify the spend with science.",
    },
  ],
  anti_patterns: [
    "Applying product with a beauty filter active — viewers can always tell",
    "Saying 'obsessed' or 'holy grail' with no specific reason why",
    "Showing only the packaging and never the product on skin",
    "Claiming it works for 'everyone' without acknowledging skin type variation",
    "Using phrases like 'flawless skin in seconds' that trigger BS detectors",
    "Over-produced content that looks like a brand ad instead of a real review",
    "Describing only what a product claims instead of what it actually does on your skin",
    "Showing a single use and claiming long-term results",
  ],
  content_rules: [
    "Always show product application on real skin — never just swatch on hand as the only proof",
    "Use natural or consistent lighting throughout — no switching from dim to bright between before and after",
    "State your skin type within the first 15 seconds so viewers can self-select",
    "If showing before/after, keep the same angle, distance, and lighting",
    "Never claim medical or dermatological results (acne cure, wrinkle elimination) — describe improvement only",
    "Show texture close-ups: the product on fingers, spreading on skin, absorption",
    "Include honest commentary about scent, feel, and any downsides",
  ],
  demonstration_priority:
    "Close-up application on real skin in natural lighting. The viewer must see the product going onto skin and the immediate visible result — texture change, coverage, glow, or correction — within the first few seconds.",
} as const;
