// ============================================================================
// TikTok Shop Universal Content Policy — Final Enforcement Layer
// ============================================================================
// This runs as a FINAL PASS on ALL outputs, regardless of category.
// It is not creative doctrine — it is platform policy compliance.
// It should NOT weaken strong output. It should only intervene when there
// is real policy or enforcement risk.
//
// Three enforcement tiers:
// TIER 1: HARD BLOCK — must never survive to final output
// TIER 2: SOFT REWRITE — directionally strong but phrasing needs normalization
// TIER 3: CATEGORY TRIGGERS — elevated review for sensitive categories
// ============================================================================

export type PolicyViolation = {
  tier: 1 | 2 | 3;
  pattern: string;
  reason: string;
  replacement_guidance: string;
};

// ── TIER 1: HARD BLOCK ──────────────────────────────────────────────────────
// These should NEVER appear in final output. No exceptions.

export const TIER1_HARD_BLOCKS: PolicyViolation[] = [
  // Medical / cure language
  { tier: 1, pattern: "cures", reason: "Medical cure claim — prohibited for non-drug products", replacement_guidance: "Use 'supports' or 'helps with' or describe personal experience" },
  { tier: 1, pattern: "cure your", reason: "Direct medical cure claim", replacement_guidance: "Use 'helps manage' or 'I noticed improvement with'" },
  { tier: 1, pattern: "cure for", reason: "Medical cure claim", replacement_guidance: "Use 'helps with' or 'supports'" },
  { tier: 1, pattern: "eliminates disease", reason: "Disease elimination claim", replacement_guidance: "Use 'supports overall wellness'" },
  { tier: 1, pattern: "prevents cancer", reason: "Specific disease prevention claim", replacement_guidance: "Remove entirely — do not make disease-specific claims" },
  { tier: 1, pattern: "prevents diabetes", reason: "Specific disease prevention claim", replacement_guidance: "Remove entirely" },
  { tier: 1, pattern: "FDA approved", reason: "False FDA approval claim for non-approved products", replacement_guidance: "Use 'manufactured in FDA-registered facility' if factually true, otherwise remove" },
  { tier: 1, pattern: "clinically proven", reason: "Requires specific citation — deceptive without one", replacement_guidance: "Cite specific study or use 'I personally noticed' framing" },
  { tier: 1, pattern: "medically proven", reason: "Medical proof claim without citation", replacement_guidance: "Use personal experience framing" },
  { tier: 1, pattern: "doctor recommended", reason: "Unsupported medical endorsement unless specifically documented", replacement_guidance: "Use 'I started using this after researching' or remove" },

  // Guaranteed outcome language
  { tier: 1, pattern: "guaranteed results", reason: "Outcome guarantee — cannot be substantiated", replacement_guidance: "Use 'I saw results' or 'many people report'" },
  { tier: 1, pattern: "guaranteed to work", reason: "Performance guarantee — cannot be verified", replacement_guidance: "Use 'this has worked well for me' or 'worth trying'" },
  { tier: 1, pattern: "100% effective", reason: "Absolute efficacy claim", replacement_guidance: "Use 'highly effective for me' or describe specific personal result" },
  { tier: 1, pattern: "works for everyone", reason: "Universal efficacy claim — impossible to substantiate", replacement_guidance: "Use 'this has worked great for me personally'" },
  { tier: 1, pattern: "never fails", reason: "Absolute performance claim", replacement_guidance: "Use 'hasn't let me down' or 'has been really reliable'" },

  // Off-platform CTA
  { tier: 1, pattern: "DM me", reason: "Off-platform transaction solicitation — violates TikTok Shop policy", replacement_guidance: "Remove — keep CTA within TikTok Shop ecosystem" },
  { tier: 1, pattern: "text me", reason: "Off-platform contact solicitation", replacement_guidance: "Remove" },
  { tier: 1, pattern: "link in bio", reason: "Off-platform CTA — redirects from TikTok Shop", replacement_guidance: "Remove or replace with 'check the link' or 'it's in TikTok Shop'" },
  { tier: 1, pattern: "link in my bio", reason: "Off-platform CTA", replacement_guidance: "Remove or replace with 'it's in TikTok Shop'" },
  { tier: 1, pattern: "scan this QR", reason: "Off-platform redirect via QR code", replacement_guidance: "Remove — use TikTok Shop native checkout" },
  { tier: 1, pattern: "QR code", reason: "Off-platform redirect mechanism", replacement_guidance: "Remove" },
  { tier: 1, pattern: "go to my website", reason: "Off-platform redirect", replacement_guidance: "Remove — keep within TikTok Shop" },
  { tier: 1, pattern: "visit my site", reason: "Off-platform redirect", replacement_guidance: "Remove" },
  { tier: 1, pattern: "use code", reason: "Off-platform coupon code — may violate Shop policy unless TikTok-native promo", replacement_guidance: "Remove unless it's a TikTok Shop native promotion" },

  // Unsupported pricing claims
  { tier: 1, pattern: "cheapest on the market", reason: "Unsupported superlative price claim", replacement_guidance: "Use 'really good value' or 'surprisingly affordable'" },
  { tier: 1, pattern: "best price anywhere", reason: "Unsupported superlative price claim", replacement_guidance: "Use 'great price for what you get'" },
  { tier: 1, pattern: "lowest price guaranteed", reason: "Price guarantee claim — cannot be substantiated by a creator", replacement_guidance: "Use 'the price is really solid for this quality'" },
];

