interface TrendSparklineProps {
  values: number[]; // Array of values to plot
  color?: string;
}

export function TrendSparkline({ values, color = "var(--clinical-warning)" }: TrendSparklineProps) {
  // Simple sparkline using SVG polyline
  const width = 40;
  const height = 16;
  const padding = 2;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  // Calculate points
  const points = values.map((value, index) => {
    const x = padding + (index / (values.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((value - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="flex items-center gap-1.5">
      <svg
        width={width}
        height={height}
        className="overflow-visible"
        style={{ minWidth: width }}
      >
        {/* Background grid dots for NAKO timeline (3 timepoints) */}
        <circle cx="8" cy={height / 2} r="1.5" fill="var(--muted-foreground)" opacity="0.3" />
        <circle cx="20" cy={height / 2} r="1.5" fill="var(--muted-foreground)" opacity="0.3" />
        <circle cx="32" cy={height / 2} r="1.5" fill="var(--muted-foreground)" opacity="0.3" />

        {/* Trend line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {values.map((value, index) => {
          const x = padding + (index / (values.length - 1)) * (width - 2 * padding);
          const y = height - padding - ((value - min) / range) * (height - 2 * padding);
          const isLast = index === values.length - 1;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={isLast ? 2.5 : 1.5}
              fill={isLast ? "var(--clinical-critical)" : color}
              stroke={isLast ? "var(--card)" : "none"}
              strokeWidth={isLast ? 1.5 : 0}
            />
          );
        })}
      </svg>
      <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
        {values[0]}→{values[values.length - 1]}
      </span>
    </div>
  );
}
