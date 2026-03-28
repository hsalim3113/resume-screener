// ScoreCircle renders an animated SVG ring showing the match score (0–100).
// The ring transitions from empty to the score value only after the component
// mounts — guaranteeing the animation fires when the results panel appears,
// not on page load.

import { useEffect, useState } from "react";

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
  // mounted starts false so the ring renders as empty (strokeDashoffset = circumference).
  // After the first animation frame, mounted becomes true, which updates strokeDashoffset
  // to targetOffset and lets the CSS transition animate the fill smoothly.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // requestAnimationFrame ensures the browser paints the empty state first
    // before the transition begins, so the fill always animates from 0
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

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
        {/* Progress ring — CSS transition handles the fill animation */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{
            // Before mounted: ring is invisible (offset = full circumference)
            // After mounted:  ring fills to the score (offset = targetOffset)
            strokeDashoffset: mounted ? targetOffset : circumference,
            transition: mounted
              ? "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)"
              : "none",
          }}
        />
      </svg>

      {/* Score label sits on top of the SVG via absolute positioning */}
      <div className="score-circle-label" style={{ color }}>
        {score}
      </div>
    </div>
  );
}
