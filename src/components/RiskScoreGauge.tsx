import { Progress } from "@/components/ui/progress";

interface RiskScoreGaugeProps {
  label: string;
  level: string;
  score: number; // 0-100
}

const levelColors: Record<string, string> = {
  Low: "clinical-badge-normal",
  Moderate: "clinical-badge-elevated",
  "Moderate-High": "clinical-badge-high",
  High: "clinical-badge-high",
};

export function RiskScoreGauge({ label, level, score }: RiskScoreGaugeProps) {
  return (
    <div className="rounded-md border bg-card p-3 my-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className={`clinical-badge ${levelColors[level] || "clinical-badge-elevated"}`}>{level}</span>
      </div>
      <Progress value={score} className="h-2.5" />
      <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
        <span>Low</span>
        <span>Moderate</span>
        <span>High</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Composite score: <span className="font-mono font-semibold text-foreground">{score}/100</span>
      </p>
    </div>
  );
}
