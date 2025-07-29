"""
app/providers/deepseek_provider.py - DeepSeek Provider Implementation
"""

from typing import Dict, Any
from datetime import datetime

from .base import BaseAIProvider
from app.utils.logger import setup_logger

logger = setup_logger("deepseek_provider")

class DeepSeekProvider(BaseAIProvider):
    """DeepSeek AI Provider"""
    
    def __init__(self, api_key: str):
        super().__init__(api_key, "deepseek")
        self.base_url = "https://api.deepseek.com/v1"
    
    def _build_headers(self) -> Dict[str, str]:
        """Build DeepSeek request headers"""
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
    
    def _build_payload(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Build DeepSeek request payload"""
        model = kwargs.get("model", self.get_default_model())
        temperature = kwargs.get("temperature", self.config.get("temperature", 0.7))
        max_tokens = kwargs.get("max_tokens", self.config.get("max_tokens", 2000))
        
        # DeepSeek-optimized system prompt for analytical tasks
        system_prompt = """You are DeepSeek, an advanced AI assistant specializing in social media analytics and digital marketing strategy. Your analytical capabilities include:

1. Advanced Data Interpretation: Process complex engagement metrics, audience demographics, and performance trends
2. Strategic Thinking: Connect data points to actionable business insights
3. Platform Expertise: Deep understanding of algorithm changes and platform-specific best practices
4. Predictive Analysis: Forecast trends and recommend proactive strategies
5. Competitive Intelligence: Benchmark performance against industry standards

Approach each analysis with:
- Quantitative rigor and statistical accuracy
- Qualitative insights into human behavior
- Strategic recommendations with clear rationale
- Measurable outcomes and success criteria
- Risk assessment and mitigation strategies

Provide comprehensive, nuanced analysis that goes beyond surface-level observations."""

        return {
            "model": model,
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": temperature,
            "max_tokens": max_tokens,
            "top_p": 0.8,
            "frequency_penalty": 0.1,
            "presence_penalty": 0.1,
            "stream": False
        }
    
    async def generate_response(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate response using DeepSeek"""
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
                        "request_id": data.get("id"),
                        "created": data.get("created"),
                        "system_fingerprint": data.get("system_fingerprint")
                    }
                }
            else:
                logger.error(f"❌ DeepSeek request failed: {response['error']}")
                return {
                    "content": "Error generating response from DeepSeek",
                    "confidence": 0.0,
                    "token_usage": 0,
                    "response_time": processing_time,
                    "metadata": {"error": response["error"]},
                    "error": response["error"]
                }
                
        except Exception as e:
            logger.error(f"❌ DeepSeek provider error: {str(e)}")
            return {
                "content": "Error in DeepSeek provider",
                "confidence": 0.0,
                "token_usage": 0,
                "response_time": 0,
                "metadata": {"error": str(e)},
                "error": str(e)
            }
    
    def _extract_content(self, response_data: Dict[str, Any]) -> str:
        """Extract content from DeepSeek response"""
        try:
            return response_data["choices"][0]["message"]["content"].strip()
        except (KeyError, IndexError):
            return "No content available"
    
    def _calculate_confidence(self, response_data: Dict[str, Any]) -> float:
        """Calculate confidence based on DeepSeek response characteristics"""
        try:
            choice = response_data.get("choices", [{}])[0]
            finish_reason = choice.get("finish_reason")
            content = choice.get("message", {}).get("content", "")
            usage = response_data.get("usage", {})
            
            # Base confidence from finish reason
            if finish_reason == "stop":
                base_confidence = 0.88  # DeepSeek tends to be very thorough
            elif finish_reason == "length":
                base_confidence = 0.75
            else:
                base_confidence = 0.6
            
            # Adjust based on response comprehensiveness
            content_length = len(content)
            if content_length > 500:  # Comprehensive response
                base_confidence += 0.05
            elif content_length < 100:  # Too brief
                base_confidence -= 0.1
            
            # Adjust based on token efficiency
            completion_tokens = usage.get("completion_tokens", 0)
            prompt_tokens = usage.get("prompt_tokens", 1)
            
            if completion_tokens > prompt_tokens * 0.3:  # Good response ratio
                base_confidence += 0.02
            
            # DeepSeek bonus for analytical content (heuristic check)
            analytical_keywords = [
                "analysis", "data", "metric", "trend", "pattern", 
                "recommend", "strategy", "insight", "correlation", "performance"
            ]
            
            keyword_count = sum(1 for keyword in analytical_keywords if keyword in content.lower())
            if keyword_count >= 3:
                base_confidence += 0.03
            
            return min(0.95, max(0.3, base_confidence))
            
        except (KeyError, IndexError, TypeError):
            return 0.65
    
    def _extract_token_usage(self, response_data: Dict[str, Any]) -> int:
        """Extract token usage from DeepSeek response"""
        try:
            return response_data.get("usage", {}).get("total_tokens", 0)
        except (KeyError, TypeError):
            return 0
    
    async def health_check(self) -> Dict[str, Any]:
        """Check DeepSeek API health"""
        try:
            test_prompt = """Analyze this social media performance data:
            - Engagement Rate: 4.2%
            - Reach: 15,000
            - Impressions: 18,500
            - Comments: 45
            - Platform: Instagram
            
            Provide one key insight and one recommendation."""
            
            response = await self.generate_response(test_prompt)
            
            # Check for substantial analytical response
            content = response.get("content", "")
            has_insight = "insight" in content.lower() or "analysis" in content.lower()
            has_recommendation = "recommend" in content.lower() or "suggest" in content.lower()
            
            if ("error" not in response and 
                len(content) > 50 and 
                (has_insight or has_recommendation)):
                return {
                    "status": "healthy",
                    "provider": self.provider_name,
                    "response_time": response.get("response_time", 0),
                    "confidence": response.get("confidence", 0),
                    "model": self.get_default_model(),
                    "analytical_quality": "high" if (has_insight and has_recommendation) else "medium",
                    "last_check": datetime.utcnow().isoformat()
                }
            else:
                return {
                    "status": "unhealthy",
                    "provider": self.provider_name,
                    "error": response.get("error", "Response quality insufficient"),
                    "content_length": len(content),
                    "last_check": datetime.utcnow().isoformat()
                }
                
        except Exception as e:
            return {
                "status": "unhealthy",
                "provider": self.provider_name,
                "error": str(e),
                "last_check": datetime.utcnow().isoformat()
            }
    
    async def get_model_info(self) -> Dict[str, Any]:
        """Get DeepSeek model information"""
        try:
            # DeepSeek doesn't have a models endpoint, so return static info
            return {
                "available_models": self.get_available_models(),
                "default_model": self.get_default_model(),
                "capabilities": [
                    "Advanced reasoning and analysis",
                    "Code understanding and generation", 
                    "Mathematical problem solving",
                    "Strategic thinking and planning",
                    "Data interpretation and insights"
                ],
                "context_window": {
                    "deepseek-chat": 32768,
                    "deepseek-coder": 16384
                },
                "strengths": [
                    "Analytical and logical reasoning",
                    "Technical accuracy",
                    "Comprehensive explanations",
                    "Strategic recommendations"
                ]
            }
        except Exception as e:
            return {"error": str(e)}
    
    def get_optimization_tips(self) -> Dict[str, Any]:
        """Get DeepSeek-specific optimization tips"""
        return {
            "prompt_optimization": [
                "Be specific about the type of analysis needed",
                "Provide structured data when possible",
                "Ask for step-by-step reasoning",
                "Request quantitative insights alongside qualitative",
                "Specify the desired output format"
            ],
            "best_practices": [
                "Use DeepSeek for complex analytical tasks",
                "Leverage its strength in logical reasoning",
                "Provide context for better strategic recommendations",
                "Ask for risk assessments and mitigation strategies",
                "Request measurable outcomes and KPIs"
            ],
            "parameter_recommendations": {
                "temperature": 0.7,  # Good balance for analytical tasks
                "top_p": 0.8,       # Focused but not too narrow
                "max_tokens": 2000, # Allow for comprehensive responses
                "frequency_penalty": 0.1,  # Reduce repetition
                "presence_penalty": 0.1    # Encourage diverse topics
            }
        }