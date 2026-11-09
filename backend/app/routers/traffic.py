import httpx
from fastapi import APIRouter, Depends, Query, HTTPException, status
from fastapi.responses import Response
from app.security import verify_api_key
from app.schemas import TrafficIncidentsResponse
from app.config import settings

router = APIRouter(prefix="/v1/traffic", tags=["Live Traffic Engine (TomTom Adapter)"])

@router.get("/flow/{z}/{x}/{y}")
async def get_traffic_flow_tile(
    z: int,
    x: int,
    y: int,
    _=Depends(verify_api_key)
):
    if not settings.TOMTOM_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error": "CREDENTIALS_NOT_CONFIGURED",
                "message": "TomTom Traffic Flow API key is not configured. Please set TOMTOM_API_KEY in backend/.env to view real-time traffic congestion layers.",
                "provider": "TomTom Traffic Flow API"
            }
        )

    url = f"https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key={settings.TOMTOM_API_KEY}"
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                return Response(content=resp.content, media_type="image/png")
            raise HTTPException(status_code=resp.status_code, detail=resp.text)
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"TomTom flow error: {str(exc)}")

@router.get("/incidents", response_model=TrafficIncidentsResponse)
async def get_traffic_incidents(
    bbox: str = Query(..., description="minLon,minLat,maxLon,maxLat"),
    _=Depends(verify_api_key)
):
    if not settings.TOMTOM_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error": "CREDENTIALS_NOT_CONFIGURED",
                "message": "TomTom Traffic Incidents API key is not configured. Please set TOMTOM_API_KEY in backend/.env to query real-time accidents, jams, and road closures.",
                "provider": "TomTom Traffic Incidents API"
            }
        )

    url = "https://api.tomtom.com/traffic/services/5/incidentDetails"
    params = {
        "key": settings.TOMTOM_API_KEY,
        "bbox": bbox,
        "fields": "{incidents{type,geometry{type,coordinates},properties{iconCategory,magnitudeOfDelay,events{description}}}}"
    }

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(url, params=params)
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail=resp.text)
            data = resp.json()
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"TomTom incidents error: {str(exc)}")

    incidents = []
    for inc in data.get("incidents", []):
        props = inc.get("properties", {})
        events = props.get("events", [{}])
        geom = inc.get("geometry", {})
        coords = geom.get("coordinates", [0, 0])
        if coords and isinstance(coords[0], list):
            coords = coords[0]

        incidents.append({
            "id": str(inc.get("id", "inc")),
            "description": events[0].get("description", "Traffic delay"),
            "severity": str(props.get("magnitudeOfDelay", "moderate")),
            "delay_seconds": int(props.get("delay", 0)),
            "coordinates": coords
        })

    return {
        "incidents": incidents,
        "bbox": bbox,
        "provider": "TomTom Traffic API"
    }

