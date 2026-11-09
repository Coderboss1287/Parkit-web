import time
import json
import datetime
from typing import Optional, Any
from sqlalchemy.orm import Session
from app.models import GeoCache

class InMemoryTTLCache:
    def __init__(self):
        self._cache: dict[str, tuple[float, Any]] = {}

    def get(self, key: str) -> Optional[Any]:
        if key in self._cache:
            expires_at, val = self._cache[key]
            if time.time() < expires_at:
                return val
            else:
                del self._cache[key]
        return None

    def set(self, key: str, value: Any, ttl_seconds: int):
        self._cache[key] = (time.time() + ttl_seconds, value)

    def clear(self):
        self._cache.clear()

memory_cache = InMemoryTTLCache()

class RateLimiter:
    def __init__(self):
        # key_id -> list of timestamps
        self._requests: dict[int, list[float]] = {}

    def is_allowed(self, key_id: int, max_per_minute: int = 300) -> bool:
        now = time.time()
        window_start = now - 60.0
        timestamps = self._requests.setdefault(key_id, [])
        # Prune old timestamps
        self._requests[key_id] = [t for t in timestamps if t > window_start]
        if len(self._requests[key_id]) >= max_per_minute:
            return False
        self._requests[key_id].append(now)
        return True

rate_limiter = RateLimiter()

def get_cached_response(db: Session, cache_key: str) -> Optional[Any]:
    # 1. Check in-memory cache first
    cached = memory_cache.get(cache_key)
    if cached is not None:
        return cached

    # 2. Check SQLite cache
    now = datetime.datetime.now(datetime.timezone.utc)
    entry = db.query(GeoCache).filter(GeoCache.cache_key == cache_key).first()
    if entry:
        entry_expires = entry.expires_at
        if entry_expires.tzinfo is None:
            entry_expires = entry_expires.replace(tzinfo=datetime.timezone.utc)
        if entry_expires > now:
            try:
                data = json.loads(entry.response_json)
                ttl = int((entry_expires - now).total_seconds())
                if ttl > 0:
                    memory_cache.set(cache_key, data, min(ttl, 3600))
                return data
            except Exception:
                pass
        else:
            db.delete(entry)
            db.commit()
    return None

def set_cached_response(db: Session, cache_key: str, cache_type: str, data: Any, ttl_seconds: int):
    # Set in memory
    memory_cache.set(cache_key, data, min(ttl_seconds, 3600))

    # Persist in DB
    now = datetime.datetime.now(datetime.timezone.utc)
    expires = now + datetime.timedelta(seconds=ttl_seconds)
    json_str = json.dumps(data)

    existing = db.query(GeoCache).filter(GeoCache.cache_key == cache_key).first()
    if existing:
        existing.response_json = json_str
        existing.expires_at = expires
    else:
        new_entry = GeoCache(
            cache_key=cache_key,
            cache_type=cache_type,
            response_json=json_str,
            expires_at=expires,
            created_at=now
        )
        db.add(new_entry)
    try:
        db.commit()
    except Exception:
        db.rollback()

