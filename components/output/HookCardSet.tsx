import type { HookOption } from "@/types/script";
import { HookCard } from "./HookCard";

type HookCardSetProps = {
  hooks: HookOption[];
};

export function HookCardSet({ hooks }: HookCardSetProps) {
  const sorted = [...hooks].sort((a, b) => a.rank - b.rank);

  return (
    <div className="grid grid-cols-1 gap-3">
      {sorted.map((hook) => (
        <HookCard key={hook.rank} hook={hook} />
      ))}
    </div>
  );
}
