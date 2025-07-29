# """
# app/db.py - Enhanced Database Manager with Connection Pooling and Advanced Queries
# """

# import asyncio
# import asyncpg
# import psycopg2
# from psycopg2.extras import RealDictCursor
# import json
# import logging
# from typing import Dict, List, Any, Optional, Tuple
# from datetime import datetime, timedelta
# from contextlib import asynccontextmanager
# import os
# from dataclasses import dataclass

# from app.config import settings
# from app.utils.logger import setup_logger

# logger = setup_logger("database")

# @dataclass
# class DatabaseConfig:
#     """Database configuration"""
#     host: str
#     port: int
#     database: str
#     user: str
#     password: str
#     min_connections: int = 5
#     max_connections: int = 20
#     command_timeout: int = 60

# class DatabaseManager:
#     """Enhanced Database Manager with async support and connection pooling"""
    
#     def __init__(self):
#         self.config = DatabaseConfig(
#             host=settings.PG_HOST,
#             port=settings.PG_PORT,
#             database=settings.PG_DB,
#             user=settings.PG_USER,
#             password=settings.PG_PASS
#         )
#         self.pool: Optional[asyncpg.Pool] = None
#         self._initialized = False
    
#     async def initialize(self):
#         """Initialize async connection pool"""
#         try:
#             self.pool = await asyncpg.create_pool(
#                 host=self.config.host,
#                 port=self.config.port,
#                 database=self.config.database,
#                 user=self.config.user,
#                 password=self.config.password,
#                 min_size=self.config.min_connections,
#                 max_size=self.config.max_connections,
#                 command_timeout=self.config.command_timeout
#             )
            
#             # Test connection
#             async with self.pool.acquire() as conn:
#                 await conn.execute("SELECT 1")
            
#             self._initialized = True
#             logger.info(f"✅ Database pool initialized ({self.config.min_connections}-{self.config.max_connections} connections)")
            
#             # Create tables if they don't exist
#             await self.create_tables()
            
#         except Exception as e:
#             logger.error(f"❌ Database initialization failed: {str(e)}")
#             raise e
    
#     async def close(self):
#         """Close connection pool"""
#         if self.pool:
#             await self.pool.close()
#             self._initialized = False
#             logger.info("🔄 Database pool closed")
    
#     @asynccontextmanager
#     async def get_connection(self):
#         """Get database connection from pool"""
#         if not self._initialized:
#             await self.initialize()
        
#         async with self.pool.acquire() as conn:
#             try:
#                 yield conn
#             except Exception as e:
#                 logger.error(f"❌ Database operation error: {str(e)}")
#                 raise e
    
#     def get_sync_connection(self):
#         """Get synchronous connection for legacy support"""
#         return psycopg2.connect(
#             host=self.config.host,
#             port=self.config.port,
#             database=self.config.database,
#             user=self.config.user,
#             password=self.config.password,
#             cursor_factory=RealDictCursor
#         )
    
#     async def create_tables(self):
#         """Create necessary tables with enhanced schema"""
#         async with self.get_connection() as conn:
#             # Enhanced AI insights table
#             await conn.execute("""
#                 CREATE TABLE IF NOT EXISTS ai_insights (
#                     id SERIAL PRIMARY KEY,
#                     account_id INTEGER REFERENCES social_accounts(id) ON DELETE CASCADE,
#                     user_id INTEGER NOT NULL,
#                     platform VARCHAR(50) NOT NULL,
#                     insights JSONB NOT NULL DEFAULT '{}',
#                     summary TEXT,
#                     confidence_score DECIMAL(3,2) DEFAULT 0.80,
#                     providers_used JSONB DEFAULT '[]',
#                     processing_time DECIMAL(8,3),
#                     token_usage INTEGER DEFAULT 0,
#                     data_period VARCHAR(100),
#                     insight_type VARCHAR(50) DEFAULT 'comprehensive',
#                     status VARCHAR(20) DEFAULT 'active',
#                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
#                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    
#                     INDEX(account_id),
#                     INDEX(user_id),
#                     INDEX(platform),
#                     INDEX(created_at),
#                     INDEX(status),
#                     INDEX(insight_type)
#                 )
#             """)
            
