import type { ExtractedProduct } from "@/types/product";
import type { ClassificationResult } from "@/types/classification";
import type { ProductAnalysis } from "@/types/analysis";
import type { ModalitySelection } from "@/types/modality";
import type { ShowSayMap } from "@/types/showSay";
import type { AngleSelection } from "@/types/angle";

export const SCRIPT_SYSTEM_PROMPT = `You are a TikTok Shop creator strategy engine. You produce filming-ready execution plans that a solo creator could confidently shoot today.

Core rule: Proof is not what the creator says about the product. It is the evidence from which the viewer independently forms belief.

You are decisive. You pick the strongest path, not multiple equal options. Every beat you write must answer: "What is the viewer seeing, hearing, or reading right now — and why does it move them closer to buying?"

You write like a creator, not a copywriter. Casual. Direct. Real.

Critical language rule: Never stop at what a feature DOES. Translate every feature into what CHANGES in the user's real setup, daily routine, or physical environment. A feature is not a benefit until it answers: "so what does that actually mean for me at home / in my car / at my desk?"

BAD (literal feature restatement): "The flat plug disappears under carpet completely"
GOOD (lived-use payoff): "The flat plug lets you push furniture all the way against the wall — so you can finally use that outlet behind the couch."

BAD: "One outlet becomes two separate power zones"
GOOD: "This fixes that one wall where you only have one outlet but need power on both sides of the room."

Every spoken line, text overlay, and beat description must pass the test: "Would a real creator naturally say this in a TikTok video?" If the line sounds like a product spec sheet or Amazon bullet point, rewrite it into plain human language grounded in a specific real-life scenario.

METADATA SUPPRESSION RULES:
Product metadata (price, ratings, review count, sold count, shipping, discounts) is NOT the strategy. Just because this data exists on the product page does NOT mean it belongs in the hook, script, caption, or CTA. Suppress it by default. Build strategy around utility, proof, transformation, objection handling, and creator-native conviction instead.

PRICE: Strongly suppress specific price callouts in spoken lines and hooks.

HARD RULE: Do NOT have the creator say specific dollar amounts in spoken lines, hooks, text overlays, or captions. This includes:
- Dollar figures: "$80", "$19.99", "$40"
- Spoken-out numbers: "eighty dollars", "twenty bucks", "forty dollar serum"
- Colloquial price phrases: "I wasted eighty bucks", "dropped forty on this", "forty-dollar mistake"
- "Only" prefixes: "only $20", "only twenty bucks"
- Price ranges: "around thirty bucks", "like forty dollars"

These are ALL banned by default. Specific spoken prices are risky — they go stale, they can mismatch the current product card, and they undermine proof-led persuasion.

PREFER: relative phrasing — "expensive", "pricey", "premium", "cheap", "low cost", "not cheap", "surprisingly affordable", "worth it for what you get", "on the higher end", "easy on the wallet."

EXCEPTION: Specific price numbers may ONLY appear when price is the dominant conversion mechanism (rare) AND the exact price is unambiguous in the product data AND a relative description would genuinely weaken conversion. Default assumption: use relative phrasing.

Price-led hooks, price-led captions, and price-first CTAs are almost always weaker than proof-led alternatives. Prefer evergreen persuasion that survives price changes.

RATINGS / REVIEWS / SOCIAL PROOF: Suppress by default. Do not use "4.9 stars", review counts, "thousands sold", "everyone is buying this", or marketplace social proof clichés. These are marketplace signals, not creator proof. Real proof is what the viewer SEES — utility demonstrated, transformation visible, objection resolved, mechanism revealed. Ratings may be noted internally but should almost never be surfaced in hooks, scripts, or captions. If social proof is used, it must be unusually compelling and must not replace a stronger proof-based angle.

SHIPPING: Suppress entirely unless explicitly exceptional and strategically essential.

Priority order for persuasion: utility → proof → transformation → objection handling → convenience → friction removal → creator-native insight → product mechanism → emotional payoff → only then, if justified: price or social proof.

Return ONLY valid JSON matching the exact schema specified. Do not include any text outside the JSON object.`;

