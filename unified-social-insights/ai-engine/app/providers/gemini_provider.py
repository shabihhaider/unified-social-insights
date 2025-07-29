"""
app/providers/gemini_provider.py - Google Gemini Provider Implementation
"""

from typing import Dict, Any
from datetime import datetime
import json

from .base import BaseAIProvider
from app.utils.logger import setup_logger

logger = setup_logger("gemini_provider")

class GeminiProvider(BaseAIProvider):
    """Google Gemini Provider"""
    
    def __init__(self, api_key: str):
        super().__init__(api_key, "gemini")
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"
    
    def _build_headers(self) -> Dict[str, str]:
        """Build Gemini request headers"""
        return {
            "Content-Type": "application/json"
        }
    
    def _build_payload(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Build Gemini request payload"""
        temperature = kwargs.get("temperature", self.config.get("temperature", 0.7))
        max_tokens = kwargs.get("max_tokens", self.config.get("max_tokens", 2000))
        
        # Enhanced system prompt for social media analysis
        enhanced_prompt = f"""
        You are a world-class social media analytics expert specializing in data-driven insights and strategic recommendations. Your expertise includes:
        - Platform algorithm understanding (Instagram, TikTok, Twitter, LinkedIn, Facebook)
        - Audience behavior analysis and segmentation
        - Content optimization and viral mechanics
        - Engagement psychology and timing strategies
        - Competitor analysis and market positioning
        - ROI measurement and performance attribution
        
        Analyze the following data with precision and provide actionable, specific recommendations:
        
        {prompt}
        
        Structure your response with:
        1. Key findings with supporting data
        2. Strategic implications 
        3. Specific actionable recommendations
        4. Expected outcomes and success metrics
        """
        
        return {
            "contents": [
                {
                    "parts": [
                        {"text": enhanced_prompt}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens,
                "topP": 0.8,
                "topK": 40,
                "candidateCount": 1,
                "stopSequences": []
            },
            "safetySettings": [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH", 
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        }
    
    async def generate_response(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate response using Gemini"""
        try:
            model = kwargs.get("model", self.get_default_model())
            url = f"{self.base_url}/models/{model}:generateContent?key={self.api_key}"
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
                        "model": model,
                        "provider": self.provider_name,
                        "candidates_count": len(data.get("candidates", [])),
                        "safety_ratings": data.get("candidates", [{}])[0].get("safetyRatings", []),
                        "finish_reason": data.get("candidates", [{}])[0].get("finishReason"),
                        "usage_metadata": data.get("usageMetadata", {}),
                        "model_version": data.get("modelVersion")
                    }
                }
            else:
                logger.error(f"❌ Gemini request failed: {response['error']}")
                return {
                    "content": "Error generating response from Gemini",
                    "confidence": 0.0,
                    "token_usage": 0,
                    "response_time": processing_time,
                    "metadata": {"error": response["error"]},
                    "error": response["error"]
                }
                
        except Exception as e:
            logger.error(f"❌ Gemini provider error: {str(e)}")
            return {
                "content": "Error in Gemini provider",
                "confidence": 0.0,
                "token_usage": 0,
                "response_time": 0,
                "metadata": {"error": str(e)},
                "error": str(e)
            }
    
    def _extract_content(self, response_data: Dict[str, Any]) -> str:
        """Extract content from Gemini response"""
        try:
            candidates = response_data.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    return parts[0].get("text", "").strip()
            return "No content available"
        except (KeyError, IndexError, TypeError):
            return "No content available"
    
    def _calculate_confidence(self, response_data: Dict[str, Any]) -> float:
        """Calculate confidence based on Gemini response"""
        try:
            candidates = response_data.get("candidates", [])
            if not candidates:
                return 0.3
                
            candidate = candidates[0]
            finish_reason = candidate.get("finishReason", "")
            safety_ratings = candidate.get("safetyRatings", [])
            
            # Base confidence from finish reason
            if finish_reason == "STOP":
                base_confidence = 0.9
            elif finish_reason == "MAX_TOKENS":
                base_confidence = 0.75
            elif finish_reason == "SAFETY":
                base_confidence = 0.4
            else:
                base_confidence = 0.6
            
            # Adjust for safety ratings - lower if any safety concerns
            safety_penalty = 0
            for rating in safety_ratings:
                probability = rating.get("probability", "NEGLIGIBLE")
                if probability in ["MEDIUM", "HIGH"]:
                    safety_penalty += 0.1
                elif probability == "LOW":
                    safety_penalty += 0.05
            
            # Check usage metadata for substantial response
            usage_metadata = response_data.get("usageMetadata", {})
            candidate_tokens = usage_metadata.get("candidatesTokenCount", 0)
            
            if candidate_tokens > 100:  # Substantial response
                base_confidence += 0.05
            
            final_confidence = max(0.1, base_confidence - safety_penalty)
            return min(0.95, final_confidence)
            
        except (KeyError, TypeError):
            return 0.6
    
    def _extract_token_usage(self, response_data: Dict[str, Any]) -> int:
        """Extract token usage from Gemini response"""
        try:
            usage_metadata = response_data.get("usageMetadata", {})
            return usage_metadata.get("totalTokenCount", 0)
        except (KeyError, TypeError):
            return 0
    
    async def health_check(self) -> Dict[str, Any]:
        """Check Gemini API health"""
        try:
            test_prompt = "Analyze this social media metric: 3.2% engagement rate on Instagram. What does this indicate?"
            response = await self.generate_response(test_prompt)
            
            if "error" not in response and len(response.get("content", "")) > 20:
                return {
                    "status": "healthy",
                    "provider": self.provider_name,
                    "response_time": response.get("response_time", 0),
                    "model": self.get_default_model(),
                    "confidence": response.get("confidence", 0),
                    "last_check": datetime.utcnow().isoformat()
                }
            else:
                return {
                    "status": "unhealthy",
                    "provider": self.provider_name,
                    "error": response.get("error", "Invalid response or too short"),
                    "last_check": datetime.utcnow().isoformat()
                }
                
        except Exception as e:
            return {
                "status": "unhealthy",
                "provider": self.provider_name,
                "error": str(e),
                "last_check": datetime.utcnow().isoformat()
            }
    
    async def list_models(self) -> Dict[str, Any]:
        """List available Gemini models"""
        try:
            url = f"{self.base_url}/models?key={self.api_key}"
            headers = self._build_headers()
            
            response = await self._make_request(url, headers, {})
            
            if response["success"]:
                models = response["data"].get("models", [])
                return {
                    "success": True,
                    "models": [
                        {
                            "name": model.get("name", ""),
                            "display_name": model.get("displayName", ""),
                            "description": model.get("description", ""),
                            "input_token_limit": model.get("inputTokenLimit", 0),
                            "output_token_limit": model.get("outputTokenLimit", 0)
                        }
                        for model in models
                        if "generateContent" in model.get("supportedGenerationMethods", [])
                    ]
                }
            else:
                return {"success": False, "error": response["error"]}
                
        except Exception as e:
            return {"success": False, "error": str(e)}