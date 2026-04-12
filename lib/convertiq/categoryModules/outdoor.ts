import type { CategoryId } from "@/types/classification";
import type { CategoryModule } from "./auto";

export const OUTDOOR_MODULE: CategoryModule = {
  id: "OUTDOOR",
  name: "Outdoor & Adventure",
  buyer_psychology: {
    primary_motivation:
      "Durability confidence — outdoor buyers need to trust that a product will perform in real conditions: rain, dirt, heat, cold, rough terrain. They buy gear they can depend on when comfort and safety matter.",
    purchase_anxiety:
      "Will this hold up in actual outdoor conditions, or is it a cheap product that only looks rugged? Buyers fear gear failure at the worst possible moment — a broken tent pole in a storm, a dead headlamp on a trail.",
    trust_threshold:
      "High — requires real outdoor environment footage showing the product handling genuine conditions. Clean, indoor, or staged outdoor demos fail to build the durability trust this buyer requires.",
    impulse_vs_considered: "considered",
  },
  proof_hierarchy: [
    "real-environment demonstration in actual outdoor conditions",
    "durability or stress test — rain, impact, weight, temperature",
    "portability and packability proof — size, weight, setup time",
    "comparison with existing gear or alternative",
    "long-term use evidence across multiple trips or seasons",
  ],
  proof_destroyers: [
    "Indoor-only demonstrations of outdoor products",
    "Clean, staged 'outdoor' settings with no real weather or terrain",
    "No real conditions shown — everything looks like a product photo shoot",
    "Claiming 'waterproof' or 'unbreakable' without testing those claims on camera",
    "Backyard demos presented as wilderness use",
  ],
  conversion_patterns: [
    {
      name: "The Field Test",
      description:
        "Take the product into real outdoor conditions — actual rain, actual trail, actual campsite — and show it performing. Genuine environment footage is the single most powerful proof for outdoor gear.",
      when_to_use:
        "All outdoor products — camping gear, hiking tools, garden equipment, sports accessories.",
    },
    {
      name: "The Pack and Go",
      description:
        "Show the full portability story — how it packs down, how much it weighs in your pack, how quickly it sets up in the field. For outdoor buyers, packability often decides the purchase.",
      when_to_use:
        "Portable gear — tents, chairs, stoves, tools, bags — anything where size and weight matter.",
    },
    {
      name: "The Conditions Test",
      description:
        "Deliberately test the product in adverse conditions — pour water on it, load it past spec, leave it in sun or cold. Proving it survives the hard test makes everyday use feel guaranteed.",
      when_to_use:
        "Products claiming weather resistance, durability, or heavy-duty performance.",
    },
  ],
  anti_patterns: [
    "Unboxing outdoor products indoors and never going outside",
    "Using product in a clean backyard and calling it 'outdoor testing'",
    "Listing durability specs without visually testing any of them",
    "Showing the product in packaging only with no environment context",
    "Claiming 'adventure ready' while filming in a living room",
  ],
  content_rules: [
    "Always show the product in a real outdoor environment — trail, campsite, garden, field",
    "If claiming weather resistance, demonstrate it in actual weather conditions",
    "Show setup and takedown time in real-time or clearly stated timeframes",
    "Include size and weight references so viewers can assess packability",
    "Demonstrate in conditions that match the product's intended use case",
    "Be honest about limitations — what conditions or uses the product is NOT suited for",
  ],
  demonstration_priority:
    "Real outdoor conditions showing durability and function. The first shot should place the product in a genuine outdoor environment — dirt, weather, terrain — and show it performing under real conditions, not studio approximations.",
} as const;
