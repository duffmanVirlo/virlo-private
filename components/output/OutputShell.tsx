"use client";

import type { OutputPackage } from "@/types/output";
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
import { ExpandableSection } from "@/components/ui/ExpandableSection";
import { ComplianceNote } from "./ComplianceNote";

type OutputShellProps = {
  output: OutputPackage;
};

export function OutputShell({ output }: OutputShellProps) {
  const { script, angle, modality, analysis, show_say, classification } = output;
  const primaryHook = script.hook_options.find((h) => h.rank === 1);
  const altHooks = script.hook_options.filter((h) => h.rank !== 1);
  const isVoiceoverModality = ["voiceover-led", "creator-to-camera"].includes(modality.selected);
  const isSilent = modality.selected === "silent-visual-first";

  // Build filmable shot list from beats
  const visualBeats = script.beats.filter((b) => b.type === "SHOW" || b.type === "HOLD");
  const spokenBeats = script.beats.filter((b) => b.type === "SPOKEN" || b.spoken);
  const textBeats = script.beats.filter((b) => b.type === "TEXT" || b.text_overlay);

  // Build full script text for copy
  const fullCopyText = buildCopyText(output);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-1 animate-fade-in">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="space-y-4 pb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="accent">{classification.primary_category}</Badge>
          <Badge>{classification.product_type}</Badge>
        </div>
        <h1 className="font-display text-xl sm:text-2xl font-bold text-text-primary leading-tight">
          {output.product.title || "Content Strategy"}
        </h1>
        <div className="flex items-center justify-between">
          {output.product.price && (
            <span className="text-sm text-text-muted">
              {output.product.currency || "$"}{output.product.price}
            </span>
          )}
          <CopyButton text={fullCopyText} label="Copy Full Strategy" />
        </div>
      </div>

      {/* ── 1. PRIMARY WINNING ANGLE ──────────────────────────────────── */}
      <Section number={1} title="Winning Angle">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-text-primary">{angle.selected.name}</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {angle.selected.conversion_hypothesis}
          </p>
          <div className="flex items-center gap-3 pt-1">
            <ScorePill label="Composite" value={angle.selected.score.composite} />
            <ScorePill label="Scroll Stop" value={angle.selected.score.scroll_stop} />
            <ScorePill label="Belief" value={angle.selected.score.belief_formation} />
          </div>
        </div>
      </Section>

      {/* ── 2. SCROLL-STOPPING OPEN ───────────────────────────────────── */}
      <Section number={2} title="Scroll-Stopping Open">
        {primaryHook && (
          <div className="space-y-4">
            {/* Primary hook */}
            <div className="border border-accent/20 rounded-xl bg-accent-surface/20 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider">Best Hook</span>
                  <Badge variant={primaryHook.hook_format === "spoken" ? "beat-spoken" : primaryHook.hook_format === "visual" ? "beat-show" : "beat-text"}>
                    {primaryHook.hook_format}
                  </Badge>
                </div>
                <CopyButton text={primaryHook.hook_text} />
              </div>
              <p className="text-base font-medium text-text-primary leading-relaxed">
                &ldquo;{primaryHook.hook_text}&rdquo;
              </p>
              <p className="text-xs text-text-muted">{primaryHook.rationale}</p>
              {primaryHook.performance_note && (
                <p className="text-xs text-text-faint italic">{primaryHook.performance_note}</p>
              )}
            </div>

            {/* First 3 seconds strategy */}
            {script.beats.length > 0 && (
              <div className="bg-elevated rounded-lg p-3 space-y-1">
                <p className="text-xs text-text-muted uppercase tracking-wider">First 3 Seconds</p>
                <p className="text-sm text-text-primary">
                  {script.beats[0].content}
                </p>
                {script.beats[0].spoken && (
                  <p className="text-sm text-beat-spoken/90">&ldquo;{script.beats[0].spoken}&rdquo;</p>
                )}
              </div>
            )}

            {/* Alt hooks collapsed */}
            {altHooks.length > 0 && (
              <ExpandableSection title="Backup Hooks" defaultOpen={false}>
                <div className="space-y-3">
                  {altHooks.map((h) => (
                    <div key={h.rank} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={h.hook_format === "spoken" ? "beat-spoken" : h.hook_format === "visual" ? "beat-show" : "beat-text"}>
                          {h.hook_format}
                        </Badge>
                        <CopyButton text={h.hook_text} />
                      </div>
                      <p className="text-sm text-text-primary">&ldquo;{h.hook_text}&rdquo;</p>
                      <p className="text-xs text-text-muted">{h.rationale}</p>
                    </div>
                  ))}
                </div>
              </ExpandableSection>
            )}
          </div>
        )}
      </Section>

      {/* ── 3. FILMING GAME PLAN ──────────────────────────────────────── */}
      <Section number={3} title="Filming Game Plan">
        <div className="space-y-4">
          {/* Modality decision */}
          <div className="bg-elevated rounded-lg p-3 space-y-1">
            <p className="text-xs text-text-muted uppercase tracking-wider">Content Format</p>
            <p className="text-sm font-medium text-text-primary">
              {formatModalityLabel(modality.selected)}
            </p>
            <p className="text-xs text-text-secondary">{modality.reason}</p>
          </div>

          {/* Shot sequence */}
          <div className="space-y-2">
            <p className="text-xs text-text-muted uppercase tracking-wider">Shot Sequence</p>
            <div className="border border-border rounded-xl overflow-hidden divide-y divide-border-subtle">
              {script.beats.map((beat, i) => (
                <div key={i} className="px-4 py-3 flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-elevated flex items-center justify-center">
                    <span className="text-xs font-bold text-text-muted">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm text-text-primary leading-relaxed">{beat.content}</p>
                    {beat.spoken && (
                      <p className="text-sm text-beat-spoken/80">
                        <span className="text-xs text-text-faint mr-1">SAY:</span>
                        &ldquo;{beat.spoken}&rdquo;
                      </p>
                    )}
                    {beat.text_overlay && (
                      <p className="text-sm text-beat-text/80">
                        <span className="text-xs text-text-faint mr-1">TEXT:</span>
                        {beat.text_overlay}
                      </p>
                    )}
                    {beat.filming_note && (
                      <p className="text-xs text-text-faint italic">{beat.filming_note}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-[10px] font-mono text-text-faint">{beat.start_seconds}–{beat.end_seconds}s</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-faint text-right">
              {script.beats.length} shots · {script.total_duration_seconds}s total
            </p>
          </div>

          {/* Filming setup */}
          <ExpandableSection title="Setup & Equipment" defaultOpen={false}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Location</p>
                <p className="text-text-primary">{script.filming_instructions.location}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Lighting</p>
                <p className="text-text-primary">{script.filming_instructions.lighting}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Equipment</p>
                <p className="text-text-primary">{script.filming_instructions.equipment_note}</p>
              </div>
            </div>
          </ExpandableSection>
        </div>
      </Section>

      {/* ── 4. VOICE & TEXT DIRECTION ─────────────────────────────────── */}
      <Section number={4} title="Voice & Text Direction">
        <div className="space-y-4">
          {/* Voiceover decision */}
          <div className={`rounded-lg p-3 space-y-1 ${isSilent ? "bg-beat-show/5 border border-beat-show/10" : isVoiceoverModality ? "bg-beat-spoken/5 border border-beat-spoken/10" : "bg-elevated"}`}>
            <p className="text-xs text-text-muted uppercase tracking-wider">Voice Recommendation</p>
            <p className="text-sm font-medium text-text-primary">
              {isSilent
                ? "No voiceover — let visuals carry. Use text overlays + trending audio."
                : isVoiceoverModality
                  ? "Voiceover recommended — your voice builds trust for this product."
                  : modality.selected === "text-led"
                    ? "Text-led — on-screen text drives the narrative. Voice optional."
                    : "Light voiceover or natural reaction sounds. Keep it casual."}
            </p>
          </div>

          {/* What to say */}
          {spokenBeats.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-text-muted uppercase tracking-wider">Spoken Lines</p>
              <div className="space-y-1.5">
                {script.beats.map((b, i) => {
                  const line = b.type === "SPOKEN" ? b.content : b.spoken;
                  if (!line) return null;
                  return (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="text-xs text-text-faint mt-0.5 flex-shrink-0">{b.start_seconds}s</span>
                      <p className="text-sm text-text-primary">&ldquo;{line}&rdquo;</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* On-screen text stack */}
          {(textBeats.length > 0 || script.cta_logic.cta_text) && (
            <div className="space-y-2">
              <p className="text-xs text-text-muted uppercase tracking-wider">On-Screen Text</p>
              <div className="space-y-1.5">
                {script.beats.map((b, i) => {
                  const text = b.type === "TEXT" ? b.content : b.text_overlay;
                  if (!text) return null;
                  return (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="text-xs text-text-faint mt-0.5 flex-shrink-0">{b.start_seconds}s</span>
                      <p className="text-sm text-beat-text/90">{text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Never say */}
          {show_say.never_say.length > 0 && (
            <ExpandableSection title="Never Say" defaultOpen={false}>
              <div className="space-y-2">
                {show_say.never_say.map((item, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-error/70">{item.blocked_phrase_type}</span>
                    <span className="text-text-faint mx-1.5">→</span>
                    <span className="text-text-secondary">{item.instead}</span>
                  </div>
                ))}
              </div>
            </ExpandableSection>
          )}
        </div>
      </Section>

      {/* ── 5. CTA & CLOSE ────────────────────────────────────────────── */}
      <Section number={5} title="CTA & Close">
        <div className="space-y-3">
          <div className="border border-accent/20 rounded-xl bg-accent-surface/20 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">Call to Action</span>
              <CopyButton text={script.cta_logic.cta_text} />
            </div>
            <p className="text-base font-medium text-text-primary">
              &ldquo;{script.cta_logic.cta_text}&rdquo;
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-elevated rounded-lg p-3 space-y-1">
              <p className="text-xs text-text-muted uppercase tracking-wider">Viewer State</p>
              <p className="text-sm text-text-secondary">{script.cta_logic.viewer_state_at_cta}</p>
            </div>
            <div className="bg-elevated rounded-lg p-3 space-y-1">
              <p className="text-xs text-text-muted uppercase tracking-wider">Why It Converts</p>
              <p className="text-sm text-text-secondary">{script.cta_logic.why_it_works}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 6. CONVERSION LOGIC (collapsed by default) ────────────────── */}
      <section className="py-6 border-t border-border-subtle">
        <ExpandableSection title="Why This Converts" badge="Strategy" defaultOpen={false}>
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <LogicRow label="Problem" value={script.problem_solution_logic.problem_framing} />
              <LogicRow label="Why This Framing" value={script.problem_solution_logic.why_this_framing} />
              <LogicRow label="Solution Position" value={script.problem_solution_logic.solution_positioning} />
              <LogicRow label="Primary Barrier" value={analysis.belief_barriers[0]?.statement || "None identified"} />
              <LogicRow label="Proof Vehicle" value={angle.selected.proof_vehicle} />
            </div>
          </div>
        </ExpandableSection>
      </section>

      {/* ── 7. CAPTION & DISTRIBUTION ─────────────────────────────────── */}
      <Section number={7} title="Caption & Hashtags">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-text-muted uppercase tracking-wider">Caption</p>
              <CopyButton text={script.caption} />
            </div>
            <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap bg-elevated rounded-lg p-3">
              {script.caption}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-text-muted uppercase tracking-wider">Hashtags</p>
            <div className="flex flex-wrap gap-1.5">
              {[...script.hashtags.broad, ...script.hashtags.mid, ...script.hashtags.specific].map((tag, i) => (
                <span key={i} className="px-2 py-0.5 text-xs bg-elevated text-text-secondary rounded-md border border-border-subtle">
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </div>
            <CopyButton
              text={[...script.hashtags.broad, ...script.hashtags.mid, ...script.hashtags.specific]
                .map((t) => (t.startsWith("#") ? t : `#${t}`))
                .join(" ")}
              label="Copy All"
            />
          </div>
        </div>
      </Section>

      {/* ── Compliance ────────────────────────────────────────────────── */}
      <ComplianceNote compliance={output.compliance} />

      {/* ── QA badge ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-3 pt-4 pb-2">
        <span className={`text-xs font-medium ${output.qa.passed ? "text-success/70" : "text-warning/70"}`}>
          ConvertIQ Score: {output.qa.overall_score.toFixed(1)}/10
        </span>
        <span className="text-text-faint text-xs">·</span>
        <span className="text-xs text-text-faint">
          {script.total_duration_seconds}s · {script.beats.length} shots · {classification.primary_category}
        </span>
      </div>
    </div>
  );
}

// ─── Helper components ───────────────────────────────────────────────────────

function Section({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <section className="py-6 border-t border-border-subtle">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center flex-shrink-0">
          {number}
        </span>
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ScorePill({ label, value }: { label: string; value: number }) {
  const color = value >= 8 ? "text-success" : value >= 6 ? "text-warning" : "text-error";
  return (
    <span className="text-xs text-text-muted">
      {label} <span className={`font-bold ${color}`}>{value.toFixed(1)}</span>
    </span>
  );
}

function LogicRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-elevated rounded-lg p-3 space-y-1">
      <p className="text-xs text-text-muted uppercase tracking-wider">{label}</p>
      <p className="text-sm text-text-secondary leading-relaxed">{value}</p>
    </div>
  );
}

function formatModalityLabel(modality: string): string {
  const labels: Record<string, string> = {
    "silent-visual-first": "Silent Visual — no voiceover, text overlays + trending audio",
    "text-led": "Text-Led — on-screen text drives the story",
    "voiceover-led": "Voiceover — your narration over product visuals",
    "creator-to-camera": "Creator to Camera — direct to viewer, personal credibility",
    "demo-first": "Demo First — product in action immediately, no preamble",
    "comparison-led": "Comparison — side-by-side or before/after proof",
    "routine-integration": "Routine Integration — product shown within daily habit",
    "problem-reveal-led": "Problem Reveal — open with the problem, solve with product",
  };
  return labels[modality] || modality;
}

// ─── Copy-all builder ────────────────────────────────────────────────────────

function buildCopyText(output: OutputPackage): string {
  const { script, angle, modality } = output;
  const lines: string[] = [];

  lines.push(`WINNING ANGLE: ${angle.selected.name}`);
  lines.push(`${angle.selected.conversion_hypothesis}`);
  lines.push("");

  const primaryHook = script.hook_options.find((h) => h.rank === 1);
  if (primaryHook) {
    lines.push(`BEST HOOK [${primaryHook.hook_format}]: "${primaryHook.hook_text}"`);
    lines.push("");
  }

  lines.push(`FORMAT: ${formatModalityLabel(modality.selected)}`);
  lines.push("");

  lines.push("SHOT SEQUENCE:");
  script.beats.forEach((b, i) => {
    lines.push(`  ${i + 1}. [${b.start_seconds}-${b.end_seconds}s] ${b.content}`);
    if (b.spoken) lines.push(`     SAY: "${b.spoken}"`);
    if (b.text_overlay) lines.push(`     TEXT: ${b.text_overlay}`);
  });
  lines.push("");

  lines.push(`CTA: "${script.cta_logic.cta_text}"`);
  lines.push("");

  lines.push(`CAPTION:\n${script.caption}`);
  lines.push("");

  const allTags = [...script.hashtags.broad, ...script.hashtags.mid, ...script.hashtags.specific]
    .map((t) => (t.startsWith("#") ? t : `#${t}`))
    .join(" ");
  lines.push(`HASHTAGS: ${allTags}`);

  return lines.join("\n");
}
