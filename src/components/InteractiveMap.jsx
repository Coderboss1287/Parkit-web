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
  Sparkles
} from "lucide-react";
import { getDistanceMeters } from "../utils/hexagonalSearch";

export default function InteractiveMap({
  listings,
  selectedListing,
  onSelectListing,
  searchCoords,
  onCoordsChange,
  hexRings = [],
  isHexSearchActive = false,
  onGetDirections
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const hexLayerRef = useRef(null);
  const userMarkerRef = useRef(null);

  const [mapEngine, setMapEngine] = useState("osm"); // 'osm' | 'google'
  const [googleKeyAvailable] = useState(() => {
    return !!import.meta.env?.VITE_GOOGLE_MAPS_API_KEY;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = searchCoords?.lat || 19.0760;
    const initialLng = searchCoords?.lng || 72.8777;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 12,
      zoomControl: false
    });

    // High quality OpenStreetMap / CartoDB Voyager tiles (crisp, modern startup aesthetic)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>, OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    hexLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map view when search coordinates change
  useEffect(() => {
    if (!mapInstanceRef.current || !searchCoords) return;
    mapInstanceRef.current.flyTo([searchCoords.lat, searchCoords.lng], 13, {
      duration: 1.2
    });

    // Update user search center marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const userIcon = L.divIcon({
      className: "custom-user-marker",
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-parkit-sky/30 animate-ping absolute"></div>
          <div class="w-6 h-6 rounded-full bg-parkit-royal border-2 border-white shadow-lg flex items-center justify-center text-white">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    userMarkerRef.current = L.marker([searchCoords.lat, searchCoords.lng], {
      icon: userIcon,
      zIndexOffset: 900
    }).addTo(mapInstanceRef.current);
  }, [searchCoords]);

  // Render Hexagonal Search Overlays on the Map
  useEffect(() => {
    if (!mapInstanceRef.current || !hexLayerRef.current) return;
    hexLayerRef.current.clearLayers();

    if (!isHexSearchActive && hexRings.length === 0) return;

    hexRings.forEach((ring) => {
      ring.cells.forEach((cell) => {
        let fillColor = "#94A3B8"; // grey unsearched
        let strokeColor = "#64748B";
        let fillOpacity = 0.08;

        if (cell.status === "searching") {
          fillColor = "#35B5F6"; // blue searching
          strokeColor = "#0752B5";
          fillOpacity = 0.35;
        } else if (cell.status === "found") {
          fillColor = "#75D84C"; // green found
          strokeColor = "#2E7D32";
          fillOpacity = 0.45;
        } else if (cell.status === "empty") {
          fillColor = "#F87171"; // red no parking
          strokeColor = "#DC2626";
          fillOpacity = 0.15;
        }

        const polygon = L.polygon(cell.polygon, {
          color: strokeColor,
          weight: cell.status === "found" ? 2.5 : 1,
          fillColor,
          fillOpacity,
          dashArray: cell.status === "unsearched" ? "3, 3" : null
        });

        polygon.bindTooltip(
          `Zone R${cell.ring} ${cell.status === "found" ? `• ${cell.matchingListings.length} spot(s) found!` : ""}`,
          { permanent: false, direction: "top" }
        );

        polygon.addTo(hexLayerRef.current);
      });
    });
  }, [hexRings, isHexSearchActive]);

  // Render Parking Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    listings.forEach((listing) => {
      const isSelected = selectedListing?.id === listing.id;
      const isAvailable = listing.isAvailable;

      // Color coding: Green for selected, Blue for available, Grey for unavailable
      let pinBg = "bg-gradient-to-r from-parkit-royal to-parkit-sky";
      let pinBorder = "border-white";
      let pulseRing = "";

      if (isSelected) {
        pinBg = "bg-gradient-to-r from-emerald-600 to-parkit-green";
        pinBorder = "border-white ring-4 ring-emerald-400/40";
        pulseRing = '<div class="absolute -inset-2 rounded-full bg-emerald-400/30 animate-ping pointer-events-none"></div>';
      } else if (!isAvailable) {
        pinBg = "bg-slate-400";
        pinBorder = "border-slate-200";
      }

      const iconHtml = `
        <div class="custom-marker relative cursor-pointer group">
          ${pulseRing}
          <div class="px-2 py-1 rounded-xl ${pinBg} ${pinBorder} border-2 shadow-lg text-white font-extrabold text-xs flex items-center gap-1">
            <span>₹${listing.hourlyPrice}</span>
            <span class="text-[9px] font-medium opacity-90">/hr</span>
          </div>
          <div class="w-2.5 h-2.5 bg-slate-800 rotate-45 mx-auto -mt-1 shadow-sm"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "leaflet-custom-pin",
        html: iconHtml,
        iconSize: [68, 34],
        iconAnchor: [34, 30]
      });

      const marker = L.marker([listing.lat, listing.lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : 100
      });

      marker.on("click", () => {
        onSelectListing(listing);
      });

      marker.addTo(markersLayerRef.current);
    });
  }, [listings, selectedListing, onSelectListing]);

  // Center on selected listing
  useEffect(() => {
    if (selectedListing && mapInstanceRef.current) {
      mapInstanceRef.current.panTo([selectedListing.lat, selectedListing.lng], {
        animate: true,
        duration: 0.6
      });
    }
  }, [selectedListing]);

  // Geolocation Handler
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        onCoordsChange({ lat: latitude, lng: longitude, locality: "Current GPS Location" });
      },
      (err) => {
        alert("Location permission denied. You can search Mumbai localities manually.");
      }
    );
  };

  return (
    <div className="relative w-full h-full min-h-[460px] rounded-3xl overflow-hidden shadow-premium border border-slate-200/80 bg-slate-100">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[460px] z-0" />

      {/* Floating Controls Top-Right */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleUseCurrentLocation}
          className="p-3 bg-white hover:bg-slate-50 text-slate-700 hover:text-parkit-royal rounded-2xl shadow-lg border border-slate-200 transition flex items-center gap-1.5 text-xs font-bold"
          title="Use Current Location"
        >
          <LocateFixed className="w-4 h-4 text-parkit-sky" />
          <span className="hidden sm:inline">My Location</span>
        </button>

        {/* Map Legend */}
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-200 text-[11px] font-semibold space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
            Map Legend
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-parkit-sky border border-parkit-royal" />
            <span className="text-slate-700">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-parkit-green border border-emerald-700" />
            <span className="text-slate-700">Selected Spot</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-400 border border-slate-500" />
            <span className="text-slate-500">Unavailable</span>
          </div>
          {isHexSearchActive && (
            <div className="pt-1.5 border-t border-slate-100 flex items-center gap-2 text-parkit-royal font-bold">
              <span className="w-3 h-3 rounded-sm bg-blue-100 border border-blue-500" />
              <span>H3 Hex Grid</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected Listing Floating Quick Info Preview Card */}
      {selectedListing && (
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

              {/* Distance from search */}
              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-600 font-medium">
                <span className="flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-parkit-sky" />
                  {searchCoords
                    ? `${(getDistanceMeters(searchCoords.lat, searchCoords.lng, selectedListing.lat, selectedListing.lng) / 1000).toFixed(1)} km away`
                    : "Near Mumbai Hub"}
                </span>
                <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                  ★ {selectedListing.rating} ({selectedListing.reviewCount})
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => onGetDirections(selectedListing)}
              className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Directions</span>
            </button>
            <button
              onClick={() => onSelectListing(selectedListing)}
              className="py-2 px-3 rounded-xl bg-gradient-to-r from-parkit-royal to-parkit-sky hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
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
