from typing import List, Optional
import httpx
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.security import verify_api_key
from app.schemas import GeocodeResult, ReverseGeocodeResult, AddressMetadata
from app.cache import get_cached_response, set_cached_response
from app.config import settings

router = APIRouter(prefix="/v1/geocode", tags=["Geocoding Engine (Nominatim Adapter)"])

@router.get("/search", response_model=List[GeocodeResult])
async def search_geocode(
    q: str = Query(..., min_length=1, description="Address, locality, or landmark to geocode"),
    limit: int = Query(5, ge=1, le=20),
    country_codes: Optional[str] = Query("in", description="Country codes (e.g. 'in')"),
    db: Session = Depends(get_db),
    _=Depends(verify_api_key)
):
    cache_key = f"geocode:search:{q.lower().strip()}:{limit}:{country_codes or 'all'}"
    cached = get_cached_response(db, cache_key)
    if cached is not None:
        return cached

    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "format": "jsonv2",
        "addressdetails": 1,
        "q": q,
        "limit": limit
    }
    if country_codes:
        params["countrycodes"] = country_codes

    headers = {
        "User-Agent": settings.NOMINATIM_USER_AGENT,
        "Accept": "application/json"
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, params=params, headers=headers)
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail="Nominatim service returned an error")
            raw_data = resp.json()
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"Failed to reach geocoding provider: {str(exc)}")

    results = []
    for item in raw_data:
        addr = item.get("address", {})
        meta = AddressMetadata(
            road=addr.get("road") or addr.get("pedestrian") or addr.get("street"),
            suburb=addr.get("suburb") or addr.get("neighbourhood") or addr.get("residential"),
            city=addr.get("city") or addr.get("town") or addr.get("village") or addr.get("municipality"),
            state=addr.get("state"),
            postcode=addr.get("postcode"),
            country=addr.get("country"),
            raw=addr
        )

        display_name = item.get("display_name", "")
        name = item.get("name") or (display_name.split(",")[0] if display_name else q)

        results.append({
            "place_id": str(item.get("place_id")),
            "name": name,
            "display_name": display_name,
            "latitude": float(item.get("lat")),
            "longitude": float(item.get("lon")),
            "country": addr.get("country"),
            "state": addr.get("state"),
            "city": meta.city,
            "postal_code": addr.get("postcode"),
            "address_metadata": meta.model_dump()
        })

    # Cache for 24 hours
    ttl_seconds = settings.CACHE_TTL_GEOCODE_HOURS * 3600
    set_cached_response(db, cache_key, "geocode", results, ttl_seconds)

    return results

@router.get("/reverse", response_model=ReverseGeocodeResult)
async def reverse_geocode(
    lat: float = Query(..., ge=-90.0, le=90.0, description="Latitude"),
    lon: float = Query(..., ge=-180.0, le=180.0, description="Longitude"),
    db: Session = Depends(get_db),
    _=Depends(verify_api_key)
):
    rounded_lat = round(lat, 5)
    rounded_lon = round(lon, 5)
    cache_key = f"geocode:reverse:{rounded_lat}:{rounded_lon}"
    cached = get_cached_response(db, cache_key)
    if cached is not None:
        return cached

    url = "https://nominatim.openstreetmap.org/reverse"
    params = {
        "format": "jsonv2",
        "addressdetails": 1,
        "lat": rounded_lat,
        "lon": rounded_lon
    }
    headers = {
        "User-Agent": settings.NOMINATIM_USER_AGENT,
        "Accept": "application/json"
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, params=params, headers=headers)
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail="Nominatim reverse geocode error")
            item = resp.json()
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"Failed to reach reverse geocode provider: {str(exc)}")

    addr = item.get("address", {})
    meta = AddressMetadata(
        road=addr.get("road") or addr.get("pedestrian") or addr.get("street"),
        suburb=addr.get("suburb") or addr.get("neighbourhood") or addr.get("residential"),
        city=addr.get("city") or addr.get("town") or addr.get("village"),
        state=addr.get("state"),
        postcode=addr.get("postcode"),
        country=addr.get("country"),
        raw=addr
    )

    result = {
        "place_id": str(item.get("place_id")),
        "display_name": item.get("display_name", f"{rounded_lat}, {rounded_lon}"),
        "latitude": rounded_lat,
        "longitude": rounded_lon,
        "address_metadata": meta.model_dump()
    }

    ttl_seconds = settings.CACHE_TTL_GEOCODE_HOURS * 3600
    set_cached_response(db, cache_key, "reverse", result, ttl_seconds)

    return result

