export type DeliveryRegister = {
  id: string;
  name: string;
  tone: string;
  pacing: string;
  energy: string;
  best_for_modality: string[];
  category_affinity: string[] | "all";
};

export const DELIVERY_REGISTERS: DeliveryRegister[] = [
  {
    id: "casual-direct",
    name: "Casual Direct",
    tone:
      "Conversational and straightforward, as if talking to a friend who asked for a recommendation. No performance energy, no forced enthusiasm. The creator speaks in their natural register with the confidence of someone sharing a genuine opinion, not delivering a script.",
    pacing:
      "Moderate and natural with no rush to fit in talking points. Pauses where a normal person would pause to think. Sentences are short and declarative. The pacing feels like a real conversation, not a rehearsed monologue.",
    energy:
      "Low to moderate. The energy comes from conviction rather than excitement. The creator sounds like they mean what they say, not like they are trying to generate enthusiasm. Moments of emphasis are natural spikes, not sustained hype.",
    best_for_modality: [
      "creator-to-camera",
      "voiceover-led",
      "routine-integration",
    ],
    category_affinity: "all",
  },
  {
    id: "enthusiastic-discovery",
    name: "Enthusiastic Discovery",
    tone:
      "Genuinely excited and slightly surprised, as if the creator just found something unexpectedly good and cannot wait to share it. The enthusiasm is specific to this product, not a baseline energy level. The excitement should feel like it was triggered by the product experience, not manufactured for the camera.",
    pacing:
      "Fast but not frantic. Sentences tumble into each other naturally as the creator tries to get all the good parts out. Occasional self-interruptions where they pivot to an even more exciting detail. The speed feels like genuine excitement, not scripted rapid-fire delivery.",
    energy:
      "High and infectious. The creator's energy makes the viewer curious about what could generate this level of genuine excitement. The energy peaks during demonstration moments and dips slightly during explanation, creating a natural wave rather than a flat wall of hype.",
    best_for_modality: [
      "creator-to-camera",
      "demo-first",
      "voiceover-led",
    ],
    category_affinity: [
      "HOME",
      "KITCHEN",
      "TECH",
      "PET",
      "FASHION",
      "BABY",
    ],
  },
  {
    id: "calm-authority",
    name: "Calm Authority",
    tone:
      "Measured and confident, as if the creator has tested many products in this category and is sharing their informed conclusion. There is no salesmanship in the delivery. The tone suggests that the creator does not need the viewer to buy this; they are simply sharing what they found after thorough evaluation.",
    pacing:
      "Deliberate and unhurried. Each point is given space to land before moving to the next. The creator does not rush because they are confident in the quality of their information. Pauses are used strategically to let key findings sink in.",
    energy:
      "Low and steady. The restrained energy signals expertise and seriousness. When the creator does show a flash of genuine appreciation for the product, it carries more weight because it contrasts with their baseline composure. The viewer interprets the restraint as credibility.",
    best_for_modality: [
      "creator-to-camera",
      "voiceover-led",
      "comparison-led",
    ],
    category_affinity: [
      "AUTO",
      "TECH",
      "OUTDOOR",
      "FITNESS",
      "WELLNESS",
      "OFFICE",
    ],
  },
];
