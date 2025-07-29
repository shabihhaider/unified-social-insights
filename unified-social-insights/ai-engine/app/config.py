"""
app/config.py - Enhanced Configuration Management for Unified Social Insights (USI)
"""
import os
from typing import List, Dict, Any, Optional
from pydantic_settings import BaseSettings
from pydantic import Field
from dotenv import load_dotenv

# Load from .env file
load_dotenv()

class Settings(BaseSettings):
    """Validated and typed environment configuration for AI microservice"""
    
    # === AI Provider API Keys ===
    OPENAI_API_KEY: str = Field(..., env="OPENAI_API_KEY")
    GROQ_API_KEY: str = Field(..., env="GROQ_API_KEY")
    GEMINI_API_KEY: Optional[str] = Field(None, env="GEMINI_API_KEY")
    DEEPSEEK_API_KEY: Optional[str] = Field(None, env="DEEPSEEK_API_KEY")
    ANTHROPIC_API_KEY: Optional[str] = Field(None, env="ANTHROPIC_API_KEY")
    COHERE_API_KEY: Optional[str] = Field(None, env="COHERE_API_KEY")
    
    # === PostgreSQL ===
    PG_DB: str = Field(..., env="PG_DB")
    PG_USER: str = Field(..., env="PG_USER")
    PG_PASS: str = Field(..., env="PG_PASS")
    PG_HOST: str = Field("localhost", env="PG_HOST")
    PG_PORT: int = Field(5432, env="PG_PORT")
    
    # === Database Connection Settings ===
    DB_MIN_CONNECTIONS: int = Field(5, env="DB_MIN_CONNECTIONS")
    DB_MAX_CONNECTIONS: int = Field(20, env="DB_MAX_CONNECTIONS")
    DB_COMMAND_TIMEOUT: int = Field(60, env="DB_COMMAND_TIMEOUT")
    
    # === Redis ===
    REDIS_HOST: str = Field("localhost", env="REDIS_HOST")
    REDIS_PORT: int = Field(6379, env="REDIS_PORT")
    REDIS_PASSWORD: Optional[str] = Field(None, env="REDIS_PASSWORD")
    REDIS_DB: int = Field(0, env="REDIS_DB")
    
    # === App Settings ===
    DEBUG: bool = Field(False, env="DEBUG")
    LOG_LEVEL: str = Field("INFO", env="LOG_LEVEL")
    DAILY_INSIGHTS_TIME: str = Field("04:00", env="DAILY_INSIGHTS_TIME")
    HOST: str = Field("0.0.0.0", env="HOST")
    PORT: int = Field(8000, env="PORT")
    
    # === Health Check Settings ===
    HOURLY_HEALTH_CHECK: bool = Field(True, env="HOURLY_HEALTH_CHECK")
    
    # === HTTP Settings ===
    HTTP_TIMEOUT: int = Field(30, env="HTTP_TIMEOUT")
    HTTP_RETRY_COUNT: int = Field(3, env="HTTP_RETRY_COUNT")
    
    # === AI Settings ===
    AI_TIMEOUT: int = Field(45, env="AI_TIMEOUT")
    AI_MAX_RETRIES: int = Field(3, env="AI_MAX_RETRIES")
    
    # === Security ===
    SECRET_KEY: str = Field("your-secret-key-here", env="SECRET_KEY")
    JWT_SECRET_KEY: str = Field("your-jwt-secret-key", env="JWT_SECRET_KEY")
    JWT_ALGORITHM: str = Field("HS256", env="JWT_ALGORITHM")
    JWT_EXPIRATION_HOURS: int = Field(24, env="JWT_EXPIRATION_HOURS")
    API_KEY_REQUIRED: bool = Field(False, env="API_KEY_REQUIRED")
    API_RATE_LIMIT_ENABLED: bool = Field(True, env="API_RATE_LIMIT_ENABLED")
    
    # === CORS Settings ===
    ALLOWED_ORIGINS: List[str] = Field(
        default_factory=lambda: ["http://localhost:3000", "http://localhost:8000"],
        env="ALLOWED_ORIGINS"
    )
    CORS_ALLOW_ALL: bool = Field(False, env="CORS_ALLOW_ALL")
    
    # === Production Settings ===
    PRODUCTION: bool = Field(False, env="PRODUCTION")
    SSL_REDIRECT: bool = Field(True, env="SSL_REDIRECT")
    SECURE_COOKIES: bool = Field(True, env="SECURE_COOKIES")
    
    # === Monitoring & Logging ===
    SENTRY_DSN: Optional[str] = Field("your_sentry_dsn_here", env="SENTRY_DSN")
    PROMETHEUS_ENABLED: bool = Field(False, env="PROMETHEUS_ENABLED")
    PROMETHEUS_PORT: int = Field(8001, env="PROMETHEUS_PORT")
    
    # === Social Media API Tokens ===
    INSTAGRAM_ACCESS_TOKEN: str = Field("your_instagram_token", env="INSTAGRAM_ACCESS_TOKEN")
    TWITTER_BEARER_TOKEN: str = Field("your_twitter_token", env="TWITTER_BEARER_TOKEN")
    LINKEDIN_ACCESS_TOKEN: str = Field("your_linkedin_token", env="LINKEDIN_ACCESS_TOKEN")
    TIKTOK_ACCESS_TOKEN: str = Field("your_tiktok_token", env="TIKTOK_ACCESS_TOKEN")
    
    # === Webhook Settings ===
    WEBHOOK_SECRET: str = Field("your_webhook_secret", env="WEBHOOK_SECRET")
    WEBHOOK_TIMEOUT: int = Field(10, env="WEBHOOK_TIMEOUT")
    
    # === Data Retention Settings ===
    INSIGHTS_RETENTION_DAYS: int = Field(90, env="INSIGHTS_RETENTION_DAYS")
    PERFORMANCE_DATA_RETENTION_DAYS: int = Field(365, env="PERFORMANCE_DATA_RETENTION_DAYS")
    PROVIDER_LOGS_RETENTION_DAYS: int = Field(30, env="PROVIDER_LOGS_RETENTION_DAYS")
    
    # === Backup Settings ===
    BACKUP_ENABLED: bool = Field(True, env="BACKUP_ENABLED")
    BACKUP_INTERVAL_HOURS: int = Field(24, env="BACKUP_INTERVAL_HOURS")
    BACKUP_RETENTION_DAYS: int = Field(30, env="BACKUP_RETENTION_DAYS")
    BACKUP_STORAGE_PATH: str = Field("/backups", env="BACKUP_STORAGE_PATH")
    
    # === Feature Flags ===
    ENABLE_ML_INSIGHTS: bool = Field(True, env="ENABLE_ML_INSIGHTS")
    ENABLE_SENTIMENT_ANALYSIS: bool = Field(True, env="ENABLE_SENTIMENT_ANALYSIS")
    ENABLE_TREND_PREDICTION: bool = Field(True, env="ENABLE_TREND_PREDICTION")
    ENABLE_IMAGE_ANALYSIS: bool = Field(False, env="ENABLE_IMAGE_ANALYSIS")
    ENABLE_VIDEO_ANALYSIS: bool = Field(False, env="ENABLE_VIDEO_ANALYSIS")
    ENABLE_COMPETITOR_TRACKING: bool = Field(True, env="ENABLE_COMPETITOR_TRACKING")
    COMPETITOR_UPDATE_INTERVAL: int = Field(24, env="COMPETITOR_UPDATE_INTERVAL")
    
    # === Advanced Feature Flags ===
    FEATURE_MULTI_PROVIDER_SYNTHESIS: bool = Field(True, env="FEATURE_MULTI_PROVIDER_SYNTHESIS")
    FEATURE_HISTORICAL_ANALYSIS: bool = Field(True, env="FEATURE_HISTORICAL_ANALYSIS")
    FEATURE_PREDICTIVE_INSIGHTS: bool = Field(True, env="FEATURE_PREDICTIVE_INSIGHTS")
    FEATURE_AUTOMATED_RECOMMENDATIONS: bool = Field(True, env="FEATURE_AUTOMATED_RECOMMENDATIONS")
    FEATURE_REAL_TIME_MONITORING: bool = Field(True, env="FEATURE_REAL_TIME_MONITORING")
    
    # === Development Settings ===
    DEV_SKIP_AUTH: bool = Field(False, env="DEV_SKIP_AUTH")
    DEV_MOCK_AI_RESPONSES: bool = Field(False, env="DEV_MOCK_AI_RESPONSES")
    DEV_ENABLE_DEBUG_ROUTES: bool = Field(False, env="DEV_ENABLE_DEBUG_ROUTES")
    
    # === Email Settings ===
    SMTP_HOST: str = Field("smtp.gmail.com", env="SMTP_HOST")
    SMTP_PORT: int = Field(587, env="SMTP_PORT")
    SMTP_USERNAME: str = Field("your_email@gmail.com", env="SMTP_USERNAME")
    SMTP_PASSWORD: str = Field("your_app_password", env="SMTP_PASSWORD")
    FROM_EMAIL: str = Field("noreply@yourdomain.com", env="FROM_EMAIL")
    
    # === Slack Integration ===
    SLACK_WEBHOOK_URL: str = Field("your_slack_webhook_url", env="SLACK_WEBHOOK_URL")
    SLACK_CHANNEL: str = Field("#alerts", env="SLACK_CHANNEL")
    
    # === Machine Learning Settings ===
    ML_MODEL_UPDATE_INTERVAL: int = Field(168, env="ML_MODEL_UPDATE_INTERVAL")  # hours
    ML_TRAINING_DATA_DAYS: int = Field(30, env="ML_TRAINING_DATA_DAYS")
    ML_CONFIDENCE_THRESHOLD: float = Field(0.75, env="ML_CONFIDENCE_THRESHOLD")
    
    # === Trend Analysis Settings ===
    TREND_ANALYSIS_PERIOD_DAYS: int = Field(30, env="TREND_ANALYSIS_PERIOD_DAYS")
    TREND_SMOOTHING_FACTOR: float = Field(0.1, env="TREND_SMOOTHING_FACTOR")
    TREND_CHANGE_THRESHOLD: float = Field(0.05, env="TREND_CHANGE_THRESHOLD")
    
    # === Benchmark Settings ===
    BENCHMARK_UPDATE_INTERVAL: int = Field(24, env="BENCHMARK_UPDATE_INTERVAL")  # hours
    BENCHMARK_CONFIDENCE_LEVEL: float = Field(0.95, env="BENCHMARK_CONFIDENCE_LEVEL")
    BENCHMARK_DATA_POINTS_MIN: int = Field(100, env="BENCHMARK_DATA_POINTS_MIN")
    
    # === Caching ===
    CACHE_TTL: int = Field(3600, env="CACHE_TTL")
    CACHE_PREFIX: str = Field("ai_engine:", env="CACHE_PREFIX")
    
    # === Rate Limiting ===
    RATE_LIMIT_REQUESTS: int = Field(100, env="RATE_LIMIT_REQUESTS")
    RATE_LIMIT_WINDOW: int = Field(3600, env="RATE_LIMIT_WINDOW")
    
    # === AI Provider Settings ===
    AI_PROVIDERS_CONFIG: Dict[str, Dict[str, Any]] = {
        "openai": {
            "enabled": True,
            "models": ["gpt-4", "gpt-3.5-turbo"],
            "default_model": "gpt-4",
            "temperature": 0.7,
            "max_tokens": 2000,
            "timeout": 30,
            "retry_count": 3
        },
        "groq": {
            "enabled": True,
            "models": ["llama-3.1-70b-versatile", "mixtral-8x7b-32768"],
            "default_model": "llama-3.1-70b-versatile",
            "temperature": 0.7,
            "max_tokens": 2000,
            "timeout": 30,
            "retry_count": 3
        },
        "gemini": {
            "enabled": True,
            "models": ["gemini-pro", "gemini-pro-vision"],
            "default_model": "gemini-pro",
            "temperature": 0.7,
            "max_tokens": 2000,
            "timeout": 30,
            "retry_count": 3
        },
        "deepseek": {
            "enabled": True,
            "models": ["deepseek-chat", "deepseek-coder"],
            "default_model": "deepseek-chat",
            "temperature": 0.7,
            "max_tokens": 2000,
            "timeout": 30,
            "retry_count": 3
        },
        "anthropic": {
            "enabled": True,
            "models": ["claude-3-sonnet", "claude-3-haiku"],
            "default_model": "claude-3-sonnet",
            "temperature": 0.7,
            "max_tokens": 2000,
            "timeout": 30,
            "retry_count": 3
        }
    }
    
    # === Insights Modules Settings ===
    INSIGHTS_CONFIG: Dict[str, Any] = {
        "engagement_analysis": {
            "enabled": True,
            "weight": 0.3,
            "metrics": ["likes", "comments", "shares", "views", "saves"]
        },
        "content_analysis": {
            "enabled": True,
            "weight": 0.25,
            "analyze_sentiment": True,
            "extract_topics": True,
            "analyze_hashtags": True
        },
        "audience_analysis": {
            "enabled": True,
            "weight": 0.2,
            "demographics": True,
            "behavior_patterns": True,
            "growth_analysis": True
        },
        "performance_trends": {
            "enabled": True,
            "weight": 0.15,
            "time_periods": ["daily", "weekly", "monthly"],
            "trend_analysis": True
        },
        "recommendations": {
            "enabled": True,
            "weight": 0.1,
            "posting_schedule": True,
            "content_suggestions": True,
            "hashtag_recommendations": True,
            "engagement_strategies": True
        }
    }
    
    # === Helper Properties ===
    @property
    def database_url(self) -> str:
        return f"postgresql://{self.PG_USER}:{self.PG_PASS}@{self.PG_HOST}:{self.PG_PORT}/{self.PG_DB}"
    
    @property
    def redis_url(self) -> str:
        auth = f":{self.REDIS_PASSWORD}@" if self.REDIS_PASSWORD else ""
        return f"redis://{auth}{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
    
    def get_enabled_providers(self) -> List[str]:
        return [
            provider for provider, config in self.AI_PROVIDERS_CONFIG.items()
            if config.get("enabled", False)
        ]
    
    def get_provider_config(self, provider: str) -> Dict[str, Any]:
        return self.AI_PROVIDERS_CONFIG.get(provider, {})
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Global singleton instance
settings = Settings()