"""
app/providers/anthropic_provider.py - Anthropic Claude Provider Implementation
"""

from typing import Dict, Any
from datetime import datetime

from .base import BaseAIProvider
from app.utils.logger import setup_logger

logger = setup_logger("anthropic_provider")

class AnthropicProvider(BaseAIProvider):
    """Anthropic Claude Provider"""
    
    def __init__(self, api_key: str):
        super().__init__(api_key, "anthropic")
        self.base_url = "https://api.anthropic.com/v1"
    
    def _build_headers(self) -> Dict[str, str]:
        """Build Anthropic request headers"""
        return {
            "Content-Type": "application/json",
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01"
        }
    
    def _build_payload(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Build Anthropic request payload"""
        model = kwargs.get("model", self.get_default_model())
        temperature = kwargs.get("temperature", self.config.get("temperature", 0.7))
        max_tokens = kwargs.get("max_tokens", self.config.get("max_tokens", 2000))
        
        # Claude-optimized system message for social media analysis
        system_message = """You are Claude, an AI assistant created by Anthropic with deep expertise in social media analytics, digital marketing strategy, and data-driven decision making.

Your analytical framework includes:

🎯 STRATEGIC ANALYSIS
- Platform algorithm understanding and optimization
- Audience psychology and behavioral patterns  
- Content performance attribution and correlation analysis
- Competitive benchmarking and market positioning
- ROI measurement and business impact assessment

📊 DATA INTERPRETATION
- Statistical significance testing and confidence intervals
- Trend analysis with predictive modeling
- Segmentation analysis and persona development
- A/B testing methodology and results interpretation
- Attribution modeling across touchpoints

🚀 ACTIONABLE RECOMMENDATIONS  
- Specific, measurable, achievable, relevant, time-bound (SMART) goals
- Risk-adjusted strategy recommendations
- Resource allocation and prioritization frameworks
- Implementation roadmaps with milestones
- Success metrics and KPI definition

Always provide:
1. Clear, evidence-based insights
2. Specific numeric targets when possible
3. Implementation timelines
4. Expected outcomes with confidence levels
5. Potential risks and mitigation strategies

Be thorough, analytical, and actionable in every response."""

        return {
            "model": model,
            "system": system_message,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "max_tokens": max_tokens,
            "temperature": temperature,
            "top_p": 0.9,
            "stop_sequences": ["Human:", "Assistant:"]
        }
    
    async def generate_response(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate response using Anthropic Claude"""
        try:
            url = f"{self.base_url}/messages"
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
                        "provider": self.provider_name,
                        "stop_reason": data.get("stop_reason"),
                        "stop_sequence": data.get("stop_sequence"),
                        "usage": data.get("usage", {}),
                        "message_id": data.get("id"),
                        "role": data.get("role"),
                        "content_type": data.get("content", [{}])[0].get("type") if data.get("content") else None
                    }
                }
            else:
                logger.error(f"❌ Anthropic request failed: {response['error']}")
                return {
                    "content": "Error generating response from Claude",
                    "confidence": 0.0,
                    "token_usage": 0,
                    "response_time": processing_time,
                    "metadata": {"error": response["error"]},
                    "error": response["error"]
                }
                
        except Exception as e:
            logger.error(f"❌ Anthropic provider error: {str(e)}")
            return {
                "content": "Error in Anthropic provider",
                "confidence": 0.0,
                "token_usage": 0,
                "response_time": 0,
                "metadata": {"error": str(e)},
                "error": str(e)
            }
    
    def _extract_content(self, response_data: Dict[str, Any]) -> str:
        """Extract content from Anthropic response"""
        try:
            content_blocks = response_data.get("content", [])
            if content_blocks and len(content_blocks) > 0:
                # Get text from first content block
                first_block = content_blocks[0]
                if first_block.get("type") == "text":
                    return first_block.get("text", "").strip()
            return "No content available"
        except (KeyError, IndexError, TypeError):
            return "No content available"
    
    def _calculate_confidence(self, response_data: Dict[str, Any]) -> float:
        """Calculate confidence based on Claude response characteristics"""
        try:
            stop_reason = response_data.get("stop_reason")
            content_blocks = response_data.get("content", [])
            usage = response_data.get("usage", {})
            
            # Base confidence from stop reason
            if stop_reason == "end_turn":
                base_confidence = 0.92  # Claude completed naturally
            elif stop_reason == "max_tokens":
                base_confidence = 0.78  # Hit token limit
            elif stop_reason == "stop_sequence":
                base_confidence = 0.85  # Stopped at sequence
            else:
                base_confidence = 0.7
            
            # Analyze content quality
            if content_blocks:
                content = content_blocks[0].get("text", "")
                content_length = len(content)
                
                # Length-based confidence adjustment
                if content_length > 800:  # Comprehensive
                    base_confidence += 0.03
                elif content_length < 200:  # Too brief
                    base_confidence -= 0.08
                
                # Quality indicators (Claude-specific patterns)
                quality_indicators = [
                    "analysis", "recommend", "strategy", "data shows",
                    "based on", "specifically", "measurable", "actionable",
                    "evidence", "correlation", "trend", "performance"
                ]
                
                indicator_count = sum(1 for indicator in quality_indicators 
                                    if indicator in content.lower())
                
                # Claude tends to be thorough and analytical
                if indicator_count >= 4:
                    base_confidence += 0.04
                elif indicator_count >= 2:
                    base_confidence += 0.02
                
                # Check for structured response (Claude strength)
                if any(marker in content for marker in ["1.", "2.", "3.", "•", "-", "**"]):
                    base_confidence += 0.02
            
            # Token usage efficiency
            input_tokens = usage.get("input_tokens", 0)
            output_tokens = usage.get("output_tokens", 0)
            
            if output_tokens > input_tokens * 0.4:  # Good expansion ratio
                base_confidence += 0.02
            
            return min(0.96, max(0.4, base_confidence))
            
        except (KeyError, IndexError, TypeError):
            return 0.75  # Claude default confidence
    
    def _extract_token_usage(self, response_data: Dict[str, Any]) -> int:
        """Extract token usage from Anthropic response"""
        try:
            usage = response_data.get("usage", {})
            input_tokens = usage.get("input_tokens", 0)
            output_tokens = usage.get("output_tokens", 0)
            return input_tokens + output_tokens
        except (KeyError, TypeError):
            return 0
    
    async def health_check(self) -> Dict[str, Any]:
        """Check Anthropic API health"""
        try:
            test_prompt = """Analyze this social media performance summary:

Platform: LinkedIn
Engagement Rate: 6.8%
Impressions: 25,000
Clicks: 1,200
Comments: 85
Shares: 32
Industry: B2B Technology

Provide one key insight and one strategic recommendation with expected outcomes."""
            
            response = await self.generate_response(test_prompt)
            content = response.get("content", "")
            
            # Check for Claude's typical analytical depth
            quality_markers = [
                len(content) > 100,  # Substantial response
                "insight" in content.lower() or "analysis" in content.lower(),
                "recommend" in content.lower() or "strategy" in content.lower(),
                any(marker in content for marker in ["based on", "indicates", "suggests"]),
                response.get("confidence", 0) > 0.7
            ]
            
            quality_score = sum(quality_markers)
            
            if "error" not in response and quality_score >= 3:
                return {
                    "status": "healthy",
                    "provider": self.provider_name,
                    "response_time": response.get("response_time", 0),
                    "confidence": response.get("confidence", 0),
                    "model": self.get_default_model(),
                    "quality_score": f"{quality_score}/5",
                    "content_length": len(content),
                    "analytical_depth": "high" if quality_score >= 4 else "medium",
                    "last_check": datetime.utcnow().isoformat()
                }
            else:
                return {
                    "status": "unhealthy",
                    "provider": self.provider_name,
                    "error": response.get("error", f"Quality insufficient (score: {quality_score}/5)"),
                    "quality_score": f"{quality_score}/5",
                    "last_check": datetime.utcnow().isoformat()
                }
                
        except Exception as e:
            return {
                "status": "unhealthy",
                "provider": self.provider_name,
                "error": str(e),
                "last_check": datetime.utcnow().isoformat()
            }
    
    async def count_tokens(self, text: str) -> Dict[str, Any]:
        """Count tokens for text (Claude-specific endpoint)"""
        try:
            url = f"{self.base_url}/messages/count_tokens"
            headers = self._build_headers()
            payload = {
                "model": self.get_default_model(),
                "messages": [{"role": "user", "content": text}]
            }
            
            response = await self._make_request(url, headers, payload)
            
            if response["success"]:
                return {
                    "success": True,
                    "input_tokens": response["data"].get("input_tokens", 0)
                }
            else:
                return {"success": False, "error": response["error"]}
                
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def get_claude_optimization_guide(self) -> Dict[str, Any]:
        """Get Claude-specific optimization recommendations"""
        return {
            "prompt_design": {
                "structure": [
                    "Provide clear context and objectives",
                    "Use specific examples when possible", 
                    "Ask for step-by-step reasoning",
                    "Request structured outputs (lists, sections)",
                    "Specify desired level of detail"
                ],
                "claude_strengths": [
                    "Analytical reasoning and synthesis",
                    "Balanced, nuanced perspectives",
                    "Ethical considerations and risk assessment",
                    "Structured, well-organized responses",
                    "Professional tone and clarity"
                ]
            },
            "parameter_optimization": {
                "temperature": {
                    "analytical_tasks": 0.3,  # More focused
                    "creative_strategy": 0.7,  # Balanced
                    "brainstorming": 0.9      # More creative
                },
                "max_tokens": {
                    "brief_insights": 500,
                    "standard_analysis": 1500, 
                    "comprehensive_report": 3000
                },
                "top_p": 0.9  # Good balance for Claude
            },
            "best_practices": [
                "Leverage Claude's analytical strengths",
                "Ask for evidence-based reasoning",
                "Request risk assessments",
                "Use Claude for complex strategy development",
                "Ask for structured, actionable outputs"
            ]
        }