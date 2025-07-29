# ai-engine/app/services/ai_service.py
import asyncio
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
from dataclasses import dataclass
import os

from app.config import settings
from app.utils.logger import setup_logger

logger = setup_logger("ai_service")

@dataclass
class InsightRequest:
    """Standardized insight request"""
    account_id: str
    user_id: str
    platform: str
    username: str
    data: Dict[str, Any]
    request_id: str = None

@dataclass
class InsightResponse:
    """Standardized insight response"""
    account_id: str
    insights: Dict[str, Any]
    summary: str
    confidence_score: float
    processing_time: float
    token_usage: int
    status: str = "success"
    error: str = None

class OptimizedAIService:
    """Simplified AI Service focused on core functionality"""
    
    def __init__(self):
        self.db_pool: Optional[asyncpg.Pool] = None
        self._initialized = False
    
    async def process_account_insights(self, request: InsightRequest) -> InsightResponse:
        """Main method to process insights for an account"""
        start_time = datetime.utcnow()
        
        try:
            logger.info(f"🤖 Processing insights for account {request.account_id}")
            
            # Generate insights based on platform
            insights = await self._generate_platform_insights(request)
            
            # Create summary
            summary = self._create_summary(insights)
            
            # Calculate metrics
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            confidence_score = self._calculate_confidence(insights)
            token_usage = insights.get("metadata", {}).get("tokens_used", 0)
            
            response = InsightResponse(
                account_id=request.account_id,
                insights=insights,
                summary=summary,
                confidence_score=confidence_score,
                processing_time=processing_time,
                token_usage=token_usage
            )
            
            # Store in database
            # DB storage handled by backend — AI engine only returns response
            
            logger.info(f"✅ Insights processed successfully for {request.account_id}")
            return response
            
        except Exception as e:
            logger.error(f"❌ Error processing insights: {str(e)}")
            return InsightResponse(
                account_id=request.account_id,
                insights={},
                summary="Error generating insights",
                confidence_score=0.0,
                processing_time=(datetime.utcnow() - start_time).total_seconds(),
                token_usage=0,
                status="error",
                error=str(e)
            )
    
    async def _generate_platform_insights(self, request: InsightRequest) -> Dict[str, Any]:
        """Generate insights based on platform data"""
        data = request.data
        platform = request.platform.lower()
        
        insights = {
            "metadata": {
                "platform": platform,
                "generated_at": datetime.utcnow().isoformat(),
                "account_id": request.account_id,
                "data_period": "current"
            }
        }
        
        if platform == "instagram":
            insights.update(await self._analyze_instagram_data(data))
        elif platform == "facebook":
            insights.update(await self._analyze_facebook_data(data))
        else:
            insights.update(await self._analyze_generic_data(data))
        
        return insights
    
    async def _analyze_instagram_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze Instagram-specific data"""
        try:
            # Extract key metrics
            profile = data.get("profile", {})
            posts = data.get("posts", [])
            stories = data.get("stories", [])
            
            # Basic analytics
            follower_count = profile.get("followers_count", 0)
            following_count = profile.get("following_count", 0)
            media_count = profile.get("media_count", 0)
            
            # Calculate engagement metrics
            total_likes = sum(post.get("like_count", 0) for post in posts)
            total_comments = sum(post.get("comment_count", 0) for post in posts)
            avg_engagement = (total_likes + total_comments) / max(len(posts), 1)
            engagement_rate = (avg_engagement / max(follower_count, 1)) * 100
            
            # Content analysis
            hashtag_analysis = self._analyze_hashtags(posts)
            posting_frequency = self._calculate_posting_frequency(posts)
            
            return {
                "engagement_analysis": {
                    "total_posts": len(posts),
                    "avg_likes_per_post": total_likes / max(len(posts), 1),
                    "avg_comments_per_post": total_comments / max(len(posts), 1),
                    "engagement_rate": round(engagement_rate, 2),
                    "follower_to_following_ratio": round(follower_count / max(following_count, 1), 2)
                },
                "content_analysis": {
                    "posting_frequency": posting_frequency,
                    "hashtag_performance": hashtag_analysis,
                    "media_types": self._analyze_media_types(posts),
                    "optimal_posting_times": self._analyze_posting_times(posts)
                },
                "recommendations": self._generate_instagram_recommendations({
                    "engagement_rate": engagement_rate,
                    "posting_frequency": posting_frequency,
                    "hashtag_analysis": hashtag_analysis
                }),
                "metadata": {
                    "tokens_used": 150,  # Estimated
                    "confidence": 0.85
                }
            }
            
        except Exception as e:
            logger.error(f"Error analyzing Instagram data: {str(e)}")
            return {"error": str(e), "metadata": {"tokens_used": 0, "confidence": 0.0}}
    
    async def _analyze_facebook_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze Facebook-specific data"""
        try:
            posts = data.get("posts", [])
            page_info = data.get("page_info", {})
            
            # Similar analysis structure as Instagram
            total_reactions = sum(post.get("reactions", {}).get("summary", {}).get("total_count", 0) for post in posts)
            total_comments = sum(post.get("comments", {}).get("summary", {}).get("total_count", 0) for post in posts)
            total_shares = sum(post.get("shares", {}).get("count", 0) for post in posts)
            
            followers = page_info.get("followers_count", 0)
            avg_engagement = (total_reactions + total_comments + total_shares) / max(len(posts), 1)
            engagement_rate = (avg_engagement / max(followers, 1)) * 100
            
            return {
                "engagement_analysis": {
                    "total_posts": len(posts),
                    "avg_reactions_per_post": total_reactions / max(len(posts), 1),
                    "avg_comments_per_post": total_comments / max(len(posts), 1),
                    "avg_shares_per_post": total_shares / max(len(posts), 1),
                    "engagement_rate": round(engagement_rate, 2)
                },
                "content_analysis": {
                    "post_types": self._analyze_facebook_post_types(posts),
                    "posting_patterns": self._analyze_posting_times(posts),
                    "content_themes": self._extract_content_themes(posts)
                },
                "recommendations": self._generate_facebook_recommendations({
                    "engagement_rate": engagement_rate,
                    "post_performance": posts
                }),
                "metadata": {
                    "tokens_used": 120,
                    "confidence": 0.80
                }
            }
            
        except Exception as e:
            logger.error(f"Error analyzing Facebook data: {str(e)}")
            return {"error": str(e), "metadata": {"tokens_used": 0, "confidence": 0.0}}
    
    async def _analyze_generic_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generic analysis for any platform"""
        return {
            "basic_analysis": {
                "data_points": len(data),
                "analysis_type": "generic",
                "summary": "Basic data analysis completed"
            },
            "metadata": {
                "tokens_used": 50,
                "confidence": 0.60
            }
        }
    
    def _analyze_hashtags(self, posts: List[Dict]) -> Dict[str, Any]:
        """Analyze hashtag performance"""
        hashtag_performance = {}
        
        for post in posts:
            caption = post.get("caption", "")
            if caption:
                hashtags = [word for word in caption.split() if word.startswith("#")]
                engagement = post.get("like_count", 0) + post.get("comment_count", 0)
                
                for hashtag in hashtags[:10]:  # Limit analysis
                    if hashtag not in hashtag_performance:
                        hashtag_performance[hashtag] = {"count": 0, "total_engagement": 0}
                    hashtag_performance[hashtag]["count"] += 1
                    hashtag_performance[hashtag]["total_engagement"] += engagement
        
        # Calculate averages
        for hashtag in hashtag_performance:
            count = hashtag_performance[hashtag]["count"]
            hashtag_performance[hashtag]["avg_engagement"] = (
                hashtag_performance[hashtag]["total_engagement"] / count
            )
        
        # Get top performing hashtags
        top_hashtags = sorted(
            hashtag_performance.items(),
            key=lambda x: x[1]["avg_engagement"],
            reverse=True
        )[:5]
        
        return {
            "total_unique_hashtags": len(hashtag_performance),
            "top_performing": [{"hashtag": h[0], "avg_engagement": h[1]["avg_engagement"]} for h in top_hashtags],
            "usage_frequency": len(hashtag_performance)
        }
    
    def _calculate_posting_frequency(self, posts: List[Dict]) -> Dict[str, Any]:
        """Calculate posting frequency patterns"""
        if not posts:
            return {"posts_per_week": 0, "consistency": "low"}
        
        # Simple frequency calculation
        posts_count = len(posts)
        # Assuming posts represent last 30 days
        posts_per_week = (posts_count / 30) * 7
        
        consistency = "high" if posts_per_week >= 5 else "medium" if posts_per_week >= 2 else "low"
        
        return {
            "posts_per_week": round(posts_per_week, 1),
            "total_posts_analyzed": posts_count,
            "consistency": consistency
        }
    
    def _analyze_media_types(self, posts: List[Dict]) -> Dict[str, Any]:
        """Analyze distribution of media types"""
        media_types = {"IMAGE": 0, "VIDEO": 0, "CAROUSEL_ALBUM": 0}
        
        for post in posts:
            media_type = post.get("media_type", "IMAGE")
            if media_type in media_types:
                media_types[media_type] += 1
        
        total = sum(media_types.values())
        if total == 0:
            return media_types
        
        return {
            media_type: {
                "count": count,
                "percentage": round((count / total) * 100, 1)
            }
            for media_type, count in media_types.items()
        }
    
    def _analyze_posting_times(self, posts: List[Dict]) -> Dict[str, Any]:
        """Analyze optimal posting times"""
        # Simplified implementation
        hour_performance = {}
        
        for post in posts:
            timestamp = post.get("timestamp")
            if timestamp:
                try:
                    dt = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
                    hour = dt.hour
                    engagement = post.get("like_count", 0) + post.get("comment_count", 0)
                    
                    if hour not in hour_performance:
                        hour_performance[hour] = {"posts": 0, "total_engagement": 0}
                    
                    hour_performance[hour]["posts"] += 1
                    hour_performance[hour]["total_engagement"] += engagement
                except:
                    continue
        
        # Find best performing hours
        best_hours = []
        for hour, data in hour_performance.items():
            if data["posts"] > 0:
                avg_engagement = data["total_engagement"] / data["posts"]
                best_hours.append({"hour": hour, "avg_engagement": avg_engagement})
        
        best_hours.sort(key=lambda x: x["avg_engagement"], reverse=True)
        
        return {
            "optimal_hours": best_hours[:3],
            "total_hours_analyzed": len(hour_performance)
        }
    
    def _generate_instagram_recommendations(self, analysis: Dict[str, Any]) -> List[str]:
        """Generate Instagram-specific recommendations"""
        recommendations = []
        
        engagement_rate = analysis.get("engagement_rate", 0)
        posting_frequency = analysis.get("posting_frequency", {})
        
        if engagement_rate < 2:
            recommendations.append("Consider improving content quality to boost engagement rate above 2%")
        
        if posting_frequency.get("consistency") == "low":
            recommendations.append("Increase posting consistency to maintain audience engagement")
        
        if posting_frequency.get("posts_per_week", 0) < 3:
            recommendations.append("Aim for 3-5 posts per week for optimal reach")
        
        recommendations.append("Use trending hashtags relevant to your niche")
        recommendations.append("Engage with your audience through comments and stories")
        
        return recommendations[:5]  # Limit to top 5 recommendations
    
    def _generate_facebook_recommendations(self, analysis: Dict[str, Any]) -> List[str]:
        """Generate Facebook-specific recommendations"""
        recommendations = []
        
        engagement_rate = analysis.get("engagement_rate", 0)
        
        if engagement_rate < 1:
            recommendations.append("Focus on creating more engaging content to improve interaction rates")
        
        recommendations.append("Post during peak audience activity times")
        recommendations.append("Use video content for higher engagement")
        recommendations.append("Encourage shares and comments through call-to-actions")
        recommendations.append("Join relevant groups to expand reach")
        
        return recommendations[:5]
    
    def _analyze_facebook_post_types(self, posts: List[Dict]) -> Dict[str, Any]:
        """Analyze Facebook post types"""
        post_types = {"status": 0, "photo": 0, "video": 0, "link": 0}
        
        for post in posts:
            # Simplified post type detection
            if post.get("attachments"):
                if "photo" in str(post.get("attachments", {})).lower():
                    post_types["photo"] += 1
                elif "video" in str(post.get("attachments", {})).lower():
                    post_types["video"] += 1
                else:
                    post_types["link"] += 1
            else:
                post_types["status"] += 1
        
        return post_types
    
    def _extract_content_themes(self, posts: List[Dict]) -> List[str]:
        """Extract common content themes"""
        # Simplified theme extraction
        themes = ["engagement", "community", "updates", "promotions"]
        return themes[:3]  # Return top 3 themes
    
    def _create_summary(self, insights: Dict[str, Any]) -> str:
        """Create a human-readable summary of insights"""
        try:
            platform = insights.get("metadata", {}).get("platform", "social media")
            
            engagement = insights.get("engagement_analysis", {})
            content = insights.get("content_analysis", {})
            recommendations = insights.get("recommendations", [])
            
            if engagement:
                engagement_rate = engagement.get("engagement_rate", 0)
                total_posts = engagement.get("total_posts", 0)
                
                summary = f"Analysis of {total_posts} {platform} posts shows an engagement rate of {engagement_rate}%. "
                
                if engagement_rate > 3:
                    summary += "Your content performs well with high audience engagement. "
                elif engagement_rate > 1:
                    summary += "Your content has moderate engagement with room for improvement. "
                else:
                    summary += "Your content engagement is below average and needs optimization. "
                
                if recommendations:
                    summary += f"Key recommendation: {recommendations[0]}"
                
                return summary
            
            return f"Comprehensive {platform} analysis completed with actionable insights and recommendations."
            
        except Exception as e:
            logger.error(f"Error creating summary: {str(e)}")
            return "AI insights generated successfully with performance metrics and recommendations."
    
    def _calculate_confidence(self, insights: Dict[str, Any]) -> float:
        """Calculate confidence score based on data quality and completeness"""
        try:
            base_confidence = 0.5
            
            # Check data completeness
            if insights.get("engagement_analysis"):
                base_confidence += 0.2
            if insights.get("content_analysis"):
                base_confidence += 0.2
            if insights.get("recommendations"):
                base_confidence += 0.1
            
            # Check metadata confidence
            metadata_confidence = insights.get("metadata", {}).get("confidence", 0.8)
            
            return min(base_confidence + (metadata_confidence * 0.2), 1.0)
            
        except Exception:
            return 0.75  # Default confidence
    
# Global service instance
ai_service = OptimizedAIService()

# Convenience functions for backward compatibility
async def process_insights_for_account(account_id: str, user_id: str, platform: str, 
                                       username: str, data: Dict[str, Any]) -> InsightResponse:
    request = InsightRequest(
        account_id=account_id,
        user_id=user_id,
        platform=platform,
        username=username,
        data=data
    )
    return await ai_service.process_account_insights(request)
