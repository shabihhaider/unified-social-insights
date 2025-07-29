"""
app/services/orchestrator.py - AI Orchestrator for Multi-Provider Integration
"""

import asyncio
import json
import logging
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
import numpy as np
from dataclasses import dataclass

from app.providers.openai_provider import OpenAIProvider
from app.providers.groq_provider import GroqProvider  
from app.providers.gemini_provider import GeminiProvider
from app.providers.deepseek_provider import DeepSeekProvider
from app.providers.anthropic_provider import AnthropicProvider
from app.services.cache import CacheManager
from app.config import settings
from app.utils.logger import setup_logger

logger = setup_logger("ai_orchestrator")

@dataclass
class InsightResult:
    """Structure for AI insight results"""
    provider: str
    content: str
    confidence: float
    processing_time: float
    token_usage: int
    metadata: Dict[str, Any]

class AIOrchestrator:
    """Enhanced AI Orchestrator for multi-provider insights generation"""
    
    def __init__(self):
        self.providers = {}
        self.cache_manager = CacheManager()
        self._initialize_providers()
        
    def _initialize_providers(self):
        """Initialize all available AI providers"""
        try:
            # OpenAI
            if settings.OPENAI_API_KEY:
                self.providers['openai'] = OpenAIProvider(settings.OPENAI_API_KEY)
                
            # Groq
            if settings.GROQ_API_KEY:
                self.providers['groq'] = GroqProvider(settings.GROQ_API_KEY)
                
            # Gemini
            if settings.GEMINI_API_KEY:
                self.providers['gemini'] = GeminiProvider(settings.GEMINI_API_KEY)
                
            # DeepSeek
            if settings.DEEPSEEK_API_KEY:
                self.providers['deepseek'] = DeepSeekProvider(settings.DEEPSEEK_API_KEY)
                
            # Anthropic
            if settings.ANTHROPIC_API_KEY:
                self.providers['anthropic'] = AnthropicProvider(settings.ANTHROPIC_API_KEY)
                
            logger.info(f"✅ Initialized {len(self.providers)} AI providers: {list(self.providers.keys())}")
            
        except Exception as e:
            logger.error(f"❌ Error initializing providers: {str(e)}")
    
    async def generate_comprehensive_insights(
        self,
        username: str,
        platform: str,
        metadata: Dict[str, Any],
        historical_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate comprehensive insights using multiple AI providers"""
        
        cache_key = f"insights:{username}:{platform}:{hash(str(metadata))}"
        
        # Check cache first
        cached_result = await self.cache_manager.get(cache_key)
        if cached_result:
            logger.info(f"📄 Retrieved cached insights for {username}")
            return json.loads(cached_result)
        
        insights = {}
        
        try:
            # Generate different types of insights
            insights_tasks = [
                self._generate_engagement_analysis(username, platform, metadata, historical_data),
                self._generate_content_analysis(username, platform, metadata, historical_data),
                self._generate_audience_insights(username, platform, metadata, historical_data),
                self._generate_performance_trends(username, platform, metadata, historical_data),
                self._generate_recommendations(username, platform, metadata, historical_data)
            ]
            
            results = await asyncio.gather(*insights_tasks, return_exceptions=True)
            
            # Compile results
            insight_types = [
                "engagement_analysis",
                "content_analysis", 
                "audience_insights",
                "performance_trends",
                "recommendations"
            ]
            
            for i, result in enumerate(results):
                if not isinstance(result, Exception):
                    insights[insight_types[i]] = result
                else:
                    logger.error(f"❌ Error generating {insight_types[i]}: {str(result)}")
                    insights[insight_types[i]] = {"error": str(result)}
            
            # Add metadata
            insights["metadata"] = {
                "generated_at": datetime.utcnow().isoformat(),
                "username": username,
                "platform": platform,
                "providers_used": list(self.providers.keys()),
                "data_period": self._get_data_period(metadata)
            }
            
            # Cache the result
            await self.cache_manager.set(
                cache_key,
                json.dumps(insights),
                expire=settings.CACHE_TTL
            )
            
            logger.info(f"✅ Generated comprehensive insights for {username} ({platform})")
            return insights
            
        except Exception as e:
            logger.error(f"❌ Error generating insights for {username}: {str(e)}")
            return {"error": str(e)}
    
    async def _generate_engagement_analysis(
        self,
        username: str,
        platform: str,
        metadata: Dict[str, Any],
        historical_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate detailed engagement analysis"""
        
        prompt = self._build_engagement_prompt(username, platform, metadata, historical_data)
        
        # Use multiple providers for engagement analysis
        providers_to_use = ["openai", "groq", "gemini"]
        results = await self._query_multiple_providers(prompt, providers_to_use)
        
        # Synthesize results
        synthesis = await self._synthesize_results(results, "engagement_analysis")
        
        return {
            "synthesis": synthesis,
            "provider_results": results,
            "metrics": self._calculate_engagement_metrics(metadata),
            "trends": self._analyze_engagement_trends(historical_data),
            "insights": await self._extract_key_insights(synthesis, "engagement")
        }
    
    async def _generate_content_analysis(
        self,
        username: str,
        platform: str,
        metadata: Dict[str, Any],
        historical_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate detailed content analysis"""
        
        prompt = self._build_content_prompt(username, platform, metadata, historical_data)
        
        providers_to_use = ["openai", "anthropic", "deepseek"]
        results = await self._query_multiple_providers(prompt, providers_to_use)
        
        synthesis = await self._synthesize_results(results, "content_analysis")
        
        return {
            "synthesis": synthesis,
            "provider_results": results,
            "content_performance": self._analyze_content_performance(metadata),
            "topic_analysis": await self._analyze_content_topics(metadata),
            "sentiment_analysis": await self._analyze_sentiment(metadata),
            "hashtag_performance": self._analyze_hashtag_performance(metadata)
        }
    
    async def _generate_audience_insights(
        self,
        username: str,
        platform: str,
        metadata: Dict[str, Any],
        historical_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate audience analysis and insights"""
        
        prompt = self._build_audience_prompt(username, platform, metadata, historical_data)
        
        providers_to_use = ["gemini", "anthropic", "openai"]
        results = await self._query_multiple_providers(prompt, providers_to_use)
        
        synthesis = await self._synthesize_results(results, "audience_analysis")
        
        return {
            "synthesis": synthesis,
            "provider_results": results,
            "demographics": self._analyze_demographics(metadata),
            "behavior_patterns": self._analyze_behavior_patterns(historical_data),
            "growth_analysis": self._analyze_growth_patterns(historical_data),
            "engagement_patterns": self._analyze_audience_engagement(metadata)
        }
    
    async def _generate_performance_trends(
        self,
        username: str,
        platform: str,
        metadata: Dict[str, Any],
        historical_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate performance trends analysis"""
        
        prompt = self._build_trends_prompt(username, platform, metadata, historical_data)
        
        providers_to_use = ["groq", "deepseek", "openai"]
        results = await self._query_multiple_providers(prompt, providers_to_use)
        
        synthesis = await self._synthesize_results(results, "trends_analysis")
        
        return {
            "synthesis": synthesis,
            "provider_results": results,
            "daily_trends": self._analyze_daily_trends(historical_data),
            "weekly_patterns": self._analyze_weekly_patterns(historical_data),
            "monthly_overview": self._analyze_monthly_patterns(historical_data),
            "performance_metrics": self._calculate_performance_metrics(metadata, historical_data)
        }
    
    async def _generate_recommendations(
        self,
        username: str,
        platform: str,
        metadata: Dict[str, Any],
        historical_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate actionable recommendations"""
        
        prompt = self._build_recommendations_prompt(username, platform, metadata, historical_data)
        
        # Use all available providers for comprehensive recommendations
        providers_to_use = list(self.providers.keys())
        results = await self._query_multiple_providers(prompt, providers_to_use)
        
        synthesis = await self._synthesize_results(results, "recommendations")
        
        return {
            "synthesis": synthesis,
            "provider_results": results,
            "posting_optimization": await self._generate_posting_recommendations(historical_data),
            "content_suggestions": await self._generate_content_suggestions(metadata),
            "hashtag_recommendations": await self._generate_hashtag_suggestions(metadata),
            "engagement_strategies": await self._generate_engagement_strategies(metadata, historical_data),
            "growth_tactics": await self._generate_growth_recommendations(historical_data)
        }
    
    async def _query_multiple_providers(
        self,
        prompt: str,
        providers: List[str]
    ) -> List[InsightResult]:
        """Query multiple AI providers concurrently"""
        
        tasks = []
        for provider_name in providers:
            if provider_name in self.providers:
                provider = self.providers[provider_name]
                task = self._query_single_provider(provider, provider_name, prompt)
                tasks.append(task)
        
        if not tasks:
            logger.warning("No available providers for query")
            return []
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Filter out exceptions
        valid_results = [r for r in results if not isinstance(r, Exception)]
        
        return valid_results
    
    async def _query_single_provider(
        self,
        provider,
        provider_name: str,
        prompt: str
    ) -> InsightResult:
        """Query a single AI provider"""
        
        start_time = datetime.utcnow()
        
        try:
            response = await provider.generate_response(prompt)
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            
            return InsightResult(
                provider=provider_name,
                content=response.get("content", ""),
                confidence=response.get("confidence", 0.8),
                processing_time=processing_time,
                token_usage=response.get("token_usage", 0),
                metadata=response.get("metadata", {})
            )
            
        except Exception as e:
            logger.error(f"❌ Error querying {provider_name}: {str(e)}")
            raise e
    
    async def _synthesize_results(
        self,
        results: List[InsightResult],
        analysis_type: str
    ) -> Dict[str, Any]:
        """Synthesize results from multiple AI providers"""
        
        if not results:
            return {"synthesis": "No results available", "confidence": 0.0}
        
        # Create synthesis prompt
        synthesis_prompt = f"""
        You are an expert social media analyst. Synthesize the following {analysis_type} results from multiple AI providers into a comprehensive, actionable insight.
        
        Provider Results:
        {json.dumps([{"provider": r.provider, "content": r.content} for r in results], indent=2)}
        
        Provide a synthesized analysis that:
        1. Combines the best insights from all providers
        2. Resolves any contradictions with reasoning
        3. Provides specific, actionable recommendations
        4. Includes confidence levels for key insights
        5. Highlights areas where providers agree/disagree
        
        Format as structured JSON with clear sections.
        """
        
        # Use the highest-performing provider for synthesis
        best_provider = max(results, key=lambda r: r.confidence)
        synthesis_result = await self._query_single_provider(
            self.providers[best_provider.provider],
            best_provider.provider,
            synthesis_prompt
        )
        
        return {
            "synthesized_content": synthesis_result.content,
            "confidence": np.mean([r.confidence for r in results]),
            "provider_count": len(results),
            "synthesis_provider": best_provider.provider,
            "processing_time": sum([r.processing_time for r in results]),
            "agreement_score": self._calculate_agreement_score(results)
        }
    
    def _calculate_agreement_score(self, results: List[InsightResult]) -> float:
        """Calculate agreement score between providers"""
        if len(results) < 2:
            return 1.0
        
        # Simple implementation - can be enhanced with NLP similarity
        contents = [r.content.lower() for r in results]
        agreement_score = 0.0
        comparisons = 0
        
        for i in range(len(contents)):
            for j in range(i + 1, len(contents)):
                # Basic similarity check (can be enhanced)
                common_words = set(contents[i].split()) & set(contents[j].split())
                total_words = set(contents[i].split()) | set(contents[j].split())
                
                if total_words:
                    similarity = len(common_words) / len(total_words)
                    agreement_score += similarity
                    comparisons += 1
        
        return agreement_score / comparisons if comparisons > 0 else 0.0
    
    async def get_provider_status(self) -> Dict[str, Any]:
        """Get status of all AI providers"""
        status = {}
        
        for provider_name, provider in self.providers.items():
            try:
                # Test provider with simple query
                test_response = await provider.generate_response("Test connection")
                status[provider_name] = {
                    "status": "online",
                    "response_time": test_response.get("response_time", 0),
                    "last_check": datetime.utcnow().isoformat()
                }
            except Exception as e:
                status[provider_name] = {
                    "status": "offline",
                    "error": str(e),
                    "last_check": datetime.utcnow().isoformat()
                }
        
        return status
    
    # Helper methods for building prompts
    def _build_engagement_prompt(self, username: str, platform: str, metadata: Dict, historical: Dict) -> str:
        return f"""
        Analyze engagement metrics for {platform} account "{username}".
        
        Current Metrics: {json.dumps(metadata, indent=2)}
        Historical Data: {json.dumps(historical, indent=2)}
        
        Provide detailed analysis of:
        1. Engagement rate trends and patterns
        2. Peak engagement times and days
        3. Content types driving highest engagement
        4. Audience interaction patterns
        5. Comparison with platform benchmarks
        6. Specific improvement opportunities
        
        Be specific with numbers and provide actionable insights.
        """
    
    def _build_content_prompt(self, username: str, platform: str, metadata: Dict, historical: Dict) -> str:
        return f"""
        Analyze content performance for {platform} account "{username}".
        
        Content Data: {json.dumps(metadata, indent=2)}
        Historical Performance: {json.dumps(historical, indent=2)}
        
        Analyze:
        1. Top-performing content types and formats
        2. Content themes and topics that resonate
        3. Optimal posting frequency and timing
        4. Hashtag effectiveness and reach
        5. Visual content vs text performance
        6. Content length and engagement correlation
        
        Provide specific content strategy recommendations.
        """
    
    def _build_audience_prompt(self, username: str, platform: str, metadata: Dict, historical: Dict) -> str:
        return f"""
        Analyze audience insights for {platform} account "{username}".
        
        Audience Data: {json.dumps(metadata, indent=2)}
        Historical Audience Data: {json.dumps(historical, indent=2)}
        
        Analyze:
        1. Audience demographics and geographic distribution
        2. Follower growth patterns and trends
        3. Audience behavior and engagement patterns
        4. Peak activity times of your audience
        5. Content preferences by audience segments
        6. Audience overlap with competitors
        
        Provide audience targeting and engagement strategies.
        """
    
    def _build_trends_prompt(self, username: str, platform: str, metadata: Dict, historical: Dict) -> str:
        return f"""
        Analyze performance trends for {platform} account "{username}".
        
        Current Performance: {json.dumps(metadata, indent=2)}
        Historical Trends: {json.dumps(historical, indent=2)}
        
        Analyze:
        1. Growth trajectory and velocity
        2. Seasonal patterns and trends
        3. Performance consistency
        4. Metric correlation analysis
        5. Trend forecasting and projections
        6. Platform algorithm impact
        
        Provide trend-based strategic recommendations.
        """
    
    def _build_recommendations_prompt(self, username: str, platform: str, metadata: Dict, historical: Dict) -> str:
        return f"""
        Generate actionable recommendations for {platform} account "{username}".
        
        Account Data: {json.dumps(metadata, indent=2)}
        Performance History: {json.dumps(historical, indent=2)}
        
        Provide specific recommendations for:
        1. Content strategy optimization
        2. Posting schedule and frequency
        3. Hashtag and keyword strategy
        4. Audience engagement tactics
        5. Growth acceleration methods
        6. Platform-specific best practices
        
        Make recommendations specific, measurable, and actionable.
        """
    
    # Analytics helper methods
    def _calculate_engagement_metrics(self, metadata: Dict) -> Dict[str, Any]:
        """Calculate detailed engagement metrics"""
        try:
            total_engagement = metadata.get('likes', 0) + metadata.get('comments', 0) + metadata.get('shares', 0)
            followers = metadata.get('followers', 1)
            posts = metadata.get('posts_count', 1)
            
            return {
                "engagement_rate": round((total_engagement / followers) * 100, 2),
                "avg_engagement_per_post": round(total_engagement / posts, 2),
                "like_rate": round((metadata.get('likes', 0) / followers) * 100, 2),
                "comment_rate": round((metadata.get('comments', 0) / followers) * 100, 2),
                "share_rate": round((metadata.get('shares', 0) / followers) * 100, 2),
                "total_engagement": total_engagement,
                "engagement_velocity": self._calculate_engagement_velocity(metadata)
            }
        except Exception as e:
            logger.error(f"Error calculating engagement metrics: {str(e)}")
            return {}
    
    def _calculate_engagement_velocity(self, metadata: Dict) -> float:
        """Calculate engagement velocity (engagement per time unit)"""
        try:
            recent_posts = metadata.get('recent_posts', [])
            if not recent_posts:
                return 0.0
            
            total_engagement = sum([
                post.get('likes', 0) + post.get('comments', 0) + post.get('shares', 0)
                for post in recent_posts
            ])
            
            time_span_hours = len(recent_posts) * 24  # Assuming daily posts
            return round(total_engagement / time_span_hours, 2) if time_span_hours > 0 else 0.0
            
        except Exception:
            return 0.0
    
    def _analyze_engagement_trends(self, historical_data: Dict) -> Dict[str, Any]:
        """Analyze engagement trends over time"""
        try:
            trends = historical_data.get('engagement_history', [])
            if len(trends) < 2:
                return {"trend": "insufficient_data"}
            
            recent_avg = np.mean([t.get('engagement', 0) for t in trends[-7:]])
            previous_avg = np.mean([t.get('engagement', 0) for t in trends[-14:-7]])
            
            trend_direction = "increasing" if recent_avg > previous_avg else "decreasing"
            trend_strength = abs(recent_avg - previous_avg) / previous_avg if previous_avg > 0 else 0
            
            return {
                "trend_direction": trend_direction,
                "trend_strength": round(trend_strength * 100, 2),
                "recent_average": round(recent_avg, 2),
                "previous_average": round(previous_avg, 2),
                "peak_engagement": max([t.get('engagement', 0) for t in trends]),
                "consistency_score": self._calculate_consistency_score(trends)
            }
        except Exception as e:
            logger.error(f"Error analyzing engagement trends: {str(e)}")
            return {}
    
    def _calculate_consistency_score(self, trends: List[Dict]) -> float:
        """Calculate consistency score for engagement"""
        try:
            engagements = [t.get('engagement', 0) for t in trends]
            if len(engagements) < 2:
                return 0.0
            
            mean_engagement = np.mean(engagements)
            std_engagement = np.std(engagements)
            
            # Consistency score: lower variance = higher consistency
            consistency = 1 - (std_engagement / mean_engagement) if mean_engagement > 0 else 0
            return round(max(0, min(1, consistency)), 2)
            
        except Exception:
            return 0.0
    
    def _analyze_content_performance(self, metadata: Dict) -> Dict[str, Any]:
        """Analyze content performance patterns"""
        try:
            posts = metadata.get('recent_posts', [])
            if not posts:
                return {"status": "no_data"}
            
            # Analyze by content type
            content_types = {}
            for post in posts:
                content_type = post.get('type', 'unknown')
                if content_type not in content_types:
                    content_types[content_type] = []
                
                engagement = post.get('likes', 0) + post.get('comments', 0) + post.get('shares', 0)
                content_types[content_type].append(engagement)
            
            # Calculate averages
            type_performance = {}
            for content_type, engagements in content_types.items():
                type_performance[content_type] = {
                    "avg_engagement": round(np.mean(engagements), 2),
                    "post_count": len(engagements),
                    "total_engagement": sum(engagements)
                }
            
            return {
                "by_content_type": type_performance,
                "best_performing_type": max(type_performance.keys(), 
                                          key=lambda k: type_performance[k]["avg_engagement"]),
                "total_posts_analyzed": len(posts)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing content performance: {str(e)}")
            return {}
    
    async def _analyze_content_topics(self, metadata: Dict) -> Dict[str, Any]:
        """Analyze content topics and themes"""
        try:
            posts = metadata.get('recent_posts', [])
            if not posts:
                return {"status": "no_data"}
            
            # Extract topics from post content (simplified approach)
            topics = {}
            for post in posts:
                content = post.get('content', '').lower()
                hashtags = post.get('hashtags', [])
                
                # Simple keyword extraction
                words = content.split()
                for word in words:
                    if len(word) > 4 and word.isalpha():  # Basic filtering
                        if word not in topics:
                            topics[word] = 0
                        topics[word] += 1
                
                # Include hashtags
                for hashtag in hashtags:
                    hashtag_clean = hashtag.replace('#', '').lower()
                    if hashtag_clean not in topics:
                        topics[hashtag_clean] = 0
                    topics[hashtag_clean] += 2  # Weight hashtags more
            
            # Get top topics
            top_topics = sorted(topics.items(), key=lambda x: x[1], reverse=True)[:10]
            
            return {
                "top_topics": dict(top_topics),
                "topic_diversity": len(topics),
                "posts_analyzed": len(posts)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing content topics: {str(e)}")
            return {}
    
    async def _analyze_sentiment(self, metadata: Dict) -> Dict[str, Any]:
        """Analyze sentiment of content and engagement"""
        try:
            posts = metadata.get('recent_posts', [])
            if not posts:
                return {"status": "no_data"}
            
            # Simple sentiment analysis (can be enhanced with proper NLP)
            positive_words = ['great', 'amazing', 'love', 'awesome', 'fantastic', 'excellent', 'wonderful']
            negative_words = ['bad', 'terrible', 'hate', 'awful', 'horrible', 'disappointing']
            
            sentiment_scores = []
            for post in posts:
                content = post.get('content', '').lower()
                words = content.split()
                
                positive_count = sum(1 for word in words if word in positive_words)
                negative_count = sum(1 for word in words if word in negative_words)
                
                if positive_count + negative_count > 0:
                    sentiment = (positive_count - negative_count) / (positive_count + negative_count)
                else:
                    sentiment = 0
                
                sentiment_scores.append(sentiment)
            
            avg_sentiment = np.mean(sentiment_scores) if sentiment_scores else 0
            
            return {
                "average_sentiment": round(avg_sentiment, 2),
                "sentiment_distribution": {
                    "positive": len([s for s in sentiment_scores if s > 0.1]),
                    "neutral": len([s for s in sentiment_scores if -0.1 <= s <= 0.1]),
                    "negative": len([s for s in sentiment_scores if s < -0.1])
                },
                "posts_analyzed": len(posts)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {str(e)}")
            return {}
    
    def _analyze_hashtag_performance(self, metadata: Dict) -> Dict[str, Any]:
        """Analyze hashtag performance and effectiveness"""
        try:
            posts = metadata.get('recent_posts', [])
            if not posts:
                return {"status": "no_data"}
            
            hashtag_performance = {}
            for post in posts:
                hashtags = post.get('hashtags', [])
                engagement = post.get('likes', 0) + post.get('comments', 0) + post.get('shares', 0)
                
                for hashtag in hashtags:
                    hashtag_clean = hashtag.replace('#', '').lower()
                    if hashtag_clean not in hashtag_performance:
                        hashtag_performance[hashtag_clean] = {'engagements': [], 'usage_count': 0}
                    
                    hashtag_performance[hashtag_clean]['engagements'].append(engagement)
                    hashtag_performance[hashtag_clean]['usage_count'] += 1
            
            # Calculate averages
            hashtag_stats = {}
            for hashtag, data in hashtag_performance.items():
                hashtag_stats[hashtag] = {
                    "avg_engagement": round(np.mean(data['engagements']), 2),
                    "usage_count": data['usage_count'],
                    "total_engagement": sum(data['engagements'])
                }
            
            # Sort by performance
            top_hashtags = sorted(hashtag_stats.items(), 
                                key=lambda x: x[1]["avg_engagement"], reverse=True)[:10]
            
            return {
                "top_performing_hashtags": dict(top_hashtags),
                "total_unique_hashtags": len(hashtag_stats),
                "hashtag_diversity": len(hashtag_stats) / len(posts) if posts else 0
            }
            
        except Exception as e:
            logger.error(f"Error analyzing hashtag performance: {str(e)}")
            return {}
    
    def _get_data_period(self, metadata: Dict) -> str:
        """Extract data period from metadata"""
        try:
            if 'date_range' in metadata:
                return metadata['date_range']
            elif 'recent_posts' in metadata and metadata['recent_posts']:
                return f"Last {len(metadata['recent_posts'])} posts"
            else:
                return "Current snapshot"
        except Exception:
            return "Unknown period"
    
    async def _extract_key_insights(self, synthesis: Dict, insight_type: str) -> List[str]:
        """Extract key actionable insights from synthesis"""
        try:
            content = synthesis.get('synthesized_content', '')
            
            # Simple insight extraction (can be enhanced with NLP)
            insights = []
            sentences = content.split('.')
            
            for sentence in sentences:
                sentence = sentence.strip()
                if any(keyword in sentence.lower() for keyword in 
                      ['recommend', 'should', 'improve', 'increase', 'optimize', 'focus']):
                    if len(sentence) > 20:  # Filter out short fragments
                        insights.append(sentence + '.')
            
            return insights[:5]  # Return top 5 insights
            
        except Exception as e:
            logger.error(f"Error extracting insights: {str(e)}")
            return []
    
    # Additional analytics methods would continue here...
    def _analyze_demographics(self, metadata: Dict) -> Dict[str, Any]:
        """Analyze audience demographics"""
        demographics = metadata.get('demographics', {})
        return {
            "age_distribution": demographics.get('age_groups', {}),
            "gender_distribution": demographics.get('gender', {}),
            "location_distribution": demographics.get('locations', {}),
            "device_usage": demographics.get('devices', {}),
            "activity_patterns": demographics.get('activity_times', {})
        }
    
    def _analyze_behavior_patterns(self, historical_data: Dict) -> Dict[str, Any]:
        """Analyze audience behavior patterns"""
        try:
            behavior_data = historical_data.get('audience_behavior', [])
            if not behavior_data:
                return {"status": "no_data"}
            
            # Analyze engagement patterns
            engagement_by_hour = {}
            engagement_by_day = {}
            
            for data_point in behavior_data:
                hour = data_point.get('hour', 0)
                day = data_point.get('day_of_week', 0)
                engagement = data_point.get('engagement', 0)
                
                if hour not in engagement_by_hour:
                    engagement_by_hour[hour] = []
                engagement_by_hour[hour].append(engagement)
                
                if day not in engagement_by_day:
                    engagement_by_day[day] = []
                engagement_by_day[day].append(engagement)
            
            # Calculate averages
            hourly_avg = {hour: np.mean(engagements) for hour, engagements in engagement_by_hour.items()}
            daily_avg = {day: np.mean(engagements) for day, engagements in engagement_by_day.items()}
            
            return {
                "peak_engagement_hour": max(hourly_avg.keys(), key=lambda k: hourly_avg[k]),
                "peak_engagement_day": max(daily_avg.keys(), key=lambda k: daily_avg[k]),
                "hourly_patterns": hourly_avg,
                "daily_patterns": daily_avg
            }
            
        except Exception as e:
            logger.error(f"Error analyzing behavior patterns: {str(e)}")
            return {}
    
    def _analyze_growth_patterns(self, historical_data: Dict) -> Dict[str, Any]:
        """Analyze follower growth patterns"""
        try:
            growth_data = historical_data.get('follower_growth', [])
            if len(growth_data) < 2:
                return {"status": "insufficient_data"}
            
            # Calculate growth rate
            recent_followers = growth_data[-1].get('followers', 0)
            previous_followers = growth_data[0].get('followers', 1)
            
            growth_rate = ((recent_followers - previous_followers) / previous_followers) * 100
            
            # Analyze growth velocity
            daily_growth = []
            for i in range(1, len(growth_data)):
                current = growth_data[i].get('followers', 0)
                previous = growth_data[i-1].get('followers', 0)
                daily_growth.append(current - previous)
            
            return {
                "overall_growth_rate": round(growth_rate, 2),
                "avg_daily_growth": round(np.mean(daily_growth), 2),
                "growth_consistency": self._calculate_consistency_score([{"engagement": g} for g in daily_growth]),
                "peak_growth_day": max(daily_growth) if daily_growth else 0,
                "growth_trend": "accelerating" if daily_growth[-3:] > daily_growth[:3] else "decelerating"
            }
            
        except Exception as e:
            logger.error(f"Error analyzing growth patterns: {str(e)}")
            return {}
    
    async def _generate_posting_recommendations(self, historical_data: Dict) -> Dict[str, Any]:
        """Generate posting schedule recommendations"""
        try:
            posting_data = historical_data.get('posting_patterns', [])
            if not posting_data:
                return {"recommendation": "Analyze posting patterns over time for optimal scheduling"}
            
            # Analyze best performing times
            performance_by_hour = {}
            for post in posting_data:
                hour = post.get('hour', 0)
                engagement = post.get('engagement', 0)
                
                if hour not in performance_by_hour:
                    performance_by_hour[hour] = []
                performance_by_hour[hour].append(engagement)
            
            # Calculate optimal times
            hourly_avg = {hour: np.mean(engagements) for hour, engagements in performance_by_hour.items()}
            optimal_hours = sorted(hourly_avg.keys(), key=lambda k: hourly_avg[k], reverse=True)[:3]
            
            return {
                "optimal_posting_hours": optimal_hours,
                "recommended_frequency": self._calculate_optimal_frequency(posting_data),
                "peak_engagement_window": f"{min(optimal_hours)}:00 - {max(optimal_hours)}:00",
                "posting_consistency_score": self._analyze_posting_consistency(posting_data)
            }
            
        except Exception as e:
            logger.error(f"Error generating posting recommendations: {str(e)}")
            return {}
    
    def _calculate_optimal_frequency(self, posting_data: List[Dict]) -> str:
        """Calculate optimal posting frequency"""
        try:
            if len(posting_data) < 7:
                return "1-2 posts per day"
            
            # Analyze frequency vs engagement correlation
            daily_posts = {}
            for post in posting_data:
                date = post.get('date', '')
                if date not in daily_posts:
                    daily_posts[date] = {'count': 0, 'total_engagement': 0}
                
                daily_posts[date]['count'] += 1
                daily_posts[date]['total_engagement'] += post.get('engagement', 0)
            
            # Find optimal frequency
            frequency_performance = {}
            for date, data in daily_posts.items():
                count = data['count']
                avg_engagement = data['total_engagement'] / count
                
                if count not in frequency_performance:
                    frequency_performance[count] = []
                frequency_performance[count].append(avg_engagement)
            
            # Calculate averages
            freq_avg = {freq: np.mean(engagements) for freq, engagements in frequency_performance.items()}
            optimal_freq = max(freq_avg.keys(), key=lambda k: freq_avg[k])
            
            return f"{optimal_freq} posts per day"
            
        except Exception:
            return "1-2 posts per day"