export type QAScoreWeights = {
  hook_strength: number;
  belief_loop_completeness: number;
  proof_authenticity: number;
  generic_language: number;
  filming_feasibility: number;
  cta_naturalness: number;
};

export const QA_WEIGHTS: QAScoreWeights = {
  hook_strength: 1.0,
  belief_loop_completeness: 1.5,
  proof_authenticity: 1.5,
  generic_language: 1.0,
  filming_feasibility: 1.0,
  cta_naturalness: 1.0,
};

/**
 * Phrases that signal generic, overused, or low-authenticity creator content.
 * Scripts containing these phrases should be flagged for revision.
 * Matching is case-insensitive and checks for substring presence.
 */
export const PHRASE_BLACKLIST: string[] = [
  // Hyperbolic endorsements
  "game changer",
  "life changing",
  "changed my life",
  "best thing ever",
  "literally the best",
  "holy grail",
  "absolute must",
  "must have",
  "must-have",
  "I can't live without",
  "can't live without this",
  "obsessed",

  // Low-effort hype language
  "you won't believe",
  "I'm not kidding",
  "trust me",
  "you need this",
  "everyone needs this",
  "it's so good",
  "so good I had to share",
  "I'm shook",
  "no because seriously",

  // Generic urgency / scarcity cues
  "run don't walk",
  "don't sleep on this",
  "selling out fast",
  "before it sells out",
  "going viral",
  "TikTok made me buy it",
  "viral product",

  // Empty filler CTAs
  "link in bio",
  "check the link",
  "click the link",
  "grab yours now",
  "use my code",
  "discount in comments",

  // Unsubstantiated superlatives
  "best on the market",
  "number one product",
  "#1 product",
  "nothing else compares",
  "the only product you need",
  "blows everything else away",
  "destroys the competition",
];

export type StructuralRejectionRule = {
  rule: string;
  severity: "blocking" | "warning";
};

/**
 * Rules that evaluate the structural quality of a generated script.
 * Blocking rules prevent a script from passing QA entirely.
 * Warning rules flag issues but allow the script through with a score penalty.
 */
export const STRUCTURAL_REJECTION_RULES: StructuralRejectionRule[] = [
  // Blocking rules - script cannot pass QA
  {
    rule: "Script contains no specific product detail (name, feature, ingredient, or dimension).",
    severity: "blocking",
  },
  {
    rule: "Hook could apply to any product in the category without modification.",
    severity: "blocking",
  },
  {
    rule: 'CTA is a generic "link in bio" or "check comments" with no product-specific reason to act.',
    severity: "blocking",
  },
  {
    rule: "Script makes a health, safety, or efficacy claim that violates category compliance rules.",
    severity: "blocking",
  },
  {
    rule: "Belief loop is missing or has no logical connection between the problem and the product as the solution.",
    severity: "blocking",
  },
  {
    rule: "Script contains no proof element (demonstration, before/after, personal result, or specific metric).",
    severity: "blocking",
  },
  {
    rule: "Script reads as a product listing or advertisement rather than authentic creator content.",
    severity: "blocking",
  },

  // Warning rules - script is penalized but can pass
  {
    rule: "No filming notes or visual direction provided on any beat.",
    severity: "warning",
  },
  {
    rule: "All hook variants are structural variations of the same sentence pattern.",
    severity: "warning",
  },
  {
    rule: "Script mentions the product name more than 3 times.",
    severity: "warning",
  },
  {
    rule: "Script exceeds 60 seconds of estimated speaking time without a clear pacing note.",
    severity: "warning",
  },
  {
    rule: "CTA does not reference a specific benefit or reason to purchase.",
    severity: "warning",
  },
  {
    rule: "Script uses more than 2 phrases from the generic language blacklist.",
    severity: "warning",
  },
  {
    rule: "Proof section relies entirely on verbal claims with no visual demonstration suggestion.",
    severity: "warning",
  },
  {
    rule: "Script does not include at least one moment of vulnerability, specificity, or personal detail.",
    severity: "warning",
  },
];

/** Minimum weighted QA score required for a script to pass quality checks. */
export const MIN_QA_SCORE = 7.5;

/**
 * Calculates the weighted QA score from individual dimension scores.
 *
 * Each dimension score should be on a 0-10 scale.
 * The final score is a weighted average using QA_WEIGHTS,
 * normalized back to a 0-10 scale.
 *
 * @param scores - A record mapping dimension names to their 0-10 scores.
 *                 Keys should match the fields of QAScoreWeights.
 * @returns The weighted average score on a 0-10 scale.
 */
export function calculateWeightedScore(
  scores: Record<string, number>,
): number {
  const weightEntries = Object.entries(QA_WEIGHTS) as [
    keyof QAScoreWeights,
    number,
  ][];

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const [dimension, weight] of weightEntries) {
    const score = scores[dimension];
    if (score !== undefined) {
      totalWeightedScore += score * weight;
      totalWeight += weight;
    }
  }

  if (totalWeight === 0) return 0;

  return Math.round((totalWeightedScore / totalWeight) * 100) / 100;
}
