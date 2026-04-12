/**
 * SectionReveal — lightweight wrapper for landing page sections.
 *
 * For founder testing: renders content immediately with no animation dependency.
 * Content is ALWAYS visible from SSR — never starts at opacity:0.
 * This eliminates all iOS Safari / mobile hydration visibility failures.
 *
 * TODO: After founder testing, re-add scroll-triggered reveal animation
 * as a progressive enhancement (visible by default, animate only after
 * JS confirms IntersectionObserver support and hydration is complete).
 */

type SectionRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function SectionReveal({ children, className = "" }: SectionRevealProps) {
  return <div className={className}>{children}</div>;
}
