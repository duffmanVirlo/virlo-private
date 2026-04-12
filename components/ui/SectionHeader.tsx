import { Badge } from "./Badge";

type SectionHeaderProps = {
  title: string;
  badge?: string;
  description?: string;
  className?: string;
};

export function SectionHeader({ title, badge, description, className = "" }: SectionHeaderProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center gap-2.5">
        <h3 className="text-sm font-semibold text-text-primary tracking-wide uppercase">
          {title}
        </h3>
        {badge && <Badge variant="accent">{badge}</Badge>}
      </div>
      {description && (
        <p className="text-sm text-text-muted">{description}</p>
      )}
    </div>
  );
}
