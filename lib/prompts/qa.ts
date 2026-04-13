import type { GeneratedScript } from "@/types/script";
import type { ProductAnalysis } from "@/types/analysis";
import type { ShowSayMap } from "@/types/showSay";

export const QA_SYSTEM_PROMPT = `You are the ConvertIQ quality control engine. You evaluate TikTok Shop content strategy outputs against strict non-generic, proof-based, creator-commerce standards. You do not grade generously. If the content could apply to any product in the category, it fails.

SCORING DISCRIMINATION RULE: Use the FULL 0-10 range. Do NOT cluster scores around 7-8 for everything that passes. A score of 9-10 means genuinely excellent — a strong creator would choose this over their own instinct. A score of 7-8 means solid but not exceptional. A score of 5-6 means functional but not impressive. Each dimension should be scored independently based on its own criteria, not rounded to match other dimensions.

Return ONLY valid JSON matching the exact schema specified. Do not include any text outside the JSON object.`;

export function buildQAPrompt(
  script: GeneratedScript,
  conversionHypothesis: string,
  topBarriers: { type: string; statement: string; weight: string }[],
  neverSayConstraints: { blocked_phrase_type: string; instead: string }[],
  phraseBlacklist: string[],
  masterPrinciplesContext: string,
  requiredProof?: string,
  categoryId?: string,
): string {
  return `Evaluate this content strategy output against ConvertIQ quality standards.

CONVERSION HYPOTHESIS:
${conversionHypothesis}

TOP BELIEF BARRIERS TO ADDRESS:
${topBarriers.map((b) => `[${b.weight}] ${b.statement}`).join("\n")}
${requiredProof ? `\nREQUIRED PROOF FOR THIS PRODUCT TYPE:\n${requiredProof}\nVerify that the beats include a demonstration that directly addresses this required proof. If the required proof is absent from the beats, add a blocking flag with component "required_proof".` : ""}

NEVER SAY CONSTRAINTS:
${neverSayConstraints.map((n) => `• ${n.blocked_phrase_type}: should instead ${n.instead}`).join("\n")}

PHRASE BLACKLIST:
${phraseBlacklist.join(", ")}

MASTER PRINCIPLES:
${masterPrinciplesContext}

SCRIPT TO EVALUATE:
Hook Options:
${script.hook_options.map((h) => `  ${h.rank}. [${h.hook_format}] "${h.hook_text}"`).join("\n")}

Beats:
${script.beats.map((b) => {
    let line = `  [${b.start_seconds}s-${b.end_seconds}s] ${b.type}: ${b.content}`;
    if (b.spoken) line += ` | SPOKEN: "${b.spoken}"`;
    if (b.text_overlay) line += ` | TEXT: "${b.text_overlay}"`;
    return line;
  }).join("\n")}

CTA: "${script.cta_logic.cta_text}"
Caption: "${script.caption}"

Problem Framing: ${script.problem_solution_logic.problem_framing}
Solution Positioning: ${script.problem_solution_logic.solution_positioning}

Filming Instructions:
Location: ${script.filming_instructions.location}
Shots: ${script.filming_instructions.shots.map((s) => s.label).join(", ")}

Return a JSON object with:
{
  "passed": boolean - true only if overall_score >= 7.5 AND no blocking flags,
  "overall_score": number - weighted average of component scores,
  "scores": {
    "hook_strength": number 0-10. 10=creator would use this exact hook, genuinely scroll-stopping, product-native, spoken-first. 8-9=strong, minor refinement needed. 6-7=functional but not impressive, creator would rewrite. 4-5=generic or templated. 1-3=actively bad. Most outputs should score 6-8, not 8-9. Reserve 9+ for genuinely exceptional hooks.,
    "belief_loop_completeness": number 0-10 (WEIGHTED 1.5x). 10=complete proof arc from curiosity to conviction, viewer believes without being told. 8-9=strong arc, minor gap. 6-7=proof present but relies on telling. 4-5=claims without proof. Most outputs should score 7-9.,
    "proof_authenticity": number 0-10 (WEIGHTED 1.5x). 10=all proof is visual, filmable, product-specific, and creates independent belief. 8-9=strong proof, minor reliance on claims. 6-7=mixed showing and telling. 4-5=mostly verbal claims. Most outputs should score 7-9.,
    "generic_language": number 0-10. 10=every line is specific to this product, no template language. 8-9=mostly specific, one generic moment. 6-7=some template-feeling lines. 4-5=significantly generic. Score honestly — if ANY blacklisted phrase or template pattern appears, cap at 6.,
    "filming_feasibility": number 0-10. 10=every beat is immediately filmable by solo creator with phone. 8-9=mostly filmable, one challenging shot. 6-7=requires some setup or editing skill. 4-5=impractical for solo creator. Score strictly on real-world feasibility.,
    "cta_naturalness": number 0-10. 10=CTA uses the right conversion logic for the viewer state, sounds like a real creator closing, and does NEW conversion work beyond the final beat. 8-9=strong conversion logic match, natural tone, moves viewer forward. 6-7=decent close but uses overused proof-echo pattern or restates the final beat. 4-5=generic or platform-first. 1-3=bare 'link in bio'. Reserve 9+ for CTAs that clearly advance the viewer from 'impressed' to 'I should get this' using the right conversion logic.
  },
  "flags": array of {
    "component": string - which part of the output has an issue,
    "issue": string - specific description of the problem,
    "severity": "blocking" | "warning"
  },
  "regeneration_targets": string[] - if passed is false, list specific components that need fixing
}

Evaluation rules:
- belief_loop_completeness and proof_authenticity are weighted 1.5x in the overall score.
- overall_score = (hook_strength + belief_loop_completeness*1.5 + proof_authenticity*1.5 + generic_language + filming_feasibility + cta_naturalness) / 7
- NOTE: The divisor is 7 (the sum of weights: 1 + 1.5 + 1.5 + 1 + 1 + 1 = 7). Do NOT divide by 8.
- IMPORTANT: Score each dimension INDEPENDENTLY using the full 0-10 range. Do NOT anchor all dimensions to the same value. A script can have excellent proof (9) but weak CTA (5) and mediocre hooks (6). Report the actual per-dimension scores, then compute overall_score strictly from the formula above. Do NOT round overall_score to a "safe" number — report the exact result to one decimal place.
HOOK ENFORCEMENT (corrected caps on 0-10 scale):
- If any hook uses generic gift/category label language ("best gift for him", "must-have for men", "everyone needs this", "perfect for dads"), hook_strength caps at 4 and flag it as blocking — these are catalog copy, not hooks.
- If any hook sounds like a recognizable swipe-file formula or internet hook template, hook_strength caps at 4 — the creator would feel embarrassed using a visibly recycled format.
- If any hook could apply to 10+ products in the category without meaningful modification, hook_strength caps at 6 — the hook is generic and adds no product-native value.
- If any hook creates no open loop, curiosity gap, contradiction, or immediate relevance in the first line, hook_strength caps at 6 — the hook exists but doesn't stop scroll.
- If any hook_text reads as a filming instruction rather than viewer-facing content, hook_strength caps at 5 and flag it.
- If any hook sounds like polished ad headline copy or over-complete formal sentences rather than natural spoken creator language, flag it as a warning. Hooks should sound spoken — incomplete sentences, breath-length fragments, conversational imperfection.
- If the hook text has no connection to the opening visual beat (hook is purely verbal with no implied filmable first frame), flag as warning with component "hook-visual" — hooks must pair with a compelling opening visual.
- If all 3 hooks are near-duplicate phrasings, use the same psychological entry angle, or differ only in wording rather than approach, flag as warning. Meaningful variation in entry behavior is required. Strict archetype taxonomy diversity is not — if one hook family is clearly dominant for the product, adjacent hooks are acceptable as long as each offers a genuinely distinct opening move.
CTA ENFORCEMENT:
- If the CTA is bare "it's in TikTok Shop" or "link in bio" with no conversion logic, cta_naturalness caps at 4 and flag it (blocking).
- If the CTA could apply to any product in the category with minimal changes, cta_naturalness caps at 6 — flag with issue "generic CTA".
- If the CTA is price-first when a stronger conversion logic exists, cta_naturalness caps at 6.
- STALE PATTERN ENFORCEMENT: If the CTA matches any of these shapes, cta_naturalness caps at 5 and flag as blocking:
  * Proof-echo: "that [X] is what sold me", "that's why I switched", "once I saw that I was sold", "[X] alone is why I use this"
  * Passive ownership: "this just lives on my [location]", "that's why I keep this", "I use this every day", "this has become part of my routine"
  These reflect on ownership instead of creating purchase momentum. They are stale and banned.
- FINAL BEAT / CTA DUPLICATION: If the CTA essentially restates the final beat in different words without adding a new conversion move, cta_naturalness caps at 6 and flag with issue "CTA duplicates final beat."
- CTA MOMENTUM TEST: A strong CTA creates PURCHASE MOMENTUM — it moves the viewer toward buying, not just admiring. Score 8-10 for CTAs that combine the viewer's pain point or need with the product payoff AND a natural reason to act (sale, stock, value, easy trial, timing). Score 6-7 for CTAs that recommend but don't create urgency or action framing. Score 4-5 for CTAs that only reflect ownership or echo proof.
- OFFER-AWARE CTA: If the product data includes sale indicators, high sold_count, deal badges, or a notably low price for the category, and the CTA does NOT leverage this as a buying nudge, flag as warning with issue "missed offer-aware CTA opportunity." Offer-aware CTAs are often the strongest option when supported by data.
- The 8 valid CTA logics are: problem_tiredness_action, situation_match_nudge, upgrade_replacement, offer_aware_buying_nudge, value_easy_trial, relief_discovery, soft_recommendation, proof_conviction.
HOOK QUALITY FLOOR:
- If any hook uses generic curiosity shells ("watch what happens", "here's what happened", "I had no idea") without strong product-native justification, flag as warning and cap hook_strength at 6.
- If hook 3 is a weaker restatement of hook 1 or 2 with different wording, flag as warning with component "hooks" — this wastes the hook slot.
- If the script has no specific product detail, it's a blocking flag.
- If any beat uses a blacklisted phrase, generic_language caps at 4.
- If beats have overlapping timestamps, flag it as a warning.
- If any spoken line or text overlay reads as a literal feature restatement rather than a lived-use benefit, flag it as a warning with component "language" and issue describing the specific line. Example: "The flat plug disappears under carpet" should be flagged — a creator would say "you can finally push furniture against the wall." Check for product-brochure language, Amazon-bullet phrasing, or lines that describe what a feature IS rather than what it DOES FOR the user in real life.
- If the hook, CTA, or caption leads with price ("only $X", "$X deal", "this price is insane") when a stronger proof/utility angle exists, flag as warning with component "metadata" — price-led outputs are almost always weaker than proof-led alternatives.
- If the hook or caption uses star ratings, review counts, or "thousands sold" as the primary persuasive lever, flag as warning with component "metadata" — marketplace social proof should not replace visible proof.
- If price appears in both the hook AND the CTA AND the caption, flag as warning — price is being overused as a persuasive shortcut.
- Check each never_say constraint — violations are blocking flags.
${categoryId && ["TECH", "AUTO", "BEAUTY"].includes(categoryId) ? `- CATEGORY HOOK MINIMUM (${categoryId}): For this category, hooks must score 7+ to pass. If hook_strength < 7, add a blocking flag with component "hooks" and issue "Hook is below category minimum (${categoryId} requires 7+)." Creators in ${categoryId} have high hook standards — a 6-hook will be rewritten, which means ConvertIQ failed to deliver.` : "- HOOK QUALITY FLOOR: If hook_strength < 6, add a blocking flag. A hook below 6 means the creator would not use it."}
- OBJECTION HANDLING CHECK: Review the top belief barriers above. At least one beat must VISUALLY demonstrate something that directly resolves the #1 barrier — not just verbally mention it. If no beat addresses the primary belief barrier through visual proof, add a warning flag with component "objection_handling" and describe which barrier was unaddressed.
- RE-HOOK CHECK: If the video is 30+ seconds, check for a secondary curiosity moment between 40-60% of the way through. If no re-hook or escalation beat exists in this range, add a warning flag with component "retention" and issue "No re-hook at midpoint for 30+ second video."
- passed = true ONLY when overall_score >= 7.5 AND zero blocking flags.

Return ONLY the JSON object.`;
}
