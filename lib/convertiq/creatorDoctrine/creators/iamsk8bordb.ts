import type { CategoryId } from "@/types/classification";
import type { ProofType } from "@/types/analysis";
import type { CreatorPatternProfile } from "./belush";

export const IAMSK8BORDB_PROFILE: CreatorPatternProfile = {
  creator_id: "iamsk8bordb",
  handle: "@iamsk8bordb",
  primary_category_strength: ["HOME", "KITCHEN", "TECH", "PET"],
  hook_archetype: "utility-interruption",
  hook_mechanics: [
    "Opens mid-use with the product already in frame, as if the viewer walked into a moment already happening. No preamble, no setup, just action.",
    "Uses the environment itself as the hook: the kitchen during cooking, the living room during a cleaning moment, or the pet area during feeding. The scenario is immediately recognizable.",
    "Catches genuine reaction moments during first or early uses where her surprise or delight is visibly authentic rather than performed",
    "Sometimes opens with the product doing something visually unexpected that makes the viewer ask 'what is that thing?' before any explanation is given",
  ],
  retention_approach:
    "Energetic discovery momentum. She holds the viewer through contagious enthusiasm and rapid transitions between impressive features or use cases. The viewer stays because her genuine excitement creates a sense that there is always one more surprising thing to see. She uses her own reactions as the retention signal: if she is still excited, there must be more worth watching.",
  pacing_signature:
    "Energetic with quick transitions between demonstrations or features. She moves fast but each beat lands because her reactions give the viewer a moment to register each proof point. The speed feels like genuine excitement rather than content compression. Brief moments of wonder or delight create natural micro-pauses within the fast flow.",
  proof_preference: ["live-demonstration", "unexpected-mechanism"],
  objection_style: "practical-demonstration",
  cta_approach: "identity-aligned",
  trust_mechanic: "peer-recommendation",
  visual_tendencies: [
    "Product always shown in the real room where it would be used, surrounded by the normal clutter and context of daily life",
    "Dynamic camera movement that follows the action rather than static product shots, creating an energetic feel",
    "Quick transitions between different use cases or rooms to show the product's versatility in multiple real scenarios",
    "Reaction shots of herself, family members, or pets responding to the product, using genuine reactions as proof of impact",
  ],
  delivery_register: "enthusiastic-discovery",
  category_adaptations: {
    HOME:
      "Shows the product solving a real household annoyance she is experiencing in the moment. Emphasizes the 'why did I not have this sooner' angle. Multiple rooms or use cases demonstrated rapidly to show versatility.",
    KITCHEN:
      "Demonstrates during real food preparation so the product is shown in its actual use context. Emphasizes ease and speed with visible food results. Often shows the cleanup benefit as a secondary hook that adds value.",
    TECH:
      "Leads with the most visually impressive capability and uses her own surprised reaction as the hook. Quickly demonstrates practical daily use cases rather than listing specs. Focuses on what the tech does for her life, not what the tech is.",
    PET:
      "Uses pet reactions as authentic social proof. The pet's genuine engagement with or response to the product is the primary proof mechanism. Shows the product making pet care easier or more enjoyable for both the pet and the owner.",
  },
  anti_patterns: [
    "Never uses scripted-sounding product descriptions or feature lists; all information comes through demonstration and reaction",
    "Avoids measured or deliberate pacing; her authenticity signal is genuine high energy, and slowing down would feel unnatural for her content style",
    "Does not front-load extensive problem framing; gets to the product and the action immediately because the scenario itself establishes the context",
    "Never delivers a calm or clinical review-style verdict; her endorsement is expressed through visible excitement and enthusiasm during use, not through a summary statement",
  ],
};
