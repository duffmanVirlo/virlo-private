"use client";

import type { UsageCheckResult } from "@/lib/usage/types";
import { PLANS, TOPUP_OPTIONS } from "@/lib/usage/plans";

type UsageGateProps = {
  check: UsageCheckResult;
  onStartOver: () => void;
};

export function UsageGate({ check, onStartOver }: UsageGateProps) {
  if (check.allowed) return null;

  // Trial expired
  if (check.reason === "trial_expired") {
    return (
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-surface border border-accent/20 mb-2">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-text-primary">
            Your free trial has ended
          </h2>
          <p className="text-sm text-text-secondary max-w-xs mx-auto leading-relaxed">
            Keep generating filming-ready strategies. Your plan continues automatically unless you cancel before the trial ends.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <PlanCard
            name="Core"
            price="$39/mo"
            runs="3 runs/day"
            highlighted={false}
          />
          <PlanCard
            name="Pro"
            price="$79/mo"
            runs="6 runs/day"
            highlighted
          />
        </div>

        <p className="text-xs text-text-faint">
          Billing coming soon. Contact us for early access.
        </p>

        <button
          onClick={onStartOver}
          className="text-sm text-text-muted hover:text-text-secondary transition-colors"
        >
          Back to home
        </button>
      </div>
    );
  }

  // Trial daily cap hit
  if (check.reason === "trial_cap") {
    return (
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        <div className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-text-primary">
            You&rsquo;ve used your trial runs
          </h2>
          <p className="text-sm text-text-secondary max-w-xs mx-auto leading-relaxed">
            Your free trial includes 3 runs over 2 days. Upgrade to keep generating — your plan continues unless you cancel before the trial ends.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <PlanCard
            name="Core"
            price="$39/mo"
            runs="3 runs/day"
            highlighted={false}
          />
          <PlanCard
            name="Pro"
            price="$79/mo"
            runs="6 runs/day"
            highlighted
          />
        </div>

        <p className="text-xs text-text-faint">
          Billing coming soon.
        </p>

        <button
          onClick={onStartOver}
          className="text-sm text-text-muted hover:text-text-secondary transition-colors"
        >
          Back to home
        </button>
      </div>
    );
  }

  // Paid plan daily cap hit (Core or Pro)
  const plan = PLANS[check.plan_id];
  const showUpgradeNudge = check.should_show_upgrade_nudge && check.plan_id === "core";

  return (
    <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
      <div className="space-y-3">
        <h2 className="font-display text-2xl font-bold text-text-primary">
          Daily capacity reached
        </h2>
        <p className="text-sm text-text-secondary max-w-xs mx-auto leading-relaxed">
          You&rsquo;ve used all {plan.daily_run_limit} of today&rsquo;s {plan.display_name} strategies.
          {showUpgradeNudge
            ? " Upgrade to Pro for 6 runs per day, or add an Additional Strategy Run."
            : " Add an Additional Strategy Run, or come back tomorrow."}
        </p>
      </div>

      {/* Additional Strategy Runs */}
      {check.should_show_topup_offer && (
        <div className="space-y-3">
          <p className="text-xs text-text-muted uppercase tracking-wider">Need one more today?</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            {TOPUP_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                disabled
                className="px-5 py-2.5 rounded-xl bg-elevated border border-border text-sm text-text-secondary cursor-not-allowed opacity-60"
                title="Additional Strategy Runs coming soon"
              >
                Additional Strategy Run — $0.99
                <span className="block text-[10px] text-text-faint mt-0.5">Coming soon</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade nudge for Core users */}
      {showUpgradeNudge && (
        <div className="border border-accent/20 rounded-xl bg-accent-surface/30 p-4 space-y-2">
          <p className="text-sm font-medium text-text-primary">
            Upgrade to Pro
          </p>
          <p className="text-xs text-text-secondary">
            6 runs per day for $79/mo — more room when you&rsquo;re testing a lot of products.
          </p>
          <button
            disabled
            className="mt-2 px-5 py-2 rounded-lg bg-accent/20 text-accent text-sm font-medium cursor-not-allowed opacity-60"
          >
            Upgrade — Coming soon
          </button>
        </div>
      )}

      <button
        onClick={onStartOver}
        className="text-sm text-text-muted hover:text-text-secondary transition-colors"
      >
        Back to home
      </button>
    </div>
  );
}

// ─── Internal plan card ──────────────────────────────────────────────────────

function PlanCard({
  name,
  price,
  runs,
  highlighted,
}: {
  name: string;
  price: string;
  runs: string;
  highlighted: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-5 space-y-2 text-left ${
        highlighted
          ? "border border-accent/30 bg-accent-surface/30"
          : "border border-border bg-surface"
      }`}
    >
      <p className={`text-sm font-semibold ${highlighted ? "text-accent" : "text-text-primary"}`}>
        {name}
      </p>
      <p className="text-xl font-bold text-text-primary">{price}</p>
      <p className="text-xs text-text-muted">{runs}</p>
      <button
        disabled
        className={`w-full mt-2 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed opacity-60 ${
          highlighted
            ? "bg-accent/20 text-accent"
            : "bg-elevated text-text-secondary"
        }`}
      >
        Coming soon
      </button>
    </div>
  );
}