#             # Historical performance data
#             await conn.execute("""
#                 CREATE TABLE IF NOT EXISTS performance_history (
#                     id SERIAL PRIMARY KEY,
#                     account_id INTEGER REFERENCES social_accounts(id) ON DELETE CASCADE,
#                     platform VARCHAR(50) NOT NULL,
#                     metrics JSONB NOT NULL DEFAULT '{}',
#                     engagement_rate DECIMAL(5,2),
#                     follower_count INTEGER,
#                     post_count INTEGER,
#                     reach INTEGER,
#                     impressions INTEGER,
#                     date_recorded DATE NOT NULL,
#                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    
#                     UNIQUE(account_id, date_recorded),
#                     INDEX(account_id),
#                     INDEX(platform),
#                     INDEX(date_recorded),
#                     INDEX(engagement_rate)
#                 )
#             """)
            
#             # Content performance tracking
#             await conn.execute("""
#                 CREATE TABLE IF NOT EXISTS content_performance (
#                     id SERIAL PRIMARY KEY,
#                     account_id INTEGER REFERENCES social_accounts(id) ON DELETE CASCADE,
#                     platform VARCHAR(50) NOT NULL,
#                     content_id VARCHAR(255),
#                     content_type VARCHAR(50),
#                     content_text TEXT,
#                     hashtags JSONB DEFAULT '[]',
#                     media_type VARCHAR(50),
#                     metrics JSONB NOT NULL DEFAULT '{}',
#                     published_at TIMESTAMP,
#                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    
#                     UNIQUE(account_id, content_id),
#                     INDEX(account_id),
#                     INDEX(platform),
#                     INDEX(content_type),
#                     INDEX(published_at)
#                 )
#             """)
            
#             # AI provider performance tracking
#             await conn.execute("""
#                 CREATE TABLE IF NOT EXISTS provider_performance (
#                     id SERIAL PRIMARY KEY,
#                     provider_name VARCHAR(50) NOT NULL,
#                     model_name VARCHAR(100),
#                     request_type VARCHAR(50),
#                     response_time DECIMAL(8,3),
#                     token_usage INTEGER,
#                     success BOOLEAN,
#                     error_message TEXT,
#                     confidence_score DECIMAL(3,2),
#                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    
#                     INDEX(provider_name),
#                     INDEX(created_at),
#                     INDEX(success),
#                     INDEX(request_type)
#                 )
#             """)
            
#             logger.info("✅ Database tables created/verified")
    
#     async def fetch_enhanced_active_accounts(self) -> List[Tuple]:
#         """Fetch active accounts with enhanced metadata and historical data"""
#         async with self.get_connection() as conn:
#             query = """
#                 SELECT 
#                     sa.id,
#                     sa.user_id,
#                     sa.platform,
#                     sa.username,
#                     sa.metadata,
#                     COALESCE(
#                         (
#                             SELECT jsonb_agg(
#                                 jsonb_build_object(
#                                     'date', ph.date_recorded,
#                                     'metrics', ph.metrics,
#                                     'engagement_rate', ph.engagement_rate,
#                                     'follower_count', ph.follower_count,
#                                     'reach', ph.reach,
#                                     'impressions', ph.impressions
#                                 )
#                                 ORDER BY ph.date_recorded DESC
#                             )
#                             FROM performance_history ph
#                             WHERE ph.account_id = sa.id
#                             AND ph.date_recorded >= CURRENT_DATE - INTERVAL '30 days'
#                         ),
#                         '[]'::jsonb
#                     ) as historical_data
#                 FROM social_accounts sa
#                 WHERE sa.is_active = true
#                 ORDER BY sa.last_sync DESC NULLS LAST
#             """
            
