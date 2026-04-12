import type { CategoryId } from "@/types/classification";
import type { CategoryModule } from "./auto";

export const BABY_MODULE: CategoryModule = {
  id: "BABY",
  name: "Baby & Parenting",
  buyer_psychology: {
    primary_motivation:
      "Safety and parental reassurance — parents buy baby products to protect their child and alleviate their own anxiety. Social proof from other parents with same-age children is the strongest motivator.",
    purchase_anxiety:
      "Is this safe for my baby's age and stage? Parents fear choking hazards, harmful materials, age-inappropriate features, and products that could injure their child. Guilt compounds every purchase decision.",
    trust_threshold:
      "Very high — safety must be established before any other selling point. Parents need to see age-appropriate demonstration, ingredient/material transparency, and testimony from parents with children at the same developmental stage.",
    impulse_vs_considered: "considered",
  },
  proof_hierarchy: [
    "safety evidence — certifications, materials, age appropriateness",
    "parent testimony with specific child age and developmental context",
    "gentle demonstration showing safe, appropriate use",
    "pediatrician or expert mention",
    "longevity proof — how it grows with the child or lasts through stages",
  ],
  proof_destroyers: [
    "Ignoring age appropriateness entirely — no mention of what age range the product suits",
    "Making medical claims about infant health, development, or milestones",
    "Dismissing legitimate parent safety concerns as overreacting",
    "Showing a product used in an unsafe manner — even briefly",
    "Using adult-centric framing focused on parent convenience over child safety",
  ],
  conversion_patterns: [
    {
      name: "The Safety-First Open",
      description:
        "Lead with the safety angle — materials, certifications, age range, how it was designed with safety in mind. Parents need safety confidence before they can consider any other feature.",
      when_to_use:
        "All baby products — especially feeding items, sleep products, toys, and anything the baby touches or ingests.",
    },
    {
      name: "The Parent-to-Parent",
      description:
        "Speak as one parent to another — share the specific problem this solved at your child's age and stage. Include developmental context that helps parents of similar-age children self-identify.",
      when_to_use:
        "Stage-specific products — teething solutions, sleep aids, feeding transitions, milestone tools.",
    },
    {
      name: "The Gentle Demo",
      description:
        "Show the product being used gently and safely with a real baby or toddler. The demonstration should feel calm and natural, never forced or performative.",
      when_to_use:
        "Products where seeing safe use is the primary trust-builder — feeding tools, bath products, play items.",
    },
  ],
  anti_patterns: [
    "Showing a product without mentioning the appropriate age range",
    "Making developmental milestone claims — 'this will help your baby walk faster'",
    "Using high-energy sales tactics that feel inappropriate for baby products",
    "Showing only the product without any baby interaction or safe-use context",
    "Ignoring safety certifications and material composition",
  ],
  content_rules: [
    "Always state the age range the product is appropriate for within the first 10 seconds",
    "Never make medical, developmental, or milestone claims about baby products",
    "Show safe, gentle use — never demonstrate a product in a way that could be replicated unsafely",
    "Mention materials, certifications, or safety testing when relevant",
    "Include your child's age and stage to help parents self-select",
    "Frame benefits around child safety and comfort first, parent convenience second",
  ],
  demonstration_priority:
    "Safe, gentle use with clear age-appropriate context. The first moment should establish that this product is safe for the specific age range, then show it being used calmly and naturally with a real child.",
} as const;
