// App.tsx — root component for the Resume Screener UI.
// Manages all application state and orchestrates the two-column layout.

import { useState, useRef } from "react";
import type { ScreeningResult } from "./types";
import { screenResume } from "./api";
import ScoreCircle from "./components/ScoreCircle";
import RecommendationBadge from "./components/RecommendationBadge";
import LoadingSpinner from "./components/LoadingSpinner";

export default function App() {
  // --- State ---
  // The PDF file chosen by the user (null until a file is selected)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // The raw text typed into the job description textarea
  const [jobDescription, setJobDescription] = useState<string>("");
  // The structured result returned by the backend after a successful screen
  const [result, setResult] = useState<ScreeningResult | null>(null);
  // True while the API request is in-flight
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Holds any error message to display in the error box
  const [error, setError] = useState<string | null>(null);

  // A ref to the hidden <input type="file"> so the styled label can trigger it
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  // Called when the user picks a file via the input
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    setError(null);
  }

  // Called on form submission — sends the file + job description to the API
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // prevent the browser's default form navigation

    // Guard: both fields must be filled (the button is also disabled, but this is a safety net)
    if (!selectedFile || !jobDescription.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // screenResume() builds FormData and POSTs to /api/screen via fetch
      const data = await screenResume(selectedFile, jobDescription);
      setResult(data);
    } catch (err) {
      // err is typed as unknown in TypeScript; we narrow it to extract the message
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      // Always stop the loading state, regardless of success or failure
      setIsLoading(false);
    }
  }

  // Whether the submit button should be disabled
  const isSubmitDisabled = isLoading || !selectedFile || !jobDescription.trim();

  // --- Render ---
  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <h1 className="app-title">Resume Screener</h1>
        <p className="app-subtitle">
          Upload a CV and paste a job description — AI will score the fit in seconds.
        </p>
      </header>

      {/* ── Main two-column grid ── */}
      <main className="app-grid">

        {/* ── Left column: input form ── */}
        <section className="panel panel--form">
          <form onSubmit={handleSubmit} noValidate>

            {/* File upload */}
            <div className="field">
              <label className="field-label">Resume (PDF)</label>
              {/*
                The actual <input> is hidden; we trigger it programmatically
                via the styled upload area below for a better-looking UI.
              */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="resume-upload"
              />
              {/* Clicking this div opens the file picker */}
              <div
                className={`upload-area ${selectedFile ? "upload-area--selected" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                // Keyboard accessibility: allow Enter/Space to open the picker
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
                }}
              >
                {selectedFile ? (
                  <span className="upload-filename">{selectedFile.name}</span>
                ) : (
                  <>
                    <span className="upload-icon">↑</span>
                    <span className="upload-hint">Click to upload PDF</span>
                  </>
                )}
              </div>
            </div>

            {/* Job description textarea */}
            <div className="field">
              <label htmlFor="job-desc" className="field-label">
                Job Description
              </label>
              <textarea
                id="job-desc"
                className="textarea"
                placeholder="Paste the full job description here..."
                value={jobDescription}
                // onChange fires on every keystroke; we sync it to state
                onChange={(e) => setJobDescription(e.target.value)}
                rows={10}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitDisabled}
            >
              {isLoading ? "Screening..." : "Screen Resume"}
            </button>
          </form>
        </section>

        {/* ── Right column: results ── */}
        <section className="panel panel--results">
          {/* Loading state */}
          {isLoading && <LoadingSpinner />}

          {/* Error state */}
          {error && !isLoading && (
            <div className="error-box" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Empty state — shown before any result */}
          {!isLoading && !error && !result && (
            <div className="empty-state">
              <p>Your results will appear here.</p>
            </div>
          )}

          {/* Results panel — only rendered once the API responds successfully */}
          {result && !isLoading && (
            <div className="results fade-in">

              {/* Score + recommendation row */}
              <div className="results-header">
                {/* Animated SVG ring showing the numeric match score */}
                <ScoreCircle score={result.match_score} />
                <div className="results-header-meta">
                  <p className="results-label">Match Score</p>
                  {/* Colour-coded pill badge for the recommendation tier */}
                  <RecommendationBadge recommendation={result.recommendation} />
                </div>
              </div>

              {/* Summary paragraph */}
              <div className="results-section">
                <h2 className="results-section-title">Summary</h2>
                <p className="results-summary">{result.summary}</p>
              </div>

              {/* Strengths list */}
              <div className="results-section">
                <h2 className="results-section-title">Strengths</h2>
                <ul className="results-list results-list--strengths">
                  {result.strengths.map((s, i) => (
                    // Using index as key is fine here — the list never reorders
                    <li key={i}>
                      <span className="list-icon list-icon--green">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gaps list */}
              <div className="results-section">
                <h2 className="results-section-title">Gaps</h2>
                <ul className="results-list results-list--gaps">
                  {result.gaps.map((g, i) => (
                    <li key={i}>
                      <span className="list-icon list-icon--red">✕</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
