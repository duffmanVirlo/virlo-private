type BadgeVariant = "default" | "accent" | "success" | "warning" | "error" | "beat-show" | "beat-spoken" | "beat-text" | "beat-hold" | "beat-note";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-elevated text-text-secondary border-border",
  accent: "bg-accent-surface text-accent border-accent/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  error: "bg-error/10 text-error border-error/20",
  "beat-show": "bg-beat-show/10 text-beat-show border-beat-show/20",
  "beat-spoken": "bg-beat-spoken/10 text-beat-spoken border-beat-spoken/20",
  "beat-text": "bg-beat-text/10 text-beat-text border-beat-text/20",
  "beat-hold": "bg-beat-hold/10 text-beat-hold border-beat-hold/20",
  "beat-note": "bg-beat-note/10 text-beat-note border-beat-note/20",
};

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
