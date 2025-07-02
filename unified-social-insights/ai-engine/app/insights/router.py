import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

class InsightRequest(BaseModel):
    account_name: str
    recent_metrics: dict

@router.post("/")
async def generate_insight(request: InsightRequest):
    try:
        prompt = f"""
        You are a social media growth assistant. Analyze the following data for the account: {request.account_name}
        Data: {request.recent_metrics}

        Return 3 actionable insights to improve their engagement.
        """

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "llama3-70b-8192",
            "messages": [
                {"role": "system", "content": "You generate insights from social media metrics."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 300
        }

        response = requests.post(GROQ_API_URL, headers=headers, json=payload)
        data = response.json()

        if response.status_code != 200:
            raise Exception(data)

        return {
            "insights": data["choices"][0]["message"]["content"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Required for app.main to include
insights_router = router
