import os
import sys
from pathlib import Path

# Ensure backend root is on python path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from fastapi.testclient import TestClient
from app.main import app
from app.config import settings

DEMO_KEY = settings.DEFAULT_DEMO_KEY

def test_endpoints():
    print("=" * 70)
    print("ATLAS MAPS API — AUTOMATED VERIFICATION SUITE")
    print("=" * 70)

    with TestClient(app) as client:
        # 1. Health check
        print("\n[1] Testing GET /health...")
        res = client.get("/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        print("    PASSED:", res.json())

        # 2. Readiness check
        print("\n[2] Testing GET /ready...")
        res = client.get("/ready")
        assert res.status_code == 200, f"Readiness check failed: {res.text}"
        print("    PASSED:", res.json())

        # 3. Security check: Missing API Key
        print("\n[3] Testing GET /v1/maps/config without X-API-Key (Expect 401)...")
        res = client.get("/v1/maps/config")
        assert res.status_code == 401, f"Expected 401 for missing key, got {res.status_code}"
        print("    PASSED (401 received):", res.json()["detail"])

        # 4. Security check: Invalid API Key
        print("\n[4] Testing GET /v1/maps/config with invalid X-API-Key (Expect 401)...")
        res = client.get("/v1/maps/config", headers={"X-API-Key": "invalid_random_key_123"})
        assert res.status_code == 401, f"Expected 401 for invalid key, got {res.status_code}"
        print("    PASSED (401 received):", res.json()["detail"])

        # 5. Maps Config & Styles with valid Demo Key
        print("\n[5] Testing GET /v1/maps/config and GET /v1/maps/styles with valid Demo Key...")
        res = client.get("/v1/maps/config", headers={"X-API-Key": DEMO_KEY})
        assert res.status_code == 200, f"Maps config failed: {res.text}"
        cfg = res.json()
        print("    PASSED Config:", cfg["default_style"], "Styles:", cfg["available_styles"])

        res = client.get("/v1/maps/styles", headers={"X-API-Key": DEMO_KEY})
        assert res.status_code == 200, f"Maps styles failed: {res.text}"
        styles = res.json()
        print("    PASSED Raster Styles:", list(styles["raster_styles"].keys()))

        # 6. Distance Straight (IUGG Haversine)
        print("\n[6] Testing GET /v1/distance/straight (Panvel to BKC Mumbai)...")
        res = client.get(
            "/v1/distance/straight?start_lat=18.9894&start_lon=73.1175&end_lat=19.0657&end_lon=72.8687",
            headers={"X-API-Key": DEMO_KEY}
        )
        assert res.status_code == 200, f"Distance straight failed: {res.text}"
        dist = res.json()
        print(f"    PASSED: {dist['distance_km']} km, Bearing: {dist['initial_bearing_degrees']}° ({dist['method']})")

        # 7. Geocode Search
        print("\n[7] Testing GET /v1/geocode/search?q=Panvel+Railway+Station...")
        res = client.get("/v1/geocode/search?q=Panvel+Railway+Station&limit=3", headers={"X-API-Key": DEMO_KEY})
        assert res.status_code == 200, f"Geocode search failed: {res.text}"
        geo = res.json()
        assert len(geo) > 0, "No geocode results returned"
        print(f"    PASSED: Found {len(geo)} places. First: {geo[0]['name']} ({geo[0]['latitude']}, {geo[0]['longitude']})")

        # 8. Geocode Reverse
        print("\n[8] Testing GET /v1/geocode/reverse?lat=19.0760&lon=72.8777...")
        res = client.get("/v1/geocode/reverse?lat=19.0760&lon=72.8777", headers={"X-API-Key": DEMO_KEY})
        assert res.status_code == 200, f"Reverse geocode failed: {res.text}"
        rev = res.json()
        print("    PASSED:", rev["display_name"][:60], "...")

        # 9. Route Calculation (OSRM)
        print("\n[9] Testing GET /v1/route (Bandra to BKC)...")
        res = client.get(
            "/v1/route?start_lat=19.0596&start_lon=72.8295&end_lat=19.0657&end_lon=72.8687&profile=driving",
            headers={"X-API-Key": DEMO_KEY}
        )
        assert res.status_code == 200, f"Route calculation failed: {res.text}"
        rt = res.json()
        print(f"    PASSED: {rt['distance_km']} km, {rt['duration_minutes']} mins, {len(rt['steps'])} steps ({rt['provider']})")

        # 10. Traffic-Aware Route (TomTom unconfigured check -> 503 CREDENTIALS_NOT_CONFIGURED)
        print("\n[10] Testing POST /v1/route/traffic-aware (Expect 503 when TOMTOM_API_KEY unset)...")
        res = client.post(
            "/v1/route/traffic-aware",
            json={"origin": [19.0596, 72.8295], "destination": [19.0657, 72.8687]},
            headers={"X-API-Key": DEMO_KEY}
        )
        assert res.status_code == 503, f"Expected 503, got {res.status_code}"
        print("    PASSED (503 received with clear configuration instructions):", res.json()["detail"]["error"])

        # 11. Nearby Places (Overpass API)
        print("\n[11] Testing GET /v1/places/nearby (EV Charging Stations near Bandra)...")
        res = client.get(
            "/v1/places/nearby?lat=19.0596&lon=72.8295&radius=5000&category=ev_charging_stations&limit=5",
            headers={"X-API-Key": DEMO_KEY}
        )
        assert res.status_code == 200, f"Nearby places failed: {res.text}"
        places = res.json()
        print(f"    PASSED: Found {places['count']} EV charging stations. Category: {places['category']}")

        # 12. Developer API Key Management
        print("\n[12] Testing Developer Key Generation POST /v1/account/keys...")
        res = client.post(
            "/v1/account/keys",
            json={"name": "Integration Test Key", "rate_limit_per_min": 500},
            headers={"X-API-Key": DEMO_KEY}
        )
        assert res.status_code == 201, f"Create API key failed: {res.text}"
        new_key_info = res.json()
        print("    PASSED: Generated key:", new_key_info["key"][:16], "... ID:", new_key_info["id"])

        # Test the newly generated key
        print("    Verifying newly created key...")
        res = client.get("/v1/maps/config", headers={"X-API-Key": new_key_info["key"]})
        assert res.status_code == 200, f"New key authentication failed: {res.text}"
        print("    PASSED: Authenticated with newly created key!")

        # 13. Usage Analytics
        print("\n[13] Testing GET /v1/account/usage...")
        res = client.get("/v1/account/usage", headers={"X-API-Key": DEMO_KEY})
        assert res.status_code == 200, f"Usage stats failed: {res.text}"
        usage = res.json()
        print(f"    PASSED: Total calls recorded: {usage['total_requests']}, Avg Latency: {usage['avg_latency_ms']} ms")

    print("\n" + "=" * 70)
    print("ALL 13 TESTS PASSED PERFECTLY! ATLAS MAPS API IS 100% OPERATIONAL.")
    print("=" * 70)

if __name__ == "__main__":
    test_endpoints()
