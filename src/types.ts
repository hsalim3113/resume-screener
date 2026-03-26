// The form payload sent to the backend.
// The PDF file is appended separately as FormData, so only job_description lives here.
export interface ScreeningRequest {
  job_description: string;
}

// The structured result returned by the FastAPI /screen endpoint,
// mirroring the Pydantic model on the server side.
export interface ScreeningResult {
  match_score: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  // Union type ensures only the three valid values are accepted at compile time
  recommendation: "Strong Match" | "Potential Match" | "Not a Match";
}