// ── TIER 2: SOFT REWRITE ────────────────────────────────────────────────────
// Directionally strong but phrasing creates policy risk. Normalize, don't gut.

export const TIER2_SOFT_REWRITES: PolicyViolation[] = [
  // Unsupported comparative claims
  { tier: 2, pattern: "better than every other", reason: "Unsupported blanket comparison — creator cannot verify against all competitors", replacement_guidance: "Use 'better than what I was using before' or 'handles [test] better than I expected'" },
  { tier: 2, pattern: "every other .+ fails", reason: "Blanket competitor failure claim", replacement_guidance: "Use 'the last one I had couldn't do this' — personal comparison only" },
  { tier: 2, pattern: "no other .+ does this", reason: "Exclusivity claim — unverifiable", replacement_guidance: "Use 'I haven't found another one that does this as well'" },
  { tier: 2, pattern: "the only .+ that actually", reason: "Exclusivity claim", replacement_guidance: "Use 'the first one I've tried that actually' — personal scope" },
  { tier: 2, pattern: "destroys the competition", reason: "Aggressive competitive claim", replacement_guidance: "Use 'holds up way better than the last one I had'" },

  // Overclaimed efficacy
  { tier: 2, pattern: "fixes your", reason: "Hard-fix claim for body/health/comfort — overclaim risk", replacement_guidance: "Use 'helps with' or 'gives relief from' or 'makes a real difference for'" },
  { tier: 2, pattern: "fixes the problem", reason: "Absolute problem resolution claim", replacement_guidance: "Use 'actually helps with' or 'made such a difference'" },
  { tier: 2, pattern: "completely eliminates", reason: "Absolute elimination claim", replacement_guidance: "Use 'significantly reduces' or 'made a huge difference with'" },
  { tier: 2, pattern: "100% waterproof", reason: "Absolute efficacy claim — one counterexample disproves it", replacement_guidance: "Use 'water rolls right off' or 'handles water really well'" },
  { tier: 2, pattern: "they're actually waterproof", reason: "Absolute claim stated as fact", replacement_guidance: "Use 'water beads up and slides off' or 'handles wet conditions really well'" },
  { tier: 2, pattern: "completely safe", reason: "Absolute safety claim — creates liability", replacement_guidance: "Use 'feels very safe to use' or describe specific safety features" },
  { tier: 2, pattern: "zero side effects", reason: "Medical claim — cannot be substantiated by a creator", replacement_guidance: "Use 'I haven't noticed any side effects personally'" },

  // Misleading urgency / scarcity
  { tier: 2, pattern: "they always sell out", reason: "Potentially misleading scarcity claim unless documented", replacement_guidance: "Use 'these tend to go quick' if high sold_count supports it, otherwise remove" },
  { tier: 2, pattern: "last chance", reason: "False urgency unless genuinely last stock", replacement_guidance: "Use 'while it's still on sale' or 'while they have it'" },
  { tier: 2, pattern: "going fast", reason: "Urgency language — acceptable if supported by sold_count, otherwise soften", replacement_guidance: "Keep only if sold_count is high; otherwise use 'worth grabbing'" },

  // Sensational language
  { tier: 2, pattern: "miracle", reason: "Exaggerated efficacy — reads as infomercial", replacement_guidance: "Use 'really surprised me' or 'made a bigger difference than I expected'" },
  { tier: 2, pattern: "magic", reason: "Exaggerated efficacy", replacement_guidance: "Use 'works really well' or 'the difference is real'" },
  { tier: 2, pattern: "life-changing", reason: "Hyperbolic — reads as inauthentic unless genuinely warranted", replacement_guidance: "Use 'made a real difference for me' or be specific about what changed" },
  { tier: 2, pattern: "game changer", reason: "Overused hyperbole", replacement_guidance: "Use the specific improvement instead — 'now I can actually [specific thing]'" },
];

// ── TIER 3: CATEGORY TRIGGERS ───────────────────────────────────────────────
// Categories that receive elevated final review

export const TIER3_ELEVATED_CATEGORIES: string[] = [
  "WELLNESS",
  "BEAUTY",
  "BABY",
  "PET",
  // Oral care products fall under BEAUTY or WELLNESS depending on classification
  // but any product with dental/teeth/oral claims should get elevated review
];

// Additional claim-sensitive product type keywords that trigger elevated review
// even if the category itself is not in the elevated list
export const TIER3_SENSITIVE_PRODUCT_TYPES: string[] = [
  "supplement",
  "vitamin",
  "serum",
  "cream",
  "oral care",
  "toothpaste",
  "whitening",
  "teeth",
  "dental",
  "posture",
  "recovery",
  "sleep aid",
  "insole",
  "anti-aging",
  "acne",
  "weight loss",
  "detox",
  "collagen",
  "probiotic",
  "essential oil",
  "cbd",
  "melatonin",
  "pain relief",
  "calming",
  "anxiety",
  "stress relief",
];
