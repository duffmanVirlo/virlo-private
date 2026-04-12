import type { CategoryId } from "@/types/classification";

export type CategoryModule = {
  id: CategoryId;
  name: string;
  buyer_psychology: {
    primary_motivation: string;
    purchase_anxiety: string;
    trust_threshold: string;
    impulse_vs_considered: "impulse" | "considered" | "hybrid";
  };
  proof_hierarchy: string[];
  proof_destroyers: string[];
  conversion_patterns: {
    name: string;
    description: string;
    when_to_use: string;
  }[];
  anti_patterns: string[];
  content_rules: string[];
  demonstration_priority: string;
};

export const AUTO_MODULE: CategoryModule = {
  id: "AUTO",
  name: "Auto & Vehicle",
  buyer_psychology: {
    primary_motivation:
      "Utility and protection — buyers want products that genuinely solve a car problem or make maintenance easier, not novelty gadgets.",
    purchase_anxiety:
      "Will this actually work on MY specific vehicle? Fitment, paint compatibility, and real-world durability are top concerns. Buyers fear wasting money on something that looks good in a video but fails in their garage.",
    trust_threshold:
      "High — requires seeing the product used on a real vehicle in a real environment. A single staged or indoor-only demo can lose the buyer entirely. Brand trust transfers from automotive credibility, not influencer status.",
    impulse_vs_considered: "hybrid",
  },
  proof_hierarchy: [
    "live-demonstration on a real vehicle",
    "side-by-side comparison (treated vs untreated, old vs new)",
    "before/after transformation with same camera angle",
    "durability proof over time or stress conditions",
    "multiple vehicle compatibility demonstration",
    "third-party mechanic or detailer endorsement",
  ],
  proof_destroyers: [
    "Staged or obviously fake dirt/damage that gets cleaned too easily",
    "Indoor-only demonstrations with perfect lighting and no road grime",
    "No actual vehicle shown — just product shots or spec readings",
    "Using a brand-new car that doesn't need the product",
    "Filter-enhanced before/after where lighting changes between shots",
    "Claiming universal fit without showing on different vehicle types",
  ],
  conversion_patterns: [
    {
      name: "The Garage Truth",
      description:
        "Start in a real garage or driveway with genuine grime, scratches, or mess. Show the actual problem up close, apply the product with no cuts, and reveal the result in the same shot.",
      when_to_use:
        "Cleaning products, paint correction, detailing supplies, or any product where the transformation is the sell.",
    },
    {
      name: "The Split Test",
      description:
        "Divide a panel, wheel, or surface in half. Treat one side, leave the other. Let the viewer see the difference in a single frame with no camera angle change.",
      when_to_use:
        "Any product where comparison is more convincing than standalone results — coatings, cleaners, protectants, polishes.",
    },
    {
      name: "The Real Problem Solve",
      description:
        "Open with a genuine car frustration the viewer has experienced (dead battery, foggy headlights, messy trunk). Show the product solving it in real time with honest commentary about effort required.",
      when_to_use:
        "Utility accessories, tools, and problem-solving products where the buyer needs to believe the product replaces an expensive shop visit.",
    },
    {
      name: "The Weekend Warrior",
      description:
        "Frame the product as part of a regular weekend car care routine. Show it being used casually alongside other maintenance tasks, normalizing the purchase as something every car owner should have.",
      when_to_use:
        "Recurring-use products like wash supplies, tire care, interior cleaners where repeat purchase is the business model.",
    },
    {
      name: "The Durability Diary",
      description:
        "Show the product applied, then cut to real footage days or weeks later in actual driving conditions — rain, dust, highway miles. Prove it lasts beyond the initial application.",
      when_to_use:
        "Coatings, sealants, protectants, or any product that claims long-term results.",
    },
  ],
  anti_patterns: [
    "Reading product specs or features from the packaging without demonstrating anything",
    "Holding the product next to a car without actually using it",
    "Using phrases like 'game changer' or 'must have' without showing why",
    "Showing only the product and never the vehicle it's meant for",
    "Over-edited transformation videos where lighting changes between before and after",
    "Claiming professional-grade results without showing any actual application process",
    "Using a showroom car that obviously doesn't need the product",
    "Generic enthusiasm with no specific vehicle context — 'this works on everything!'",
  ],
  content_rules: [
    "Always show the product being used on a real vehicle — never just product shots",
    "Include at least one uncut application sequence so viewers see the actual effort required",
    "Never hide drying time, buffing steps, or multiple coats if they're required",
    "Show the vehicle in natural outdoor lighting for final results — not studio or garage-only",
    "If claiming universal fitment, demonstrate on at least two different vehicle types",
    "State the vehicle year/make/model when relevant to fitment",
    "Never claim a product replaces professional service without honest qualification",
  ],
  demonstration_priority:
    "Show the product actively working on a real vehicle in a real garage or driveway setting. The first 3 seconds must establish automotive context — a real car, real dirt, real problem. No product-first intros.",
} as const;
