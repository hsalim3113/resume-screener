import type { ScreeningResult } from "../types";

interface RecommendationBadgeProps {
  recommendation: ScreeningResult["recommendation"];
}

// Maps each recommendation value to a CSS class defined in index.css
const classMap: Record<ScreeningResult["recommendation"], string> = {
  "Strong Match": "badge badge--green",
  "Potential Match": "badge badge--amber",
  "Not a Match": "badge badge--red",
};

export default function RecommendationBadge({
  recommendation,
}: RecommendationBadgeProps) {
  return (
    <span className={classMap[recommendation]}>{recommendation}</span>
  );
}
