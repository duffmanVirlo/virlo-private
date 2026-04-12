export type ObjectionPattern = {
  id: string;
  name: string;
  approach: string;
  placement_in_video: string;
  why_it_works: string;
  anti_pattern: string;
};

export const OBJECTION_PATTERNS: ObjectionPattern[] = [
  {
    id: "proof-absorbs-objection",
    name: "Proof Absorbs Objection",
    approach:
      "Design the primary proof demonstration so that it inherently answers the main objection without ever acknowledging the objection explicitly. If the objection is 'this probably does not work on tough stains,' the demo uses the toughest stain. The objection is answered by what the viewer sees, not by what the creator says.",
    placement_in_video:
      "Embedded within the main proof section of the video. The objection is never surfaced as a separate topic; it is simply resolved by the evidence being shown. This typically falls in the middle third of the video where the core demonstration occurs.",
    why_it_works:
      "When the creator explicitly addresses an objection, it validates the objection as a real concern and puts the viewer in a defensive posture. When the proof naturally eliminates the objection, the viewer never consciously processes it as a barrier. The objection simply ceases to exist in their mind because the evidence already contradicted it.",
    anti_pattern:
      "Stopping the demonstration to say 'I know you might be thinking this won't work for X.' This surfaces a doubt the viewer may not have had, and positions the creator as someone who knows their product has weaknesses. Even if the answer is good, the framing is defensive.",
  },
  {
    id: "preemptive-limitation",
    name: "Preemptive Limitation",
    approach:
      "Proactively acknowledge a genuine limitation of the product early in the video before the viewer discovers it. This builds credibility by signaling honesty, and it frames the limitation on the creator's terms rather than letting the viewer discover it and lose trust.",
    placement_in_video:
      "Early in the video, typically just after the hook and before the main proof. The limitation is stated briefly and matter-of-factly, then the video moves on to what the product does well. It should not be the focus, just a passing acknowledgment.",
    why_it_works:
      "A creator who volunteers a limitation signals that they are not trying to sell at all costs. This paradoxically increases trust in everything else they say. The viewer thinks: 'If they are honest about the downside, the positive claims are probably true too.' It also inoculates against the viewer finding the limitation later and feeling deceived.",
    anti_pattern:
      "Dwelling on the limitation, over-explaining it, or mentioning so many limitations that the video becomes a list of reasons not to buy. The limitation should be a brief, honest aside that enhances credibility, not a confession that dominates the narrative.",
  },
  {
    id: "social-evidence",
    name: "Social Evidence",
    approach:
      "Let other people's behavior or testimony address the objection. Instead of the creator arguing against the doubt, the viewer sees that many others have already resolved the same doubt through purchase, use, or endorsement. This can be comment screenshots, visible sales numbers, or references to widespread adoption.",
    placement_in_video:
      "Can appear at any point but is most effective after the creator's own proof has established baseline credibility. Placing social evidence after a demonstration adds a second layer of conviction: 'Not just this person, but many people confirm this.'",
    why_it_works:
      "Objections are essentially risk assessments. When the viewer sees that thousands of other people took the same risk and were satisfied, their perceived risk drops dramatically. Social evidence is particularly effective for objections the creator cannot personally disprove, like long-term durability or universal effectiveness.",
    anti_pattern:
      "Using obviously fake or curated testimonials, or citing vague numbers like 'thousands of happy customers' without any visible proof. The social evidence must be tangible and verifiable within the video frame, or it functions as a claim rather than proof.",
  },
  {
    id: "practical-demonstration",
    name: "Practical Demonstration",
    approach:
      "Address the objection by performing the exact action the viewer doubts will work. If they doubt the product is easy to use, show the full setup in real time. If they doubt it fits, show it fitting. The demonstration directly targets the specific barrier to belief with observable action.",
    placement_in_video:
      "In the proof section of the video, either as the primary demonstration or as a deliberate escalation point. The objection-targeted demonstration should feel like a natural part of showing the product, not like a separate defensive segment.",
    why_it_works:
      "Seeing is believing in its most literal form. When the viewer watches the exact thing they doubted happen in front of them, the objection is resolved at the perceptual level rather than the argumentative level. There is no counter-argument to 'I just watched it work.' This is the strongest objection-handling approach when the objection can be physically demonstrated.",
    anti_pattern:
      "Performing a demonstration that is obviously staged to succeed. Using ideal conditions, perfect lighting, or suspiciously easy test cases. The demonstration must feel like a real test with real stakes, or the viewer assumes the conditions were engineered to hide the limitation.",
  },
];
