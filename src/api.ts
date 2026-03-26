import type { ScreeningResult } from "./types";

// Sends a resume PDF and job description to the backend screening endpoint.
// Returns a typed ScreeningResult or throws an Error with the server's detail message.
export async function screenResume(
  file: File,
  job_description: string
): Promise<ScreeningResult> {
  // FormData is the browser's built-in way to send multipart/form-data,
  // which is required for file uploads alongside plain text fields.
  const formData = new FormData();
  formData.append("resume", file);           // key must match FastAPI's File(...) param name
  formData.append("job_description", job_description); // key must match FastAPI's Form(...) param name

  // The request goes to /api/screen; Vite's dev proxy rewrites this to
  // http://localhost:8000/screen, so the backend never needs to know about /api.
  const response = await fetch("/api/screen", {
    method: "POST",
    body: formData,
    // Do NOT set Content-Type manually — the browser sets it automatically
    // with the correct multipart boundary when body is FormData.
  });

  if (!response.ok) {
    // FastAPI returns error details in { "detail": "..." } format
    const errorData = await response.json().catch(() => ({}));
    const message =
      typeof errorData.detail === "string"
        ? errorData.detail
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  // Cast the JSON response to our TypeScript interface
  const data: ScreeningResult = await response.json();
  return data;
}