#             rows = await conn.fetch(query)
#             return [(row[0], row[1], row[2], row[3], row[4], row[5]) for row in rows]
    
#     async def insert_enhanced_ai_insights(
#         self,
#         account_id: int,
#         user_id: int,
#         platform: str,
#         insights: Dict[str, Any]
#     ):
#         """Insert enhanced AI insights with metadata"""
#         async with self.get_connection() as conn:
#             # Extract summary from insights
#             summary = self._extract_summary(insights)
            
#             # Calculate average confidence
#             confidence = self._calculate_average_confidence(insights)
            
#             # Extract providers used
#             providers_used = self._extract_providers_used(insights)
            
#             # Extract processing metrics
#             processing_time = insights.get("metadata", {}).get("total_processing_time", 0)
#             token_usage = insights.get("metadata", {}).get("total_token_usage", 0)
#             data_period = insights.get("metadata", {}).get("data_period", "current")
            
#             await conn.execute("""
#                 INSERT INTO ai_insights (
#                     account_id, user_id, platform, insights, summary,
#                     confidence_score, providers_used, processing_time,
#                     token_usage, data_period, updated_at
#                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
#                 ON CONFLICT (account_id) 
#                 DO UPDATE SET
#                     insights = EXCLUDED.insights,
#                     summary = EXCLUDED.summary,
#                     confidence_score = EXCLUDED.confidence_score,
#                     providers_used = EXCLUDED.providers_used,
#                     processing_time = EXCLUDED.processing_time,
#                     token_usage = EXCLUDED.token_usage,
#                     data_period = EXCLUDED.data_period,
#                     updated_at = CURRENT_TIMESTAMP
#             """, account_id, user_id, platform, json.dumps(insights), summary,
#                 confidence, json.dumps(providers_used), processing_time,
#                 token_usage, data_period)
    
#     async def get_insights_history(
#         self,
#         account_id: int,
#         days: int = 30
#     ) -> List[Dict[str, Any]]:
#         """Get historical insights for an account"""
#         async with self.get_connection() as conn:
#             query = """
#                 SELECT 
#                     insights,
#                     summary,
#                     confidence_score,
#                     providers_used,
#                     processing_time,
#                     token_usage,
#                     created_at
#                 FROM ai_insights
#                 WHERE account_id = $1
#                 AND created_at >= CURRENT_TIMESTAMP - INTERVAL '%d days'
#                 ORDER BY created_at DESC
#             """ % days
            
#             rows = await conn.fetch(query, account_id)
            
#             return [
#                 {
#                     "insights": row[0],
#                     "summary": row[1],
#                     "confidence_score": float(row[2]) if row[2] else 0,
#                     "providers_used": row[3],
#                     "processing_time": float(row[4]) if row[4] else 0,
#                     "token_usage": row[5] or 0,
#                     "created_at": row[6].isoformat()
#                 }
#                 for row in rows
#             ]
    
#     async def store_performance_data(
#         self,
#         account_id: int,
#         platform: str,
#         metrics: Dict[str, Any],
#         date_recorded: datetime = None
#     ):
#         """Store performance data for trend analysis"""
#         if date_recorded is None:
#             date_recorded = datetime.utcnow().date()
        
#         async with self.get_connection() as conn:
#             await conn.execute("""
#                 INSERT INTO performance_history (
#                     account_id, platform, metrics, engagement_rate,
#                     follower_count, post_count, reach, impressions, date_recorded
#                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
#                 ON CONFLICT (account_id, date_recorded)
#                 DO UPDATE SET
#                     metrics = EXCLUDED.metrics,
#                     engagement_rate = EXCLUDED.engagement_rate,
#                     follower_count = EXCLUDED.follower_count,
#                     post_count = EXCLUDED.post_count,
#                     reach = EXCLUDED.reach,
#                     impressions = EXCLUDED.impressions
#             """, 
#                 account_id, platform, json.dumps(metrics),
#                 metrics.get("engagement_rate"),
#                 metrics.get("follower_count"),
#                 metrics.get("post_count"),
#                 metrics.get("reach"),
#                 metrics.get("impressions"),
#                 date_recorded
#             )
    
