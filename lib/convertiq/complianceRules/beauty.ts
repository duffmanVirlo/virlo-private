import type { ComplianceRule } from "./wellness";

export const BEAUTY_COMPLIANCE: ComplianceRule = {
  category: "BEAUTY",
  blocked_phrases: [
    {
      phrase: "permanent results",
      reason:
        "No topical beauty product delivers permanent results. This is a deceptive claim that sets false expectations.",
      replacement_guidance:
        'Use "long-lasting" or "I\'ve seen sustained improvement with continued use" instead.',
    },
    {
      phrase: "anti-aging miracle",
      reason:
        'The word "miracle" implies supernatural or guaranteed efficacy, which is misleading for cosmetic products.',
      replacement_guidance:
        'Use "this has really helped with my fine lines" or "I\'ve noticed my skin looks more youthful since using this".',
    },
    {
      phrase: "dermatologist-approved",
      reason:
        "Requires verifiable dermatologist endorsement. Without documented backing, this is a false authority claim.",
      replacement_guidance:
        'If true, cite the specific dermatologist or study. Otherwise, use "gentle on my sensitive skin" or "formulated with ingredients dermatologists commonly recommend".',
    },
    {
      phrase: "acne cure",
      reason:
        "Acne is a medical condition. Claiming a cure makes the product an unapproved drug under FDA guidelines.",
      replacement_guidance:
        'Use "helped clear my breakouts" or "my skin has been so much calmer since I started using this". Frame as personal experience.',
    },
    {
      phrase: "eliminates wrinkles",
      reason:
        "No topical product eliminates wrinkles. This claim is factually false and misleading.",
      replacement_guidance:
        'Use "softens the appearance of fine lines" or "my wrinkles look less noticeable to me".',
    },
    {
      phrase: "guaranteed results",
      reason:
        "Beauty outcomes vary dramatically by skin type, environment, and genetics. Guarantees are inherently deceptive.",
      replacement_guidance:
        'Use "I\'ve been really impressed with my results" and pair with the disclaimer about individual variation.',
    },
    {
      phrase: "works on all skin types",
      reason:
        "Universal skin type claims are almost never true and set up returns and negative reviews.",
      replacement_guidance:
        'Specify your own skin type: "I have oily, acne-prone skin and this worked great for me. Your results may differ based on your skin type."',
    },
    {
      phrase: "replaces botox",
      reason:
        "Comparing a topical product to a medical procedure is a deceptive drug claim.",
      replacement_guidance:
        'Use "I feel like this gives my skin a really plump, smooth look" without referencing medical procedures.',
    },
  ],
  required_framing: [
    {
      rule: 'Frame all results as "my experience" rather than universal claims.',
      example:
        '"On my combination skin, this serum has been incredible" NOT "This serum works for everyone".',
    },
    {
      rule: "Provide specific skin type context so viewers can self-select relevance.",
      example:
        '"I have dry, sensitive skin that reacts to almost everything, so the fact that this didn\'t irritate me was huge" NOT "This is perfect for sensitive skin".',
    },
    {
      rule: "Anchor results to a timeline and usage consistency.",
      example:
        '"I used this every night for about 4 weeks before I really saw a difference in my texture" NOT "Instant results from day one".',
    },
    {
      rule: "Describe observable changes rather than making clinical claims.",
      example:
        '"My pores look smaller to me and my foundation goes on smoother" NOT "Shrinks pores and repairs skin barrier".',
    },
    {
      rule: "Acknowledge that beauty outcomes depend on individual factors.",
      example:
        '"This has been my holy grail but I know skin is super personal, so what works for me might not work for you".',
    },
  ],
  disclaimer_requirements: [
    "Individual results may vary based on skin type, routine, and consistency of use.",
    "Always perform a patch test before applying new products, especially if you have sensitive or reactive skin.",
    "This is my personal experience and not a substitute for advice from a licensed dermatologist.",
  ],
};
