import time
import datetime
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.security import seed_default_key
from app.seed_data import seed_parkit_database
from app.models import UsageLog
from app.routers import (
    health,
    maps,
    geocode,
    route,
    distance,
    places,
    traffic,
    account,
    parkit
)

def run_migrations():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE parkit_users ADD COLUMN password_hash VARCHAR(128)"))
            conn.commit()
        except Exception:
            pass

# Ensure tables exist immediately
Base.metadata.create_all(bind=engine)
run_migrations()
db_init = SessionLocal()
try:
    seed_default_key(db_init)
    seed_parkit_database(db_init)
finally:
    db_init.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite schema
    Base.metadata.create_all(bind=engine)
    run_migrations()
    # Seed default production demo key & parkit data
    db = SessionLocal()
    try:
        seed_default_key(db)
        seed_parkit_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="ATLAS MAPS API",
    description="Production-ready, zero-billing Global Mapping & Geospatial Engine for PARKIT Smart Parking Marketplace",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend and external callers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Usage logging & latency tracking middleware
@app.middleware("http")
async def log_requests_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration_ms = round((time.time() - start_time) * 1000.0, 2)

    # Don't log /health and /docs checks to keep logs focused
    path = request.url.path
    if not (path.startswith("/docs") or path.startswith("/openapi.json") or path == "/health"):
        key_id = getattr(request.state, "api_key_id", None)
        client_ip = request.client.host if request.client else "unknown"

        db = SessionLocal()
        try:
            log_entry = UsageLog(
                key_id=key_id,
                endpoint=path,
                method=request.method,
                status_code=response.status_code,
                latency_ms=duration_ms,
                ip_address=client_ip,
                cached=False,
                timestamp=datetime.datetime.now(datetime.timezone.utc)
            )
            db.add(log_entry)
            db.commit()
        except Exception:
            db.rollback()
        finally:
            db.close()

    # Add custom latency header
    response.headers["X-Response-Time-Ms"] = str(duration_ms)
    response.headers["X-Atlas-Engine"] = "ATLAS-MAPS-v1"
    return response

# Register routers
app.include_router(health.router)
app.include_router(maps.router)
app.include_router(geocode.router)
app.include_router(route.router)
app.include_router(distance.router)
app.include_router(places.router)
app.include_router(traffic.router)
app.include_router(account.router)
app.include_router(parkit.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
