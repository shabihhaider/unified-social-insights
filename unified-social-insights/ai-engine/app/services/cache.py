"""
app/services/cache.py - Enhanced Cache Management System
Professional-grade caching with Redis and intelligent invalidation
"""

import asyncio
import json
import pickle
import hashlib
import logging
from typing import Any, Dict, List, Optional, Union, Callable
from datetime import datetime, timedelta
import aioredis
from dataclasses import dataclass, asdict
import compress_pickle

from app.config import settings
from app.utils.logger import setup_logger

logger = setup_logger("cache_manager")

@dataclass
class CacheEntry:
    """Cache entry with metadata"""
    key: str
    value: Any
    created_at: datetime
    expires_at: Optional[datetime]
    access_count: int = 0
    last_accessed: Optional[datetime] = None
    tags: List[str] = None
    size_bytes: int = 0

class CacheStats:
    """Cache statistics tracker"""
    
    def __init__(self):
        self.hits = 0
        self.misses = 0
        self.sets = 0
        self.deletes = 0
        self.errors = 0
        self.total_size = 0
        self.start_time = datetime.utcnow()
    
    @property
    def hit_rate(self) -> float:
        total = self.hits + self.misses
        return (self.hits / total * 100) if total > 0 else 0
    
    @property
    def uptime(self) -> timedelta:
        return datetime.utcnow() - self.start_time
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "hits": self.hits,
            "misses": self.misses,
            "sets": self.sets,
            "deletes": self.deletes,
            "errors": self.errors,
            "hit_rate": round(self.hit_rate, 2),
            "total_size_mb": round(self.total_size / (1024 * 1024), 2),
            "uptime_seconds": self.uptime.total_seconds()
        }

