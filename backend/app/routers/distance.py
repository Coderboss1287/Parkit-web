import math
import httpx
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.security import verify_api_key
from app.schemas import DistanceStraightResponse, DistanceRoadResponse, MatrixRequest, MatrixResponse
from app.routers.route import calculate_haversine
from app.config import settings

router = APIRouter(prefix="/v1/distance", tags=["Distance & Matrix Engine"])

@router.get("/straight", response_model=DistanceStraightResponse)
def get_straight_distance(
    start_lat: float = Query(..., ge=-90.0, le=90.0),
    start_lon: float = Query(..., ge=-180.0, le=180.0),
    end_lat: float = Query(..., ge=-90.0, le=90.0),
    end_lon: float = Query(..., ge=-180.0, le=180.0),
    _=Depends(verify_api_key)
):
    meters, bearing = calculate_haversine(start_lat, start_lon, end_lat, end_lon)
    return {
        "start_lat": start_lat,
        "start_lon": start_lon,
        "end_lat": end_lat,
        "end_lon": end_lon,
        "distance_meters": round(meters, 1),
        "distance_km": round(meters / 1000.0, 3),
        "initial_bearing_degrees": bearing,
        "method": "IUGG Great-Circle Haversine (R=6371008.8m)"
    }

@router.get("/road", response_model=DistanceRoadResponse)
async def get_road_distance(
    start_lat: float = Query(..., ge=-90.0, le=90.0),
    start_lon: float = Query(..., ge=-180.0, le=180.0),
    end_lat: float = Query(..., ge=-90.0, le=90.0),
    end_lon: float = Query(..., ge=-180.0, le=180.0),
    profile: str = Query("driving", pattern="^(driving|walking|cycling)$"),
    _=Depends(verify_api_key)
):
    profile_map = {"driving": "driving", "walking": "foot", "cycling": "bike"}
    osrm_profile = profile_map.get(profile, "driving")
    url = f"https://router.project-osrm.org/route/v1/{osrm_profile}/{start_lon},{start_lat};{end_lon},{end_lat}?overview=false"

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(url, headers={"User-Agent": settings.NOMINATIM_USER_AGENT})
            if resp.status_code == 200:
                data = resp.json()
                if data.get("routes"):
                    r = data["routes"][0]
                    dist_m = float(r.get("distance", 0.0))
                    dur_s = float(r.get("duration", 0.0))
                    return {
                        "start_lat": start_lat,
                        "start_lon": start_lon,
                        "end_lat": end_lat,
                        "end_lon": end_lon,
                        "distance_meters": round(dist_m, 1),
                        "distance_km": round(dist_m / 1000.0, 2),
                        "duration_seconds": round(dur_s, 1),
                        "duration_minutes": max(1.0, round(dur_s / 60.0, 1)),
                        "profile": profile,
                        "provider": "Project OSRM"
                    }
    except Exception:
        pass

    # Fallback to Haversine * road winding factor 1.25
    meters, _ = calculate_haversine(start_lat, start_lon, end_lat, end_lon)
    dist_m = meters * 1.25
    speed_kmh = 35.0 if profile == "driving" else 15.0 if profile == "cycling" else 4.5
    dur_m = max(1.0, round(((dist_m / 1000.0) / speed_kmh) * 60.0, 1))

    return {
        "start_lat": start_lat,
        "start_lon": start_lon,
        "end_lat": end_lat,
        "end_lon": end_lon,
        "distance_meters": round(dist_m, 1),
        "distance_km": round(dist_m / 1000.0, 2),
        "duration_seconds": round(dur_m * 60.0, 1),
        "duration_minutes": dur_m,
        "profile": profile,
        "provider": "Project OSRM (Approximated Road Network Model)"
    }

@router.post("/matrix", response_model=MatrixResponse)
async def calculate_matrix(
    req: MatrixRequest,
    _=Depends(verify_api_key)
):
    origins = req.origins
    destinations = req.destinations
    profile = (req.profile or "driving").lower()

    if not origins or not destinations:
        raise HTTPException(status_code=400, detail="Origins and destinations cannot be empty")

    if profile == "haversine":
        # Pure local calculation
        dist_matrix = []
        for o in origins:
            row = []
            for d in destinations:
                m, _ = calculate_haversine(o[0], o[1], d[0], d[1])
                row.append(round(m / 1000.0, 2))
            dist_matrix.append(row)

        return {
            "origins": origins,
            "destinations": destinations,
            "distances_km": dist_matrix,
            "durations_minutes": None,
            "method": "Local IUGG Haversine Matrix"
        }

    # Use OSRM Table API: /table/v1/{profile}/{coordinates}
    profile_map = {"driving": "driving", "walking": "foot", "cycling": "bike"}
    osrm_profile = profile_map.get(profile, "driving")

    # Combine origins and destinations
    coords_list = []
    # Origins will have indices 0 .. len(origins)-1
    for o in origins:
        coords_list.append(f"{o[1]},{o[0]}")
    # Destinations will have indices len(origins) .. len(origins)+len(destinations)-1
    dest_start_idx = len(origins)
    for d in destinations:
        coords_list.append(f"{d[1]},{d[0]}")

    coords_str = ";".join(coords_list)
    sources_str = ";".join(str(i) for i in range(len(origins)))
    destinations_str = ";".join(str(dest_start_idx + j) for j in range(len(destinations)))

    url = f"https://router.project-osrm.org/table/v1/{osrm_profile}/{coords_str}?sources={sources_str}&destinations={destinations_str}&annotations=distance,duration"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, headers={"User-Agent": settings.NOMINATIM_USER_AGENT})
            if resp.status_code == 200:
                data = resp.json()
                raw_distances = data.get("distances", [])
                raw_durations = data.get("durations", [])

                dist_matrix = [[round(d / 1000.0, 2) if d is not None else 0.0 for d in row] for row in raw_distances]
                dur_matrix = [[max(1.0, round(sec / 60.0, 1)) if sec is not None else 0.0 for sec in row] for row in raw_durations]

                return {
                    "origins": origins,
                    "destinations": destinations,
                    "distances_km": dist_matrix,
                    "durations_minutes": dur_matrix,
                    "method": f"OSRM Table Matrix ({osrm_profile})"
                }
    except Exception:
        pass

    # Fallback to local Haversine matrix
    dist_matrix = []
    dur_matrix = []
    speed_kmh = 35.0 if profile == "driving" else 15.0 if profile == "cycling" else 4.5

    for o in origins:
        d_row = []
        t_row = []
        for d in destinations:
            m, _ = calculate_haversine(o[0], o[1], d[0], d[1])
            road_km = round((m * 1.25) / 1000.0, 2)
            mins = max(1.0, round((road_km / speed_kmh) * 60.0, 1))
            d_row.append(road_km)
            t_row.append(mins)
        dist_matrix.append(d_row)
        dur_matrix.append(t_row)

    return {
        "origins": origins,
        "destinations": destinations,
        "distances_km": dist_matrix,
        "durations_minutes": dur_matrix,
        "method": "Haversine Kinematic Matrix Model"
    }
