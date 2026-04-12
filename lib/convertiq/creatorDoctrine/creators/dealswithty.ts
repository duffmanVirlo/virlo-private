import type { CategoryId } from "@/types/classification";
import type { ProofType } from "@/types/analysis";
import type { CreatorPatternProfile } from "./belush";

export const DEALSWITHTY_PROFILE: CreatorPatternProfile = {
  creator_id: "dealswithty",
  handle: "@dealswithty",
  primary_category_strength: ["HOME", "KITCHEN", "TECH", "AUTO"],
  hook_archetype: "disbelief-reveal",
  hook_mechanics: [
    "Opens with the price or deal as the hook itself, using the gap between expected price and actual price to create immediate curiosity",
    "Shows the product doing something visually surprising or impressive in the first two seconds before any explanation",
    "Uses rapid unboxing energy where the product is already being torn open as the video starts, signaling urgency and excitement",
    "Anchors against a higher-priced alternative immediately so the viewer frames the deal as a steal from the first moment",
  ],
  retention_approach:
    "Fast-paced proof stacking with escalation. She holds the viewer by rapidly demonstrating multiple impressive capabilities of the product, each one more surprising than the last. The viewer stays because each proof point raises the question 'what else does it do?' She uses sheer volume of proof delivered at speed to maintain engagement.",
  pacing_signature:
    "High energy and fast throughout. Cuts are quick, demonstrations are rapid, and she moves between proof points without lingering. The pacing matches the deal-finding persona: someone who has found something great and is excitedly showing everything about it before the viewer can look away. Brief pauses only at peak moments of proof for emphasis.",
  proof_preference: ["live-demonstration", "quantity-scale"],
  objection_style: "practical-demonstration",
  cta_approach: "scarcity-earned",
  trust_mechanic: "casual-authority",
  visual_tendencies: [
    "Product shown in the real environment where it will be used: kitchen counter, garage, car interior, living room",
    "Multiple quick demonstrations back-to-back showing different use cases and features",
    "Price tags, deal comparisons, or discount codes shown on screen as visual proof of the value proposition",
    "Hands-on interaction throughout: she is always touching, using, or testing the product rather than just talking about it",
  ],
  delivery_register: "enthusiastic-discovery",
  category_adaptations: {
    HOME:
      "Demonstrates multiple use cases for the same product throughout the home. Emphasizes the 'I did not know I needed this' discovery angle. Shows the product solving real household problems one after another.",
    KITCHEN:
      "Focuses on the product making cooking easier or faster with real food demonstrations. Shows the cleanup or convenience factor as a secondary proof point. The kitchen counter is always visible to ground the demo.",
    TECH:
      "Leads with the most impressive feature first, then reveals additional capabilities as escalation. Compares against the better-known or more expensive alternative to anchor the value proposition.",
    AUTO:
      "Demonstrates in or on a real vehicle. Shows the installation or setup process to prove it is easy, then demonstrates the result. Often uses a before-during-after visual flow specific to car-related products.",
  },
  anti_patterns: [
    "Never presents a product without demonstrating it live; all claims are backed by visible action",
    "Avoids slow buildups or extensive problem framing; gets to the product and proof immediately",
    "Does not use calm or measured delivery; her authenticity signal is genuine high energy, and dialing it down would feel scripted",
    "Never presents a deal without visible proof of the value: the original price, the comparison product, or the discount must be on screen",
  ],
};