#     async def get_performance_trends(
#         self,
#         account_id: int,
#         days: int = 30
#     ) -> List[Dict[str, Any]]:
#         """Get performance trends for analysis"""
#         async with self.get_connection() as conn:
#             query = """
#                 SELECT 
#                     date_recorded,
#                     metrics,
#                     engagement_rate,
#                     follower_count,
#                     reach,
#                     impressions
#                 FROM performance_history
#                 WHERE account_id = $1
#                 AND date_recorded >= CURRENT_DATE - INTERVAL '%d days'
#                 ORDER BY date_recorded ASC
#             """ % days
            
#             rows = await conn.fetch(query, account_id)
            
#             return [
#                 {
#                     "date": row[0].isoformat(),
#                     "metrics": row[1],
#                     "engagement_rate": float(row[2]) if row[2] else 0,
#                     "follower_count": row[3] or 0,
#                     "reach": row[4] or 0,
#                     "impressions": row[5] or 0
#                 }
#                 for row in rows
#             ]
    
#     async def log_provider_performance(
#         self,
#         provider_name: str,
#         model_name: str,
#         request_type: str,
#         response_time: float,
#         token_usage: int,
#         success: bool,
#         error_message: str = None,
#         confidence_score: float = None
#     ):
#         """Log AI provider performance for monitoring"""
#         async with self.get_connection() as conn:
#             await conn.execute("""
#                 INSERT INTO provider_performance (
#                     provider_name, model_name, request_type, response_time,
#                     token_usage, success, error_message, confidence_score
#                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
#             """, 
#                 provider_name, model_name, request_type, response_time,
#                 token_usage, success, error_message, confidence_score
#             )
    
#     async def get_provider_analytics(
#         self,
#         days: int = 7
#     ) -> Dict[str, Any]:
#         """Get provider performance analytics"""
#         async with self.get_connection() as conn:
#             query = """
#                 SELECT 
#                     provider_name,
#                     COUNT(*) as total_requests,
#                     AVG(response_time) as avg_response_time,
#                     AVG(token_usage) as avg_token_usage,
#                     AVG(confidence_score) as avg_confidence,
#                     COUNT(*) FILTER (WHERE success = true) as successful_requests,
#                     COUNT(*) FILTER (WHERE success = false) as failed_requests,
#                     ROUND(
#                         (COUNT(*) FILTER (WHERE success = true)::decimal / COUNT(*)) * 100, 2
#                     ) as success_rate
#                 FROM provider_performance
#                 WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '%d days'
#                 GROUP BY provider_name
#                 ORDER BY success_rate DESC, avg_response_time ASC
#             """ % days
            
#             rows = await conn.fetch(query)
            
#             analytics = {}
#             for row in rows:
#                 analytics[row[0]] = {
#                     "total_requests": row[1],
#                     "avg_response_time": float(row[2]) if row[2] else 0,
#                     "avg_token_usage": float(row[3]) if row[3] else 0,
#                     "avg_confidence": float(row[4]) if row[4] else 0,
#                     "successful_requests": row[5],
#                     "failed_requests": row[6],
#                     "success_rate": float(row[7]) if row[7] else 0
#                 }
            
#             return analytics
    
#     async def get_user_insights_summary(
#         self,
#         user_id: int
#     ) -> Dict[str, Any]:
#         """Get comprehensive insights summary for a user"""
#         async with self.get_connection() as conn:
#             # Get account summary
#             accounts_query = """
#                 SELECT 
#                     COUNT(*) as total_accounts,
#                     COUNT(*) FILTER (WHERE is_active = true) as active_accounts,
#                     ARRAY_AGG(DISTINCT platform) as platforms
#                 FROM social_accounts
#                 WHERE user_id = $1
#             """
            
