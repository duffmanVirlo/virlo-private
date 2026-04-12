export type ProofSequencePattern = {
  id: string;
  name: string;
  sequence: string[];
  why_this_order: string;
  best_for_proof_type: string[];
  category_affinity: string[] | "all";
};

export const PROOF_SEQUENCES: ProofSequencePattern[] = [
  {
    id: "problem-mechanism-result",
    name: "Problem Mechanism Result",
    sequence: [
      "Establish the specific problem with enough sensory detail that the viewer re-experiences their own frustration",
      "Reveal the product mechanism or feature that addresses the problem, showing how it works rather than just that it exists",
      "Show the result as a natural consequence of the mechanism, letting the visual evidence do the convincing",
      "Optional: brief reaction or observation that mirrors what the viewer is already thinking",
    ],
    why_this_order:
      "The viewer needs to feel the problem before they care about any solution. The mechanism builds understanding and credibility: they see why it works, not just that someone claims it does. By the time the result appears, the viewer has a mental model that makes the result feel logical and inevitable rather than magical and suspicious.",
    best_for_proof_type: [
      "live-demonstration",
      "unexpected-mechanism",
      "problem-framing",
    ],
    category_affinity: "all",
  },
  {
    id: "before-during-after",
    name: "Before During After",
    sequence: [
      "Show the 'before' state clearly and honestly, without exaggeration that would undermine credibility",
      "Show the product being applied or used in real time, with no cuts that suggest trickery",
      "Show the 'after' state in the same lighting and conditions as the 'before', allowing the viewer to make a direct comparison",
      "Optional: return to a split or side-by-side view so the contrast is unmistakable",
    ],
    why_this_order:
      "Transformation is one of the most powerful proof structures because the viewer's own eyes provide the evidence. The unbroken before-during-after sequence eliminates the suspicion of editing tricks. Showing the process in the middle proves that the product is the cause of the transformation, not some other factor.",
    best_for_proof_type: [
      "result-display",
      "live-demonstration",
      "personal-testimony",
    ],
    category_affinity: ["BEAUTY", "HOME", "AUTO", "FITNESS", "KITCHEN"],
  },
  {
    id: "single-escalation",
    name: "Single Escalation",
    sequence: [
      "Start with the most basic and believable demonstration of the product working",
      "Increase the difficulty, the stakes, or the impressiveness of the next demonstration",
      "Push to the most extreme or surprising test that still feels authentic",
      "Land on the result of the final escalation as the closing proof point",
    ],
    why_this_order:
      "Starting with a modest claim that is easy to believe earns initial credibility. Each escalation step is accepted because the previous step was proven true. By the time the most impressive claim arrives, the viewer has a track record of seeing the product deliver, so they believe the big claim too. Starting with the biggest claim would trigger skepticism with no established trust to support it.",
    best_for_proof_type: [
      "live-demonstration",
      "quantity-scale",
      "comparison",
    ],
    category_affinity: ["TECH", "AUTO", "OUTDOOR", "FITNESS", "KITCHEN"],
  },
  {
    id: "comparison-reveal",
    name: "Comparison Reveal",
    sequence: [
      "Introduce the familiar alternative, existing product, or standard approach the viewer currently uses or knows about",
      "Use the alternative so the viewer sees its limitations or weaknesses through demonstration, not through the creator's critique",
      "Introduce the new product in the same context and conditions",
      "Let the comparison speak visually, with minimal verbal editorializing, so the viewer reaches their own conclusion about which is better",
    ],
    why_this_order:
      "Starting with the familiar establishes a benchmark the viewer can relate to. Demonstrating its limitations through use rather than words avoids sounding like a competitor attack ad. When the new product appears in identical conditions, the comparison is fair and the viewer trusts the outcome because they watched both tests. The conclusion feels self-derived rather than marketed.",
    best_for_proof_type: [
      "comparison",
      "live-demonstration",
      "unexpected-mechanism",
    ],
    category_affinity: [
      "TECH",
      "AUTO",
      "BEAUTY",
      "KITCHEN",
      "HOME",
      "FITNESS",
    ],
  },
];
