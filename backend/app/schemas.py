from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# Health & Ready
class HealthResponse(BaseModel):
    status: str
    service: str = "ATLAS MAPS API"
    version: str = "1.0.0"

class ReadyResponse(BaseModel):
    status: str
    database: str
    cache: str
    providers: Dict[str, str]

# Maps Config & Styles
class MapConfigResponse(BaseModel):
    center: List[float] = [72.8777, 19.0760]  # Mumbai [lng, lat]
    zoom: int = 12
    attribution: str = "© ATLAS MAPS API • OpenStreetMap • Esri • OpenTopoMap"
    default_style: str = "voyager"
    available_styles: List[str]

class MapStylesResponse(BaseModel):
    raster_styles: Dict[str, str]
    vector_styles: Dict[str, Optional[str]]
    maptiler_enabled: bool

# Geocoding
class AddressMetadata(BaseModel):
    road: Optional[str] = None
    suburb: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postcode: Optional[str] = None
    country: Optional[str] = None
    raw: Optional[Dict[str, Any]] = None

class GeocodeResult(BaseModel):
    place_id: Optional[str] = None
    name: str
    display_name: str
    latitude: float
    longitude: float
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    address_metadata: Optional[AddressMetadata] = None

class ReverseGeocodeResult(BaseModel):
    place_id: Optional[str] = None
    display_name: str
    latitude: float
    longitude: float
    address_metadata: Optional[AddressMetadata] = None

# Routing
class RouteStep(BaseModel):
    instruction: str
    distance_meters: float
    duration_seconds: float
    name: Optional[str] = None
    maneuver_type: Optional[str] = None
    maneuver_modifier: Optional[str] = None

class RouteGeometry(BaseModel):
    type: str = "LineString"
    coordinates: List[List[float]]  # [[lng, lat], ...]

class RouteResponse(BaseModel):
    distance_meters: float
    distance_km: float
    duration_seconds: float
    duration_minutes: float
    profile: str
    straight_distance_km: float
    initial_bearing_degrees: float
    geometry: RouteGeometry
    steps: List[RouteStep]
    provider: str = "Project OSRM"

class RouteRequest(BaseModel):
    origin: List[float] = Field(..., description="[lat, lon]")
    destination: List[float] = Field(..., description="[lat, lon]")
    waypoints: Optional[List[List[float]]] = None
    profile: Optional[str] = "driving"
    alternatives: Optional[bool] = False
    steps: Optional[bool] = True

class TrafficAwareRouteRequest(BaseModel):
    origin: List[float]
    destination: List[float]
    departure_time: Optional[str] = "now"

# Distance & Matrix
class DistanceStraightResponse(BaseModel):
    start_lat: float
    start_lon: float
    end_lat: float
    end_lon: float
    distance_meters: float
    distance_km: float
    initial_bearing_degrees: float
    method: str = "IUGG Great-Circle Haversine (R=6371008.8m)"

class DistanceRoadResponse(BaseModel):
    start_lat: float
    start_lon: float
    end_lat: float
    end_lon: float
    distance_meters: float
    distance_km: float
    duration_seconds: float
    duration_minutes: float
    profile: str
    provider: str = "Project OSRM"

class MatrixRequest(BaseModel):
    origins: List[List[float]] = Field(..., description="List of [lat, lon]")
    destinations: List[List[float]] = Field(..., description="List of [lat, lon]")
    profile: Optional[str] = "driving"  # driving, walking, cycling, haversine

class MatrixResponse(BaseModel):
    origins: List[List[float]]
    destinations: List[List[float]]
    distances_km: List[List[float]]
    durations_minutes: Optional[List[List[float]]] = None
    method: str

# Places & POI
class PlaceResult(BaseModel):
    id: str
    name: str
    category: str
    latitude: float
    longitude: float
    distance_meters: float
    distance_km: float
    tags: Optional[Dict[str, Any]] = None

class PlacesNearbyResponse(BaseModel):
    category: str
    center: List[float]  # [lat, lon]
    radius_meters: float
    count: int
    places: List[PlaceResult]
    provider: str = "Overpass API (OpenStreetMap)"

# Traffic
class TrafficIncident(BaseModel):
    id: str
    description: str
    severity: str
    delay_seconds: int
    coordinates: List[float]

class TrafficIncidentsResponse(BaseModel):
    incidents: List[TrafficIncident]
    bbox: str
    provider: str = "TomTom Traffic API"

# API Keys & Account Analytics
class ApiKeyResponse(BaseModel):
    id: int
    prefix: str
    name: str
    is_active: bool
    rate_limit_per_min: int
    created_at: str
    last_used_at: Optional[str] = None

class ApiKeyCreate(BaseModel):
    name: str = "New Key"
    rate_limit_per_min: Optional[int] = 300

class ApiKeyCreateResponse(BaseModel):
    key: str
    id: int
    name: str
    prefix: str
    message: str = "Store this API key safely. You will not be able to view it again."

class EndpointUsage(BaseModel):
    endpoint: str
    total_calls: int
    avg_latency_ms: float
    error_count: int

class UsageStatsResponse(BaseModel):
    total_requests: int
    cached_hits: int
    cache_hit_ratio: float
    avg_latency_ms: float
    error_rate: float
    endpoints_breakdown: List[EndpointUsage]

