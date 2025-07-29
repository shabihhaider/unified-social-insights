"""
app/utils/logger.py - Enhanced Logging Utilities
Professional-grade logging with structured output and monitoring integration
"""

import logging
import sys
import json
from datetime import datetime
from typing import Dict, Any, Optional
from pathlib import Path
import structlog
from pythonjsonlogger import jsonlogger

from app.config import settings

# Configure structlog
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

class AIEngineFormatter(jsonlogger.JsonFormatter):
    """Custom JSON formatter for AI Engine logs"""
    
    def add_fields(self, log_record, record, message_dict):
        super().add_fields(log_record, record, message_dict)
        
        # Add standard fields
        log_record['timestamp'] = datetime.utcnow().isoformat()
        log_record['service'] = 'ai-engine'
        log_record['environment'] = 'development' if settings.DEBUG else 'production'
        
        # Add request ID if available
        if hasattr(record, 'request_id'):
            log_record['request_id'] = record.request_id
        
        # Add user context if available
        if hasattr(record, 'user_id'):
            log_record['user_id'] = record.user_id
        
        # Add performance metrics
        if hasattr(record, 'duration'):
            log_record['duration_ms'] = record.duration
        
        # Add AI provider context
        if hasattr(record, 'provider'):
            log_record['ai_provider'] = record.provider
        
        if hasattr(record, 'model'):
            log_record['ai_model'] = record.model

class PerformanceFilter(logging.Filter):
    """Filter to add performance metrics to log records"""
    
    def filter(self, record):
        # Add memory usage
        import psutil
        process = psutil.Process()
        record.memory_mb = round(process.memory_info().rss / 1024 / 1024, 2)
        record.cpu_percent = process.cpu_percent()
        
        return True

def setup_logger(
    name: str,
    level: str = None,
    log_file: str = None,
    enable_json: bool = True
) -> logging.Logger:
    """Setup enhanced logger with structured output"""
    
    logger = logging.getLogger(name)
    
    # Prevent duplicate handlers
    if logger.handlers:
        return logger
    
    # Set log level
    log_level = getattr(logging, (level or settings.LOG_LEVEL).upper())
    logger.setLevel(log_level)
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)
    
    if enable_json:
        # JSON formatter for structured logging
        json_formatter = AIEngineFormatter(
            '%(timestamp)s %(service)s %(name)s %(levelname)s %(message)s'
        )
        console_handler.setFormatter(json_formatter)
    else:
        # Simple formatter for development
        simple_formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        console_handler.setFormatter(simple_formatter)
    
    # Add performance filter
    performance_filter = PerformanceFilter()
    console_handler.addFilter(performance_filter)
    
    logger.addHandler(console_handler)
    
    # File handler if specified
    if log_file:
        log_path = Path("logs")
        log_path.mkdir(exist_ok=True)
        
        file_handler = logging.FileHandler(log_path / log_file)
        file_handler.setLevel(log_level)
        
        file_formatter = AIEngineFormatter(
            '%(timestamp)s %(service)s %(name)s %(levelname)s %(message)s'
        )
        file_handler.setFormatter(file_formatter)
        file_handler.addFilter(performance_filter)
        
        logger.addHandler(file_handler)
    
    return logger

def log_ai_request(
    provider: str,
    model: str,
    prompt_length: int,
    response_length: int,
    duration: float,
    success: bool,
    error: str = None
):
    """Log AI provider request metrics"""
    logger = logging.getLogger("ai_requests")
    
    extra = {
        'provider': provider,
        'model': model,
        'prompt_length': prompt_length,
        'response_length': response_length,
        'duration': duration,
        'success': success
    }
    
    if error:
        extra['error'] = error
    
    if success:
        logger.info(f"AI request completed successfully", extra=extra)
    else:
        logger.error(f"AI request failed: {error}", extra=extra)

def log_database_operation(
    operation: str,
    table: str,
    duration: float,
    rows_affected: int = None,
    success: bool = True,
    error: str = None
):
    """Log database operation metrics"""
    logger = logging.getLogger("database")
    
    extra = {
        'operation': operation,
        'table': table,
        'duration': duration,
        'success': success
    }
    
    if rows_affected is not None:
        extra['rows_affected'] = rows_affected
    
    if error:
        extra['error'] = error
    
    if success:
        logger.info(f"Database {operation} on {table} completed", extra=extra)
    else:
        logger.error(f"Database {operation} on {table} failed: {error}", extra=extra)

