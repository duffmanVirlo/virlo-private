import type { CategoryId } from "@/types/classification";
import type { CategoryModule } from "./auto";

export const FASHION_MODULE: CategoryModule = {
  id: "FASHION",
  name: "Fashion & Apparel",
  buyer_psychology: {
    primary_motivation:
      "Fit confidence — buyers want to know how a piece looks and fits on a real body similar to theirs, not on a model. The purchase decision hinges on believing it will look that good on them.",
    purchase_anxiety:
      "Will this fit MY body type? Will the sizing be accurate? Will the fabric feel cheap in person? Returns are a hassle, so buyers need maximum confidence before purchasing clothing online.",
    trust_threshold:
      "Moderate — requires honest try-on with real commentary about fit, sizing, and fabric quality. Glamour-shot-only content feels aspirational but doesn't convert because it doesn't answer fit questions.",
    impulse_vs_considered: "hybrid",
  },
  proof_hierarchy: [
    "try-on demonstration with honest fit commentary",
    "fit comparison across body types or sizes",
    "styling context — how it works in a real outfit",
    "fabric and quality close-up",
    "movement test — sitting, bending, walking",
    "size reference — stating height, weight, or size worn",
  ],
  proof_destroyers: [
    "Showing the garment only on one body type with no size context",
    "Ignoring sizing entirely — no mention of what size was ordered or fit accuracy",
    "Glamour shots only with no real-world try-on or movement",
    "Heavy filtering that obscures true color and fabric texture",
    "Posing in ways that hide how the garment actually fits when standing naturally",
  ],
  conversion_patterns: [
    {
      name: "The Honest Try-On",
      description:
        "Put the garment on camera, stand naturally, and give honest commentary on fit, comfort, and where it runs true/large/small. Include your size, height, and what you typically wear for reference.",
      when_to_use:
        "All clothing and shapewear — the core conversion pattern for fashion content.",
    },
    {
      name: "The Movement Test",
      description:
        "Show the garment in motion — walking, sitting, bending, reaching. Viewers need to see how it behaves in real life, not just in a posed photo.",
      when_to_use:
        "Activewear, shapewear, dresses, workwear — anything where fit during movement matters.",
    },
    {
      name: "The Style Build",
      description:
        "Show 2-3 different outfits built around the single product. Demonstrate versatility by pairing it with items the viewer likely already owns.",
      when_to_use:
        "Versatile basics, statement pieces, shoes, accessories — products that benefit from styling inspiration.",
    },
  ],
  anti_patterns: [
    "Holding up the garment without ever putting it on",
    "Showing only posed, filtered photos instead of real try-on video",
    "Never mentioning what size you're wearing or your body measurements",
    "Saying 'so flattering' without showing how or why it flatters",
    "Only showing front-facing views — never side, back, or seated",
  ],
  content_rules: [
    "Always state the size worn and at least one body reference point (height or typical size)",
    "Show the garment from multiple angles — front, side, and back minimum",
    "Include at least one movement shot to show real-world fit behavior",
    "Show the fabric up close so viewers can assess quality and texture",
    "If the product is shapewear or compression, show realistic before and with-product comparison",
    "Never rely on posing alone — stand naturally for at least one shot",
  ],
  demonstration_priority:
    "Real try-on with honest fit commentary. The first few seconds should show the garment on a real body with natural posture and immediate commentary about how it fits, feels, and where it runs true or off.",
} as const;