#             account_row = await conn.fetchrow(accounts_query, user_id)
            
#             # Get latest insights
#             insights_query = """
#                 SELECT 
#                     ai.platform,
#                     ai.summary,
#                     ai.confidence_score,
#                     ai.created_at,
#                     sa.username
#                 FROM ai_insights ai
#                 JOIN social_accounts sa ON ai.account_id = sa.id
#                 WHERE ai.user_id = $1
#                 AND ai.status = 'active'
#                 ORDER BY ai.created_at DESC
#             """
            
#             insights_rows = await conn.fetch(insights_query, user_id)
            
#             # Get performance trends
#             trends_query = """
#                 SELECT 
#                     ph.platform,
#                     AVG(ph.engagement_rate) as avg_engagement_rate,
#                     AVG(ph.follower_count) as avg_followers,
#                     COUNT(*) as data_points
#                 FROM performance_history ph
#                 JOIN social_accounts sa ON ph.account_id = sa.id
#                 WHERE sa.user_id = $1
#                 AND ph.date_recorded >= CURRENT_DATE - INTERVAL '30 days'
#                 GROUP BY ph.platform
#             """
            
#             trends_rows = await conn.fetch(trends_query, user_id)
            
#             return {
#                 "account_summary": {
#                     "total_accounts": account_row[0],
#                     "active_accounts": account_row[1],
#                     "platforms": account_row[2] or []
#                 },
#                 "latest_insights": [
#                     {
#                         "platform": row[0],
#                         "summary": row[1],
#                         "confidence": float(row[2]) if row[2] else 0,
#                         "created_at": row[3].isoformat(),
#                         "username": row[4]
#                     }
#                     for row in insights_rows
#                 ],
#                 "performance_overview": [
#                     {
#                         "platform": row[0],
#                         "avg_engagement_rate": float(row[1]) if row[1] else 0,
#                         "avg_followers": int(row[2]) if row[2] else 0,
#                         "data_points": row[3]
#                     }
#                     for row in trends_rows
#                 ]
#             }
    
#     # Helper methods
#     def _extract_summary(self, insights: Dict[str, Any]) -> str:
#         """Extract summary from insights"""
#         try:
#             # Try to get synthesis summary first
#             for insight_type in ["engagement_analysis", "content_analysis", "recommendations"]:
#                 if insight_type in insights:
#                     synthesis = insights[insight_type].get("synthesis", {})
#                     if isinstance(synthesis, dict):
#                         content = synthesis.get("synthesized_content", "")
#                         if content and len(content) > 50:
#                             # Extract first paragraph as summary
#                             first_paragraph = content.split('\n')[0]
#                             return first_paragraph[:500] + "..." if len(first_paragraph) > 500 else first_paragraph
            
#             # Fallback to any available content
#             for key, value in insights.items():
#                 if isinstance(value, dict) and "synthesis" in value:
#                     content = value["synthesis"].get("synthesized_content", "")
#                     if content:
#                         return content[:500] + "..." if len(content) > 500 else content
            
#             return "Comprehensive AI insights generated successfully"
            
#         except Exception as e:
#             logger.error(f"Error extracting summary: {str(e)}")
#             return "AI insights generated"
    
#     def _calculate_average_confidence(self, insights: Dict[str, Any]) -> float:
#         """Calculate average confidence across all insights"""
#         try:
#             confidences = []
            
#             for insight_type, insight_data in insights.items():
#                 if isinstance(insight_data, dict):
#                     # Check synthesis confidence
#                     synthesis = insight_data.get("synthesis", {})
#                     if isinstance(synthesis, dict) and "confidence" in synthesis:
#                         confidences.append(synthesis["confidence"])
                    
#                     # Check provider results confidence
#                     provider_results = insight_data.get("provider_results", [])
#                     for result in provider_results:
#                         if hasattr(result, 'confidence'):
#                             confidences.append(result.confidence)
            
#             return sum(confidences) / len(confidences) if confidences else 0.8
            
