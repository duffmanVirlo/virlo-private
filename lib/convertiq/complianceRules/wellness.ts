export type ComplianceRule = {
  category: string;
  blocked_phrases: {
    phrase: string;
    reason: string;
    replacement_guidance: string;
  }[];
  required_framing: {
    rule: string;
    example: string;
  }[];
  disclaimer_requirements: string[];
};

export const WELLNESS_COMPLIANCE: ComplianceRule = {
  category: "WELLNESS",
  blocked_phrases: [
    {
      phrase: "cure",
      reason:
        "Implies the product can eliminate a disease or condition, which is a medical claim prohibited for non-drug products.",
      replacement_guidance:
        'Use "supports" or "helps with" instead. E.g., "supports joint comfort" rather than "cures joint pain".',
    },
    {
      phrase: "treat",
      reason:
        "Implies therapeutic action reserved for approved drugs and medical devices.",
      replacement_guidance:
        'Use "helps manage" or "I use this for my..." framing. E.g., "I use this to help manage my morning stiffness".',
    },
    {
      phrase: "heal",
      reason:
        "Suggests the product repairs or restores bodily function, which constitutes a medical claim.",
      replacement_guidance:
        'Use "soothe" or "comfort" instead. E.g., "this really soothes my muscles after a workout".',
    },
    {
      phrase: "diagnose",
      reason:
        "Diagnosing conditions is a medical act that cannot be attributed to a consumer product.",
      replacement_guidance:
        'Use "helped me understand" or "gave me insight into". E.g., "this tracker gave me insight into my sleep patterns".',
    },
    {
      phrase: "prevent disease",
      reason:
        "Disease prevention claims are drug claims under FTC and FDA guidelines.",
      replacement_guidance:
        'Use "supports overall wellness" or "part of my daily routine for staying healthy".',
    },
    {
      phrase: "medical-grade",
      reason:
        "Implies regulatory clearance or clinical equivalence that the product likely does not have.",
      replacement_guidance:
        'Use "professional-quality" or "high-potency" if factually accurate.',
    },
    {
      phrase: "clinically proven",
      reason:
        "Requires specific clinical trial citation. Without one, this is a deceptive claim.",
      replacement_guidance:
        'If a study exists, cite it specifically: "in a 2024 study published in [journal], participants saw...". Otherwise, use "backed by research" only if genuinely true, or stick to personal experience.',
    },
    {
      phrase: "FDA approved",
      reason:
        "Supplements and most wellness products are not FDA-approved. This claim is false for the vast majority of TikTok Shop wellness products.",
      replacement_guidance:
        'Use "manufactured in an FDA-registered facility" or "made following GMP standards" if factually accurate. Never claim FDA approval for supplements.',
    },
  ],
  required_framing: [
    {
      rule: 'Use "supports" language instead of curative claims.',
      example:
        '"This magnesium supplement supports my sleep quality" NOT "This magnesium cures my insomnia".',
    },
    {
      rule: "Frame all benefits as personal experience, not universal outcomes.",
      example:
        '"Since I started taking this, I\'ve personally noticed more energy in the mornings" NOT "This product gives you more energy".',
    },
    {
      rule: "Anchor results to a specific timeline and consistent usage pattern.",
      example:
        '"After 3 weeks of consistent use, I noticed my digestion felt smoother" NOT "This fixes your digestion instantly".',
    },
    {
      rule: "Pair any benefit claim with context about your personal routine or lifestyle.",
      example:
        '"I take this alongside my morning walk and balanced breakfast, and together it\'s made a difference for me" NOT "Just take this and you\'ll feel amazing".',
    },
    {
      rule: "Avoid absolutist language; use qualifiers that reflect honest variability.",
      example:
        '"This has been really helpful for me personally" NOT "This works for everyone".',
    },
  ],
  disclaimer_requirements: [
    "Individual results may vary.",
    "This is not medical advice. Consult a healthcare professional before starting any new supplement or wellness routine.",
    "These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.",
  ],
};
