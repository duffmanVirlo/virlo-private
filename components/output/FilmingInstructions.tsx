import type { GeneratedScript } from "@/types/script";
import { CopyButton } from "@/components/ui/CopyButton";

type FilmingInstructionsProps = {
  instructions: GeneratedScript["filming_instructions"];
};

export function FilmingInstructions({ instructions }: FilmingInstructionsProps) {
  const fullText = [
    `LOCATION: ${instructions.location}`,
    `LIGHTING: ${instructions.lighting}`,
    `EQUIPMENT: ${instructions.equipment_note}`,
    "",
    "SHOTS:",
    ...instructions.shots.map(
      (s) => `${s.label}:\n${s.instructions.map((i) => `  - ${i}`).join("\n")}`,
    ),
  ].join("\n");

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CopyButton text={fullText} label="Copy All" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-elevated rounded-lg p-3 space-y-1">
          <p className="text-xs text-text-muted uppercase tracking-wider">Location</p>
          <p className="text-sm text-text-primary font-medium">{instructions.location}</p>
        </div>
        <div className="bg-elevated rounded-lg p-3 space-y-1">
          <p className="text-xs text-text-muted uppercase tracking-wider">Lighting</p>
          <p className="text-sm text-text-primary font-medium">{instructions.lighting}</p>
        </div>
        <div className="bg-elevated rounded-lg p-3 space-y-1">
          <p className="text-xs text-text-muted uppercase tracking-wider">Equipment</p>
          <p className="text-sm text-text-primary font-medium">{instructions.equipment_note}</p>
        </div>
      </div>

      <div className="space-y-3">
        {instructions.shots.map((shot, i) => (
          <div key={i} className="border border-border rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-accent uppercase tracking-wide">
              {shot.label}
            </p>
            <ul className="space-y-1.5">
              {shot.instructions.map((instruction, j) => (
                <li key={j} className="text-sm text-text-primary leading-relaxed flex gap-2">
                  <span className="text-text-muted flex-shrink-0">-</span>
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
