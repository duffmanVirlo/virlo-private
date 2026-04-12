import type { CategoryId } from "@/types/classification";
import type { CategoryModule } from "./auto";

export const TECH_MODULE: CategoryModule = {
  id: "TECH",
  name: "Tech & Electronics",
  buyer_psychology: {
    primary_motivation:
      "Capability discovery — buyers want to see a gadget do something unexpected or impressive that solves a real problem. The 'wow, I didn't know that existed' moment drives purchases.",
    purchase_anxiety:
      "Does it actually do what it claims, or is this another cheap gadget that breaks in a week? Buyers fear exaggerated specs, compatibility issues, and the 'cool for 5 minutes then useless' trap.",
    trust_threshold:
      "High — requires live, uncut demonstration of the core capability. Spec-reading and box-showing kill trust instantly. Credibility comes from showing the product doing the thing, not talking about it doing the thing.",
    impulse_vs_considered: "impulse",
  },
  proof_hierarchy: [
    "live demonstration of the unexpected capability",
    "mechanism reveal — showing how/why it works",
    "comparison with existing solution or competitor",
    "real-world context use (not just desk/studio demo)",
    "durability or longevity proof",
    "compatibility demonstration across devices",
  ],
  proof_destroyers: [
    "Reading specs from the box or listing without showing anything",
    "Showing the packaging/unboxing without demonstrating the product",
    "Studio-only demos that don't reflect real-world use",
    "Over-claiming capabilities the product clearly can't deliver",
    "Using tech jargon without showing what it means in practice",
    "Obvious paid promotion energy — 'the brand sent me this and it's AMAZING'",
  ],
  conversion_patterns: [
    {
      name: "The Capability Reveal",
      description:
        "Open with the product doing its most impressive or unexpected thing — no buildup, no unboxing. Let the capability itself be the hook, then explain what it is and how it works.",
      when_to_use:
        "Any gadget where the core function is visually impressive or surprising — portable projectors, magnetic mounts, camera accessories, smart devices.",
    },
    {
      name: "The Problem Swap",
      description:
        "Show the annoying way you currently solve a problem (tangled cables, bad phone mount, weak flashlight), then show this product replacing that frustration in one step.",
      when_to_use:
        "Utility tech and accessories where the buyer already owns an inferior solution — chargers, adapters, mounts, organizers.",
    },
    {
      name: "The Stress Test",
      description:
        "Push the product beyond normal use — drop it, use it in rain, test battery at max load, bend the cable. Show that it handles real-world abuse, not just gentle studio conditions.",
      when_to_use:
        "Products where durability is a key concern — cables, cases, portable chargers, outdoor tech.",
    },
    {
      name: "The One Feature Focus",
      description:
        "Instead of listing every feature, choose the single most compelling one and demonstrate it thoroughly. Depth on one capability converts better than breadth across many.",
      when_to_use:
        "Multi-feature products where the full feature list would feel like a spec sheet — smart home devices, multi-tools, apps.",
    },
    {
      name: "The Ecosystem Fit",
      description:
        "Show how the product integrates into a real setup — your desk, your car, your bag. Demonstrate it working alongside other devices the viewer likely already owns.",
      when_to_use:
        "Accessories and peripherals that need to fit into an existing tech ecosystem — phone accessories, desk tools, car tech.",
    },
  ],
  anti_patterns: [
    "Spending the first 15 seconds on unboxing and packaging instead of the product",
    "Reading the Amazon listing or spec sheet on camera",
    "Saying 'this is a game changer' without demonstrating why",
    "Showing the product sitting on a desk without using it",
    "Generic tech reviewer tone — 'let's see what we got here, guys'",
    "Listing features without demonstrating any of them",
    "Claiming 'best I've ever used' with no comparison or context",
    "Using sponsored-content language that signals paid promotion over genuine use",
  ],
  content_rules: [
    "Lead with the capability in action — never open with product packaging or branding",
    "Show the product being used, not just held or displayed",
    "Demonstrate at least one real-world use scenario outside a clean desk setup",
    "If claiming compatibility, show it working with at least two different devices",
    "Never list more than 3 features — demonstrate the best one deeply instead",
    "Include honest commentary about any limitations or trade-offs",
    "Show scale reference — the product in hand, next to a phone, on a desk — so viewers understand size",
  ],
  demonstration_priority:
    "Show the product's most unexpected or impressive capability in action within the first 2 seconds. The viewer should see what the product does before they know what the product is. Capability first, explanation second.",
} as const;
