import { cn } from "@/lib/utils";

export function WaveformVisualizer({ active }: { active: boolean }) {
  return (
    <div className="flex h-14 items-end gap-1">
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className={cn("w-1 rounded bg-primary/70", active && "animate-waveform")}
          style={{
            height: `${8 + ((i * 17) % 36)}px`,
            animationDelay: `${i * 0.03}s`,
          }}
        />
      ))}
    </div>
  );
}
