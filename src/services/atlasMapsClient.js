/**
 * ATLAS MAPS API — Unified Geospatial Client SDK (Hybrid Dual-Mode Engine)
 *
 * Mode 1 (Primary): Direct calls to ATLAS MAPS API FastAPI Backend (port 8000)
 *                   using X-API-Key header authentication.
 * Mode 2 (Automatic Fallback): If the backend is unavailable or offline,
 *                   automatically falls back to upstream open geospatial APIs
 *                   (Nominatim, Project OSRM, Overpass API) and client-side
 *                   IUGG Haversine math so PARKIT NEVER breaks.
 */

const DEFAULT_API_URL = import.meta.env.VITE_ATLAS_API_URL || "";
const DEFAULT_API_KEY = import.meta.env.VITE_ATLAS_API_KEY || "atlas_live_demo_key_9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c";

// Standard IUGG Earth Radius in meters
const IUGG_EARTH_RADIUS_METERS = 6371008.8;

// Available tile styles (100% Key-Free, Zero-Watermark)
export const ATLAS_MAP_STYLES = {
  voyager: {
    id: "voyager",
    name: "Atlas Voyager Streets (Key-Free OSM)",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    filter: "contrast(1.04) saturate(1.08)",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors • ATLAS MAPS API',
    maxZoom: 19
  },
  dark: {
    id: "dark",
    name: "Atlas Dark Matter (Key-Free Night Mode)",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    filter: "invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors • ATLAS MAPS API',
    maxZoom: 19
  },
  satellite: {
    id: "satellite",
    name: "Atlas World Satellite (Key-Free Aerial)",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    filter: "none",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics • ATLAS MAPS API',
    maxZoom: 19
  },
  topo: {
    id: "topo",
    name: "Atlas Terrain & Topo (Key-Free)",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    filter: "none",
    attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap',
    maxZoom: 17
  }
};

export const ATLAS_TILE_STYLES = ATLAS_MAP_STYLES;

