# ai-engine/app/main.py
import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
import uvicorn

from app.services.ai_service import (
    process_insights_for_account,
    InsightRequest,
    InsightResponse
)

from app.config import settings
from app.utils.logger import setup_logger

logger = setup_logger("main")

app = FastAPI(
    title="Social Media AI Engine",
    description="Optimized AI service for social media insights",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

class ProcessInsightsRequest(BaseModel):
    account_id: str
    user_id: str
    platform: str
    username: str
    data: Dict[str, Any]

class ProcessInsightsResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    processing_time: Optional[float] = None

class HealthResponse(BaseModel):
    status: str
    healthy: bool
    database_connected: bool
    timestamp: str
    version: str = "2.0.0"

@app.post("/process-insights", response_model=ProcessInsightsResponse)
async def process_insights(request: ProcessInsightsRequest, background_tasks: BackgroundTasks):
    try:
        logger.info(f"🤖 Processing insights for {request.account_id}")
        response = await process_insights_for_account(
            account_id=request.account_id,
            user_id=request.user_id,
            platform=request.platform,
            username=request.username,
            data=request.data
        )
        if response.status == "error":
            raise HTTPException(status_code=500, detail=f"Insight processing failed: {response.error}")

        return ProcessInsightsResponse(
            success=True,
            message="Insights processed successfully",
            data={
                "account_id": response.account_id,
                "summary": response.summary,
                "confidence_score": response.confidence_score,
                "insights_preview": {
                    "engagement_analysis": response.insights.get("engagement_analysis", {}),
                    "recommendations_count": len(response.insights.get("recommendations", []))
                }
            },
            processing_time=response.processing_time
        )
    except Exception as e:
        logger.error(f"❌ Insight processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

@app.post("/batch-process")
async def batch_process_insights(requests: List[ProcessInsightsRequest], background_tasks: BackgroundTasks):
    try:
        if len(requests) > 10:
            raise HTTPException(status_code=400, detail="Max 10 accounts per batch")

        results = []
        for req in requests:
            try:
                response = await process_insights_for_account(
                    account_id=req.account_id,
                    user_id=req.user_id,
                    platform=req.platform,
                    username=req.username,
                    data=req.data
                )
                results.append({
                    "account_id": req.account_id,
                    "success": response.status != "error",
                    "summary": response.summary if response.status != "error" else None,
                    "error": response.error if response.status == "error" else None
                })
            except Exception as e:
                results.append({
                    "account_id": req.account_id,
                    "success": False,
                    "error": str(e)
                })

        return {
            "success": True,
            "message": f"Processed {len(results)} accounts",
            "results": results
        }

    except Exception as e:
        logger.error(f"❌ Batch error: {str(e)}")
        raise HTTPException(status_code=500, detail="Batch processing failed")

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"❌ Unhandled exception: {str(exc)}")
    return {
        "success": False,
        "message": "Internal server error",
        "error": str(exc) if settings.DEBUG else "An unexpected error occurred"
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
