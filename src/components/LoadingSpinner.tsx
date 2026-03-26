// A simple animated SVG spinner shown while the API request is in-flight
export default function LoadingSpinner() {
  return (
    <div className="spinner-wrapper">
      <svg
        className="spinner"
        viewBox="0 0 50 50"
        width={40}
        height={40}
        aria-label="Loading"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#4ade80"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80 40"
        />
      </svg>
      <p className="spinner-label">Analysing your resume...</p>
    </div>
  );
}