def log_cache_operation(
    operation: str,
    key: str,
    hit: bool = None,
    duration: float = None,
    size_bytes: int = None
):
    """Log cache operation metrics"""
    logger = logging.getLogger("cache")
    
    extra = {
        'operation': operation,
        'cache_key': key
    }
    
    if hit is not None:
        extra['cache_hit'] = hit
    
    if duration is not None:
        extra['duration'] = duration
    
    if size_bytes is not None:
        extra['size_bytes'] = size_bytes
    
    logger.info(f"Cache {operation} for key {key}", extra=extra)

class LogContext:
    """Context manager for adding structured context to logs"""
    
    def __init__(self, **context):
        self.context = context
        self.logger = structlog.get_logger()
    
    def __enter__(self):
        self.bound_logger = self.logger.bind(**self.context)
        return self.bound_logger
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            self.bound_logger.error(
                "Exception in log context",
                exc_type=exc_type.__name__,
                exc_value=str(exc_val)
            )

# Context managers for common logging scenarios
class AIRequestContext(LogContext):
    """Context for AI provider requests"""
    
    def __init__(self, provider: str, model: str, request_id: str = None):
        super().__init__(
            ai_provider=provider,
            ai_model=model,
            request_id=request_id or f"ai_{datetime.utcnow().timestamp()}"
        )

class DatabaseContext(LogContext):
    """Context for database operations"""
    
    def __init__(self, operation: str, table: str, user_id: int = None):
        super().__init__(
            db_operation=operation,
            db_table=table,
            user_id=user_id
        )

class InsightsGenerationContext(LogContext):
    """Context for insights generation"""
    
    def __init__(self, account_id: int, platform: str, user_id: int):
        super().__init__(
            account_id=account_id,
            platform=platform,
            user_id=user_id,
            operation="insights_generation"
        )

# Utility functions for metrics logging
def log_performance_metrics(
    operation: str,
    duration: float,
    success: bool,
    **kwargs
):
    """Log performance metrics for monitoring"""
    logger = logging.getLogger("performance")
    
    extra = {
        'operation': operation,
        'duration_ms': round(duration * 1000, 2),
        'success': success,
        **kwargs
    }
    
    if success:
        logger.info(f"Performance: {operation} completed", extra=extra)
    else:
        logger.warning(f"Performance: {operation} completed with issues", extra=extra)

def log_user_action(
    user_id: int,
    action: str,
    details: Dict[str, Any] = None
):
    """Log user actions for analytics"""
    logger = logging.getLogger("user_actions")
    
    extra = {
        'user_id': user_id,
        'action': action,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    if details:
        extra.update(details)
    
    logger.info(f"User action: {action}", extra=extra)

def log_system_health(
    component: str,
    status: str,
    metrics: Dict[str, Any] = None
):
    """Log system health metrics"""
    logger = logging.getLogger("system_health")
    
    extra = {
        'component': component,
        'status': status,
        'check_time': datetime.utcnow().isoformat()
    }
    
    if metrics:
        extra.update(metrics)
    
    if status == "healthy":
        logger.info(f"Health check: {component} is healthy", extra=extra)
    else:
        logger.warning(f"Health check: {component} has issues", extra=extra)

# Security logging
def log_security_event(
    event_type: str,
    user_id: int = None,
    ip_address: str = None,
    details: str = None
):
    """Log security events"""
    logger = logging.getLogger("security")
    
    extra = {
        'event_type': event_type,
        'timestamp': datetime.utcnow().isoformat(),
        'severity': 'high' if event_type in ['failed_auth', 'unauthorized_access'] else 'medium'
    }
    
    if user_id:
        extra['user_id'] = user_id
    
    if ip_address:
        extra['ip_address'] = ip_address
    
    if details:
        extra['details'] = details
    
    logger.warning(f"Security event: {event_type}", extra=extra)

# Error tracking integration
def setup_error_tracking():
    """Setup error tracking with Sentry if configured"""
    try:
        if hasattr(settings, 'SENTRY_DSN') and settings.SENTRY_DSN:
            import sentry_sdk
            from sentry_sdk.integrations.logging import LoggingIntegration
            from sentry_sdk.integrations.asyncio import AsyncioIntegration
            
            sentry_logging = LoggingIntegration(
                level=logging.INFO,
                event_level=logging.ERROR
            )
            
            sentry_sdk.init(
                dsn=settings.SENTRY_DSN,
                integrations=[sentry_logging, AsyncioIntegration()],
                traces_sample_rate=0.1,
                environment='development' if settings.DEBUG else 'production'
            )
            
            logger = logging.getLogger("system")
            logger.info("Error tracking initialized with Sentry")
            
    except ImportError:
        logger = logging.getLogger("system")
        logger.warning("Sentry not available for error tracking")
    except Exception as e:
        logger = logging.getLogger("system")
        logger.error(f"Failed to initialize error tracking: {str(e)}")

# Initialize error tracking on import
setup_error_tracking()