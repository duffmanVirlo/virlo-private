type LoadingDotsProps = {
  className?: string;
};

export function LoadingDots({ className = "" }: LoadingDotsProps) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-[pulse-subtle_1.4s_ease-in-out_infinite]" />
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-[pulse-subtle_1.4s_ease-in-out_0.2s_infinite]" />
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-[pulse-subtle_1.4s_ease-in-out_0.4s_infinite]" />
    </span>
  );
}
