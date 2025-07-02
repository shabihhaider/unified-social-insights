import os
from fastapi import FastAPI
from dotenv import load_dotenv

# ✅ Load environment variables from .env
load_dotenv()

from app.insights.router import insights_router

app = FastAPI(title="USI AI Insights Engine")

app.include_router(insights_router, prefix="/insights")
