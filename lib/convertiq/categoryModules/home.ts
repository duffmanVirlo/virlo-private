import type { CategoryId } from "@/types/classification";
import type { CategoryModule } from "./auto";

export const HOME_MODULE: CategoryModule = {
  id: "HOME",
  name: "Home & Cleaning",
  buyer_psychology: {
    primary_motivation:
      "Transformation satisfaction — buyers want to see a real mess become clean, a chaotic space become organized. The visual payoff of before/after is the primary emotional driver. Secondary motivation is solving a specific cleaning or organization pain point.",
    purchase_anxiety:
      "Will this work on MY type of mess? Buyers worry that the demo mess is staged, the product only works in ideal conditions, or the transformation requires more effort than shown. Scale anxiety is real — 'my mess is worse than that.'",
    trust_threshold:
      "Moderate — requires showing a genuinely messy starting point and the real process of transformation. Skipping the work or using obviously staged messes destroys trust. Credibility comes from showing the effort, not just the result.",
    impulse_vs_considered: "impulse",
  },
  proof_hierarchy: [
    "before/after transformation with continuous demonstration",
    "live cleanup showing the actual process and effort required",
    "scale proof — handling a mess bigger than the viewer expects",
    "comparison with alternative methods (paper towels vs this, old organizer vs this)",
    "durability of the clean — showing it still works days or weeks later",
    "multi-use versatility demonstration across different surfaces or rooms",
  ],
  proof_destroyers: [
    "Obviously staged messes that look placed rather than accumulated naturally",
    "Skipping the actual cleaning process — showing only before and after with a jump cut",
    "Unrealistic scenarios no real home would have — like a perfectly dirty kitchen",
    "Using the product on an already-clean surface where it can't show real improvement",
    "Failing to show the scale of what the product can handle",
    "Perfect 'after' shots that look like a different room or location entirely",
  ],
  conversion_patterns: [
    {
      name: "The Real Mess",
      description:
        "Start with a genuinely dirty, cluttered, or messy space — the kind viewers recognize from their own homes. No staging. Show the product tackling the mess from start to finish in a single location.",
      when_to_use:
        "Cleaning products, stain removers, pressure washers, organizational tools — anything where the transformation is the core value.",
    },
    {
      name: "The Satisfying Process",
      description:
        "Focus on the process itself as visual content — the scrubbing, the organizing, the transformation happening in real time. Home content thrives on satisfaction, and the process is often more engaging than the result.",
      when_to_use:
        "Visually satisfying products — steam cleaners, power washers, organizational bins, label makers, vacuum cleaners.",
    },
    {
      name: "The Scale Escalation",
      description:
        "Start with a normal mess, show the product handling it easily, then escalate to a much bigger or tougher challenge. Proving it handles the hard stuff makes the everyday use feel effortless.",
      when_to_use:
        "Products with broad capability — multi-surface cleaners, heavy-duty tools, large-capacity organizers.",
    },
    {
      name: "The Hidden Nightmare",
      description:
        "Reveal a mess the viewer didn't know existed — behind the fridge, inside the dryer vent, under the sink, inside a couch cushion. The shock of the hidden mess creates urgency to buy.",
      when_to_use:
        "Deep-cleaning tools, specialized cleaners, products that address problems people forget about or avoid.",
    },
    {
      name: "The System Setup",
      description:
        "Show how an organizational product creates a complete system — not just one bin, but a whole drawer, closet, or pantry transformation. The system thinking inspires viewers to commit to the full solution.",
      when_to_use:
        "Organizational products, storage solutions, pantry systems, closet tools, label makers.",
    },
  ],
  anti_patterns: [
    "Using a mess that looks carefully placed or arranged for the camera",
    "Jump-cutting from before to after without showing any of the actual work",
    "Demonstrating on an already-clean surface to show how 'easy' it is",
    "Claiming 'effortless' cleaning while visibly scrubbing hard",
    "Showing only one tiny area when the product claims to handle large spaces",
    "Using perfect ASMR audio that makes the demo feel staged rather than real",
    "Claiming a product replaces all other cleaning products without demonstrating versatility",
    "Showing the product in a home that looks like a catalog — viewers need to see real lived-in spaces",
  ],
  content_rules: [
    "Start with a genuinely messy before state — the worse it looks, the better the transformation sells",
    "Show the actual process, not just before and after — viewers want to see the work happening",
    "Use the same camera angle for before and after shots so the transformation is undeniable",
    "Include effort transparency — if it takes 3 applications, show that, don't pretend one pass does it",
    "Demonstrate on real household surfaces and materials, not display items",
    "Show scale clearly — how much surface area, how many items organized, how big the mess was",
    "If the product requires refills, replacement parts, or consumables, mention that honestly",
  ],
  demonstration_priority:
    "Real mess to real clean in continuous footage. The first shot must be a genuinely dirty, cluttered, or disorganized space that viewers recognize from their own lives. Then show the product transforming it with visible, satisfying progress.",
} as const;
