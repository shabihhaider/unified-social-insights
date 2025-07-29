"""
app/providers/openai_provider.py - OpenAI Provider Implementation
"""

from typing import Dict, Any
from datetime import datetime
import json

from .base import BaseAIProvider, AIResponse
from app.utils.logger import setup_logger

logger = setup_logger("openai_provider")

class OpenAIProvider(BaseAIProvider):
    """OpenAI GPT Provider"""
    
    def __init__(self, api_key: str):
        super().__init__(api_key, "openai")
        self.base_url = "https://api.openai.com/v1"
    
    def _build_headers(self) -> Dict[str, str]:
        """Build OpenAI request headers"""
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
    
    def _build_payload(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Build OpenAI request payload"""
        model = kwargs.get("model", self.get_default_model())
        temperature = kwargs.get("temperature", self.config.get("temperature", 0.7))
        max_tokens = kwargs.get("max_tokens", self.config.get("max_tokens", 2000))
        
        return {
            "model": model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert social media analyst providing detailed, actionable insights."
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": False
        }
    
    async def generate_response(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate response using OpenAI"""
        try:
            url = f"{self.base_url}/chat/completions"
            headers = self._build_headers()
            payload = self._build_payload(prompt, **kwargs)
            
            start_time = datetime.utcnow()
            response = await self._make_request(url, headers, payload)
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            
            if response["success"]:
                data = response["data"]
                content = self._extract_content(data)
                
                return {
                    "content": content,
                    "confidence": self._calculate_confidence(data),
                    "token_usage": self._extract_token_usage(data),
                    "response_time": processing_time,
                    "metadata": {
                        "model": payload["model"],
                        "temperature": payload["temperature"],
                        "provider": self.provider_name,
                        "finish_reason": data.get("choices", [{}])[0].get("finish_reason"),
                        "usage": data.get("usage", {}),
                        "request_id": data.get("id")
                    }
                }
            else:
                logger.error(f"❌ OpenAI request failed: {response['error']}")
                return {
                    "content": "Error generating response from OpenAI",
                    "confidence": 0.0,
                    "token_usage": 0,
                    "response_time": processing_time,
                    "metadata": {"error": response["error"]},
                    "error": response["error"]
                }
                
        except Exception as e:
            logger.error(f"❌ OpenAI provider error: {str(e)}")
            return {
                "content": "Error in OpenAI provider",
                "confidence": 0.0,
                "token_usage": 0,
                "response_time": 0,
                "metadata": {"error": str(e)},
                "error": str(e)
            }
    
    def _extract_content(self, response_data: Dict[str, Any]) -> str:
        """Extract content from OpenAI response"""
        try:
            return response_data["choices"][0]["message"]["content"].strip()
        except (KeyError, IndexError):
            return "No content available"
    
    def _calculate_confidence(self, response_data: Dict[str, Any]) -> float:
        """Calculate confidence based on OpenAI response"""
        try:
            finish_reason = response_data.get("choices", [{}])[0].get("finish_reason")
            if finish_reason == "stop":
                return 0.9
            elif finish_reason == "length":
                return 0.7
            else:
                return 0.5
        except (KeyError, IndexError):
            return 0.5
    
    def _extract_token_usage(self, response_data: Dict[str, Any]) -> int:
        """Extract token usage from OpenAI response"""
        try:
            return response_data.get("usage", {}).get("total_tokens", 0)
        except (KeyError, TypeError):
            return 0
    
    async def health_check(self) -> Dict[str, Any]:
        """Check OpenAI API health"""
        try:
            test_prompt = "Respond with 'OK' if you can process this request."
            response = await self.generate_response(test_prompt)
            
            if "error" not in response:
                return {
                    "status": "healthy",
                    "provider": self.provider_name,
                    "response_time": response.get("response_time", 0),
                    "last_check": datetime.utcnow().isoformat()
                }
            else:
                return {
                    "status": "unhealthy",
                    "provider": self.provider_name,
                    "error": response["error"],
                    "last_check": datetime.utcnow().isoformat()
                }
                
        except Exception as e:
            return {
                "status": "unhealthy",
                "provider": self.provider_name,
                "error": str(e),
                "last_check": datetime.utcnow().isoformat()
            }