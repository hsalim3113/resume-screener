// ScoreCircle renders an animated SVG ring showing the match score (0–100).
// The ring fills from 0 to the score value on mount via a CSS animation.

interface ScoreCircleProps {
  score: number; // integer 0–100
}

// Returns the ring colour based on score thresholds
function getColor(score: number): string {
  if (score >= 70) return "#4ade80"; // green
  if (score >= 40) return "#fbbf24"; // amber
  return "#f87171";                  // red
}

export default function ScoreCircle({ score }: ScoreCircleProps) {
  const size = 160;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  // circumference is the total length of the circle's stroke path
  const circumference = 2 * Math.PI * radius;
  // dashoffset at full score = 0 (fully drawn); at 0 score = full circumference (invisible)
  const targetOffset = circumference - (score / 100) * circumference;
  const color = getColor(score);

  return (
    <div className="score-circle-wrapper">
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }} // start the fill from the top
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1f1f1f"
          strokeWidth={strokeWidth}
        />
        {/* Animated progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          // CSS custom properties let the keyframe animation reference the target offset
          style={
            {
              "--circumference": circumference,
              "--target-offset": targetOffset,
              strokeDashoffset: targetOffset,
              animation: "draw-ring 1s ease-out forwards",
            } as React.CSSProperties
          }
        />
      </svg>

      {/* Score label sits on top of the SVG via absolute positioning */}
      <div className="score-circle-label" style={{ color }}>
        {score}
      </div>
    </div>
  );
}
