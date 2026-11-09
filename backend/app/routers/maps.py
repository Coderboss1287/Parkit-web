from fastapi import APIRouter, Depends
from app.security import verify_api_key
from app.schemas import MapConfigResponse, MapStylesResponse
from app.config import settings

router = APIRouter(prefix="/v1/maps", tags=["Global Map Config & Styles"])

@router.get("/config", response_model=MapConfigResponse)
def get_map_config(_=Depends(verify_api_key)):
    return {
        "center": [72.8777, 19.0760],
        "zoom": 12,
        "attribution": "© ATLAS MAPS API • OpenStreetMap • Esri • OpenTopoMap",
        "default_style": "voyager",
        "available_styles": ["voyager", "dark", "satellite", "topo"]
    }

@router.get("/styles", response_model=MapStylesResponse)
def get_map_styles(_=Depends(verify_api_key)):
    maptiler_key = settings.MAPTILER_API_KEY
    maptiler_enabled = bool(maptiler_key)

    vector_styles = {
        "voyager": None,
        "dark": None,
        "satellite": None,
        "topo": None,
        "maptiler_streets": f"https://api.maptiler.com/maps/streets-v2/style.json?key={maptiler_key}" if maptiler_enabled else None
    }

    return {
        "raster_styles": {
            "voyager": "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            "dark": "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            "satellite": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            "topo": "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        },
        "vector_styles": vector_styles,
        "maptiler_enabled": maptiler_enabled
    }

