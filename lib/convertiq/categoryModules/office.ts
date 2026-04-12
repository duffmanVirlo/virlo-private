import type { CategoryId } from "@/types/classification";
import type { CategoryModule } from "./auto";

export const OFFICE_MODULE: CategoryModule = {
  id: "OFFICE",
  name: "Office & Productivity",
  buyer_psychology: {
    primary_motivation:
      "Productivity and comfort improvement — buyers want products that reduce friction in their daily work, whether that means a cleaner desk, better posture, or a smoother workflow. The purchase is justified by daily utility.",
    purchase_anxiety:
      "Will this actually improve my workflow, or will it sit on my desk unused after a week? Buyers worry about desk space, compatibility with their existing setup, and whether the improvement is meaningful enough to justify the cost.",
    trust_threshold:
      "Moderate — requires seeing the product in a real, lived-in workspace solving a genuine workflow problem. Perfectly clean desk setups feel aspirational but unrelatable. Credibility comes from integration into a real work context.",
    impulse_vs_considered: "hybrid",
  },
  proof_hierarchy: [
    "utility demonstration solving a real workflow friction",
    "before/after desk or workspace setup comparison",
    "workflow improvement — showing tasks completed faster or more comfortably",
    "ergonomic benefit demonstration with real use context",
    "size and compatibility proof with common desk setups",
  ],
  proof_destroyers: [
    "Perfectly staged 'clean desk' that no one actually works at",
    "No real work context — product shown on an empty desk with nothing else",
    "Ignoring desk size reality — product shown with unlimited space",
    "Claiming productivity improvement with no demonstration of how",
    "Focusing on aesthetics over function — style without substance",
  ],
  conversion_patterns: [
    {
      name: "The Workflow Fix",
      description:
        "Show a specific daily friction point — tangled cables, uncomfortable posture, cluttered desk — and demonstrate how the product eliminates it. The before/after should feel like a daily life upgrade.",
      when_to_use:
        "Cable management, ergonomic tools, desk organizers, monitor stands — products that solve visible workspace problems.",
    },
    {
      name: "The Real Desk Integration",
      description:
        "Show the product on your actual desk alongside your real equipment. Viewers need to see it fitting into a workspace that has a monitor, keyboard, coffee mug, and the normal clutter of work.",
      when_to_use:
        "Any desk product where fitment and space compatibility matter — stands, organizers, lighting, accessories.",
    },
    {
      name: "The All-Day Test",
      description:
        "Use the product through a full work session and report on comfort, utility, and whether it made a real difference by end of day. Long-form proof of daily utility converts office buyers.",
      when_to_use:
        "Ergonomic products — chairs, wrist rests, standing desk converters, monitor arms — where comfort over time is the sell.",
    },
  ],
  anti_patterns: [
    "Showing products on a catalog-perfect desk with no signs of real work",
    "Listing product dimensions without showing it next to real desk items for scale",
    "Claiming ergonomic benefits without showing actual use during work",
    "Presenting a complete desk makeover when the viewer is buying one item",
    "Using productivity buzzwords without showing any actual workflow improvement",
  ],
  content_rules: [
    "Show the product in a real workspace with genuine work context — laptop, papers, coffee",
    "Include size reference by showing the product alongside common desk items",
    "If claiming ergonomic benefit, demonstrate proper use and explain the improvement",
    "Show the product from the user's perspective — the angle they'd actually see it from while working",
    "Be honest about desk space requirements and compatibility limitations",
    "Include installation or setup footage if the product requires assembly",
  ],
  demonstration_priority:
    "Real workspace integration showing actual productivity or comfort impact. The first shot should be the product solving a real problem on a real desk — not a minimalist setup, but a workspace that looks like someone actually works there.",
} as const;
