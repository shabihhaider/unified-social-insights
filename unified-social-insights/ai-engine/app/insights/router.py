from fastapi import APIRouter
from app.db import fetch_active_accounts, insert_ai_summary
from app.services.summary import build_prompt, generate_summary

router = APIRouter()

@router.get("/")
def health_check():
    return { "status": "AI insights router working" }

@router.post("/generate")
def generate_insights_now():
    accounts = fetch_active_accounts()
    generated = 0

    for account in accounts:
        acc_id, user_id, platform, username, metadata = account
        prompt = build_prompt(username, platform, metadata or {})
        summary = generate_summary(prompt)
        insert_ai_summary(acc_id, user_id, platform, summary)
        generated += 1

    return { "message": f"{generated} summaries generated." }