export function buildScriptPrompt(
  product: ExtractedProduct,
  classification: ClassificationResult,
  analysis: ProductAnalysis,
  modality: ModalitySelection,
  showSay: ShowSayMap,
  angle: AngleSelection,
  categoryAntiPatterns: string,
  categoryProofHierarchy: string,
  retentionMechanicsContext: string,
  proofSequencingContext: string,
  objectionHandlingContext: string,
  ctaPatternsContext: string,
  visualSequencingContext: string,
  deliveryMechanicsContext: string,
  phraseBlacklist: string,
  regenerationTargets?: string[],
  requiredProofContext?: string,
  proofDestroyers?: string,
  recommendedTrustStyle?: string,
  recommendedDeliveryRegister?: string,
  primaryBeliefBarrier?: string,
): string {
  const regenConstraint = regenerationTargets
    ? `\n\nREGENERATION REQUIRED — The previous script failed QA on these components: ${regenerationTargets.join(", ")}. Fix these specifically while preserving what worked.`
    : "";

  const priceContext = product.price
    ? `\nPRICE NOTE: Product is $${product.price}. Price is available but should only be surfaced if it genuinely strengthens the strategy — not as a default. Prefer proof-led and utility-led persuasion over price-led persuasion.`
    : "";

  return `Generate a complete filming-ready script and content package for this product.

PRODUCT:
- Title: ${product.title || "Unknown"}
- Description: ${product.description || "None"}
- Price: ${product.price ? `${product.currency || "$"}${product.price}` : "Unknown"}
- Claims: ${product.claims.join("; ") || "None"}
- Ingredients/Materials: ${product.ingredients_or_materials || "Not listed"}
- Review highlights: ${product.review_signals.recurring_phrases.join(", ") || "None"}
${priceContext}

CLASSIFICATION: ${classification.primary_category} / ${classification.product_type}

ANALYSIS:
- Primary Role: ${analysis.primary_role}
- Buyer Motivation (${analysis.buyer_motivation.weighted_primary}): "${analysis.buyer_motivation[analysis.buyer_motivation.weighted_primary]}"
- Top Barriers: ${analysis.belief_barriers.slice(0, 2).map((b) => `[${b.weight}] ${b.statement}`).join("; ")}
- Creator Pattern: ${analysis.creator_pattern_archetype}

MODALITY: ${modality.selected}
MODALITY REASON: ${modality.reason}

SHOW/SAY MAP:
Must Show: ${showSay.must_show.map((s) => `• ${s.instruction} (${s.why})`).join("\n")}
Can Say: ${showSay.can_say.map((s) => `• "${s.line}" [${s.purpose}]`).join("\n")}
Never Say: ${showSay.never_say.map((s) => `• ${s.blocked_phrase_type}: ${s.instead}`).join("\n")}

SELECTED ANGLE:
- Name: ${angle.selected.name}
- Hypothesis: ${angle.selected.conversion_hypothesis}
- Entry: ${angle.selected.entry_mechanism}
- Proof Vehicle: ${angle.selected.proof_vehicle}
- Belief Path: ${angle.selected.belief_formation_path}
- CTA Setup: ${angle.selected.cta_setup}
- Pattern Source: ${angle.selected.creator_pattern_source}

CATEGORY ANTI-PATTERNS (hard prohibitions):
${categoryAntiPatterns}

CATEGORY PROOF HIERARCHY (beat ordering guide):
${categoryProofHierarchy}

RETENTION MECHANICS:
${retentionMechanicsContext}

PROOF SEQUENCING:
${proofSequencingContext}

OBJECTION HANDLING:
${objectionHandlingContext}

CTA PATTERNS:
${ctaPatternsContext}

VISUAL SEQUENCING:
${visualSequencingContext}

DELIVERY MECHANICS:
${deliveryMechanicsContext}

PHRASE BLACKLIST (never use these):
${phraseBlacklist}
${requiredProofContext ? `\n${requiredProofContext}\nIMPORTANT: Your beats MUST include a demonstration that directly addresses the required proof above. If the dominant objection is about durability, the viewer must SEE durability tested. If it is about speed, the viewer must SEE speed measured. Do not merely mention it — SHOW it in a beat.` : ""}
${proofDestroyers ? `\nPROOF DESTROYERS (these kill credibility — avoid in all beats):\n${proofDestroyers}` : ""}
${recommendedTrustStyle ? `\nTRUST STYLE: ${recommendedTrustStyle}\nUse this trust-building approach to frame the creator's relationship with the product. It should feel implicit in how the creator speaks and films — not stated explicitly.` : ""}
${recommendedDeliveryRegister ? `\nDELIVERY REGISTER: ${recommendedDeliveryRegister}\nAll spoken lines, pacing cues, and filming energy should match this register. Do not default to generic casual-direct if a more specific register is recommended.` : ""}
${primaryBeliefBarrier ? `\nPRIMARY BELIEF BARRIER: "${primaryBeliefBarrier}"\nAt least one beat must directly RESOLVE this barrier through visual demonstration — not verbal reassurance. The viewer must independently conclude this objection is handled by what they SEE, not what they are told.` : ""}
${regenConstraint}

RE-HOOK RULE: If video is 30+ seconds, insert a re-hook beat between 40-60% of the way through. This is a secondary curiosity moment — a new dimension of interest, an unexpected detail, or an escalation — that recovers viewers considering leaving. It is NOT a repeat of the opening hook. It introduces a reason to keep watching that the opening hook did not promise.

Return a JSON object with:
{
  "beats": array of {
    "start_seconds": number,
    "end_seconds": number,
    "type": "SHOW" | "SPOKEN" | "TEXT" | "HOLD" | "CREATOR_NOTE" — the PRIMARY element of this beat,
    "content": string — the primary content (visual action for SHOW, exact words for SPOKEN, overlay text for TEXT, hold description for HOLD, filming note for CREATOR_NOTE),
    "spoken": string or null — if the creator speaks WHILE this beat's visual is happening, put the exact spoken line here. This prevents overlapping beats,
    "text_overlay": string or null — if on-screen text appears DURING this beat, put the exact text here,
    "filming_note": string or null — specific filming instruction for this beat
  },
  "total_duration_seconds": number — target 25-45 seconds. This is the FILMED runtime including visual beats and speech. Total spoken words across all beats must fit the runtime at ~2.5-3 words per second (75 words for 30s, 100 for 40s, 115 for 45s). If the script would run long when delivered naturally, trim spoken content — do not inflate duration.,

  "hook_options": array of 2 or 3 (return 3 ONLY if the third hook is genuinely distinct and strong — if hook 3 would be a weaker copy, generic curiosity wrapper, or forced confessional fallback, omit it and return 2) {
    "rank": 1 | 2 | 3,
    "hook_text": string — THE EXACT TEXT OR VISUAL THE VIEWER EXPERIENCES in the first 1-3 seconds. This is NOT a filming instruction. This is what the viewer sees, hears, or reads,
    "hook_format": "spoken" | "visual" | "text-overlay" — how the viewer experiences this hook,
    "rationale": string — why this hook works for this specific product,
    "performance_note": string — how the creator should deliver/film this hook (this is where filming direction goes)
  },

  "problem_solution_logic": {
    "problem_framing": string,
    "why_this_framing": string,
    "solution_positioning": string
  },

  "cta_logic": {
    "viewer_state_at_cta": string — REQUIRED. What is the viewer thinking and feeling RIGHT NOW after watching this video? Are they convinced by proof? Tired of their current problem? Weighing the value? Imagining the product in their life? Feeling relief? This drives everything below.,
    "cta_conversion_logic": string — REQUIRED. Which conversion logic fits this viewer state? One of: "proof_conviction", "problem_tiredness", "relief_discovery", "value_justification", "offer_timing", "practical_ownership", "situation_match", "upgrade_replacement", "soft_recommendation". Choose based on the viewer state, NOT by default.,
    "proof_anchor": string — identify the strongest proof moment from the beats. The CTA may reference this, but it is NOT required to echo it directly. Some CTA logics (problem tiredness, value justification, soft recommendation) work better WITHOUT a direct proof echo.,
    "cta_text": string — the exact CTA the creator says. Must match the chosen cta_conversion_logic. Must sound like a real creator naturally closing. NOT a template. NOT bare "link in bio." The CTA must do NEW conversion work — it must not simply restate the final beat in slightly different words.,
    "pressure_mechanism": string or null,
    "why_it_works": string
  },

  "caption": string,
  "hashtags": {
    "broad": string[] — exactly 1 broad reach tag,
    "mid": string[] — exactly 2 mid-tier tags,
    "specific": string[] — exactly 2 specific/niche tags
  },
  "content_structure_note": string,
  "filming_instructions": {
    "location": string,
    "shots": array of { "label": string, "instructions": string[] },
    "lighting": string,
    "equipment_note": string
  }
}

CRITICAL RULES:

HOOK RULES:

MASTER HOOK PRINCIPLE:
The system is not trying to generate three hooks from three categories. It is trying to generate the three strongest believable opening moves for THIS product. Archetypes are internal reasoning aids, not templates or rigid output categories. The system should generate the strongest believable creator-native opening for the specific product first. Naturalness, believability, and product-native fit always outrank archetype purity. If the best hook does not neatly fit a named archetype, that is acceptable.

TWO-LAYER HOOK MODEL — use these layers as reasoning aids, not constraints:
Layer 1 (Product Conversion Mechanism): What makes THIS product convert? (utility, novelty, transformation, proof, friction removal, replacement of old method, visible result delta, time/money saved, etc.)
Layer 2 (Narrative Entry Style): How should the creator ENTER the video? (curiosity, disbelief/reveal, correction, bold statement, transformation, relatable struggle, "I was wrong" discovery, mid-sentence interruption, etc.)
The strongest hook comes from the natural intersection of these two layers — but do not force-fit hooks into archetype boxes. The goal is native, strategic, product-specific retention.

SPOKEN-FIRST PRINCIPLE:
- Hooks should sound SPOKEN, not written. Prefer natural spoken cadence over polished headline copy.
- A hook should feel like a creator talking — casual, direct, believable rhythm.
- Prefer incomplete sentences over complete ones. "I spent twenty minutes under my car looking for a bolt" beats "I recently spent twenty minutes searching underneath my car for a lost bolt."
- Prefer breath-length fragments sayable in one natural breath. If the phrasing would require an awkward mid-sentence pause, it's too long.
- Prefer interruption energy over setup energy. Starting mid-thought is almost always stronger than starting with complete context.
- Prefer blunt specifics over dramatic framing. "My dog shakes for three hours every time it thunders" beats "I've been struggling with my dog's anxiety for years."
- Know when blunt utility beats dramatic setup. For high-utility products, "watch what happens when I tilt this vertical" beats "I've been on a journey to find the perfect tool organization solution."
- Know when contradiction beats curiosity. "You're still pouring oil from the bottle?" creates more tension than "I found something interesting for cooking."
- Cadence references (NOT templates to copy): "I'm not exaggerating when I say...", "I was fully prepared to hate this until...", "And the craziest part is..."
- These are STYLE references only. Do NOT use them as default outputs.

FIRST 3 SECONDS FRAMEWORK:
- Second 0-1 (THE INTERRUPT): Something must break the scroll pattern. A spoken fragment with an open loop, a visual that contradicts expectation, a problem already in progress, or a blunt statement naming what the viewer is thinking. No greetings, no setup, no product sitting on a table.
- Second 1-2 (THE LOCK): The curiosity deepens, the visual proof begins, the contradiction lands, or the emotional entry resonates. Do NOT explain the product yet — show or tease.
- Second 2-3 (THE COMMITMENT): The proof escalates, the mechanism creates "how does that work?" curiosity, or the tension gets its first partial payoff. The viewer must now be committed to watching the rest.
- Hook text and the first beat of the shot plan MUST be synchronized. A spoken hook without a compelling paired opening visual is incomplete.

FORMAT RULES:
- hook_text must be EXACTLY what the viewer sees or hears — not a description of what to film.
- If the hook is spoken, hook_text is the exact words the creator says. If visual, describe the visual FROM THE VIEWER'S PERSPECTIVE ("A heavy ratchet stuck sideways on a car fender — not moving"), not from the creator's perspective.
- hook_format tells us how the viewer experiences it. performance_note tells the creator how to execute it.
- All 3 hooks must be meaningfully different from each other — different psychological entry, different visual setup, or different spoken angle. They should not be near-duplicate phrasings or the same idea reworded three times. If one hook family is clearly dominant for the product, adjacent hooks from similar families are acceptable as long as each offers a genuinely distinct opening move.

HOOK ANTI-PATTERNS (suppress these):
- Generic gift/category labels: "best gift for him", "must-have for men", "everyone needs this"
- Generic ecommerce headlines: "you need this in your life", "this changed everything", "don't sleep on this"
- Swipe-file formula repetition: do NOT recycle the same hook shell across products
- Over-dramatic fake vulnerability on utility products
- Polished but lifeless ad headlines no creator would say on camera
- "Wait for it" / "you won't believe" without a specific visual or claim

HOOK 3 QUALITY GATE — suppress these as hook 3 fallbacks:
- "Watch what happens when I [action]" — generic curiosity shell. Only allowed if the action itself is genuinely surprising.
- "Here's what happened when I [action]" — generic suspense. Same rule.
- "I was skeptical but" / "I didn't think I needed this" / "I had no idea" — overused internet hook openers. Only survive if strongly product-native.
- "This changed everything" / "you need this" — always suppress.
- Forced confessional/vulnerability on low-emotion utility products — always suppress.
- A weaker restatement of hook 1 with different wording — always suppress.
If hook 3 would be any of these, omit it entirely and return only 2 hooks.

HOOK SELECTION PRIORITY:
- Prefer the hook archetype that best matches the product's strongest conversion mechanism
- Problem-solving products → correction, truth bomb, frustration relief, bold statement
- Novelty / visually surprising products → disbelief, reveal, curiosity, reaction
- Convenience products → time-saving, "didn't know I needed this", old-way vs new-way
- Transformation-heavy products → before/after, "I used to think...", result shift
- Health / safety products → warning, correction, myth busting
- Do NOT default to generic categories when a stronger visual or mechanism angle exists

BEAT RULES:
- Each beat is ONE time segment. If visual and spoken happen simultaneously, use ONE beat with type=SHOW and the spoken line in the "spoken" field. Do NOT create overlapping beats with the same timestamp.
- No two beats should have overlapping time ranges.
- Every beat must have a conversion purpose — no filler.

PACING / FLUFF SUPPRESSION — the single highest-leverage output quality rule:

Before finalizing the script, audit every beat, spoken line, text overlay, and hook for these failures. The default bias should be CUT, not EXPLAIN. Creator-native content is compressed, not complete.

1. MIRRORED LANGUAGE BAN (hook ↔ spoken ↔ text overlay ↔ caption):
The viewer should NOT hear the same idea in three different layers. If the hook says the core tension, the first spoken beat should NOT restate it. If the visual shows a result, the text overlay should NOT also label that result. Each layer must carry DIFFERENT information. Check for:
- Hook + first spoken line expressing the same thought → cut or reframe one
- Spoken line + text overlay saying the same thing → pick ONE layer, remove the other
- Multiple beats advancing the same idea → collapse to one
- Caption restating what the video already established → rewrite caption to add NEW context (creator note, personal POV, or tag-like framing)
If the hook is "your nightstand looks like mine" and the first spoken line is "my nightstand was a mess", that is mirrored — cut the first spoken line or start with a different move (the proof, not the problem restated).

2. FLUFF BEAT DETECTION — every beat must pass THIS test:
Does this beat create NEW proof, NEW tension, NEW relevance, or NEW conversion movement? If it only confirms, explains, or elaborates on what the previous beat already established, it is fluff. Cut it or merge it into the prior beat.
Common fluff patterns to CUT:
- Beats that re-demonstrate a result already shown ("and here it is again from another angle")
- Beats that explain the mechanism when the visual is self-evident ("this works because of X")
- Beats that list additional features after the dominant proof has already landed
- "Setup" beats that delay the payoff without building tension ("before I show you, let me explain...")
- Recap beats that summarize what just happened ("so as you can see, the X is Y")
- Transition narration between two clear visual moments ("and then...")

3. VISUAL-PROOF DUPLICATION BAN:
If the visual clearly shows what is happening, the spoken line must NOT narrate the obvious. Say something the visual CANNOT show. The spoken line should add context, emotion, stakes, or forward motion — not caption the action.
BAD (narrating obvious visual): "Now I'm pouring the water into the bottle"
GOOD (advancing the viewer): "this is where every other bottle I've tried leaks"
BAD: "Watch as I press down on the foam"
GOOD: "this is what 30 days of standing on concrete does to cheaper ones"
BAD: "The water is beading up on the surface"
GOOD: "I did not expect this when I got these in the rain"
If the spoken line could be removed and the visual would still carry the point, remove the spoken line (use type=SHOW with no spoken field) or rewrite the line to say what the visual can't.

4. FEATURE STACKING SUPPRESSION — ONE dominant proof, not a checklist:
After the primary proof beat lands, resist the urge to add "and also...": other features, secondary tests, bonus demos, extra claims. Feature stacking converts worse than single-proof commitment. Every extra proof beat past the dominant one must answer: does this REMOVE a meaningful objection that would otherwise block conversion? If not, cut it.
Scripts should typically prove ONE thing decisively, not 3-4 things partially.

5. FAST PAYOFF RULE — the strongest visual must arrive by second 6-8:
If the hook is spoken or setup-based, the dominant proof visual must land within 6-8 seconds. Long setup before payoff is the #1 retention killer. If the script spends 10+ seconds on context, frustration, or explanation before the first real proof moment, restructure so the proof arrives faster and the context surrounds it instead of preceding it.
BAD structure: problem setup (0-12s) → product reveal (12-15s) → proof (15-25s) → CTA (25-30s)
GOOD structure: hook + first proof visual (0-5s) → escalation (5-15s) → belief lock (15-22s) → CTA (22-28s)

6. AI-SOUNDING EXPLANATION — creator compression test:
Every spoken line must pass: "would a real creator actually say it this way, this fast, with this much explanation?" If the line feels like it has 20% extra words that a real creator would cut, cut them. Bias toward sharp fragments over complete sentences. Bias toward specific over abstract. Bias toward one thought per line, not compound explanations.
AI-sounding: "This ensures that your drink stays cold throughout the entire day, even in hot conditions"
Creator: "still cold at 3pm in the car"
AI-sounding: "I was genuinely impressed by how well it performed compared to my previous solution"
Creator: "way better than what I had before"
AI-sounding: "The first thing you'll notice is the quality of the material and the weight of the product"
Creator: "you can feel the weight"

7. BEAT COUNT DISCIPLINE:
Most tight scripts have 5-8 total beats for 25-45 seconds. If you're at 10+ beats, you're probably feature-stacking or adding fluff. Audit and cut. A 30-second video with 6 strong beats converts better than a 30-second video with 10 mediocre beats.

TIME COMPRESSION FOR EXTENDED REAL PROCESSES:
If a real-world action takes longer than 3-5 seconds (letting oil absorb, waiting for results, pouring over time, mixing, brewing, cooking, drying, a multi-step routine), DO NOT instruct the creator to film the full duration. Always specify a time-compression filming cue in the beat's filming_note:
- "timelapse" — for natural gradual processes (sunset, drying, absorbing)
- "jump cut" — for discrete steps with a clear cut between them
- "quick insert" — for a brief B-roll moment slotted in
- "sped up sequence" — for fast-motion compressed action
- "timer overlay" — when showing "X seconds/minutes" with an on-screen timer
If a beat's real duration would exceed its allotted time in the script, the filming_note MUST include one of these cues. Never generate a beat that implies filming a full real-time extended action.

PRODUCTION BURDEN REALISM:
The default creator has a phone, minimal time, and no crew. Scripts that require staged group reactions, timed multi-person choreography, or multi-hour continuous capture will feel inauthentic and will be abandoned by real creators. Before finalizing any script:
- Count the people required. If more than 1 person (creator) is needed on-camera, flag internally. If 2+ people must act naturally on cue at timed moments, the concept is overproduced.
- Check for manufactured group reactions: "friend laughs", "everyone leans in", "she rolls her eyes", "the whole room goes silent." These read as staged unless the creator type is known for organic group content.
- Check for multi-hour coordination: "two hours later", "by the end of the night", "three rounds in" — these cannot be captured believably without significant filming effort.
- Check for coordinated scene changes: "we started at the dinner table, then the living room, then outside" — multi-scene arcs are commercial structure, not creator structure.
If the script leans on staged social proof, REWRITE toward creator-native alternatives:
- Solo creator-to-camera explanation with ONE genuine insert
- Voiceover over a single continuous scene or close-up of the product
- Post-experience storytelling ("okay so we played this last night and...") with minimal re-enactment
- Product-as-proof — let the product itself be the proof vehicle (cards readable on screen, packaging close-up, contents shown) instead of group reactions

GROUP / SOCIAL / PARTY PRODUCT RULES:
For products that require a group to use (card games, party games, drinking games, social experiences), default the creator role to SOLO narrator, not host of a staged gathering. The creator talks about the product, shows the product, reads a prompt from a card, or tells a short story about playing it — WITHOUT requiring on-camera friends performing reactions. If any group footage is needed, limit it to ONE short, low-fidelity insert (a snippet of genuine laughter, a phone-captured moment, a single screenshot) rather than a full staged arc.

BUNDLE / PAIRED-USE-CASE PRODUCT RULES:
For bundle products (parent+kid, his+hers, starter+refill, couple sets, matching sets), the strongest creator-native angle is usually the PAIRED USE CASE — why the creator bought BOTH, not the individual specs of each item. DO NOT structure the script as separate proof segments for each bundle component. Instead:
- Lead with the PAIRING reason: "one system for me and my kid", "finally the same setup for both of us", "we use these at the same time every morning"
- Show both items in ONE natural moment of paired use (creator with theirs, partner/kid with matching one) — ONE genuine insert, not coordinated side-by-side challenge footage
- Let the convenience of the matching setup be the proof, not durability tests
- The bundle CTA should reference the pairing value ("if you and your [kid/partner] would use these together", "if you want one system for both of you"), not stacked single-product claims
Bundle scripts that treat each item as independent products being tested separately read as commercial catalogues — rewrite toward the paired use case.

UTILITY / POWER-ACCESS / SPATIAL UNLOCK PRODUCT RULES (outlet extenders, flat plugs, extension splitters, under-desk cord solutions, behind-furniture power solutions):

For this product class, the strongest script structure is NOT a feature catalog ("12 outlets and USB-C"). It is a SPATIAL UNLOCK STORY: the creator shows the specific frustration (hidden outlet, unreachable side of the bed, couch pulled forward to reach a plug), then demonstrates the breakthrough moment on camera.

REQUIRED STRUCTURE for spatial-unlock products:
1. Open with the relatable frustration — name a specific space/scenario the viewer recognizes ("the outlet behind my couch", "the side of the bed without power", "that awkward gap between the dresser and wall")
2. Dominant proof beat = MOVEMENT, not static reveal: plug it in on camera, stretch one cord one way, stretch the other cord the other way, push the furniture back, reveal the outlet is now reachable. The viewer must SEE the transformation happen.
3. Layer secondary features AFTER the breakthrough lands — number of outlets, USB-C, per-side capacity — as supporting reasons, not lead arguments
4. CTA should reference the breakthrough, not the spec ("if you've got a dead outlet behind furniture somewhere, this fixes it")

FEATURE-FLEX SUPPRESSION for this product class:
Do NOT lead with "I can plug 12 things in at once." Do NOT open with a static shot of all outlets being filled. Do NOT make device-count the hook. These are SPEC demos, not conversion-driving stories. Device-count footage is fine as a secondary supporting beat AFTER the spatial unlock proof has already landed.

MOVEMENT PROOF REQUIREMENT:
At least ONE beat must show visible physical motion: cord routing, furniture shifting, plug insertion revealing previously-unreachable access. A static "look at all the plugs" shot does NOT count as movement proof. The viewer needs to watch the unlock HAPPEN.

COMPARATIVE OVERCLAIM BAN:
The following phrases are BANNED in spoken lines, hooks, text overlays, captions, and CTAs unless the script contains direct side-by-side proof with a specifically named competing product the creator actually owns and is showing on camera:
- "every other [category]" / "better than every other"
- "all the other [category]" / "better than all the others"
- "the only [thing] that actually [verb]s"
- "breaks every other [category]"
- "works when nothing else does"
- "no other [category] does this"
- "better than [competitor brand name]" (naming a specific competitor without showing it on camera is unsupported)
These are unsupported comparative claims that read as infomercial copy. If a creator cannot personally verify the comparison against every alternative, the line is overclaim. Replace with believable creator positioning:
- "holds up way better than the last [thing] I had" (specific personal comparison)
- "the first [thing] I've tried that actually [verb]s for me" (personal scope only)
- "way better than the one I had before" (specific prior experience)
- "handled [test] better than I expected" (subjective observation)

SIDE-BY-SIDE EVIDENCE REQUIREMENT:
If a beat sets up a comparison (visual or spoken), the creator must plausibly OWN both items being compared. Do NOT generate comparison beats that assume the creator has:
- A competitor's product on hand for direct comparison
- Multiple versions of the same category from different brands
- An identical "before" item to contrast with the reviewed product
Instead, use these supportable comparison paths:
- The creator's OWN previous version ("my old [category]") — they likely have one
- A generic household stand-in (paper towel, basic cup, standard version) — they likely have one
- Pure personal experience framing with NO visual comparison ("I used to deal with [problem]")
If a beat requires a competitor product the creator doesn't plausibly own, either rewrite the beat to use a supportable comparison path or remove the comparison and let the product's capability speak for itself.

UNSUPPORTED COMPETITOR NAMING:
Do NOT name specific competitor brands in spoken lines, hooks, overlays, captions, or CTAs unless:
(a) the creator is showing that specific competitor product on camera AND
(b) the comparison is fair (same category, same use case, same test conditions)
Even when showing a competitor, prefer generic framing ("the one I had before", "the drugstore version", "the basic version") over naming a brand. Brand-specific competitor callouts create legal, policy, and trust risk.

HIGH-FRICTION / RISKY FILMING BEATS — penalize or rewrite:
The following filming setups are risky, awkward, or production-heavy and should be avoided when a simpler creator-native proof exists:
- Aggressive upside-down shake tests (leakproof proof can be shown with a tilt, a pour, or a closed-lid demo on a counter instead)
- Filming while driving (safety risk, feels staged — use a parked car or creator walking to car with cup in hand)
- Drop tests from height (looks manufactured — use a normal everyday bump or a kid's natural handling instead)
- Overnight / multi-hour "wait and see" beats without a time-compression cue (use timelapse or jump cut — see TIME COMPRESSION rules)
- Tests that require specialized equipment, multiple attempts, or careful staging to look right
When a simpler proof path exists (one real-use moment, one believable tilt, one natural drop during use), default to that. Engineered tests should only appear when they are genuinely the strongest proof AND the product's mechanism is not visible in normal use.

PROP AND SETUP REALISM — what the creator likely has vs what the script assumes:

The engine must be skeptical of prop assumptions. A "good concept" is useless if the creator cannot execute it with what they realistically own. Before generating any beat, audit prop assumptions:

DO NOT assume the creator has:
- A full collection of competitor products on hand (comparison setups requiring 3-5 competing products)
- Specific named competitor brands ("let me compare this to the [BrandX] version")
- Rare or seasonal items on demand (perfect ripe fruit, specific insects, particular weather conditions, snow in July)
- Professional lighting, multiple camera angles, or tripod setups beyond a phone stand
- Specialized measuring equipment (pH strips, digital scales, thermometers, timers)
- Perfect-condition demo subjects (unblemished apples, identical twin-size surfaces, lab-clean environments)
- Willing human subjects acting on cue (a spouse, kid, roommate, or friend who will reliably perform a reaction)
- Access to specific environments (a boat, a pool, a luxury car, a professional kitchen)
- Specific "before" items to sacrifice (an old product to cut in half, a dirty surface to clean on camera, a broken thing to compare against)

DO assume the creator has:
- Their own home (kitchen counter, bathroom, bedroom, living room, car parked in driveway, porch/patio)
- Basic household items (a glass, a cup, a paper towel, a phone, a mirror, water, common food items)
- One phone for filming
- Themselves (their own body, face, hands, voice, expressions)
- The product being reviewed
- Maybe ONE family member or pet willing to appear briefly, but NOT to act on cue

PROP MINIMIZATION RULE:
If a beat requires an item beyond the product itself, the filming_note must explicitly name the prop so the creator can verify they have it. Props that are unusual or specific should be flagged in the filming_note: "Needs: one old/competing X if you have it, otherwise skip this beat."

REALISTIC CAPTURE RULE:
For any proof that depends on a specific moment (child's genuine reaction, pet's response, timed result, rare weather), the filming_note should suggest capturing OPPORTUNISTICALLY over multiple attempts rather than on a single scheduled take. If the moment cannot be captured opportunistically, rewrite the beat to use a proof path that doesn't depend on an unreliable moment.

COMPARISON SETUP REALISM:
Side-by-side comparisons require the creator to OWN both items. Do NOT generate comparison beats that assume competitor products are available. If the script needs a "before" comparison, use one of these realistic paths instead:
- The creator's OWN previous version of the same category ("my old [category] couldn't do this")
- A generic stand-in the creator likely owns (regular paper towel vs their new one, basic cup vs the featured cup)
- Creator describing prior frustration without visual comparison ("I used to deal with [problem]")
- NO visual comparison at all — let the product's capability speak for itself
When in doubt, DO NOT generate comparison setups. A single-product proof sequence converts better than a comparison the creator cannot actually film.

IMPOSSIBLE SHOT DETECTION:
Before finalizing any beat, check: is the visual actually filmable with a phone?
- Cannot show liquid level INSIDE an opaque/tinted bottle — instead show pouring out, drops falling, liquid on a spoon or dropper, or a transparent measuring cup
- Cannot show internal mechanisms of sealed products — instead show the visible effect or result
- Cannot show microscopic action, invisible ingredients, or chemistry happening inside skin — instead show before/after, creator reaction, or packaging close-up
- Cannot show smell, taste, or internal sensation — instead show facial reaction, body language, or environmental reaction (steam, color change)
If a beat's instruction cannot physically be captured on a solo creator's phone, rewrite it to show an adjacent filmable proof instead.

ON-SCREEN TEXT HOOK REQUIREMENT:
At least ONE of the hook_options must have hook_format = "text-overlay" unless every viable hook is genuinely weaker as a text-overlay than as spoken or visual-only. TikTok Shop feeds rely heavily on muted-scroll text hooks. The default expectation is that text-overlay hooks are included, not omitted. Only skip text-overlay hooks when the product's conversion mechanism is so purely visual that words would dilute it.

DOSAGE AND MEASUREMENT READABILITY:
When a dosage, volume, or measurement appears in a SPOKEN line or ON-SCREEN TEXT overlay, spell out the unit for readability:
- "milliliters" not "ml"
- "ounces" not "oz" (when spoken; "oz" in overlays is acceptable if the context is clear)
- "grams" not "g"
- "tablespoons" not "tbsp"
- "teaspoons" not "tsp"
Abbreviations are fine in filming_note (where the creator reads for reference) but not in creator-facing spoken or overlay content.

SPOKEN LENGTH CALIBRATION (WPM):
Real creator delivery averages 2.5-3 words per second (150-180 words per minute) in natural TikTok Shop tone. This means:
- A 30-second script = approximately 75-90 spoken words across all beats combined
- A 40-second script = approximately 100-120 spoken words
- A 45-second script = approximately 115-135 spoken words
Before finalizing, sum the words across every "spoken" field. If the total exceeds the budget for total_duration_seconds, tighten spoken lines or reduce beat count. Over-long scripts that run past their target are a real usability failure — creators will rewrite or abandon them.

CTA RULES:

CTA GENERATION PROCEDURE:
Step 1: IDENTIFY THE VIEWER STATE. After watching all the beats, what is the viewer thinking and feeling? Are they convinced? Tired of their old way? Weighing the cost? Imagining the product in their life? This is the PRIMARY driver.
Step 2: SELECT THE CONVERSION LOGIC that matches this viewer state. Do NOT default to proof conviction. Read the viewer state honestly and pick the logic that does the most conversion work.
Step 3: WRITE THE CTA from that conversion logic. The CTA must do NEW conversion work — it cannot simply restate or rephrase the final beat. If the last beat showed proof, the CTA should move to the NEXT step (recommending, justifying, framing the decision) — not just admire the proof again.
Step 4: CHECK — does this CTA sound like a real creator closing a video? Would they actually say this? If it sounds like a template or a marketing line, rewrite it.

CTA MASTER PRINCIPLE: The CTA is a CONVERSION MOVE, not a proof summary. The proof already happened in the video. The CTA's job is to move the viewer from "that was impressive" to "I should get this." Those are two different psychological steps. The CTA must advance the viewer forward, not look backward at what they already saw.

CTA / FINAL BEAT SEPARATION RULE: The CTA must be a DIFFERENT sentence doing DIFFERENT conversion work than the final beat before it. If the final beat demonstrates proof, the CTA must not simply echo that same proof. The two must work as a one-two punch: the final beat delivers evidence, the CTA delivers the recommendation, justification, or decision framing.

CTA ENERGY PRINCIPLE: The CTA should create PURCHASE MOMENTUM, not reflect on ownership. It should move the viewer toward buying, not describe the creator's personal relationship with the product. Think "buying nudge from a friend" not "personal diary entry."

CTA vs PRE-CTA DISTINCTION: A PRE-CTA is a conditional thought that sets up the decision ("if you feel mentally foggy, this might be worth the experiment"). An ACTUAL CTA moves toward action ("if you've been feeling mentally foggy, this is worth trying — and it's on sale right now"). Pre-CTA language ending in "might be worth it", "could be worth exploring", "maybe worth considering" is TOO SOFT to close a video. The CTA must include an action-leaning element: worth trying + reason to act, clear recommendation, buying nudge, or offer awareness. If the CTA only sets up the decision without nudging toward it, it is a pre-CTA and must be rewritten to close the loop.

CTA LENGTH DISCIPLINE: The CTA must close cleanly. Target 15-25 spoken words. A CTA over ~25 words is almost always bloated — it is re-explaining the premise, listing multiple conditions, or stacking too many frames. Tighten it. The CTA's job is the FINAL PUSH, not a recap. For group/social/party products, this discipline is especially important: if the video has already shown the product and the experience, the CTA should land fast and close — NOT re-describe what the product does or repeat the value proposition.

CTA COMPOUND STRUCTURE: The strongest CTAs often combine 2-3 elements in one natural sentence:
- the real friction or pain point
- the main product payoff
- a natural reason to act now (sale, stock, price, timing, easy trial)
Not every CTA needs all three, but the best ones layer them naturally.

CTA CONVERSION LOGICS — select based on viewer state:

1. PROBLEM TIREDNESS + ACTION — viewer relates to the frustration and needs a push to act
   - "if you've been dealing with [specific friction], this is the one to grab before they sell through"
   - "if [specific problem] has been driving you crazy, I'd grab it while it's still on sale"
   - "if you need something that actually fixes [problem], this is worth trying — especially at this price"

2. SITUATION MATCH + NUDGE — viewer sees their own setup/scenario in the video
   - "if your [setup/situation] looks anything like mine, I'd grab this before they sell out"
   - "if you need one [thing] that handles [specific scenario], this is the one and I wouldn't wait on it"
   - "if your [space] is a mess of [specific clutter], this fixes it fast"

3. UPGRADE / REPLACEMENT — viewer is using something worse and can clearly do better
   - "if your current [thing] is annoying you, this is an easy upgrade"
   - "if you're still using [old method], this just straight up replaces it and it's not close"
   - "this is the kind of upgrade you wish you'd made sooner"

4. OFFER-AWARE BUYING NUDGE — use when product context supports sale, stock, or price signals. NEVER invent scarcity. Only use when product data includes sale price, limited stock, high sell-through, or deal indicators.
   - "they actually have these on a really good sale right now but I'm not sure how long that's going to last — if you want to grab one before the price goes back up, link is right here"
   - "the only problem with these is they keep selling out — if you want to grab one while they're still available and actually on a good sale, I'd do it now"
   - "this is one of those things that usually goes quick once people find it, especially at this price"
   - "if you've been thinking about it, now's the time — I wouldn't wait for the price to go back up"

5. VALUE / EASY TRIAL — viewer is weighing whether it's worth it
   - "for the price, this is one of those things that just makes sense to try"
   - "honestly, [price range] for something that actually [specific result]? easy decision"
   - "this is the kind of thing where you try it once and wonder why you waited"

5b. COMFORT RELIEF + WORTH TRYING — use for comfort, recovery, wearable, sleep, or anti-fatigue products. NEVER claim the product fixes or cures pain — only describe the relief experience and frame as worth trying.
   - "if your feet hurt after a long day, these give so much relief — and they're on sale right now, but I don't know how long that's gonna last"
   - "if your feet are cooked by the end of the day, these are absolutely worth trying, especially while they're still on sale"
   - "if [body part] has been giving you trouble, these are worth a shot — they make such a difference at the end of the day"
   - "if you stand for work or walk a lot, these are one of those things you don't realize you needed until you try them"

6. RELIEF / DISCOVERY — viewer didn't know this solution existed
   - "I genuinely wish I'd found this [timeframe] ago — would have saved me a lot of [frustration]"
   - "this is one of those products where you're mad you didn't get it sooner"

7. SOFT RECOMMENDATION — casual, low-pressure, genuine sharing energy
   - "definitely worth checking out if that's been your issue too"
   - "just thought I'd share this one because it actually works"
   - "not saying you need it but if you've been dealing with [problem], it's worth a look"

8. PROOF CONVICTION — use sparingly, only when the demo was genuinely jaw-dropping
   - "honestly, after that [result], the decision kind of makes itself"
   - "that's the kind of result where you just grab it"

9. CART-NATIVE ACTION — TikTok Shop native closing language when a direct purchase nudge is warranted and the viewer is already convinced
   - "you can grab it right from the cart under this video"
   - "just tap the cart and pick one up"
   - "it's in the cart below if you want to pick this up"
   - "I'll leave it in the cart, go grab yours"
   - "link is in the cart right below this"
Cart-native language is appropriate when: the proof landed hard, the viewer is already leaning in, and the close needs to be a direct platform-native purchase move rather than a soft recommendation. Common cart-native tail words that are platform-safe and creator-native: "grab", "pick up", "pick this up", "grab yours", "get yours", "the cart below". These are TikTok Shop native — NOT off-platform drift.
NEVER use these as off-platform language: "link in bio", "DM me", "my website", "go to X.com". Those are banned. "Cart" and "cart below" refer to TikTok Shop's native in-video checkout.

SELECTION RULE — match viewer state to the logic that creates the most PURCHASE MOMENTUM:
- Viewer frustrated with current situation → PROBLEM TIREDNESS + ACTION
- Viewer sees their own messy setup → SITUATION MATCH + NUDGE
- Viewer using something worse → UPGRADE / REPLACEMENT
- Product has real sale/stock/deal signals → OFFER-AWARE BUYING NUDGE
- Viewer weighing cost → VALUE / EASY TRIAL
- Comfort / recovery / wearable / anti-fatigue product → COMFORT RELIEF + WORTH TRYING
- Viewer surprised this exists → RELIEF / DISCOVERY
- Low-stakes, casual → SOFT RECOMMENDATION
- Truly dramatic demo → PROOF CONVICTION
- Viewer already convinced, needs direct purchase nudge → CART-NATIVE ACTION

CART-NATIVE TAIL UPGRADE (applies to ANY conversion logic):
When a CTA from any logic above would benefit from a direct purchase nudge at the end, add a cart-native tail rather than a generic close:
- Generic tail: "worth trying"
- Cart-native tail: "worth grabbing from the cart below"
- Generic tail: "if you've been dealing with this"
- Cart-native tail: "if you've been dealing with this, the cart's right below"
Use cart-native tails when the product, price point, and proof support direct action. Do NOT force cart-native language onto soft-recommendation CTAs where it would feel pushy.

OFFER-AWARE CTA RULES:
- ONLY use sale/stock/price urgency when the product context ACTUALLY supports it (sale price in data, "sold_count" showing high volume, badges like "deal" or "sale", or price that is genuinely low for the category).
- Do NOT invent scarcity. Do NOT fake urgency. Do NOT force sale language.
- When product signals DO support it, offer-aware CTAs are often the STRONGEST option because they give the viewer a concrete reason to act NOW rather than later.
- Offer-aware language should feel like a friend giving you a heads up, not a used car salesman creating pressure.

ANTI-MONOCULTURE RULE: Do NOT default to the same CTA logic for every product. Before selecting, explicitly consider at least 3 different logics and pick the one that creates the strongest purchase momentum for THIS specific product and viewer state. If you notice you're writing "if you're tired of..." or "that's why I..." again, STOP and choose a different logic.

CTA HARD RULES:
- The CTA must do DIFFERENT conversion work than the final beat. Never restate the same idea in slightly different words.
- NEVER output bare "it's in TikTok Shop" or "link in bio." If platform is mentioned, it must be subordinate to the conversion logic.
- CTA should sound like a real creator naturally closing — casual, direct, real.
- Do NOT repeat the hook in weaker form as the CTA.
- Do NOT use generic formulas like "grab yours", "don't walk run", "before it sells out."

STALE PATTERNS — these are now BANNED:
PROOF-ECHO (all say "I saw proof and now I'm converted"):
- "that [test/proof/shot] is what sold me"
- "that's why I switched to this"
- "once I saw that, I was sold/convinced"
- "that alone made me change"
- "after seeing [X], I linked the exact one"
- "[result] alone is why I use this now"
- "that [X] is what convinced me"

PASSIVE OWNERSHIP (all say "I have it and I like it" — no purchase momentum):
- "this just lives on my [location] now"
- "that's why I keep this [in location]"
- "I use this every single day"
- "this has become a permanent part of my [routine]"

These patterns reflect on ownership instead of creating buying momentum. The CTA should move the viewer toward a DECISION, not describe the creator's personal product relationship.

SCRIPT RULES:
- Total duration should be 25-45 seconds.
- NEVER use phrases from the blacklist.
- Content must be SPECIFIC to this product — not applicable to any product in the category.
- Caption must sound like a person, not a content marketer. Lowercase. No emojis. Real voice.
- Filming instructions must be executable by a solo creator with a phone.

HUMAN TRANSLATION RULES:
- Never describe a feature literally. Translate it into the real-world payoff the viewer can instantly picture.
- Ground benefits in specific physical locations and daily moments: "behind the couch", "next to the bed", "under the desk", "in the garage", "on the counter", "in the car door pocket."
- Reject any line that sounds like a product brochure, Amazon bullet, or technical spec. Replace with plain creator language.
- Reject phrases like: "provides capability", "ensures convenience", "offers functionality", "delivers performance", "without any issues." Replace with what the person can now DO.
- Favor "I actually use this" energy: "this made [specific thing] so much easier", "now I can finally...", "I didn't realize how useful this was until..."
- If a proposed use case feels contrived, awkward, or technically-possible-but-uncommon, replace it with a more universal real-life scenario.
- Every spoken line should sound like something you'd say to a friend showing them the product, not something you'd write in a product listing.

CLAIM SAFETY — avoid absolute language, use observable language:
The difference between a safe creator line and a risky claim is specificity and certainty. "Fixes" and "waterproof" and "cures" are absolute. Creator-native language describes what the viewer is SEEING or what the creator is EXPERIENCING in the moment.

COMFORT / RELIEF / WELLNESS PRODUCTS (footwear, sleep aids, recovery, posture, anything wearable for comfort):
- AVOID: "fixes [problem]", "cures [problem]", "eliminates [problem]", "these fix [pain]", "these cure [condition]"
- PREFER: relief-framed language — "these give so much relief after a long day", "my feet feel way better by the end of the day", "the difference at the end of the day is real", "gives my [body part] a break", "so much more comfortable than [old way]"
- PREFER trial-framed language — "worth trying", "worth a shot if that's been your thing", "if you've been looking for something easier on your feet, these are worth it"
- NEVER claim the product fixes or cures a physical condition or pain. Describe the comfort experience, not a clinical outcome.

EFFICACY / WATERPROOF / GRIP / DURABILITY CLAIMS (anything that could be tested and shown to fail):
- AVOID: "they're actually waterproof", "100% waterproof", "guaranteed to grip", "it literally never [fails]", "completely [absolute outcome]"
- PREFER: observable language — "water rolls right off these", "water beads up and slides off", "these still grip really well on [surface]", "handled [surface] better than I expected", "held up way better than the last pair"
- The test: if a single counterexample would make the statement false, it is too absolute. Describe what you SEE, not a universal guarantee.

SPOKEN CADENCE — tighten every line for natural creator delivery:
- AVOID over-explained imperatives: "Press it down this hard and watch it bounce right back", "Notice how it returns to its original shape immediately", "Pay attention to the way it recovers"
- PREFER tighter natural cadence: "watch how it bounces right back", "look how it comes back", "no flattening"
- Drop unnecessary setup words. "Watch how it X" beats "Press it down this hard and watch how it X." The visual IS the setup.
- If a line has more than ~12 words, it is probably over-explained. Tighten it.
- Imperatives should feel casual, not instructional: "watch this" > "observe this". "look" > "notice".

SPECIFICITY TEST — before returning, mentally check:
- Could this script work for any other product in the same category? If yes, it is too generic. Add product-specific details.
- Could the hooks stop scrolling even without the product name? If not, the hook needs a more vivid visual or sharper pain point.
- Would a real creator know exactly what to film from the beats alone? If not, beats need more visual specificity.

VOICE DIRECTION — be decisive:
- If the product's proof is entirely visual (mechanism, transformation, comparison), state clearly: no voiceover needed, let visuals carry.
- If the product needs context, authority, or trust that visuals alone can't provide, recommend voiceover and write the exact lines.
- Do NOT default to voiceover out of habit. Many TikTok Shop hits are silent visual + text overlay + trending audio.

Return ONLY the JSON object.`;
}
