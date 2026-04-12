import type { ComplianceRule } from "./wellness";

export const BABY_COMPLIANCE: ComplianceRule = {
  category: "BABY",
  blocked_phrases: [
    {
      phrase: "medically safe",
      reason:
        "Safety certifications require formal testing and regulatory clearance. Unsubstantiated safety claims for baby products carry serious liability.",
      replacement_guidance:
        'Use "meets [specific safety standard]" if verifiable, or "I felt comfortable using this with my baby after researching the materials".',
    },
    {
      phrase: "pediatrician-recommended",
      reason:
        "Requires documented endorsement from a licensed pediatrician. False authority claims are especially harmful in the baby category.",
      replacement_guidance:
        'If genuinely recommended, name the source. Otherwise use "I ran this by our pediatrician before trying it" as personal context.',
    },
    {
      phrase: "prevents illness",
      reason:
        "Disease prevention is a medical claim. No consumer baby product can legally claim to prevent illness.",
      replacement_guidance:
        'Use "supports a healthy routine" or "part of how I keep our space clean for the baby".',
    },
    {
      phrase: "developmental milestone",
      reason:
        "Claiming a product accelerates or ensures developmental milestones is a medical/therapeutic claim and sets dangerous expectations for parents.",
      replacement_guidance:
        'Use "my baby seemed to enjoy engaging with this" or "this kept them entertained during tummy time". Never claim a product causes developmental progress.',
    },
    {
      phrase: "guarantees safety",
      reason:
        "No product can guarantee absolute safety. This claim creates false assurance and serious legal exposure.",
      replacement_guidance:
        'Use "designed with safety features like [specific feature]" or "I appreciated the [specific safety detail]".',
    },
    {
      phrase: "hypoallergenic",
      reason:
        'Unless the product has been clinically tested and certified, "hypoallergenic" is an unsubstantiated claim. Many products labeled this way still cause reactions.',
      replacement_guidance:
        'Use "gentle formula" or "my baby has sensitive skin and didn\'t have a reaction to this, but every baby is different".',
    },
    {
      phrase: "doctor-approved",
      reason:
        "Requires verifiable documentation. Generic doctor approval claims are misleading in the baby category.",
      replacement_guidance:
        'Use "I always check with our doctor before introducing new products" as a responsible framing.',
    },
    {
      phrase: "prevents SIDS",
      reason:
        "SIDS prevention claims are extremely dangerous misinformation. No consumer product can prevent SIDS.",
      replacement_guidance:
        "Never make this claim in any form. Focus on safe sleep practices recommended by the AAP if discussing sleep products.",
    },
  ],
  required_framing: [
    {
      rule: "Always include age-appropriate context for the child shown or referenced.",
      example:
        '"My 8-month-old has been using this for the past month" NOT "Great for babies" without age context.',
    },
    {
      rule: "Frame all observations as parent experience, not clinical assessments.",
      example:
        '"As a mom of two, I noticed my toddler seemed more engaged during playtime with this" NOT "This toy boosts cognitive development".',
    },
    {
      rule: "Lead with safety-first language when discussing any baby product.",
      example:
        '"The first thing I checked was the safety certifications and materials list, and I was happy to see [specific detail]" before discussing benefits.',
    },
    {
      rule: "Acknowledge that every baby is different and what works for one may not work for another.",
      example:
        '"This was a lifesaver for our bedtime routine, but every baby is different so I\'d suggest trying it to see if yours takes to it".',
    },
    {
      rule: "Never position convenience features as safety features.",
      example:
        '"This made feeding time easier for me" NOT "This prevents choking" unless the product has verified anti-choking certification.',
    },
  ],
  disclaimer_requirements: [
    "Every child is different. What worked for my family may not work for yours.",
    "Always consult your pediatrician before introducing new products to your baby's routine, especially for feeding, skincare, or sleep-related items.",
    "This content reflects my personal experience as a parent and is not medical or safety advice.",
    "Always supervise your child when using any new product.",
  ],
};
