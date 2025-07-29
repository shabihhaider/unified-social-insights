"""
app/providers/base.py - Base AI Provider Class
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
from datetime import datetime
import asyncio
import aiohttp
import logging
from dataclasses import dataclass

from app.config import settings
from app.utils.logger import setup_logger

logger = setup_logger("ai_providers")

@dataclass
class AIResponse:
    """Standardized AI response structure"""
    content: str
    confidence: float
    token_usage: int
    response_time: float
    metadata: Dict[str, Any]
    provider: str
    model: str
    error: Optional[str] = None

class BaseAIProvider(ABC):
    """Base class for all AI providers"""
    
    def __init__(self, api_key: str, provider_name: str):
        self.api_key = api_key
        self.provider_name = provider_name
        self.config = settings.get_provider_config(provider_name)
        self.session = None
        
    async def initialize(self):
        """Initialize the provider"""
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=self.config.get("timeout", 30))
        )
        logger.info(f"✅ Initialized {self.provider_name} provider")
    
    async def close(self):
        """Close the provider and cleanup resources"""
        if self.session:
            await self.session.close()
        logger.info(f"🔄 Closed {self.provider_name} provider")
    
    @abstractmethod
    async def generate_response(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate response from AI provider"""
        pass
    
    @abstractmethod
    async def health_check(self) -> Dict[str, Any]:
        """Check provider health status"""
        pass
    
    async def _make_request(
        self,
        url: str,
        headers: Dict[str, str],
        payload: Dict[str, Any],
        retry_count: int = None
    ) -> Dict[str, Any]:
        """Make HTTP request with retry logic"""
        
        if not self.session:
            await self.initialize()
        
        retry_count = retry_count or self.config.get("retry_count", 3)
        
        for attempt in range(retry_count):
            try:
                start_time = datetime.utcnow()
                
                async with self.session.post(url, headers=headers, json=payload) as response:
                    response_time = (datetime.utcnow() - start_time).total_seconds()
                    
                    if response.status == 200:
                        data = await response.json()
                        return {
                            "success": True,
                            "data": data,
                            "response_time": response_time,
                            "attempt": attempt + 1
                        }
                    else:
                        error_text = await response.text()
                        logger.warning(f"❌ {self.provider_name} request failed (attempt {attempt + 1}): {response.status} - {error_text}")
                        
                        if attempt == retry_count - 1:
                            return {
                                "success": False,
                                "error": f"HTTP {response.status}: {error_text}",
                                "response_time": response_time,
                                "attempt": attempt + 1
                            }
                        
                        # Exponential backoff
                        await asyncio.sleep(2 ** attempt)
                        
            except asyncio.TimeoutError:
                logger.warning(f"⏱️ {self.provider_name} request timeout (attempt {attempt + 1})")
                if attempt == retry_count - 1:
                    return {
                        "success": False,
                        "error": "Request timeout",
                        "response_time": self.config.get("timeout", 30),
                        "attempt": attempt + 1
                    }
                await asyncio.sleep(2 ** attempt)
                
            except Exception as e:
                logger.error(f"❌ {self.provider_name} request error (attempt {attempt + 1}): {str(e)}")
                if attempt == retry_count - 1:
                    return {
                        "success": False,
                        "error": str(e),
                        "response_time": 0,
                        "attempt": attempt + 1
                    }
                await asyncio.sleep(2 ** attempt)
    
    def _extract_content(self, response_data: Dict[str, Any]) -> str:
        """Extract content from provider response - to be overridden"""
        return ""
    
    def _calculate_confidence(self, response_data: Dict[str, Any]) -> float:
        """Calculate confidence score - to be overridden"""
        return 0.8
    
    def _extract_token_usage(self, response_data: Dict[str, Any]) -> int:
        """Extract token usage - to be overridden"""
        return 0
    
    def _build_headers(self) -> Dict[str, str]:
        """Build request headers - to be overridden"""
        return {"Content-Type": "application/json"}
    
    def _build_payload(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Build request payload - to be overridden"""
        return {}
    
    async def validate_api_key(self) -> bool:
        """Validate API key"""
        try:
            health_result = await self.health_check()
            return health_result.get("status") == "healthy"
        except Exception as e:
            logger.error(f"❌ API key validation failed for {self.provider_name}: {str(e)}")
            return False
    
    def get_available_models(self) -> List[str]:
        """Get list of available models"""
        return self.config.get("models", [])
    
    def get_default_model(self) -> str:
        """Get default model"""
        return self.config.get("default_model", "")
    
    def get_provider_info(self) -> Dict[str, Any]:
        """Get provider information"""
        return {
            "name": self.provider_name,
            "models": self.get_available_models(),
            "default_model": self.get_default_model(),
            "config": {k: v for k, v in self.config.items() if k != "api_key"}
        }