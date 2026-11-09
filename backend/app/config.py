import os
from pathlib import Path
from pydantic_settings import BaseSettings

# Base directory for the backend
BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    ATLAS_ENV: str = "development"
    ATLAS_HOST: str = "0.0.0.0"
    ATLAS_PORT: int = 8000
    ATLAS_SECRET_KEY: str = "atlas_super_secret_signing_key_2026"
    DEFAULT_DEMO_KEY: str = "atlas_live_demo_key_9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c"
    DATABASE_URL: str = f"sqlite:///{BASE_DIR / 'atlas_maps.db'}"
    TOMTOM_API_KEY: str = ""
    MAPTILER_API_KEY: str = ""
    NOMINATIM_USER_AGENT: str = "AtlasMapsAPI/1.0 (PARKIT Geospatial Engine; contact@parkit.internal)"
    CACHE_TTL_GEOCODE_HOURS: int = 24
    CACHE_TTL_ROUTES_MINUTES: int = 60
    CACHE_TTL_PLACES_MINUTES: int = 30
    DEFAULT_RATE_LIMIT_PER_MINUTE: int = 300

    class Config:
        env_file = str(BASE_DIR / ".env")
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()