class AtlasMapsClient {
  constructor(baseUrl = DEFAULT_API_URL, apiKey = DEFAULT_API_KEY) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.apiKey = apiKey;
    this.backendHealthy = null;
    this.lastHealthCheck = 0;
    this.modeListeners = new Set();
  }

  setApiKey(newKey) {
    this.apiKey = newKey;
  }

  onModeChange(listener) {
    this.modeListeners.add(listener);
    return () => this.modeListeners.delete(listener);
  }

  _notifyMode(isBackend) {
    this.modeListeners.forEach((fn) => fn(isBackend));
  }

  /**
   * Health check with 15s caching
   */
  async checkBackendHealth() {
    const now = Date.now();
    if (this.backendHealthy !== null && now - this.lastHealthCheck < 15000) {
      return this.backendHealthy;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${this.baseUrl}/health`, {
        signal: controller.signal,
        headers: { Accept: "application/json" }
      });
      clearTimeout(timeoutId);
      const isOk = res.ok;
      if (this.backendHealthy !== isOk) {
        this.backendHealthy = isOk;
        this._notifyMode(isOk);
      }
      this.lastHealthCheck = now;
      return isOk;
    } catch {
      if (this.backendHealthy !== false) {
        this.backendHealthy = false;
        this._notifyMode(false);
      }
      this.lastHealthCheck = now;
      return false;
    }
  }

  /**
   * Local IUGG Great-Circle Haversine calculation + Initial Bearing
   */
  calculateHaversine(lat1, lon1, lat2, lon2) {
    const toRad = (d) => (d * Math.PI) / 180;
    const phi1 = toRad(lat1);
    const phi2 = toRad(lat2);
    const deltaPhi = toRad(lat2 - lat1);
    const deltaLambda = toRad(lon2 - lon1);

    const a =
      Math.sin(deltaPhi / 2) ** 2 +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
    const meters = IUGG_EARTH_RADIUS_METERS * c;

    // Bearing
    const y = Math.sin(deltaLambda) * Math.cos(phi2);
    const x =
      Math.cos(phi1) * Math.sin(phi2) -
      Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
    const bearing = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;

    return {
      distanceMeters: Math.round(meters * 10) / 10,
      distanceKm: Math.round((meters / 1000) * 100) / 100,
      initialBearingDegrees: Math.round(bearing * 10) / 10
    };
  }

  /**
   * Geocode Address Search (Backend primary -> Nominatim fallback)
   */
  async geocodeSearch(query, limit = 5, countryCodes = "in") {
    if (!query || !query.trim()) return [];

    const isBackendUp = await this.checkBackendHealth();
    if (isBackendUp) {
      try {
        const url = new URL(`${this.baseUrl}/v1/geocode/search`);
        url.searchParams.set("q", query);
        url.searchParams.set("limit", String(limit));
        if (countryCodes) url.searchParams.set("country_codes", countryCodes);

        const res = await fetch(url.toString(), {
          headers: {
            "X-API-Key": this.apiKey,
            Accept: "application/json"
          }
        });
        if (res.ok) {
          const data = await res.json();
          return data.map((item) => ({
            placeId: item.place_id,
            name: item.name,
            displayName: item.display_name,
            lat: item.latitude,
            lng: item.longitude,
            city: item.city,
            state: item.state,
            country: item.country,
            source: "ATLAS Gateway"
          }));
        }
      } catch (e) {
        console.warn("ATLAS Backend geocode error, falling back to direct adapter:", e);
      }
    }

    // Direct Browser Fallback: Nominatim
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=${limit}&q=${encodeURIComponent(
        query
      )}${countryCodes ? `&countrycodes=${countryCodes}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      return (data || []).map((item) => {
        const addr = item.address || {};
        return {
          placeId: String(item.place_id),
          name: item.name || (item.display_name ? item.display_name.split(",")[0] : query),
          displayName: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          city: addr.city || addr.town || addr.suburb || addr.district,
          state: addr.state,
          country: addr.country,
          source: "Direct OpenStreetMap Adapter"
        };
      });
    } catch (err) {
      console.error("Geocoding failed completely:", err);
      return [];
    }
  }

  /**
   * Reverse Geocode (Backend primary -> Nominatim fallback)
   */
  async reverseGeocode(lat, lng) {
    const isBackendUp = await this.checkBackendHealth();
    if (isBackendUp) {
      try {
        const url = `${this.baseUrl}/v1/geocode/reverse?lat=${lat}&lon=${lng}`;
        const res = await fetch(url, {
          headers: {
            "X-API-Key": this.apiKey,
            Accept: "application/json"
          }
        });
        if (res.ok) {
          const data = await res.json();
          return {
            displayName: data.display_name,
            lat: data.latitude,
            lng: data.longitude,
            source: "ATLAS Gateway"
          };
        }
      } catch (e) {
        console.warn("ATLAS Backend reverse geocode error, falling back:", e);
      }
    }

    // Direct Fallback
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&lat=${lat}&lon=${lng}`;
      const res = await fetch(url);
      const item = await res.json();
      return {
        displayName: item.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        lat: parseFloat(item.lat || lat),
        lng: parseFloat(item.lon || lng),
        source: "Direct OpenStreetMap Adapter"
      };
    } catch {
      return {
        displayName: `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        lat,
        lng,
        source: "Local"
      };
    }
  }

  /**
   * Calculate Road Route (Backend primary -> Project OSRM fallback -> Geodesic corridor)
   */
  async calculateRoute(startLat, startLng, endLat, endLng, profile = "driving") {
    const straight = this.calculateHaversine(startLat, startLng, endLat, endLng);
    const isBackendUp = await this.checkBackendHealth();

    if (isBackendUp) {
      try {
        const url = `${this.baseUrl}/v1/route?start_lat=${startLat}&start_lon=${startLng}&end_lat=${endLat}&end_lon=${endLng}&profile=${profile}&steps=true`;
        const res = await fetch(url, {
          headers: {
            "X-API-Key": this.apiKey,
            Accept: "application/json"
          }
        });
        if (res.ok) {
          const data = await res.json();
          const leafletCoords = (data.geometry?.coordinates || []).map((c) => [c[1], c[0]]);
          return {
            distanceKm: data.distance_km,
            distanceMeters: data.distance_meters,
            durationMinutes: data.duration_minutes,
            durationSeconds: data.duration_seconds,
            straightDistanceKm: data.straight_distance_km,
            bearingDegrees: data.initial_bearing_degrees,
            profile: data.profile,
            leafletCoords: leafletCoords.length > 0 ? leafletCoords : [[startLat, startLng], [endLat, endLng]],
            steps: data.steps || [],
            provider: `${data.provider} (via ATLAS Gateway)`
          };
        }
      } catch (e) {
        console.warn("ATLAS Backend route error, falling back to direct OSRM:", e);
      }
    }

    // Direct OSRM Fallback
    const profileMap = {
      driving: "driving",
      walking: "foot",
      cycling: "bike"
    };
    const osrmProfile = profileMap[profile] || "driving";
    const osrmUrl = `https://router.project-osrm.org/route/v1/${osrmProfile}/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`;

    try {
      const res = await fetch(osrmUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.routes && data.routes[0]) {
          const r = data.routes[0];
          const roadDistKm = Math.round((r.distance / 1000) * 100) / 100;
          const roadMins = Math.max(1, Math.round(r.duration / 60));
          const leafletCoords = (r.geometry?.coordinates || []).map((c) => [c[1], c[0]]);

          const steps = (r.legs?.[0]?.steps || []).map((st) => {
            const mType = st.maneuver?.type || "continue";
            const mMod = st.maneuver?.modifier || "";
            const roadName = st.name || "road";
            let instruction = `Continue on ${roadName}`;
            if (mType === "depart") instruction = `Head on ${roadName}`;
            else if (mType === "arrive") instruction = "Arrive at destination";
            else if (mMod) instruction = `Turn ${mMod} onto ${roadName}`;

            return {
              instruction,
              distance_meters: Math.round(st.distance),
              duration_seconds: Math.round(st.duration),
              name: roadName,
              maneuver_type: mType
            };
          });

          return {
            distanceKm: roadDistKm,
            distanceMeters: r.distance,
            durationMinutes: roadMins,
            durationSeconds: r.duration,
            straightDistanceKm: straight.distanceKm,
            bearingDegrees: straight.initialBearingDegrees,
            profile,
            leafletCoords: leafletCoords.length > 0 ? leafletCoords : [[startLat, startLng], [endLat, endLng]],
            steps,
            provider: "Direct Project OSRM Engine"
          };
        }
      }
    } catch (e) {
      console.warn("Direct OSRM route failed, using geodesic corridor fallback:", e);
    }

    // Geodesic corridor fallback
    const estRoadKm = Math.round(straight.distanceKm * 1.25 * 100) / 100;
    const speedKmh = profile === "driving" ? 35 : profile === "cycling" ? 15 : 4.5;
    const estMins = Math.max(1, Math.round((estRoadKm / speedKmh) * 60));

    return {
      distanceKm: estRoadKm,
      distanceMeters: Math.round(estRoadKm * 1000),
      durationMinutes: estMins,
      durationSeconds: estMins * 60,
      straightDistanceKm: straight.distanceKm,
      bearingDegrees: straight.initialBearingDegrees,
      profile,
      leafletCoords: [[startLat, startLng], [endLat, endLng]],
      steps: [
        {
          instruction: `Head directly toward destination corridor (bearing ${straight.initialBearingDegrees}°)`,
          distance_meters: Math.round(estRoadKm * 1000),
          duration_seconds: estMins * 60,
          name: "Direct Corridor"
        }
      ],
      provider: "Local Kinematic Haversine Fallback"
    };
  }

  /**
   * Nearby Places & POIs (Backend primary -> Overpass API fallback)
   */
  async getNearbyPlaces(lat, lng, category = "ev_charging_stations", radius = 2500) {
    const isBackendUp = await this.checkBackendHealth();
    if (isBackendUp) {
      try {
        const url = `${this.baseUrl}/v1/places/nearby?lat=${lat}&lon=${lng}&radius=${radius}&category=${category}&limit=30`;
        const res = await fetch(url, {
          headers: {
            "X-API-Key": this.apiKey,
            Accept: "application/json"
          }
        });
        if (res.ok) {
          const data = await res.json();
          return {
            category: data.category,
            places: data.places || [],
            count: data.count || 0,
            provider: `${data.provider} (via ATLAS Gateway)`
          };
        }
      } catch (e) {
        console.warn("ATLAS Backend places error, falling back to direct Overpass API:", e);
      }
    }

    // Direct Browser Fallback: Overpass API
    const categoryTagMap = {
      ev_charging_stations: 'node["amenity"="charging_station"]',
      fuel_stations: 'node["amenity"="fuel"]',
      petrol_pumps: 'node["amenity"="fuel"]',
      parking_areas: 'node["amenity"="parking"]',
      hospitals: 'node["amenity"="hospital"]'
    };
    const tag = categoryTagMap[category] || 'node["amenity"="charging_station"]';
    const overpassQl = `[out:json][timeout:8];(${tag}(around:${radius},${lat},${lng}););out center 25;`;

    try {
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "data=" + encodeURIComponent(overpassQl)
      });
      const data = await res.json();
      const elements = data.elements || [];

      const places = elements
        .map((el) => {
          const pLat = el.lat || el.center?.lat;
          const pLng = el.lon || el.center?.lon;
          if (!pLat || !pLng) return null;
          const dist = this.calculateHaversine(lat, lng, pLat, pLng);
          const tags = el.tags || {};
          const name = tags.name || tags.operator || tags.brand || `${category.replace(/_/g, " ")} #${el.id}`;

          return {
            id: `osm_${el.id}`,
            name,
            category,
            latitude: pLat,
            longitude: pLng,
            distance_meters: dist.distanceMeters,
            distance_km: dist.distanceKm,
            tags
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.distance_meters - b.distance_meters);

      return {
        category,
        places,
        count: places.length,
        provider: "Direct Overpass API Adapter"
      };
    } catch (err) {
      console.warn("Direct Overpass API failed:", err);
      return { category, places: [], count: 0, provider: "Unavailable" };
    }
  }

  /**
   * Get Developer Usage Stats
   */
  async getAccountUsage() {
    try {
      const res = await fetch(`${this.baseUrl}/v1/account/usage`, {
        headers: { "X-API-Key": this.apiKey }
      });
      if (res.ok) return await res.json();
    } catch {}
    return null;
  }

  // =========================================================================
  // PARKIT PERSISTENT DATABASE API
  // =========================================================================

  /**
   * Upsert user login in persistent database
   */
  async loginUser(userData) {
    try {
      const res = await fetch(`${this.baseUrl}/v1/parkit/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey
        },
        body: JSON.stringify(userData)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const msg = errData.detail || `Authentication failed (${res.status})`;
        const err = new Error(msg);
        err.status = res.status;
        throw err;
      }
      return await res.json();
    } catch (err) {
      if (err.status === 400 || err.status === 401) {
        throw err;
      }
      console.warn("Backend user login unavailable, using offline fallback:", err);
      return null;
    }
  }

  /**
   * Fetch all listings from persistent database
   */
  async fetchListings(category = null, locality = null) {
    try {
      const params = new URLSearchParams();
      if (category && category !== "all") params.append("category", category);
      if (locality && locality !== "all") params.append("locality", locality);
      const url = `${this.baseUrl}/v1/parkit/listings${params.toString() ? "?" + params.toString() : ""}`;
      const res = await fetch(url, {
        headers: { "X-API-Key": this.apiKey }
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Backend listings unavailable, using offline fallback:", err);
    }
    return null;
  }

  /**
   * Insert new listing into database
   */
  async createListing(listingData) {
    try {
      const res = await fetch(`${this.baseUrl}/v1/parkit/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey
        },
        body: JSON.stringify(listingData)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Backend createListing failed, using offline fallback:", err);
    }
    return null;
  }

  /**
   * Update listing availability/pricing in database
   */
  async updateListing(listingId, updatedFields) {
    try {
      const res = await fetch(`${this.baseUrl}/v1/parkit/listings/${listingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey
        },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Backend updateListing failed:", err);
    }
    return null;
  }

  /**
   * Delete listing from database
   */
  async deleteListing(listingId) {
    try {
      const res = await fetch(`${this.baseUrl}/v1/parkit/listings/${listingId}`, {
        method: "DELETE",
        headers: { "X-API-Key": this.apiKey }
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Backend deleteListing failed:", err);
    }
    return null;
  }

  /**
   * Fetch all bookings from database
   */
  async fetchBookings(userEmail = null) {
    try {
      const url = userEmail
        ? `${this.baseUrl}/v1/parkit/bookings?user_email=${encodeURIComponent(userEmail)}`
        : `${this.baseUrl}/v1/parkit/bookings`;
      const res = await fetch(url, {
        headers: { "X-API-Key": this.apiKey }
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Backend fetchBookings failed:", err);
    }
    return null;
  }

  /**
   * Create booking in database (handles 409 Conflict)
   */
  async createBooking(bookingData) {
    const res = await fetch(`${this.baseUrl}/v1/parkit/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey
      },
      body: JSON.stringify(bookingData)
    });

    if (res.status === 409) {
      const errorData = await res.json().catch(() => ({}));
      const msg = errorData.detail || "This parking slot is already booked for the selected time window.";
      const conflictErr = new Error(msg);
      conflictErr.status = 409;
      throw conflictErr;
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Booking failed with status ${res.status}`);
    }

    return await res.json();
  }

  /**
   * Cancel booking in database
   */
  async cancelBooking(bookingId) {
    try {
      const res = await fetch(`${this.baseUrl}/v1/parkit/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        headers: { "X-API-Key": this.apiKey }
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Backend cancelBooking failed:", err);
    }
    return null;
  }

  /**
   * Fetch messages for a listing
   */
  async fetchMessages(listingId) {
    try {
      const res = await fetch(`${this.baseUrl}/v1/parkit/messages/${listingId}`, {
        headers: { "X-API-Key": this.apiKey }
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Backend fetchMessages failed:", err);
    }
    return null;
  }

  /**
   * Post a message for a listing
   */
  async sendChatMessage(listingId, messageData) {
    try {
      const res = await fetch(`${this.baseUrl}/v1/parkit/messages/${listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey
        },
        body: JSON.stringify(messageData)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Backend sendChatMessage failed:", err);
    }
    return null;
  }
}

// Export singleton instance
export const atlasMaps = new AtlasMapsClient();
export default atlasMaps;

