import type { CategoryId } from "@/types/classification";
import type { ProofType } from "@/types/analysis";
import type { CreatorPatternProfile } from "./belush";

export const MATTKAHLA_PROFILE: CreatorPatternProfile = {
  creator_id: "mattkahla",
  handle: "@mattkahla",
  primary_category_strength: ["AUTO", "TECH", "OUTDOOR", "FITNESS"],
  hook_archetype: "bold-statement",
  hook_mechanics: [
    "Opens by questioning whether a product actually works as claimed, framing the video as an honest test rather than a recommendation",
    "Uses skeptical framing from the start: 'Let's see if this is actually worth it' positions him as the viewer's proxy rather than the brand's spokesperson",
    "Shows the product alongside the challenge or test it is about to face, creating immediate visual tension about the outcome",
    "Occasionally references previous product failures or disappointments to establish that he has high standards and is not easily impressed",
  ],
  retention_approach:
    "Deliberate test-then-reveal pacing. He holds the viewer by creating a genuine question about whether the product will pass his test. The viewer stays because the outcome is uncertain and the test feels real. He uses his own visible skepticism as the retention mechanism: the viewer wants to see if his opinion will change.",
  pacing_signature:
    "Deliberate and methodical during the test, with measured narration that builds credibility. He takes his time with each test to show that he is being thorough, not rushing to a conclusion. The reveal moment arrives after the viewer has watched the full process, making the result feel earned and trustworthy. There is a notable pace change at the verdict moment.",
  proof_preference: ["live-demonstration", "comparison"],
  objection_style: "proof-absorbs-objection",
  cta_approach: "problem-resolution",
  trust_mechanic: "real-use-evidence",
  visual_tendencies: [
    "Outdoor or garage setting that feels like a real workspace, not a studio or staged environment",
    "Product shown in harsh or demanding conditions that a real user would encounter, not ideal or controlled settings",
    "Side-by-side comparisons with competing products or the existing solution, tested under identical conditions",
    "Full test process shown without cuts at key moments so the viewer trusts the result was not manufactured in editing",
  ],
  delivery_register: "calm-authority",
  category_adaptations: {
    AUTO:
      "Tests the product on his actual vehicle in real conditions. Shows the full application or installation process. Compares against the well-known brand or traditional method. Durability or real-world performance is always the proof priority.",
    TECH:
      "Unboxes and uses the product with visible skepticism. Tests against the manufacturer's specific claims one by one. Shows measurable results when possible rather than subjective impressions. Willing to show when a product underperforms.",
    OUTDOOR:
      "Tests in actual outdoor conditions rather than controlled environments. Shows the product handling real weather, terrain, or wear. Emphasizes durability and practical performance over features or aesthetics.",
    FITNESS:
      "Demonstrates the product during real workouts or physical activity. Compares the experience against established alternatives. Focuses on whether the product performs under the stress of actual use rather than gentle handling.",
  },
  anti_patterns: [
    "Never opens with a positive conclusion; the verdict is always reserved for after the test so it feels earned",
    "Avoids enthusiastic energy or hype; his credibility depends on measured, evidence-based delivery",
    "Does not accept product claims at face value; every claim is framed as something to be verified through testing",
    "Never skips showing a failure or disappointing result if one occurs during testing; his willingness to show negatives is his core trust signal",
  ],
};