#         except Exception as e:
#             logger.error(f"Error calculating confidence: {str(e)}")
#             return 0.8
    
#     def _extract_providers_used(self, insights: Dict[str, Any]) -> List[str]:
#         """Extract list of providers used"""
#         try:
#             providers = set()
            
#             for insight_type, insight_data in insights.items():
#                 if isinstance(insight_data, dict):
#                     provider_results = insight_data.get("provider_results", [])
#                     for result in provider_results:
#                         if hasattr(result, 'provider'):
#                             providers.add(result.provider)
            
#             return list(providers)
            
#         except Exception as e:
#             logger.error(f"Error extracting providers: {str(e)}")
#             return []

# # Legacy sync functions for backward compatibility
# def fetch_active_accounts() -> List[Tuple]:
#     """Legacy sync function for fetching active accounts"""
#     db_config = {
#         'dbname': settings.PG_DB,
#         'user': settings.PG_USER,
#         'password': settings.PG_PASS,
#         'host': settings.PG_HOST,
#         'port': settings.PG_PORT
#     }
    
#     with psycopg2.connect(**db_config) as conn:
#         with conn.cursor() as cur:
#             cur.execute("""
#                 SELECT id, user_id, platform, username, metadata
#                 FROM social_accounts
#                 WHERE is_active = true
#                 ORDER BY last_sync DESC NULLS LAST
#             """)
#             return cur.fetchall()

# def insert_ai_summary(account_id: int, user_id: int, platform: str, summary: str):
#     """Legacy sync function for inserting AI summary"""
#     db_config = {
#         'dbname': settings.PG_DB,
#         'user': settings.PG_USER,
#         'password': settings.PG_PASS,
#         'host': settings.PG_HOST,
#         'port': settings.PG_PORT
#     }
    
#     with psycopg2.connect(**db_config) as conn:
#         with conn.cursor() as cur:
#             cur.execute("""
#                 INSERT INTO ai_insights (account_id, user_id, platform, summary, insights)
#                 VALUES (%s, %s, %s, %s, %s)
#                 ON CONFLICT (account_id)
#                 DO UPDATE SET
#                     summary = EXCLUDED.summary,
#                     updated_at = CURRENT_TIMESTAMP
#             """, (account_id, user_id, platform, summary, json.dumps({"legacy_summary": summary})))
#             conn.commit()

# class HealthChecker:
#     """Database and system health checker"""
    
#     def __init__(self):
#         self.db_manager = DatabaseManager()
    
#     async def check_database_health(self) -> Dict[str, Any]:
#         """Check database connectivity and performance"""
#         try:
#             start_time = datetime.utcnow()
            
#             async with self.db_manager.get_connection() as conn:
#                 # Test basic connectivity
#                 await conn.execute("SELECT 1")
                
#                 # Test table existence
#                 tables_result = await conn.fetch("""
#                     SELECT tablename FROM pg_tables 
#                     WHERE schemaname = 'public'
#                     AND tablename IN ('social_accounts', 'ai_insights', 'performance_history')
#                 """)
                
#                 # Test recent data
#                 recent_insights = await conn.fetchval("""
#                     SELECT COUNT(*) FROM ai_insights 
#                     WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
#                 """)
                
#                 response_time = (datetime.utcnow() - start_time).total_seconds()
                
#                 return {
#                     "status": "healthy",
#                     "response_time": response_time,
#                     "tables_found": len(tables_result),
#                     "recent_insights": recent_insights,
#                     "pool_size": self.db_manager.pool.get_size() if self.db_manager.pool else 0,
#                     "last_check": datetime.utcnow().isoformat()
#                 }
                
#         except Exception as e:
#             return {
#                 "status": "unhealthy",
#                 "error": str(e),
#                 "last_check": datetime.utcnow().isoformat()
#             }
    
#     async def verify_all_services(self) -> Dict[str, Any]:
#         """Verify all system services"""
#         db_health = await self.check_database_health()
        