class CacheManager:
    """Enhanced Cache Manager with Redis backend"""
    
    def __init__(self):
        self.redis: Optional[aioredis.Redis] = None
        self.stats = CacheStats()
        self.prefix = settings.CACHE_PREFIX
        self.default_ttl = settings.CACHE_TTL
        self._initialized = False
        
        # Cache configuration
        self.compression_enabled = True
        self.compression_threshold = 1024  # bytes
        self.max_key_length = 250
        
        # Serialization methods
        self.serializers = {
            'json': (json.dumps, json.loads),
            'pickle': (pickle.dumps, pickle.loads),
            'compress_pickle': (compress_pickle.dumps, compress_pickle.loads)
        }
    
    async def initialize(self):
        """Initialize Redis connection"""
        try:
            self.redis = aioredis.from_url(
                settings.redis_url,
                encoding="utf-8",
                decode_responses=False,  # We handle encoding ourselves
                max_connections=20,
                retry_on_timeout=True
            )
            
            # Test connection
            await self.redis.ping()
            
            self._initialized = True
            logger.info(f"✅ Cache manager initialized with Redis at {settings.REDIS_HOST}:{settings.REDIS_PORT}")
            
        except Exception as e:
            logger.error(f"❌ Cache initialization failed: {str(e)}")
            raise e
    
    async def close(self):
        """Close Redis connection"""
        if self.redis:
            await self.redis.close()
            self._initialized = False
            logger.info("🔄 Cache manager closed")
    
    def _ensure_initialized(self):
        """Ensure cache is initialized"""
        if not self._initialized:
            raise RuntimeError("Cache manager not initialized. Call initialize() first.")
    
    def _build_key(self, key: str, namespace: str = None) -> str:
        """Build cache key with prefix and namespace"""
        if namespace:
            full_key = f"{self.prefix}{namespace}:{key}"
        else:
            full_key = f"{self.prefix}{key}"
        
        # Ensure key length doesn't exceed Redis limits
        if len(full_key) > self.max_key_length:
            # Create hash for long keys
            key_hash = hashlib.sha256(full_key.encode()).hexdigest()[:16]
            full_key = f"{self.prefix}hash:{key_hash}"
        
        return full_key
    
    def _serialize_value(self, value: Any, method: str = 'auto') -> bytes:
        """Serialize value for storage"""
        try:
            if method == 'auto':
                # Auto-detect best serialization method
                if isinstance(value, (str, int, float, bool, list, dict)):
                    method = 'json'
                else:
                    method = 'compress_pickle' if self.compression_enabled else 'pickle'
            
            serializer = self.serializers[method][0]
            
            if method == 'json':
                serialized = serializer(value, ensure_ascii=False).encode('utf-8')
            else:
                serialized = serializer(value)
            
            # Apply compression if enabled and data is large enough
            if (self.compression_enabled and 
                method != 'compress_pickle' and 
                len(serialized) > self.compression_threshold):
                
                import gzip
                serialized = gzip.compress(serialized)
                method += '_gzip'
            
            # Prepend method identifier
            return f"{method}:".encode() + serialized
            
        except Exception as e:
            logger.error(f"❌ Serialization error: {str(e)}")
            raise e
    
    def _deserialize_value(self, data: bytes) -> Any:
        """Deserialize value from storage"""
        try:
            # Extract method identifier
            method_end = data.find(b':')
            if method_end == -1:
                raise ValueError("Invalid cache data format")
            
            method = data[:method_end].decode()
            serialized_data = data[method_end + 1:]
            
            # Handle compression
            if method.endswith('_gzip'):
                import gzip
                serialized_data = gzip.decompress(serialized_data)
                method = method[:-5]  # Remove '_gzip' suffix
            
            # Deserialize
            deserializer = self.serializers[method][1]
            
            if method == 'json':
                return deserializer(serialized_data.decode('utf-8'))
            else:
                return deserializer(serialized_data)
                
        except Exception as e:
            logger.error(f"❌ Deserialization error: {str(e)}")
            raise e
    
    async def get(
        self, 
        key: str, 
        namespace: str = None,
        default: Any = None,
        track_access: bool = True
    ) -> Any:
        """Get value from cache"""
        self._ensure_initialized()
        
        cache_key = self._build_key(key, namespace)
        
        try:
            data = await self.redis.get(cache_key)
            
            if data is None:
                self.stats.misses += 1
                return default
            
            value = self._deserialize_value(data)
            
            if track_access:
                # Update access statistics
                await self._update_access_stats(cache_key)
            
            self.stats.hits += 1
            return value
            
        except Exception as e:
            logger.error(f"❌ Cache get error for key {cache_key}: {str(e)}")
            self.stats.errors += 1
            return default
    
    async def set(
        self,
        key: str,
        value: Any,
        expire: int = None,
        namespace: str = None,
        tags: List[str] = None,
        if_not_exists: bool = False
    ) -> bool:
        """Set value in cache"""
        self._ensure_initialized()
        
        cache_key = self._build_key(key, namespace)
        expire = expire or self.default_ttl
        
        try:
            serialized_value = self._serialize_value(value)
            
            # Set value with expiration
            if if_not_exists:
                success = await self.redis.set(cache_key, serialized_value, ex=expire, nx=True)
            else:
                success = await self.redis.set(cache_key, serialized_value, ex=expire)
            
            if success:
                self.stats.sets += 1
                self.stats.total_size += len(serialized_value)
                
                # Store tags for invalidation
                if tags:
                    await self._store_tags(cache_key, tags)
                
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"❌ Cache set error for key {cache_key}: {str(e)}")
            self.stats.errors += 1
            return False
    
    async def delete(self, key: str, namespace: str = None) -> bool:
        """Delete value from cache"""
        self._ensure_initialized()
        
        cache_key = self._build_key(key, namespace)
        
        try:
            deleted = await self.redis.delete(cache_key)
            
            if deleted:
                self.stats.deletes += 1
                # Remove from tag associations
                await self._remove_from_tags(cache_key)
            
            return bool(deleted)
            
        except Exception as e:
            logger.error(f"❌ Cache delete error for key {cache_key}: {str(e)}")
            self.stats.errors += 1
            return False
    
    async def exists(self, key: str, namespace: str = None) -> bool:
        """Check if key exists in cache"""
        self._ensure_initialized()
        
        cache_key = self._build_key(key, namespace)
        
        try:
            return bool(await self.redis.exists(cache_key))
        except Exception as e:
            logger.error(f"❌ Cache exists error for key {cache_key}: {str(e)}")
            return False
    
    async def expire(self, key: str, seconds: int, namespace: str = None) -> bool:
        """Set expiration for existing key"""
        self._ensure_initialized()
        
        cache_key = self._build_key(key, namespace)
        
        try:
            return bool(await self.redis.expire(cache_key, seconds))
        except Exception as e:
            logger.error(f"❌ Cache expire error for key {cache_key}: {str(e)}")
            return False
    
    async def ttl(self, key: str, namespace: str = None) -> int:
        """Get time to live for key"""
        self._ensure_initialized()
        
        cache_key = self._build_key(key, namespace)
        
        try:
            return await self.redis.ttl(cache_key)
        except Exception as e:
            logger.error(f"❌ Cache TTL error for key {cache_key}: {str(e)}")
            return -1
    
    async def increment(
        self, 
        key: str, 
        amount: int = 1, 
        namespace: str = None,
        expire: int = None
    ) -> int:
        """Increment numeric value"""
        self._ensure_initialized()
        
        cache_key = self._build_key(key, namespace)
        
        try:
            pipeline = self.redis.pipeline()
            pipeline.incrby(cache_key, amount)
            
            if expire:
                pipeline.expire(cache_key, expire)
            
            results = await pipeline.execute()
            return results[0]
            
        except Exception as e:
            logger.error(f"❌ Cache increment error for key {cache_key}: {str(e)}")
            return 0
    
    async def get_many(
        self, 
        keys: List[str], 
        namespace: str = None
    ) -> Dict[str, Any]:
        """Get multiple values from cache"""
        self._ensure_initialized()
        
        cache_keys = [self._build_key(key, namespace) for key in keys]
        
        try:
            values = await self.redis.mget(cache_keys)
            result = {}
            
            for i, (original_key, cache_key, value) in enumerate(zip(keys, cache_keys, values)):
                if value is not None:
                    try:
                        result[original_key] = self._deserialize_value(value)
                        self.stats.hits += 1
                    except Exception as e:
                        logger.error(f"❌ Deserialization error for {cache_key}: {str(e)}")
                        self.stats.errors += 1
                else:
                    self.stats.misses += 1
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Cache get_many error: {str(e)}")
            self.stats.errors += 1
            return {}
    
    async def set_many(
        self, 
        mapping: Dict[str, Any], 
        expire: int = None,
        namespace: str = None
    ) -> bool:
        """Set multiple values in cache"""
        self._ensure_initialized()
        
        expire = expire or self.default_ttl
        
        try:
            pipeline = self.redis.pipeline()
            
            for key, value in mapping.items():
                cache_key = self._build_key(key, namespace)
                serialized_value = self._serialize_value(value)
                pipeline.set(cache_key, serialized_value, ex=expire)
            
            results = await pipeline.execute()
            success_count = sum(1 for result in results if result)
            
            self.stats.sets += success_count
            return success_count == len(mapping)
            
        except Exception as e:
            logger.error(f"❌ Cache set_many error: {str(e)}")
            self.stats.errors += 1
            return False
    
    async def delete_many(
        self, 
        keys: List[str], 
        namespace: str = None
    ) -> int:
        """Delete multiple keys from cache"""
        self._ensure_initialized()
        
        cache_keys = [self._build_key(key, namespace) for key in keys]
        
        try:
            deleted_count = await self.redis.delete(*cache_keys)
            self.stats.deletes += deleted_count
            return deleted_count
            
        except Exception as e:
            logger.error(f"❌ Cache delete_many error: {str(e)}")
            self.stats.errors += 1
            return 0
    
    async def clear_namespace(self, namespace: str) -> int:
        """Clear all keys in a namespace"""
        self._ensure_initialized()
        
        pattern = f"{self.prefix}{namespace}:*"
        
        try:
            keys = []
            async for key in self.redis.scan_iter(match=pattern):
                keys.append(key)
            
            if keys:
                deleted_count = await self.redis.delete(*keys)
                self.stats.deletes += deleted_count
                return deleted_count
            
            return 0
            
        except Exception as e:
            logger.error(f"❌ Cache clear_namespace error for {namespace}: {str(e)}")
            self.stats.errors += 1
            return 0
    
    async def invalidate_by_tags(self, tags: List[str]) -> int:
        """Invalidate cache entries by tags"""
        self._ensure_initialized()
        
        try:
            keys_to_delete = set()
            
            for tag in tags:
                tag_key = f"{self.prefix}tags:{tag}"
                tag_members = await self.redis.smembers(tag_key)
                keys_to_delete.update(tag_members)
            
            if keys_to_delete:
                # Delete the keys
                deleted_count = await self.redis.delete(*keys_to_delete)
                
                # Clean up tag associations
                for tag in tags:
                    await self.redis.delete(f"{self.prefix}tags:{tag}")
                
                self.stats.deletes += deleted_count
                return deleted_count
            
            return 0
            
        except Exception as e:
            logger.error(f"❌ Cache invalidate_by_tags error: {str(e)}")
            self.stats.errors += 1
            return 0
    
    async def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        try:
            redis_info = await self.redis.info()
            
            return {
                "cache_stats": self.stats.to_dict(),
                "redis_info": {
                    "connected_clients": redis_info.get("connected_clients", 0),
                    "used_memory": redis_info.get("used_memory", 0),
                    "used_memory_human": redis_info.get("used_memory_human", "0B"),
                    "keyspace_hits": redis_info.get("keyspace_hits", 0),
                    "keyspace_misses": redis_info.get("keyspace_misses", 0),
                    "total_commands_processed": redis_info.get("total_commands_processed", 0)
                }
            }
        except Exception as e:
            logger.error(f"❌ Error getting cache stats: {str(e)}")
            return {"cache_stats": self.stats.to_dict(), "redis_info": {}}
    
    async def health_check(self) -> Dict[str, Any]:
        """Perform cache health check"""
        try:
            start_time = datetime.utcnow()
            
            # Test basic operations
            test_key = f"health_check_{int(start_time.timestamp())}"
            test_value = {"timestamp": start_time.isoformat(), "test": True}
            
            # Test set
            set_success = await self.set(test_key, test_value, expire=60)
            
            # Test get
            retrieved_value = await self.get(test_key)
            
            # Test delete
            delete_success = await self.delete(test_key)
            
            response_time = (datetime.utcnow() - start_time).total_seconds()
            
            return {
                "status": "healthy" if (set_success and retrieved_value == test_value and delete_success) else "unhealthy",
                "response_time": response_time,
                "operations": {
                    "set": set_success,
                    "get": retrieved_value == test_value,
                    "delete": delete_success
                },
                "stats": self.stats.to_dict()
            }
            
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "stats": self.stats.to_dict()
            }
    
    # Helper methods for advanced features
    async def _store_tags(self, cache_key: str, tags: List[str]):
        """Store tag associations for cache invalidation"""
        try:
            pipeline = self.redis.pipeline()
            
            for tag in tags:
                tag_key = f"{self.prefix}tags:{tag}"
                pipeline.sadd(tag_key, cache_key)
                pipeline.expire(tag_key, self.default_ttl)
            
            await pipeline.execute()
            
        except Exception as e:
            logger.error(f"❌ Error storing tags: {str(e)}")
    
    async def _remove_from_tags(self, cache_key: str):
        """Remove key from all tag associations"""
        try:
            # This is a simplified implementation
            # In production, you might want to track reverse associations
            tag_pattern = f"{self.prefix}tags:*"
            
            async for tag_key in self.redis.scan_iter(match=tag_pattern):
                await self.redis.srem(tag_key, cache_key)
            
        except Exception as e:
            logger.error(f"❌ Error removing from tags: {str(e)}")
    
    async def _update_access_stats(self, cache_key: str):
        """Update access statistics for a key"""
        try:
            stats_key = f"{cache_key}:stats"
            pipeline = self.redis.pipeline()
            pipeline.hincrby(stats_key, "access_count", 1)
            pipeline.hset(stats_key, "last_accessed", datetime.utcnow().isoformat())
            pipeline.expire(stats_key, self.default_ttl)
            await pipeline.execute()
            
        except Exception as e:
            # Don't log this as it's not critical
            pass
    
    # Decorator for caching function results
    def cached(
        self,
        expire: int = None,
        namespace: str = None,
        key_func: Callable = None,
        tags: List[str] = None
    ):
        """Decorator for caching function results"""
        def decorator(func):
            async def wrapper(*args, **kwargs):
                # Generate cache key
                if key_func:
                    cache_key = key_func(*args, **kwargs)
                else:
                    import hashlib
                    key_parts = [func.__name__, str(args), str(sorted(kwargs.items()))]
                    cache_key = hashlib.md5(":".join(key_parts).encode()).hexdigest()
                
                # Try to get from cache
                cached_result = await self.get(cache_key, namespace)
                if cached_result is not None:
                    return cached_result
                
                # Execute function and cache result
                result = await func(*args, **kwargs)
                await self.set(cache_key, result, expire, namespace, tags)
                
                return result
            
            return wrapper
        return decorator