import os
import json
import fitz  # PyMuPDF
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
from typing import Literal

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Resume Screener API")

# Allow all origins for development — restrict in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client using the API key from .env
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# System prompt instructing GPT-4o-mini to return structured JSON only
SYSTEM_PROMPT = """You are an expert technical recruiter and resume analyst.

Given a resume and a job description, evaluate how well the candidate matches the role.

You MUST respond with ONLY valid JSON — no explanation, no markdown, no code fences.

The JSON must have exactly these keys:
{
  "match_score": <integer from 0 to 100>,
  "summary": "<2-3 sentence overview of the candidate>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>", "<optional strength 4>"],
  "gaps": ["<gap 1>", "<gap 2>", "<optional gap 3>"],
  "recommendation": "<exactly one of: Strong Match, Potential Match, Not a Match>"
}"""


# Pydantic model for the structured screening result
class ScreeningResult(BaseModel):
    match_score: int
    summary: str
    strengths: list[str]
    gaps: list[str]
    recommendation: Literal["Strong Match", "Potential Match", "Not a Match"]


# Health check endpoint
@app.get("/")
def health_check():
    return {"status": "ok", "message": "Resume Screener API is running"}


# Main screening endpoint
@app.post("/screen", response_model=ScreeningResult)
async def screen_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
):
    # Validate that a file was actually provided
    if not resume:
        raise HTTPException(status_code=400, detail="No resume file provided.")

    # Read the uploaded PDF bytes
    pdf_bytes = await resume.read()

    # Extract text from the PDF using PyMuPDF
    try:
        pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
        resume_text = ""
        for page in pdf_document:
            resume_text += page.get_text()
        pdf_document.close()

        if not resume_text.strip():
            raise ValueError("PDF contains no extractable text.")
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Failed to parse PDF: {str(e)}",
        )

    # Build the user message combining resume text and job description
    user_message = f"""Job Description:
{job_description}

---

Resume:
{resume_text}"""

    # Send to OpenAI GPT-4o-mini and request structured JSON output
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            temperature=0.2,  # Low temperature for consistent, structured output
        )
        raw_content = response.choices[0].message.content
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"OpenAI API error: {str(e)}",
        )

    # Parse the JSON response from the model into the Pydantic result model
    try:
        data = json.loads(raw_content)
        result = ScreeningResult(**data)
    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse model response as valid JSON: {str(e)}",
        )

    return result
