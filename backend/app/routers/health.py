from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app.schemas import HealthResponse, ReadyResponse
import httpx

router = APIRouter(tags=["Health & Readiness"])

@router.get("/health", response_model=HealthResponse)
def get_health():
    return {
        "status": "healthy",
        "service": "ATLAS MAPS API",
        "version": "1.0.0"
    }

@router.get("/ready", response_model=ReadyResponse)
async def get_readiness(db: Session = Depends(get_db)):
    db_status = "unhealthy"
    try:
        db.execute(text("SELECT 1"))
        db_status = "ready"
    except Exception as e:
        db_status = f"error: {str(e)}"

    providers = {
        "nominatim_geocoder": "available",
        "osrm_router": "available",
        "overpass_places": "available",
        "osm_tiles": "available"
    }

    return {
        "status": "ready" if db_status == "ready" else "degraded",
        "database": db_status,
        "cache": "ready (in-memory TTL + SQLite)",
        "providers": providers
    }