#         return {
#             "database": db_health,
#             "overall_status": "healthy" if db_health["status"] == "healthy" else "degraded",
#             "timestamp": datetime.utcnow().isoformat()
#         }
    
#     async def comprehensive_health_check(self) -> Dict[str, Any]:
#         """Comprehensive health check including performance metrics"""
#         try:
#             db_health = await self.check_database_health()
            
#             # Additional system metrics
#             async with self.db_manager.get_connection() as conn:
#                 # Database size
#                 db_size = await conn.fetchval("""
#                     SELECT pg_size_pretty(pg_database_size(current_database()))
#                 """)
                
#                 # Active connections
#                 active_connections = await conn.fetchval("""
#                     SELECT count(*) FROM pg_stat_activity 
#                     WHERE state = 'active'
#                 """)
                
#                 # Recent activity
#                 recent_activity = await conn.fetch("""
#                     SELECT 
#                         'social_accounts' as table_name,
#                         COUNT(*) as total_records,
#                         COUNT(*) FILTER (WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours') as recent_records
#                     FROM social_accounts
#                     UNION ALL
#                     SELECT 
#                         'ai_insights' as table_name,
#                         COUNT(*) as total_records,
#                         COUNT(*) FILTER (WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '24 hours') as recent_records
#                     FROM ai_insights
#                 """)
            
#             return {
#                 "status": "healthy" if db_health["status"] == "healthy" else "unhealthy",
#                 "database": db_health,
#                 "system_metrics": {
#                     "database_size": db_size,
#                     "active_connections": active_connections,
#                     "table_activity": [
#                         {
#                             "table": row[0],
#                             "total_records": row[1],
#                             "recent_records": row[2]
#                         }
#                         for row in recent_activity
#                     ]
#                 },
#                 "timestamp": datetime.utcnow().isoformat()
#             }
            
#         except Exception as e:
#             return {
#                 "status": "unhealthy",
#                 "error": str(e),
#                 "timestamp": datetime.utcnow().isoformat()
#             }
    
#     async def get_system_metrics(self) -> Dict[str, Any]:
#         """Get detailed system performance metrics"""
#         try:
#             async with self.db_manager.get_connection() as conn:
#                 # Query performance stats
#                 query_stats = await conn.fetch("""
#                     SELECT 
#                         schemaname,
#                         tablename,
#                         n_tup_ins as inserts,
#                         n_tup_upd as updates,
#                         n_tup_del as deletes,
#                         n_live_tup as live_tuples,
#                         n_dead_tup as dead_tuples
#                     FROM pg_stat_user_tables
#                     ORDER BY n_live_tup DESC
#                 """)
                
#                 # Index usage
#                 index_stats = await conn.fetch("""
#                     SELECT 
#                         schemaname,
#                         tablename,
#                         indexname,
#                         idx_scan as scans,
#                         idx_tup_read as tuples_read,
#                         idx_tup_fetch as tuples_fetched
#                     FROM pg_stat_user_indexes
#                     WHERE idx_scan > 0
#                     ORDER BY idx_scan DESC
#                     LIMIT 10
#                 """)
                
#                 return {
#                     "table_statistics": [
#                         {
#                             "schema": row[0],
#                             "table": row[1],
#                             "inserts": row[2],
#                             "updates": row[3],
#                             "deletes": row[4],
#                             "live_tuples": row[5],
#                             "dead_tuples": row[6]
#                         }
#                         for row in query_stats
#                     ],
#                     "index_usage": [
#                         {
#                             "schema": row[0],
#                             "table": row[1],
#                             "index": row[2],
#                             "scans": row[3],
#                             "tuples_read": row[4],
#                             "tuples_fetched": row[5]
#                         }
#                         for row in index_stats
#                     ],
#                     "timestamp": datetime.utcnow().isoformat()
#                 }
                
#         except Exception as e:
#             return {
#                 "error": str(e),
#                 "timestamp": datetime.utcnow().isoformat()
#             }