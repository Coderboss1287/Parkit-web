import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import {
  MapPin,
  Navigation,
  ExternalLink,
  Zap,
  Shield,
  Eye,
  CheckCircle,
  LocateFixed,
  Layers,
  Sparkles,
  Fuel,
  Compass,
  X,
  Car,
  Bike,
  Footprints,
  Server,
  Activity
} from "lucide-react";
import atlasMaps, { ATLAS_MAP_STYLES, ATLAS_TILE_STYLES } from "../services/atlasMapsClient";

export default function InteractiveMap({
  listings,
  selectedListing,
  onSelectListing,
  onOpenDetails,
  searchCoords,
  onCoordsChange,
  userLocation,
  onGetDirections,
  onLocateUser,
  activeRoute: externalRoute,
  onClearRoute
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const poiLayerRef = useRef(null);

  // Map state
  const [currentStyle, setCurrentStyle] = useState("voyager");
  const [internalRoute, setInternalRoute] = useState(null);
  const [routeProfile, setRouteProfile] = useState("driving");
  const [isRouting, setIsRouting] = useState(false);
  const [nearbyPoiType, setNearbyPoiType] = useState(null);
  const [isScanningPoi, setIsScanningPoi] = useState(false);
  const [clickedAddress, setClickedAddress] = useState(null);
  const [isBackendActive, setIsBackendActive] = useState(false);

  const activeRoute = externalRoute || internalRoute;

  // Check backend health periodically
  useEffect(() => {
    atlasMaps.checkBackendHealth().then((isUp) => setIsBackendActive(isUp));
    const unsub = atlasMaps.onModeChange((isUp) => setIsBackendActive(isUp));
    const interval = setInterval(() => {
      atlasMaps.checkBackendHealth().then((isUp) => setIsBackendActive(isUp));
    }, 20000);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = searchCoords?.lat || 19.0760;
    const initialLng = searchCoords?.lng || 72.8777;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: false
    });

    const initialStyleConfig = ATLAS_MAP_STYLES[currentStyle] || ATLAS_MAP_STYLES.voyager;
    tileLayerRef.current = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: initialStyleConfig.attribution,
      maxZoom: initialStyleConfig.maxZoom || 19
    }).addTo(map);

    // Apply CSS filter ONLY to tilePane so markers and routes keep true colors
    const tilePane = map.getPane("tilePane");
    if (tilePane && initialStyleConfig.filter) {
      tilePane.style.filter = initialStyleConfig.filter;
    }

    L.control.zoom({ position: "bottomright" }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);
    poiLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Invalidate size after layout render to eliminate grey borders/gaps
    setTimeout(() => map.invalidateSize(), 150);

    // Click on map -> Reverse Geocode via ATLAS MAPS API
    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;
      setClickedAddress({ lat, lng, text: "Reverse geocoding via ATLAS...", loading: true });
      try {
        const rev = await atlasMaps.reverseGeocode(lat, lng);
        setClickedAddress({ lat, lng, text: rev.displayName, source: rev.source, loading: false });
      } catch {
        setClickedAddress({ lat, lng, text: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, loading: false });
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Tile layer switcher with tilePane CSS filter isolation
  const handleStyleChange = (styleKey) => {
    setCurrentStyle(styleKey);
    const styleObj = ATLAS_MAP_STYLES[styleKey] || ATLAS_MAP_STYLES.voyager;
    if (tileLayerRef.current && styleObj) {
      tileLayerRef.current.setUrl(styleObj.url);
      if (styleObj.maxZoom) {
        tileLayerRef.current.options.maxZoom = styleObj.maxZoom;
      }
    }
    if (mapInstanceRef.current) {
      const tilePane = mapInstanceRef.current.getPane("tilePane");
      if (tilePane) {
        tilePane.style.filter = styleObj.filter || "none";
      }
    }
  };

  // Pan / Fly to search coords
  useEffect(() => {
    if (!mapInstanceRef.current || !searchCoords) return;
    mapInstanceRef.current.flyTo([searchCoords.lat, searchCoords.lng], 14, {
      duration: 1.2
    });
  }, [searchCoords]);

  // User location marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    const locCoords = userLocation || (searchCoords?.isLiveLocation ? searchCoords : null);
    if (!locCoords) return;

    const userPulsingIcon = L.divIcon({
      className: "custom-pulsing-user-marker",
      html: `
        <div class="relative flex items-center justify-center w-8 h-8 pointer-events-none">
          <span class="absolute w-8 h-8 rounded-full bg-blue-500/35 animate-ping"></span>
          <span class="absolute w-6 h-6 rounded-full bg-sky-400/40 animate-pulse"></span>
          <span class="relative w-4 h-4 rounded-full bg-[#1A73E8] border-2 border-white shadow-xl flex items-center justify-center">
            <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
          </span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    userMarkerRef.current = L.marker([locCoords.lat, locCoords.lng], {
      icon: userPulsingIcon,
      zIndexOffset: 950
    })
      .bindTooltip('<div class="font-bold text-xs text-slate-800 px-1 py-0.5">📍 You are here</div>', {
        permanent: false,
        direction: "top",
        offset: [0, -10]
      })
      .addTo(mapInstanceRef.current);
  }, [userLocation, searchCoords]);

  // Parking Spot Price Pill Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    listings.forEach((listing) => {
      const isSelected = selectedListing?.id === listing.id;
      const isAvailable = listing.isAvailable;

      let pinBg = "bg-gradient-to-r from-parkit-royal to-parkit-sky";
      let pinBorder = "border-white";
      let pulseRing = "";
      let pointerColor = "bg-[#0752B5]";

      if (isSelected) {
        pinBg = "bg-gradient-to-r from-emerald-600 to-parkit-green";
        pinBorder = "border-white ring-4 ring-emerald-400/50 scale-110";
        pulseRing = '<div class="absolute -inset-2 rounded-full bg-emerald-400/40 animate-ping pointer-events-none"></div>';
        pointerColor = "bg-emerald-600";
      } else if (!isAvailable) {
        pinBg = "bg-slate-400";
        pinBorder = "border-slate-200";
        pointerColor = "bg-slate-500";
      }

      const iconHtml = `
        <div class="custom-marker relative cursor-pointer group transition-all duration-200 ${
          isSelected ? "scale-110 z-50" : "hover:scale-105"
        }">
          ${pulseRing}
          <div class="px-2.5 py-1.5 rounded-xl ${pinBg} ${pinBorder} border-2 shadow-xl text-white font-black text-xs flex items-center gap-1.5 whitespace-nowrap">
            ${isSelected ? '<span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>' : ""}
            <span>₹${listing.hourlyPrice}</span>
            <span class="text-[9px] font-semibold opacity-90">/hr</span>
          </div>
          <div class="w-2.5 h-2.5 ${pointerColor} rotate-45 mx-auto -mt-1 shadow-sm"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "leaflet-custom-pin",
        html: iconHtml,
        iconSize: [72, 36],
        iconAnchor: [36, 32]
      });

      const marker = L.marker([listing.lat, listing.lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : 100
      });

      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        onSelectListing(listing);
      });

      marker.addTo(markersLayerRef.current);
    });
  }, [listings, selectedListing, onSelectListing]);

  // Center on selected listing
  useEffect(() => {
    if (selectedListing && mapInstanceRef.current && !activeRoute) {
      mapInstanceRef.current.panTo([selectedListing.lat, selectedListing.lng], {
        animate: true,
        duration: 0.6
      });
    }
  }, [selectedListing, activeRoute]);

  // Render Route Polyline on Map
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerRef.current) return;
    routeLayerRef.current.clearLayers();

    if (activeRoute && activeRoute.leafletCoords && activeRoute.leafletCoords.length > 0) {
      // Glow underlay polyline
      const glowLine = L.polyline(activeRoute.leafletCoords, {
        color: "#0752B5",
        weight: 8,
        opacity: 0.35,
        lineCap: "round",
        lineJoin: "round"
      }).addTo(routeLayerRef.current);

      // Main polyline
      const mainLine = L.polyline(activeRoute.leafletCoords, {
        color: "#35B5F6",
        weight: 5,
        opacity: 0.95,
        lineCap: "round",
        lineJoin: "round"
      }).addTo(routeLayerRef.current);

      mapInstanceRef.current.fitBounds(mainLine.getBounds(), {
        padding: [60, 60]
      });
    }
  }, [activeRoute]);

  // Calculate Route handler
  const handleCalculateRoute = async (targetListing, profile = routeProfile) => {
    const origin = userLocation || searchCoords || { lat: 19.0760, lng: 72.8777 };
    setIsRouting(true);
    try {
      const res = await atlasMaps.calculateRoute(
        origin.lat,
        origin.lng,
        targetListing.lat,
        targetListing.lng,
        profile
      );
      setInternalRoute({
        ...res,
        destinationTitle: targetListing.title,
        destinationAddress: targetListing.address,
        targetListing
      });
    } catch (err) {
      console.error("Route calculation error:", err);
    } finally {
      setIsRouting(false);
    }
  };

  const handleProfileSwitch = (newProfile) => {
    setRouteProfile(newProfile);
    if (activeRoute?.targetListing) {
      handleCalculateRoute(activeRoute.targetListing, newProfile);
    }
  };

  const handleCloseRoute = () => {
    setInternalRoute(null);
    if (routeLayerRef.current) routeLayerRef.current.clearLayers();
    if (onClearRoute) onClearRoute();
  };

  // Nearby POIs Scanner (EV Chargers & Petrol Pumps)
  const handleScanPoi = async (category) => {
    if (!mapInstanceRef.current || !poiLayerRef.current) return;

    if (nearbyPoiType === category) {
      // Toggle off
      poiLayerRef.current.clearLayers();
      setNearbyPoiType(null);
      return;
    }

    const center = searchCoords || userLocation || { lat: 19.0760, lng: 72.8777 };
    setIsScanningPoi(true);
    setNearbyPoiType(category);
    poiLayerRef.current.clearLayers();

    try {
      const res = await atlasMaps.getNearbyPlaces(center.lat, center.lng, category, 3000);
      const isEv = category === "ev_charging_stations";

      res.places.forEach((p) => {
        const iconHtml = `
          <div class="px-2 py-1 rounded-xl shadow-lg border border-white text-white font-bold text-[10px] flex items-center gap-1 ${
            isEv ? "bg-purple-600 ring-2 ring-purple-300" : "bg-amber-600 ring-2 ring-amber-300"
          }">
            <span>${isEv ? "⚡" : "⛽"}</span>
            <span class="truncate max-w-[90px]">${p.name}</span>
          </div>
        `;
        const icon = L.divIcon({
          className: "poi-custom-marker",
          html: iconHtml,
          iconSize: [110, 24],
          iconAnchor: [55, 12]
        });

        const m = L.marker([p.latitude, p.longitude], { icon })
          .bindTooltip(`<b>${p.name}</b><br/>${p.distance_km} km away`, { direction: "top" })
          .addTo(poiLayerRef.current);
      });
    } catch (e) {
      console.error("POI scan error:", e);
    } finally {
      setIsScanningPoi(false);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-3xl overflow-hidden shadow-premium border border-slate-200/80 bg-slate-100 flex flex-col">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px] flex-1 z-0" />

      {/* Top Bar Controls: Styles, POI Scanners & Engine Status */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Style Switcher & POI Tools */}
        <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
          {/* Style Selector */}
          <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-md border border-slate-200 flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Layers className="w-3.5 h-3.5 text-parkit-royal" />
            <select
              value={currentStyle}
              onChange={(e) => handleStyleChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="voyager">Atlas Voyager Streets (Key-Free OSM)</option>
              <option value="dark">Atlas Dark Matter (Key-Free Night Mode)</option>
              <option value="satellite">Atlas World Satellite (Key-Free Aerial)</option>
              <option value="topo">Atlas Terrain & Topo (Key-Free)</option>
            </select>
          </div>

          {/* EV Charging Scanner */}
          <button
            onClick={() => handleScanPoi("ev_charging_stations")}
            disabled={isScanningPoi}
            className={`px-3 py-1.5 rounded-xl shadow-md text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
              nearbyPoiType === "ev_charging_stations"
                ? "bg-purple-600 text-white ring-2 ring-purple-300"
                : "bg-white/95 hover:bg-purple-50 text-slate-700 border border-slate-200"
            }`}
            title="Scan EV Charging Stations within 3km"
          >
            <Zap className={`w-3.5 h-3.5 ${nearbyPoiType === "ev_charging_stations" ? "text-yellow-300" : "text-purple-600"}`} />
            <span>EV Stations</span>
          </button>

          {/* Petrol Pumps Scanner */}
          <button
            onClick={() => handleScanPoi("fuel_stations")}
            disabled={isScanningPoi}
            className={`px-3 py-1.5 rounded-xl shadow-md text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
              nearbyPoiType === "fuel_stations"
                ? "bg-amber-600 text-white ring-2 ring-amber-300"
                : "bg-white/95 hover:bg-amber-50 text-slate-700 border border-slate-200"
            }`}
            title="Scan Petrol Pumps within 3km"
          >
            <Fuel className={`w-3.5 h-3.5 ${nearbyPoiType === "fuel_stations" ? "text-white" : "text-amber-600"}`} />
            <span>Petrol Pumps</span>
          </button>
        </div>

        {/* Right: Engine Status Pill & GPS */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Status Badge */}
          <div
            className={`px-2.5 py-1 rounded-xl shadow-md border text-[11px] font-bold flex items-center gap-1.5 backdrop-blur-md ${
              isBackendActive
                ? "bg-emerald-50/95 border-emerald-200 text-emerald-800"
                : "bg-blue-50/95 border-blue-200 text-blue-800"
            }`}
            title={
              isBackendActive
                ? "Connected to FastAPI Backend (port 8000) with X-API-Key Auth"
                : "FastAPI offline. Automatic Direct-Adapter Fallback is active (100% resilient)."
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendActive ? "bg-emerald-500 animate-pulse" : "bg-sky-500 animate-pulse"
              }`}
            />
            <span className="hidden sm:inline">
              {isBackendActive ? "ATLAS Gateway Active (:8000)" : "ATLAS Direct Fallback Mode"}
            </span>
            <span className="sm:hidden">{isBackendActive ? "Gateway" : "Fallback"}</span>
          </div>

          {/* GPS Button */}
          <button
            onClick={onLocateUser}
            className="p-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-parkit-royal rounded-xl shadow-md border border-slate-200 transition cursor-pointer"
            title="Locate My Position (GPS)"
          >
            <LocateFixed className="w-4 h-4 text-parkit-sky" />
          </button>
        </div>
      </div>

      {/* Reverse Geocode Click Toast */}
      {clickedAddress && (
        <div className="absolute top-16 left-3 right-3 sm:right-auto sm:max-w-md z-30 bg-slate-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2 min-w-0">
            <Compass className="w-4 h-4 text-cyan-400 flex-shrink-0 animate-spin" />
            <div className="text-xs truncate">
              <span className="text-[10px] text-cyan-300 font-extrabold uppercase block">
                Reverse Geocode ({clickedAddress.source || "ATLAS"})
              </span>
              <span className="font-semibold text-slate-100">{clickedAddress.text}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => {
                onCoordsChange?.({
                  lat: clickedAddress.lat,
                  lng: clickedAddress.lng,
                  locality: clickedAddress.text
                });
                setClickedAddress(null);
              }}
              className="px-2 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[11px] rounded-lg transition"
            >
              Search Here
            </button>
            <button
              onClick={() => setClickedAddress(null)}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Active ATLAS Route Banner / Drawer Overlay */}
      {activeRoute && (
        <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-auto md:w-[420px] z-30 bg-slate-900/95 backdrop-blur-md text-white rounded-3xl p-5 shadow-2xl border border-slate-700 animate-fadeIn space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-300">
                  ATLAS ROUTING ENGINE • {activeRoute.provider}
                </span>
              </div>
              <h4 className="text-base font-black text-white mt-0.5 truncate">
                {activeRoute.destinationTitle || "Destination Route"}
              </h4>
              <p className="text-xs text-slate-400 truncate">{activeRoute.destinationAddress}</p>
            </div>

            <button
              onClick={handleCloseRoute}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Metrics Pill Grid */}
          <div className="grid grid-cols-3 gap-2 bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700/60 text-center">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Road Distance</span>
              <span className="text-base font-black text-cyan-300">{activeRoute.distanceKm} km</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Est. Duration</span>
              <span className="text-base font-black text-emerald-400">
                {activeRoute.durationMinutes} mins
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Haversine</span>
              <span className="text-xs font-mono font-bold text-slate-300 block mt-1">
                {activeRoute.straightDistanceKm} km
              </span>
            </div>
          </div>

          {/* Profile Switcher */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-slate-400 font-bold text-[11px]">Travel Mode:</span>
            <div className="flex gap-1 bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => handleProfileSwitch("driving")}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                  routeProfile === "driving"
                    ? "bg-[#0752B5] text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Car</span>
              </button>
              <button
                type="button"
                onClick={() => handleProfileSwitch("cycling")}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                  routeProfile === "cycling"
                    ? "bg-[#0752B5] text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Bike</span>
              </button>
              <button
                type="button"
                onClick={() => handleProfileSwitch("walking")}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                  routeProfile === "walking"
                    ? "bg-[#0752B5] text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>Walk</span>
              </button>
            </div>
          </div>

          {/* Turn-by-Turn Maneuvers Drawer */}
          {activeRoute.steps && activeRoute.steps.length > 0 && (
            <div className="border-t border-slate-800 pt-2 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Turn-by-Turn Navigation Steps ({activeRoute.steps.length})
              </span>
              <div className="max-h-28 overflow-y-auto pr-1 space-y-1 text-[11px] font-mono text-slate-300">
                {activeRoute.steps.slice(0, 10).map((st, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-slate-800/60 px-2 py-1 rounded-lg"
                  >
                    <span className="truncate pr-2">
                      {idx + 1}. {st.instruction}
                    </span>
                    <span className="text-cyan-400 flex-shrink-0 font-bold">
                      {st.distance_meters > 1000
                        ? `${(st.distance_meters / 1000).toFixed(1)}km`
                        : `${Math.round(st.distance_meters)}m`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Listing Floating Quick Info Preview Card (Only when not showing active route) */}
      {selectedListing && !activeRoute && (
        <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-auto md:w-96 z-20 bg-white rounded-2xl p-4 shadow-2xl border border-slate-200/90 animate-fadeIn">
          <div className="flex gap-3">
            <img
              src={selectedListing.image}
              alt={selectedListing.title}
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-parkit-royal">
                  {selectedListing.category}
                </span>
                <span className="text-base font-black text-parkit-royal">
                  ₹{selectedListing.hourlyPrice}
                  <span className="text-xs font-normal text-slate-400">/hr</span>
                </span>
              </div>
              <h4 className="text-sm font-bold text-parkit-dark truncate mt-1">
                {selectedListing.title}
              </h4>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {selectedListing.address}
              </p>

              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-600 font-medium">
                <span className="flex items-center gap-1 font-bold text-parkit-royal">
                  <Navigation className="w-3 h-3 text-parkit-sky" />
                  {selectedListing.distanceKm !== undefined
                    ? `${selectedListing.distanceKm} km away`
                    : searchCoords
                    ? `${atlasMaps.calculateHaversine(searchCoords.lat, searchCoords.lng, selectedListing.lat, selectedListing.lng).distanceKm} km away`
                    : "Near You"}
                </span>
                <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                  ★ {selectedListing.rating} ({selectedListing.reviewCount})
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => handleCalculateRoute(selectedListing)}
              disabled={isRouting}
              className="py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-parkit-royal text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-parkit-royal" />
              <span>{isRouting ? "Calculating..." : "ATLAS Route"}</span>
            </button>
            <button
              onClick={() => (onOpenDetails ? onOpenDetails(selectedListing) : onSelectListing(selectedListing))}
              className="py-2 px-3 rounded-xl bg-gradient-to-r from-parkit-royal to-parkit-sky hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>View & Book</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
