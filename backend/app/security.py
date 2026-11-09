import hashlib
import secrets
import datetime
import time
from fastapi import Header, HTTPException, Depends, Request, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ApiKey, UsageLog
from app.config import settings
from app.cache import rate_limiter

def hash_key(raw_key: str) -> str:
    return hashlib.sha256(raw_key.encode("utf-8")).hexdigest()

def generate_api_key(prefix: str = "atlas_live_") -> tuple[str, str, str]:
    token = secrets.token_hex(16)
    raw_key = f"{prefix}{token}"
    key_hash = hash_key(raw_key)
    masked_prefix = f"{raw_key[:15]}...{raw_key[-4:]}"
    return raw_key, key_hash, masked_prefix

def seed_default_key(db: Session):
    default_raw = settings.DEFAULT_DEMO_KEY
    h = hash_key(default_raw)
    existing = db.query(ApiKey).filter(ApiKey.key_hash == h).first()
    if not existing:
        prefix = f"{default_raw[:15]}...{default_raw[-4:]}"
        new_key = ApiKey(
            key_hash=h,
            prefix=prefix,
            name="Default Production Demo Key",
            is_active=True,
            rate_limit_per_min=1000,
            created_at=datetime.datetime.now(datetime.timezone.utc)
        )
        db.add(new_key)
        db.commit()

async def verify_api_key(
    request: Request,
    x_api_key: str = Header(None, alias="X-API-Key", description="ATLAS MAPS API Key"),
    db: Session = Depends(get_db)
) -> ApiKey:
    if not x_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing 'X-API-Key' header. Please provide a valid ATLAS MAPS API key (e.g. atlas_live_demo_key_9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c)."
        )

    h = hash_key(x_api_key)
    api_key = db.query(ApiKey).filter(ApiKey.key_hash == h, ApiKey.is_active == True).first()

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or revoked 'X-API-Key'. Please verify your ATLAS MAPS credentials."
        )

    # Check rate limit
    if not rate_limiter.is_allowed(api_key.id, api_key.rate_limit_per_min):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded ({api_key.rate_limit_per_min} requests/minute). Please slow down."
        )

    # Update last_used_at
    api_key.last_used_at = datetime.datetime.now(datetime.timezone.utc)
    try:
        db.commit()
    except Exception:
        db.rollback()

    # Store on request state for logging middleware
    request.state.api_key_id = api_key.id
    return api_key

