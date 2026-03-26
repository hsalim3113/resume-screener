# Resume Screener

An AI-powered CV screening tool that matches a candidate's resume against a job description and returns a structured analysis — including a match score, strengths, gaps, and a hiring recommendation.

![Screenshot placeholder](https://via.placeholder.com/900x500/111111/4ade80?text=Resume+Screener+Screenshot)

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, TypeScript, Vite        |
| Backend   | FastAPI (Python)                  |
| PDF Parse | PyMuPDF (fitz)                    |
| AI Model  | OpenAI GPT-4o-mini                |

---

## Prerequisites

- **Node.js** 18+
- **Python** 3.10+
- An **OpenAI API key** — [get one here](https://platform.openai.com/api-keys)

---

## Getting Started

### 1. Start the backend

```bash
cd server
pip install -r requirements.txt
cp .env.example .env          # then open .env and add your OPENAI_API_KEY
uvicorn server:app --reload
```

The API will be available at `http://localhost:8000`.

### 2. Start the frontend

In a separate terminal, from the project root:

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Folder Structure

```
resume-screener/
├── index.html                  # HTML entry point, loads Google Fonts
├── package.json
├── tsconfig.json
├── vite.config.ts              # Dev proxy: /api → http://localhost:8000
├── .gitignore
│
├── src/
│   ├── main.tsx                # React entry point
│   ├── App.tsx                 # Root component, state management
│   ├── api.ts                  # screenResume() fetch wrapper
│   ├── types.ts                # TypeScript interfaces
│   ├── index.css               # Global dark-theme stylesheet
│   └── components/
│       ├── ScoreCircle.tsx     # Animated SVG ring
│       ├── RecommendationBadge.tsx
│       └── LoadingSpinner.tsx
│
└── server/
    ├── server.py               # FastAPI app
    ├── requirements.txt
    └── .env.example
```

---

## Companion Projects

- [AI Listing Generator — backend](https://github.com/hsalim3113/ai-listing-generator)
- [AI Listing Generator — frontend](https://github.com/hsalim3113/ai-listing-frontend)

---

Built by [hsalim3113](https://github.com/hsalim3113)
