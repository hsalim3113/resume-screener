# Resume Screener

> AI-powered CV screening — upload a resume, paste a job description, get a structured match analysis in seconds.

[ screenshot ]

---

## How it works

1. **Upload a CV** — drag in any PDF resume
2. **Paste the job description** — the full text from any job posting
3. **Get AI analysis** — GPT-4o-mini returns a match score, strengths, skill gaps, and a hiring recommendation

---

## Tech Stack

| Layer       | Technology                          | Purpose                              |
|-------------|-------------------------------------|--------------------------------------|
| Frontend    | React 18 + TypeScript + Vite        | UI, state management, dev proxy      |
| Backend     | FastAPI (Python)                    | REST API, request validation         |
| PDF Parsing | PyMuPDF (`fitz`)                    | Extract text from uploaded PDFs      |
| AI          | OpenAI GPT-4o-mini                  | Resume-to-JD matching and scoring    |

---

## Prerequisites

- **Node.js** 18+
- **Python** 3.10+
- An **OpenAI API key** — [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

---

## Installation & Usage

### 1 — Backend

```bash
cd server
pip install -r requirements.txt
cp .env.example .env        # add your OPENAI_API_KEY to .env
uvicorn server:app --reload
```

API is now live at `http://localhost:8000`.

### 2 — Frontend

Open a second terminal from the project root:

```bash
npm install
npm run dev
```

App is now live at `http://localhost:5173`.

The Vite dev server proxies all `/api/*` requests to FastAPI, so no CORS configuration is needed in development.

---

## API

| Method | Endpoint  | Body                                              | Returns          |
|--------|-----------|---------------------------------------------------|------------------|
| GET    | `/`       | —                                                 | Health check     |
| POST   | `/screen` | `multipart/form-data`: `resume` (PDF), `job_description` (text) | `ScreeningResult` JSON |

**Response schema:**

```json
{
  "match_score": 82,
  "summary": "Strong backend engineer with relevant Python experience...",
  "strengths": ["FastAPI expertise", "Proven ML deployment", "..."],
  "gaps": ["No TypeScript experience", "..."],
  "recommendation": "Strong Match"
}
```

`recommendation` is always one of: `"Strong Match"` · `"Potential Match"` · `"Not a Match"`

---

## Folder Structure

```
resume-screener/
├── index.html                    # Entry point — loads Google Fonts, mounts React
├── package.json
├── tsconfig.json
├── vite.config.ts                # Dev proxy: /api → http://localhost:8000
├── .gitignore
│
├── src/
│   ├── main.tsx                  # React entry — StrictMode mount
│   ├── App.tsx                   # Root component, all state management
│   ├── api.ts                    # screenResume() fetch wrapper
│   ├── types.ts                  # TypeScript interfaces (ScreeningResult, etc.)
│   ├── index.css                 # Dark theme stylesheet
│   └── components/
│       ├── ScoreCircle.tsx       # Animated SVG progress ring
│       ├── RecommendationBadge.tsx
│       └── LoadingSpinner.tsx
│
└── server/
    ├── server.py                 # FastAPI app — /screen endpoint
    ├── requirements.txt
    └── .env.example
```

---

## Companion Projects

- [ai-listing-generator](https://github.com/hsalim3113/ai-listing-generator) — FastAPI backend that generates property listings with GPT-4o
- [ai-listing-frontend](https://github.com/hsalim3113/ai-listing-frontend) — React + Vite frontend for the listing generator

---

Built by [hsalim3113](https://github.com/hsalim3113)
