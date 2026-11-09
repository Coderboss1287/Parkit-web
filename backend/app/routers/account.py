from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.security import verify_api_key, generate_api_key
from app.models import ApiKey, UsageLog
from app.schemas import ApiKeyResponse, ApiKeyCreate, ApiKeyCreateResponse, UsageStatsResponse, EndpointUsage

router = APIRouter(prefix="/v1/account", tags=["Developer Account, API Keys & Usage Analytics"])

@router.get("/usage", response_model=UsageStatsResponse)
def get_account_usage(
    db: Session = Depends(get_db),
    api_key: ApiKey = Depends(verify_api_key)
):
    total = db.query(UsageLog).count()
    if total == 0:
        return {
            "total_requests": 0,
            "cached_hits": 0,
            "cache_hit_ratio": 0.0,
            "avg_latency_ms": 0.0,
            "error_rate": 0.0,
            "endpoints_breakdown": []
        }

    cached_count = db.query(UsageLog).filter(UsageLog.cached == True).count()
    avg_latency = db.query(func.avg(UsageLog.latency_ms)).scalar() or 0.0
    error_count = db.query(UsageLog).filter(UsageLog.status_code >= 400).count()

    # Endpoints breakdown
    breakdown_rows = (
        db.query(
            UsageLog.endpoint,
            func.count(UsageLog.id).label("total"),
            func.avg(UsageLog.latency_ms).label("avg_lat"),
            func.sum(UsageLog.status_code >= 400).label("errors")
        )
        .group_by(UsageLog.endpoint)
        .all()
    )

    breakdown = []
    for r in breakdown_rows:
        breakdown.append({
            "endpoint": r[0],
            "total_calls": int(r[1]),
            "avg_latency_ms": round(float(r[2] or 0.0), 2),
            "error_count": int(r[3] or 0)
        })

    return {
        "total_requests": total,
        "cached_hits": cached_count,
        "cache_hit_ratio": round(cached_count / total, 3),
        "avg_latency_ms": round(float(avg_latency), 2),
        "error_rate": round(error_count / total, 3),
        "endpoints_breakdown": breakdown
    }

@router.get("/keys", response_model=List[ApiKeyResponse])
def list_api_keys(
    db: Session = Depends(get_db),
    _=Depends(verify_api_key)
):
    keys = db.query(ApiKey).order_by(ApiKey.created_at.desc()).all()
    results = []
    for k in keys:
        results.append({
            "id": k.id,
            "prefix": k.prefix,
            "name": k.name,
            "is_active": k.is_active,
            "rate_limit_per_min": k.rate_limit_per_min,
            "created_at": k.created_at.isoformat() if k.created_at else "",
            "last_used_at": k.last_used_at.isoformat() if k.last_used_at else None
        })
    return results

@router.post("/keys", response_model=ApiKeyCreateResponse, status_code=status.HTTP_201_CREATED)
def create_api_key(
    req: ApiKeyCreate,
    db: Session = Depends(get_db),
    _=Depends(verify_api_key)
):
    raw_key, key_hash, prefix = generate_api_key()
    new_key = ApiKey(
        key_hash=key_hash,
        prefix=prefix,
        name=req.name or "Atlas App Key",
        is_active=True,
        rate_limit_per_min=req.rate_limit_per_min or 300
    )
    db.add(new_key)
    db.commit()
    db.refresh(new_key)

    return {
        "key": raw_key,
        "id": new_key.id,
        "name": new_key.name,
        "prefix": new_key.prefix,
        "message": "Store this API key safely. You will not be able to view it again."
    }

@router.delete("/keys/{key_id}", status_code=status.HTTP_200_OK)
def revoke_api_key(
    key_id: int,
    db: Session = Depends(get_db),
    current_key: ApiKey = Depends(verify_api_key)
):
    target = db.query(ApiKey).filter(ApiKey.id == key_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="API key not found")
    if target.id == current_key.id:
        raise HTTPException(status_code=400, detail="Cannot revoke the currently active key used for this request")

    target.is_active = False
    db.commit()
    return {"message": f"API key {target.prefix} successfully revoked", "id": key_id}

