"use client";

import { useState } from "react";
import { SectionReveal } from "@/components/landing/SectionReveal";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: Wire to actual waitlist backend
    setSubmitted(true);
  };

  // ── Reusable waitlist form ──────────────────────────────────────────────
  function WaitlistForm({ id }: { id?: string }) {
    if (submitted) {
      return (
        <div className="rounded-xl border border-success/30 bg-success/5 p-4 text-center">
          <p className="text-sm font-semibold text-success">You&rsquo;re on the list.</p>
          <p className="text-xs text-text-muted mt-1">We&rsquo;ll reach out when early access opens.</p>
        </div>
      );
    }
    return (
      <form onSubmit={handleWaitlist} id={id} className="flex flex-col sm:flex-row gap-2.5 w-full max-w-md">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 bg-void border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-faint outline-none focus:border-accent/40 transition-colors"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-accent text-void rounded-xl text-sm font-semibold hover:bg-accent-bright transition-colors active:scale-[0.98] whitespace-nowrap"
        >
          Request Early Access
        </button>
      </form>
    );
  }

  return (
    <>
      {/* ═══ NAV ═══════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border-subtle bg-void/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-display text-lg font-bold text-text-primary tracking-tight">Virlo</span>
            <span className="hidden sm:inline text-[11px] text-text-faint tracking-wide">Shoppable Content Intelligence</span>
          </div>
          <a href="/start" className="px-4 py-1.5 rounded-lg bg-accent text-void text-xs font-semibold hover:bg-accent-bright transition-colors">
            Continue with Virlo
          </a>
        </div>
      </nav>

      {/* ═══ 1. HERO ═══════════════════════════════════════════════════════ */}
      <section className="relative pt-14 min-h-[75vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_45%,rgba(232,168,48,0.07)_0%,transparent_65%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_85%_50%,rgba(232,168,48,0.04)_0%,transparent_55%)] pointer-events-none" />
        <div className="absolute top-14 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />

        <div className="w-full max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 py-14 sm:py-16">
          <div
            className="max-w-2xl space-y-7 sm:space-y-8"
          >
            <div className="space-y-4 sm:space-y-5">
              <h1 className="font-display text-3xl sm:text-[2.5rem] lg:text-5xl font-extrabold tracking-tight text-text-primary leading-[1.1]">
                The AI engine for shoppable content creators.
              </h1>
              <p className="text-[15px] sm:text-base lg:text-lg text-text-secondary leading-relaxed max-w-xl">
                Virlo turns products into high-probability video concepts, scripts, and shot-by-shot plans built for short-form content that actually converts.
              </p>
              <p className="text-[13px] sm:text-sm text-text-muted leading-relaxed max-w-lg">
                Built on proven short-form conversion behavior from real TikTok Shop performance and positioned for the next wave of creator-led shopping across platforms.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="/start"
                className="inline-flex px-8 py-3.5 bg-accent text-void rounded-xl text-[15px] font-semibold hover:bg-accent-bright transition-all duration-200 active:scale-[0.98] shadow-[0_1px_12px_rgba(232,168,48,0.2)]"
              >
                Continue with Virlo
              </a>
              <p className="text-[11px] text-text-faint">
                Currently in controlled founder testing. Access is limited.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="#what-virlo-does"
                onClick={(e) => { e.preventDefault(); document.getElementById("what-virlo-does")?.scrollIntoView({ behavior: "smooth" }); }}
                className="group inline-flex items-center gap-2 text-[13px] font-medium text-text-secondary hover:text-accent transition-colors"
              >
                See What Virlo Does
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-void to-transparent pointer-events-none" />
      </section>

      {/* ═══ 2. WHAT VIRLO GIVES YOU — first post-hero payoff ═════════════ */}
      <section id="what-virlo-does" className="pt-4 sm:pt-6 pb-16 sm:pb-24 px-5 sm:px-10">
        <div className="max-w-5xl mx-auto">
          <SectionReveal>
            <div className="text-center space-y-2.5 mb-10 sm:mb-12">
              <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-accent">What You Get</p>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary tracking-tight">
                What Virlo actually gives you
              </h2>
              <p className="text-sm sm:text-base text-text-secondary max-w-lg mx-auto leading-relaxed">
                Virlo is built to remove the guesswork before you hit record.
              </p>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Winning content angles", body: "Virlo identifies the strongest product angle before you film, so you stop guessing what to say and start leading with what actually makes people care." },
              { title: "Conversion-built scripts", body: "Get short-form scripts structured around hook strength, proof sequencing, objection handling, retention, and soft CTA flow \u2014 instead of generic AI fluff." },
              { title: "Shot-by-shot filming plans", body: "Know exactly what to film, what to show, and how to sequence the visuals so the content feels natural, watchable, and built to sell." },
            ].map((card, i) => (
              <SectionReveal key={card.title} delay={i * 0.08}>
                <div className="rounded-xl border border-border-subtle bg-elevated/30 p-5 sm:p-6 space-y-3 hover:border-border transition-colors duration-300 h-full">
                  <h3 className="text-[15px] font-semibold text-text-primary">{card.title}</h3>
                  <p className="text-[13px] text-text-muted leading-relaxed">{card.body}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MARKET SIGNAL (relocated as bridge into How It Works) ════════ */}
      <div className="py-8 sm:py-10 px-5 sm:px-10">
        <SectionReveal>
          <p className="text-center text-sm sm:text-base font-medium text-text-muted leading-relaxed max-w-xl mx-auto">
            The next era of creator commerce won&rsquo;t be won by who posts more. It will be won by who structures product content better.
          </p>
        </SectionReveal>
      </div>

      {/* ═══ 3. HOW IT WORKS ═══════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-5 sm:px-10 relative">
        <div className="absolute inset-0 bg-surface/30 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <SectionReveal>
            <div className="text-center space-y-3 mb-10 sm:mb-12">
              <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-accent">How It Works</p>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary tracking-tight">How Virlo works</h2>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { num: "01", title: "Start with the product", body: "Virlo begins with the product, because the best content angle is determined by what actually matters about what you\u2019re selling." },
              { num: "02", title: "ConvertIQ finds the strongest angle", body: "ConvertIQ analyzes what makes product videos work by prioritizing attention, proof, retention, objection handling, and creator-native conversion behavior." },
              { num: "03", title: "Get the full execution plan", body: "Virlo gives you the angle, script, proof flow, and shot-by-shot plan so you know exactly how to structure the video before you ever film it." },
            ].map((step, i) => (
              <SectionReveal key={step.num} delay={i * 0.08}>
                <div className="rounded-xl border border-border-subtle bg-elevated/20 p-5 sm:p-6 space-y-3 hover:border-border transition-colors duration-300 h-full">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-accent font-mono">{step.num}</span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-text-primary">{step.title}</h3>
                  <p className="text-[13px] text-text-muted leading-relaxed">{step.body}</p>
                </div>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal delay={0.25}>
            <p className="text-center text-[13px] text-text-faint mt-8 italic">
              This isn&rsquo;t generic AI writing. It&rsquo;s conversion logic translated into creator-ready execution.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ═══ 5. WHY VIRLO IS DIFFERENT (CONVERTIQ MOAT) ═══════════════════ */}
      <section className="py-16 sm:py-24 px-5 sm:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(232,168,48,0.04)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-3xl mx-auto relative">
          <SectionReveal>
            <div className="text-center space-y-4 mb-8">
              <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-accent">Why Virlo Is Different</p>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary tracking-tight leading-snug">
                Most AI generates content.<br className="hidden sm:block" />
                Virlo generates conversion logic.
              </h2>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="space-y-5 text-sm sm:text-[15px] text-text-secondary leading-relaxed">
              <p>Most AI tools can write words. That does not mean they understand why a product video works.</p>
              <p>
                Virlo is powered by <span className="text-text-primary font-medium">ConvertIQ</span>, an intelligence engine built around real short-form commerce behavior &mdash; not generic copywriting patterns. It was designed to reverse engineer what actually makes product content convert: hook quality, proof sequencing, retention structure, objection handling, and creator-native selling psychology.
              </p>
              <p className="text-text-muted italic">
                Virlo doesn&rsquo;t just help you make content. It helps you make content with a real reason to convert.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ═══ 6. BUILT FOR WHAT'S NEXT ══════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-5 sm:px-10 relative">
        <div className="absolute inset-0 bg-surface/30 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative">
          <SectionReveal>
            <div className="text-center space-y-3 mb-10">
              <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-accent">The Future</p>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary tracking-tight">
                Built for where creator commerce is headed
              </h2>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="space-y-5 text-sm sm:text-[15px] text-text-secondary leading-relaxed">
              <p>Short-form product content is no longer tied to one platform.</p>
              <p>As creator-led shopping expands, the creators who win will be the ones who understand how to structure content that actually drives clicks, trust, and conversion.</p>
              <p>Virlo is built for that shift.</p>
              <p>
                Powered by ConvertIQ and grounded in proven TikTok Shop performance behavior, Virlo helps creators build product content with real conversion logic today &mdash; while positioning them for the next wave of platform-native shopping across ecosystems like Instagram Shop and beyond.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ═══ 7. WHO IT'S FOR ═══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-5 sm:px-10">
        <div className="max-w-4xl mx-auto">
          <SectionReveal>
            <div className="text-center space-y-3 mb-14">
              <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-accent">Built For</p>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary tracking-tight">
                Built for creators who want product content that performs
              </h2>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Affiliate creators", body: "Creators who want better product videos, stronger conversion logic, and less wasted posting." },
              { title: "Shoppable content creators", body: "Creators building short-form content in platform-native shopping ecosystems and preparing for what\u2019s next." },
              { title: "UGC and product-focused creators", body: "Creators who want their content to feel natural while still being structured to drive action." },
              { title: "Early movers in creator commerce", body: "Creators who understand that better structure beats more randomness." },
            ].map((card, i) => (
              <SectionReveal key={card.title} delay={i * 0.07}>
                <div className="rounded-xl border border-border-subtle bg-elevated/20 p-5 sm:p-6 space-y-2.5 hover:border-border transition-colors duration-300 h-full">
                  <h3 className="text-[15px] font-semibold text-text-primary">{card.title}</h3>
                  <p className="text-[13px] text-text-muted leading-relaxed">{card.body}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8. WHY NOW ════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-5 sm:px-10 relative">
        <div className="absolute inset-0 bg-surface/30 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative">
          <SectionReveal>
            <div className="text-center space-y-3 mb-10">
              <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-accent">Timing</p>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary tracking-tight">
                Why this matters now
              </h2>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="space-y-5 text-sm sm:text-[15px] text-text-secondary leading-relaxed">
              <p className="font-medium text-text-primary">The market is shifting fast.</p>
              <p>What started as a platform-specific opportunity is becoming a broader creator-commerce movement. As more ecosystems roll out native shopping experiences, creators who understand shoppable content structure early will have an outsized advantage.</p>
              <p className="text-text-muted italic">Virlo is being built for that exact moment.</p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ═══ 9. EARLY ACCESS BLOCK ════════════════════════════════════════ */}
      <section id="waitlist" className="py-16 sm:py-20 px-5 sm:px-10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,168,48,0.03)_0%,transparent_60%)] pointer-events-none" />
        <SectionReveal>
          <div className="max-w-xl mx-auto text-center space-y-6 relative z-10">
            <div className="space-y-3">
              <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-accent">Early Access</p>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                Want to be notified when broader access opens?
              </h2>
              <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                Virlo is currently in controlled testing. Leave your email to be first in line when we expand access.
              </p>
            </div>

            <div className="flex justify-center">
              <WaitlistForm id="main-waitlist" />
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* ═══ 10. FAQ ═══════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-5 sm:px-10 relative">
        <div className="absolute inset-0 bg-surface/30 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative">
          <SectionReveal>
            <div className="text-center space-y-3 mb-10">
              <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-accent">Questions</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">Common questions</h2>
            </div>
          </SectionReveal>

          <div className="space-y-2">
            {[
              { q: "Is Virlo just another AI script tool?", a: "No. Virlo is built around conversion logic, not generic writing. It helps creators identify the best angle, proof structure, and shot sequencing before they ever record." },
              { q: "What makes Virlo different?", a: "Virlo is powered by ConvertIQ, an internal intelligence engine built from real short-form commerce behavior, including the elements that actually influence clicks, trust, retention, and conversion in product videos." },
              { q: "Is Virlo only for TikTok Shop creators?", a: "No. Virlo is positioned for shoppable short-form content creators more broadly. Its current intelligence foundation is strongest from proven TikTok Shop performance behavior, but the platform is intentionally built around the broader shift toward creator-led shopping across ecosystems." },
              { q: "Who is Virlo for?", a: "Virlo is built for affiliate creators, shoppable content creators, UGC creators, and product-focused creators who want their short-form content to have a stronger reason to convert." },
              { q: "When will Virlo be available?", a: "Virlo is currently in early development and founder testing. Join the waitlist to be first in line for early access." },
            ].map((item, i) => (
              <SectionReveal key={i} delay={i * 0.04}>
                <FAQItem question={item.q} answer={item.a} />
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 11. FINAL CTA ═════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-5 sm:px-10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,168,48,0.05)_0%,transparent_60%)] pointer-events-none" />
        <SectionReveal>
          <div className="max-w-xl mx-auto text-center space-y-8 relative z-10">
            <div className="space-y-4">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary tracking-tight leading-snug">
                The future of creator commerce belongs to creators who understand conversion.
              </h2>
              <p className="text-sm sm:text-base text-text-secondary max-w-md mx-auto leading-relaxed">
                Virlo is building the intelligence layer for shoppable short-form content.
              </p>
            </div>

            <a
              href="/start"
              className="inline-flex px-8 py-3.5 bg-accent text-void rounded-xl text-sm font-semibold hover:bg-accent-bright transition-colors active:scale-[0.98] shadow-[0_1px_12px_rgba(232,168,48,0.2)]"
            >
              Continue with Virlo
            </a>
          </div>
        </SectionReveal>
      </section>

      {/* ═══ FOOTER ════════════════════════════════════════════════════════ */}
      <footer className="py-10 px-6 sm:px-10 border-t border-border-subtle">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-display text-sm font-bold text-text-primary tracking-tight">Virlo</span>
            <span className="text-[11px] text-text-faint">Powered by ConvertIQ</span>
          </div>
          <p className="text-[11px] text-text-faint">
            The AI engine for shoppable content creators
          </p>
        </div>
      </footer>
    </>
  );
}

// ── FAQ Accordion ─────────────────────────────────────────────────────────
// Uses native <details>/<summary> so it works on iOS Safari without JS hydration.

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="rounded-xl border border-border-subtle bg-elevated/20 overflow-hidden group">
      <summary className="w-full flex items-start gap-3 px-4 sm:px-5 py-4 text-left hover:bg-elevated/40 transition-colors cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="flex-1 text-[13px] sm:text-[14px] font-medium text-text-primary leading-snug">{question}</span>
        <svg
          className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5 transition-transform duration-200 group-open:rotate-180"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="px-4 sm:px-5 pb-4">
        <p className="text-[12px] sm:text-[13px] text-text-muted leading-relaxed">{answer}</p>
      </div>
    </details>
  );
}
