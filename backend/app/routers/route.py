import math
import httpx
from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.security import verify_api_key
from app.schemas import RouteResponse, RouteRequest, RouteStep, TrafficAwareRouteRequest
from app.cache import get_cached_response, set_cached_response
from app.config import settings

router = APIRouter(prefix="/v1/route", tags=["Directions & Routing Engine (Project OSRM Adapter)"])

def calculate_haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> tuple[float, float]:
    R = 6371008.8  # IUGG mean earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(max(0.0, 1.0 - a)))
    meters = R * c

    # Initial bearing calculation
    y = math.sin(delta_lambda) * math.cos(phi2)
    x = math.cos(phi1) * math.sin(phi2) - math.sin(phi1) * math.cos(phi2) * math.cos(delta_lambda)
    bearing = (math.degrees(math.atan2(y, x)) + 360.0) % 360.0

    return meters, round(bearing, 1)

def parse_osrm_response(data: dict, profile: str, s_lat: float, s_lon: float, e_lat: float, e_lon: float) -> dict:
    if not data or "routes" not in data or len(data["routes"]) == 0:
        raise HTTPException(status_code=404, detail="No route found between coordinates")

    route = data["routes"][0]
    distance_meters = float(route.get("distance", 0.0))
    duration_seconds = float(route.get("duration", 0.0))
    geometry = route.get("geometry", {"type": "LineString", "coordinates": [[s_lon, s_lat], [e_lon, e_lat]]})

    straight_meters, bearing = calculate_haversine(s_lat, s_lon, e_lat, e_lon)

    steps_list = []
    legs = route.get("legs", [])
    if legs:
        for leg in legs:
            for s in leg.get("steps", []):
                instruction = ""
                maneuver = s.get("maneuver", {})
                m_type = maneuver.get("type", "continue")
                m_modifier = maneuver.get("modifier", "")
                name = s.get("name") or "road"

                if m_type == "depart":
                    instruction = f"Head {m_modifier or 'forward'} on {name}"
                elif m_type == "arrive":
                    instruction = f"Arrive at destination"
                elif m_modifier:
                    instruction = f"Turn {m_modifier} onto {name}"
                else:
                    instruction = f"Continue on {name}"

                steps_list.append({
                    "instruction": instruction,
                    "distance_meters": float(s.get("distance", 0.0)),
                    "duration_seconds": float(s.get("duration", 0.0)),
                    "name": name,
                    "maneuver_type": m_type,
                    "maneuver_modifier": m_modifier
                })

    return {
        "distance_meters": round(distance_meters, 1),
        "distance_km": round(distance_meters / 1000.0, 2),
        "duration_seconds": round(duration_seconds, 1),
        "duration_minutes": max(1.0, round(duration_seconds / 60.0, 1)),
        "profile": profile,
        "straight_distance_km": round(straight_meters / 1000.0, 2),
        "initial_bearing_degrees": bearing,
        "geometry": geometry,
        "steps": steps_list,
        "provider": "Project OSRM"
    }

async def fetch_osrm_route(s_lat: float, s_lon: float, e_lat: float, e_lon: float, profile: str, db: Session) -> dict:
    profile_map = {
        "driving": "driving",
        "walking": "foot",
        "cycling": "bike"
    }
    osrm_profile = profile_map.get(profile.lower(), "driving")

    cache_key = f"route:{osrm_profile}:{round(s_lat,4)},{round(s_lon,4)}->{round(e_lat,4)},{round(e_lon,4)}"
    cached = get_cached_response(db, cache_key)
    if cached is not None:
        return cached

    url = f"https://router.project-osrm.org/route/v1/{osrm_profile}/{s_lon},{s_lat};{e_lon},{e_lat}"
    params = {
        "overview": "full",
        "geometries": "geojson",
        "steps": "true",
        "alternatives": "false"
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, params=params, headers={"User-Agent": settings.NOMINATIM_USER_AGENT})
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail=f"OSRM router error: {resp.text}")
            data = resp.json()
    except httpx.RequestError as exc:
        # Fallback to geodesic direct corridor if OSRM is unreachable
        straight_meters, bearing = calculate_haversine(s_lat, s_lon, e_lat, e_lon)
        dist_km = straight_meters / 1000.0
        # Estimated speed based on profile
        speed_kmh = 35.0 if profile == "driving" else 15.0 if profile == "cycling" else 4.5
        est_minutes = round((dist_km / speed_kmh) * 60.0, 1)

        result = {
            "distance_meters": round(straight_meters * 1.25, 1),  # road winding factor
            "distance_km": round(dist_km * 1.25, 2),
            "duration_seconds": round(est_minutes * 60.0, 1),
            "duration_minutes": est_minutes,
            "profile": profile,
            "straight_distance_km": round(dist_km, 2),
            "initial_bearing_degrees": bearing,
            "geometry": {
                "type": "LineString",
                "coordinates": [[s_lon, s_lat], [e_lon, e_lat]]
            },
            "steps": [{
                "instruction": f"Head toward destination along corridor (bearing {bearing}°)",
                "distance_meters": round(straight_meters, 1),
                "duration_seconds": round(est_minutes * 60.0, 1),
                "name": "Corridor",
                "maneuver_type": "depart",
                "maneuver_modifier": "straight"
            }],
            "provider": "Project OSRM (Direct Geodesic Fallback)"
        }
        return result

    result = parse_osrm_response(data, profile, s_lat, s_lon, e_lat, e_lon)
    set_cached_response(db, cache_key, "route", result, settings.CACHE_TTL_ROUTES_MINUTES * 60)
    return result

@router.get("", response_model=RouteResponse)
async def get_route(
    start_lat: float = Query(..., ge=-90.0, le=90.0),
    start_lon: float = Query(..., ge=-180.0, le=180.0),
    end_lat: float = Query(..., ge=-90.0, le=90.0),
    end_lon: float = Query(..., ge=-180.0, le=180.0),
    profile: str = Query("driving", pattern="^(driving|walking|cycling)$"),
    alternatives: bool = Query(False),
    steps: bool = Query(True),
    db: Session = Depends(get_db),
    _=Depends(verify_api_key)
):
    return await fetch_osrm_route(start_lat, start_lon, end_lat, end_lon, profile, db)

@router.post("", response_model=RouteResponse)
async def post_route(
    req: RouteRequest,
    db: Session = Depends(get_db),
    _=Depends(verify_api_key)
):
    s_lat, s_lon = req.origin[0], req.origin[1]
    e_lat, e_lon = req.destination[0], req.destination[1]
    return await fetch_osrm_route(s_lat, s_lon, e_lat, e_lon, req.profile or "driving", db)

@router.post("/traffic-aware")
async def post_traffic_aware_route(
    req: TrafficAwareRouteRequest,
    db: Session = Depends(get_db),
    _=Depends(verify_api_key)
):
    if not settings.TOMTOM_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error": "CREDENTIALS_NOT_CONFIGURED",
                "message": "TomTom Traffic API is not configured. Please set TOMTOM_API_KEY in backend/.env to enable live congestion-aware routing.",
                "provider": "TomTom Routing API"
            }
        )

    # If TomTom API key is provided
    s_lat, s_lon = req.origin[0], req.origin[1]
    e_lat, e_lon = req.destination[0], req.destination[1]
    url = f"https://api.tomtom.com/routing/1/calculateRoute/{s_lat},{s_lon}:{e_lat},{e_lon}/json"
    params = {
        "key": settings.TOMTOM_API_KEY,
        "traffic": "true",
        "departAt": req.departure_time or "now"
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, params=params)
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail=resp.text)
            return resp.json()
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"TomTom routing error: {str(exc)}")
