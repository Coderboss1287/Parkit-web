import httpx
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.security import verify_api_key
from app.schemas import PlacesNearbyResponse, PlaceResult
from app.cache import get_cached_response, set_cached_response
from app.routers.route import calculate_haversine
from app.config import settings

router = APIRouter(prefix="/v1/places", tags=["Nearby Places & POI Engine (Overpass API Adapter)"])

CATEGORY_RULES = {
    "restaurants": [("amenity", "restaurant")],
    "cafes": [("amenity", "cafe")],
    "hospitals": [("amenity", "hospital")],
    "pharmacies": [("amenity", "pharmacy")],
    "schools": [("amenity", "school")],
    "colleges": [("amenity", "college"), ("amenity", "university")],
    "hotels": [("tourism", "hotel")],
    "petrol_pumps": [("amenity", "fuel")],
    "fuel_stations": [("amenity", "fuel")],
    "ev_charging_stations": [("amenity", "charging_station")],
    "atms": [("amenity", "atm")],
    "banks": [("amenity", "bank")],
    "shopping_malls": [("shop", "mall")],
    "supermarkets": [("shop", "supermarket")],
    "railway_stations": [("railway", "station"), ("railway", "halt")],
    "airports": [("aeroway", "aerodrome")],
    "parking_areas": [("amenity", "parking")]
}

OVERPASS_MIRRORS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
]

@router.get("/nearby", response_model=PlacesNearbyResponse)
async def get_nearby_places(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0),
    radius: float = Query(2000.0, ge=100.0, le=25000.0, description="Radius in meters"),
    category: str = Query("ev_charging_stations", description="POI category"),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    _=Depends(verify_api_key)
):
    norm_cat = category.lower().strip()
    rules = CATEGORY_RULES.get(norm_cat)
    if not rules:
        valid_cats = ", ".join(CATEGORY_RULES.keys())
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported category '{category}'. Supported categories: {valid_cats}"
        )

    cache_key = f"places:nearby:{round(lat, 4)}:{round(lon, 4)}:{int(radius)}:{norm_cat}:{limit}"
    cached = get_cached_response(db, cache_key)
    if cached is not None:
        return cached

    rad = int(radius)
    subqueries = []
    for k, v in rules:
        subqueries.append(f'node["{k}"="{v}"](around:{rad},{lat},{lon});')
        subqueries.append(f'way["{k}"="{v}"](around:{rad},{lat},{lon});')

    overpass_ql = f"[out:json][timeout:15];({' '.join(subqueries)});out center {limit};"

    elements = []
    for mirror_url in OVERPASS_MIRRORS:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(
                    mirror_url,
                    data={"data": overpass_ql},
                    headers={
                        "Content-Type": "application/x-www-form-urlencoded",
                        "User-Agent": settings.NOMINATIM_USER_AGENT
                    }
                )
                if resp.status_code == 200:
                    data = resp.json()
                    elements = data.get("elements", [])
                    break
        except Exception:
            continue

    places = []
    for el in elements:
        p_lat = el.get("lat") or (el.get("center", {}).get("lat"))
        p_lon = el.get("lon") or (el.get("center", {}).get("lon"))
        if not p_lat or not p_lon:
            continue

        tags = el.get("tags", {})
        name = tags.get("name") or tags.get("operator") or tags.get("brand") or f"{norm_cat.replace('_', ' ').title()} #{el.get('id')}"

        dist_m, _ = calculate_haversine(lat, lon, float(p_lat), float(p_lon))

        places.append({
            "id": f"{el.get('type', 'node')}_{el.get('id')}",
            "name": name,
            "category": norm_cat,
            "latitude": float(p_lat),
            "longitude": float(p_lon),
            "distance_meters": round(dist_m, 1),
            "distance_km": round(dist_m / 1000.0, 2),
            "tags": tags
        })

    # Sort by Haversine distance from search center
    places.sort(key=lambda x: x["distance_meters"])
    places = places[:limit]

    result = {
        "category": norm_cat,
        "center": [lat, lon],
        "radius_meters": radius,
        "count": len(places),
        "places": places,
        "provider": "Overpass API (OpenStreetMap)"
    }

    set_cached_response(db, cache_key, "places", result, settings.CACHE_TTL_PLACES_MINUTES * 60)
    return result

@router.get("/search", response_model=PlacesNearbyResponse)
async def search_places(
    q: str = Query(..., min_length=1),
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0),
    radius: float = Query(10000.0, ge=500.0, le=50000.0),
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
    _=Depends(verify_api_key)
):
    rad = int(radius)
    overpass_ql = f'[out:json][timeout:15];(node["name"~"{q}",i](around:{rad},{lat},{lon});way["name"~"{q}",i](around:{rad},{lat},{lon}););out center {limit};'

    elements = []
    for mirror in OVERPASS_MIRRORS:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(
                    mirror,
                    data={"data": overpass_ql},
                    headers={"Content-Type": "application/x-www-form-urlencoded", "User-Agent": settings.NOMINATIM_USER_AGENT}
                )
                if resp.status_code == 200:
                    elements = resp.json().get("elements", [])
                    break
        except Exception:
            continue

    places = []
    for el in elements:
        p_lat = el.get("lat") or (el.get("center", {}).get("lat"))
        p_lon = el.get("lon") or (el.get("center", {}).get("lon"))
        if not p_lat or not p_lon:
            continue
        tags = el.get("tags", {})
        name = tags.get("name") or f"Place #{el.get('id')}"
        dist_m, _ = calculate_haversine(lat, lon, float(p_lat), float(p_lon))

        places.append({
            "id": f"{el.get('type', 'node')}_{el.get('id')}",
            "name": name,
            "category": "search_result",
            "latitude": float(p_lat),
            "longitude": float(p_lon),
            "distance_meters": round(dist_m, 1),
            "distance_km": round(dist_m / 1000.0, 2),
            "tags": tags
        })

    places.sort(key=lambda x: x["distance_meters"])
    return {
        "category": "custom_search",
        "center": [lat, lon],
        "radius_meters": radius,
        "count": len(places),
        "places": places,
        "provider": "Overpass API (OpenStreetMap)"
    }

@router.get("/{place_id}")
async def get_place_details(
    place_id: str,
    _=Depends(verify_api_key)
):
    parts = place_id.split("_")
    osm_type = parts[0] if len(parts) > 1 else "node"
    osm_id = parts[1] if len(parts) > 1 else parts[0]

    overpass_ql = f"[out:json][timeout:10];{osm_type}({osm_id});out center;"

    for mirror in OVERPASS_MIRRORS:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(mirror, data={"data": overpass_ql}, headers={"User-Agent": settings.NOMINATIM_USER_AGENT})
                if resp.status_code == 200:
                    elements = resp.json().get("elements", [])
                    if elements:
                        el = elements[0]
                        return {
                            "id": place_id,
                            "latitude": el.get("lat") or el.get("center", {}).get("lat"),
                            "longitude": el.get("lon") or el.get("center", {}).get("lon"),
                            "tags": el.get("tags", {}),
                            "provider": "Overpass API"
                        }
        except Exception:
            continue

    raise HTTPException(status_code=404, detail=f"Place '{place_id}' not found")
