import type { CategoryId } from "@/types/classification";
import type { CategoryModule } from "./auto";

export const KITCHEN_MODULE: CategoryModule = {
  id: "KITCHEN",
  name: "Kitchen & Cooking",
  buyer_psychology: {
    primary_motivation:
      "Result-driven simplicity — buyers want to see delicious food made easier or better with this product. The food result is the proof. If the food looks good, the product sells itself.",
    purchase_anxiety:
      "Will this actually make cooking easier or just take up counter space? Buyers fear kitchen gadgets that seem useful in demos but gather dust. They need to believe the product fits their skill level and kitchen size.",
    trust_threshold:
      "Moderate — the food result carries most of the trust burden. If the end result looks genuinely appetizing and the process looks achievable, buyers convert. Overly complex demos or restaurant-quality expectations backfire.",
    impulse_vs_considered: "impulse",
  },
  proof_hierarchy: [
    "food result — close-up, appetizing, clearly made with this product",
    "process demonstration showing ease of use",
    "time comparison with traditional method",
    "cleanup and storage convenience",
    "versatility across different recipes or foods",
  ],
  proof_destroyers: [
    "Skipping the cooking entirely — showing only the gadget without food",
    "Unrealistic kitchen setup that doesn't look like a real home",
    "No appetizing food close-up at the end — missing the money shot",
    "Over-complicated recipes that make the product seem hard to use",
    "Clearly pre-made food passed off as just-cooked with the product",
  ],
  conversion_patterns: [
    {
      name: "The Money Shot First",
      description:
        "Open with a close-up of the finished food — golden, steaming, appetizing. Then rewind to show how the product made it happen. The food result hooks; the process converts.",
      when_to_use:
        "Appliances, cookware, air fryers, grills — any product where the food result is visually compelling.",
    },
    {
      name: "The Time Race",
      description:
        "Show a split-screen or sequential comparison: the old way takes 30 minutes, this product does it in 10. Concrete time savings make the value proposition undeniable.",
      when_to_use:
        "Time-saving appliances and tools — instant pots, choppers, peelers, prep tools.",
    },
    {
      name: "The Everyday Meal",
      description:
        "Show the product making a simple, everyday meal the viewer already cooks — not a gourmet showpiece. Proving it improves Tuesday night dinner converts better than an elaborate weekend recipe.",
      when_to_use:
        "Versatile kitchen tools and appliances aimed at home cooks, not food enthusiasts.",
    },
  ],
  anti_patterns: [
    "Showing the product on a counter without ever cooking anything",
    "Using restaurant-quality plating that makes the viewer feel inadequate",
    "Focusing entirely on features and specs instead of food results",
    "Claiming 'so easy' while the demo shows multiple complex steps",
    "No food close-up at the end of the video — the biggest missed opportunity in kitchen content",
  ],
  content_rules: [
    "Always end with an appetizing close-up of the finished food — this is non-negotiable",
    "Show the entire cooking process from prep to plate, even if time-lapsed",
    "Demonstrate in a real kitchen — not a studio or commercial kitchen setup",
    "If the product saves time, show or state the actual time comparison",
    "Include cleanup — showing that the product is easy to wash builds purchase confidence",
    "Use recipes that match the skill level of the target buyer, not aspirational cooking",
  ],
  demonstration_priority:
    "The food result is the hero. Open with or quickly reach a close-up of appetizing, clearly-homemade food that was prepared using this product. The viewer should be hungry before they know what the product is.",
} as const;
