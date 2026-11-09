import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Car,
  Filter,
  SlidersHorizontal,
  Map as MapIcon,
  List as ListIcon,
  Sparkles,
  Zap,
  Shield,
  Layers,
  ChevronDown,
  Navigation,
  Bot,
  LocateFixed
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { PARKING_CATEGORIES, LOCALITIES_MUMBAI, VEHICLE_TYPES } from "../data/categories";
import {
  calculateHaversineDistanceKm
} from "../utils/hexagonalSearch";
import InteractiveMap from "./InteractiveMap";
import ParkingCard from "./ParkingCard";
import ParkingDetailsModal from "./ParkingDetailsModal";
import BookingModal from "./BookingModal";
import ChatModal from "./ChatModal";
import CallModal from "./CallModal";
import atlasMaps from "../services/atlasMapsClient";

export default function RentItDashboard() {
  const {
    listings,
    selectedListing,
    setSelectedListing,
    bookingListing,
    setBookingListing,
    chatListing,
    setChatListing,
    callListing,
    setCallListing,
    setShowAIAssistant,
    userLocation,
    setUserLocation,
    setNearbyDynamicSpots
  } = useApp();

  // Search & Filter State
  const [selectedLocality, setSelectedLocality] = useState("All Localities");
  const [searchCoords, setSearchCoords] = useState({ lat: 19.0760, lng: 72.8777 });
  const [isLocating, setIsLocating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVehicleType, setSelectedVehicleType] = useState("four_wheeler");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedStartTime, setSelectedStartTime] = useState("10:00");
  const [selectedEndTime, setSelectedEndTime] = useState("13:00");
  const [maxPrice, setMaxPrice] = useState(150);
  const [filterCoveredOnly, setFilterCoveredOnly] = useState(false);
  const [filterEVOnly, setFilterEVOnly] = useState(false);
  const [filterSecurityOnly, setFilterSecurityOnly] = useState(false);
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(true);

  // View state: 'split' | 'map' | 'list'
  const [viewMode, setViewMode] = useState("split");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // ATLAS Engine State: Geocoder & Active In-App Route
  const [atlasSearchQuery, setAtlasSearchQuery] = useState("");
  const [atlasResults, setAtlasResults] = useState([]);
  const [isSearchingAtlas, setIsSearchingAtlas] = useState(false);
  const [showAtlasDropdown, setShowAtlasDropdown] = useState(false);
  const [activeRoute, setActiveRoute] = useState(null);

  // Core handler: updates map center and locality filter
  const applyCoordinates = async (coords, localityLabel = "📍 My Current Location (GPS)", isLiveGps = false) => {
    setSearchCoords({ lat: coords.lat, lng: coords.lng, isLiveLocation: isLiveGps });
    setSelectedLocality(localityLabel);

    if (isLiveGps) {
      setUserLocation({ lat: coords.lat, lng: coords.lng });
    }
  };

  // Live Geolocation Auto-Detect when page loads
  useEffect(() => {
    if (!navigator.geolocation) return;

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        applyCoordinates({ lat: latitude, lng: longitude }, "📍 My Current Location (GPS)", true);
      },
      (err) => {
        setIsLocating(false);
        console.log("Geolocation auto-detect status:", err.message);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  // Triggered when user clicks "My Location" button
  const handleTriggerGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        applyCoordinates({ lat: latitude, lng: longitude }, "📍 My Current Location (GPS)", true);
      },
      (err) => {
        setIsLocating(false);
        alert("Location access was denied or unavailable. You can select a locality from the dropdown.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Two-way sync: scroll card into view in sidebar when selectedListing changes
  useEffect(() => {
    if (selectedListing) {
      const cardEl = document.getElementById(`parking-card-${selectedListing.id}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedListing]);

  // Handle Locality Dropdown Selection
  const handleLocalitySelect = (localityName) => {
    setSelectedLocality(localityName);
    if (localityName.includes("My Current Location") && userLocation) {
      applyCoordinates(userLocation, "📍 My Current Location (GPS)", true);
      return;
    }
    const loc = LOCALITIES_MUMBAI.find((l) => l.name === localityName);
    if (loc) {
      applyCoordinates({ lat: loc.lat, lng: loc.lng }, loc.name, false);
    }
  };

  // Filter listings based on current controls
  const filteredListings = useMemo(() => {
    return listings
      .filter((l) => {
        if (selectedCategory !== "all" && l.category !== selectedCategory) return false;
        if (!l.vehicleTypes.includes(selectedVehicleType)) return false;
        if (l.hourlyPrice > maxPrice) return false;
        if (filterCoveredOnly && !l.isCovered) return false;
        if (filterEVOnly && !l.hasEVCharging) return false;
        if (filterSecurityOnly && !l.hasSecurity) return false;
        if (filterAvailableOnly && !l.isAvailable) return false;
        return true;
      })
      .map((l) => {
        const distKm = calculateHaversineDistanceKm(searchCoords.lat, searchCoords.lng, l.lat, l.lng);
        return {
          ...l,
          distanceKm: distKm,
          distanceMeters: Math.round(distKm * 1000)
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [
    listings,
    selectedCategory,
    selectedVehicleType,
    maxPrice,
    filterCoveredOnly,
    filterEVOnly,
    filterSecurityOnly,
    filterAvailableOnly,
    searchCoords
  ]);

  // ATLAS Geocoder Search Handler
  const handleAtlasSearch = async (e) => {
    if (e) e.preventDefault();
    if (!atlasSearchQuery.trim()) return;

    setIsSearchingAtlas(true);
    setShowAtlasDropdown(true);
    try {
      const results = await atlasMaps.geocodeSearch(atlasSearchQuery, 5);
      setAtlasResults(results);
      if (results.length > 0) {
        // Automatically pin first result if user hit enter
        const top = results[0];
        applyCoordinates({ lat: top.lat, lng: top.lng }, top.name || top.displayName, false);
      }
    } catch (err) {
      console.error("ATLAS Search error:", err);
    } finally {
      setIsSearchingAtlas(false);
    }
  };

  const handleSelectAtlasResult = (res) => {
    setAtlasSearchQuery(res.name || res.displayName);
    setShowAtlasDropdown(false);
    applyCoordinates({ lat: res.lat, lng: res.lng }, res.name || res.displayName, false);
  };

  // In-App ATLAS Route Calculation
  const handleGetDirections = async (listing) => {
    setSelectedListing(listing);
    setViewMode("split"); // Switch to split so map is visible
    const origin = userLocation || searchCoords || { lat: 19.0760, lng: 72.8777 };

    try {
      const res = await atlasMaps.calculateRoute(
        origin.lat,
        origin.lng,
        listing.lat,
        listing.lng,
        "driving"
      );
      setActiveRoute({
        ...res,
        destinationTitle: listing.title,
        destinationAddress: listing.address,
        targetListing: listing
      });
    } catch (err) {
      console.error("ATLAS route calculation error:", err);
      // Fallback: open external map if completely offline
      const url = `https://www.google.com/maps/dir/?api=1&destination=${listing.lat},${listing.lng}`;
      window.open(url, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] pb-16">
      {/* Top Filter and Search Bar */}
      <section className="bg-white border-b border-slate-200/90 py-5 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-parkit-royal text-xs font-bold uppercase tracking-wider mb-1 border border-blue-200">
                <Car className="w-3 h-3 text-parkit-sky" />
                <span>Customer Workspace • RENT IT</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-parkit-dark tracking-tight">
                Discover Verified Parking in Mumbai
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Book guaranteed hourly, daily or monthly parking with transparent ₹ INR checkout.
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start md:self-auto">
              <button
                onClick={() => setViewMode("split")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === "split"
                    ? "bg-white text-parkit-royal shadow-sm"
                    : "text-slate-600 hover:text-parkit-dark"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Split View</span>
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === "map"
                    ? "bg-white text-parkit-royal shadow-sm"
                    : "text-slate-600 hover:text-parkit-dark"
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Map View</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === "list"
                    ? "bg-white text-parkit-royal shadow-sm"
                    : "text-slate-600 hover:text-parkit-dark"
                }`}
              >
                <ListIcon className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
            </div>
          </div>

          {/* ATLAS Live Geocoding Search Bar */}
          <div className="relative pt-1">
            <form onSubmit={handleAtlasSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={atlasSearchQuery}
                  onChange={(e) => {
                    setAtlasSearchQuery(e.target.value);
                    if (!showAtlasDropdown && e.target.value.length > 2) {
                      setShowAtlasDropdown(true);
                    }
                  }}
                  onFocus={() => {
                    if (atlasResults.length > 0) setShowAtlasDropdown(true);
                  }}
                  placeholder="ATLAS Geocoder (/v1/geocode/search): Search any street, railway station, or landmark in Mumbai & Navi Mumbai..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-parkit-sky focus:bg-white shadow-inner transition"
                />
              </div>
              <button
                type="submit"
                disabled={isSearchingAtlas}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-parkit-royal to-parkit-sky text-white text-xs font-extrabold shadow-md hover:opacity-95 transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span>{isSearchingAtlas ? "Geocoding..." : "ATLAS Search"}</span>
              </button>
            </form>

            {/* Autocomplete Suggestions Dropdown */}
            {showAtlasDropdown && atlasResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto">
                <div className="px-3.5 py-1.5 bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>ATLAS Geocoder Suggestions</span>
                  <button
                    type="button"
                    onClick={() => setShowAtlasDropdown(false)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    Close
                  </button>
                </div>
                {atlasResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectAtlasResult(item)}
                    className="w-full px-4 py-2.5 text-left text-xs hover:bg-blue-50/80 flex items-start gap-2.5 transition"
                  >
                    <MapPin className="w-4 h-4 text-parkit-royal flex-shrink-0 mt-0.5" />
                    <div className="truncate">
                      <span className="font-extrabold text-slate-900 block truncate">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate">
                        {item.displayName}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Primary Filter Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
            {/* Location selector */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-extrabold uppercase text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-parkit-royal" />
                  Location / Hub
                </label>
                <button
                  type="button"
                  onClick={handleTriggerGeolocation}
                  disabled={isLocating}
                  className="text-[10px] font-extrabold text-parkit-royal hover:text-blue-700 flex items-center gap-1 transition"
                  title="Detect Live GPS Location"
                >
                  <LocateFixed className={`w-3 h-3 text-parkit-sky ${isLocating ? "animate-spin" : ""}`} />
                  <span>{isLocating ? "Locating..." : "My Location"}</span>
                </button>
              </div>
              <select
                value={selectedLocality}
                onChange={(e) => handleLocalitySelect(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-parkit-sky focus:bg-white transition"
              >
                {(userLocation || selectedLocality.includes("My Current Location")) && (
                  <option value={selectedLocality.includes("My Current Location") ? selectedLocality : "📍 My Current Location (GPS)"}>
                    📍 My Current Location (GPS)
                  </option>
                )}
                {LOCALITIES_MUMBAI.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category dropdown */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1">
                SELECT PARKING TYPE
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-parkit-sky focus:bg-white transition"
              >
                <option value="all">All 8 Parking Types</option>
                {PARKING_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} (from ₹{cat.baseHourlyPrice}/hr)
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1">
                Vehicle Type
              </label>
              <select
                value={selectedVehicleType}
                onChange={(e) => setSelectedVehicleType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-parkit-sky focus:bg-white transition"
              >
                {VEHICLE_TYPES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-parkit-royal" />
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              />
            </div>

            {/* Time Window */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-parkit-royal" />
                Start – End Time
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="time"
                  value={selectedStartTime}
                  onChange={(e) => setSelectedStartTime(e.target.value)}
                  className="w-1/2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="time"
                  value={selectedEndTime}
                  onChange={(e) => setSelectedEndTime(e.target.value)}
                  className="w-1/2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Secondary Facility Pills and Max Price Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Filters:
              </span>

              <button
                onClick={() => setFilterCoveredOnly(!filterCoveredOnly)}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                  filterCoveredOnly
                    ? "bg-blue-50 border-parkit-sky text-parkit-royal"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                Covered Canopy
              </button>

              <button
                onClick={() => setFilterEVOnly(!filterEVOnly)}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition flex items-center gap-1 ${
                  filterEVOnly
                    ? "bg-purple-50 border-purple-400 text-purple-700"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Zap className="w-3 h-3 text-purple-600" />
                EV Charging
              </button>

              <button
                onClick={() => setFilterSecurityOnly(!filterSecurityOnly)}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition flex items-center gap-1 ${
                  filterSecurityOnly
                    ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Shield className="w-3 h-3 text-emerald-600" />
                24/7 Security
              </button>

              <button
                onClick={() => setFilterAvailableOnly(!filterAvailableOnly)}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                  filterAvailableOnly
                    ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                Available Only
              </button>
            </div>

            {/* Price Slider */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500">Max Budget:</span>
              <span className="font-extrabold text-parkit-royal text-xs">₹{maxPrice}/hr</span>
              <input
                type="range"
                min="30"
                max="200"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 accent-parkit-royal cursor-pointer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* View Mode Dispatcher */}
        {viewMode === "split" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Listings Cards Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-4 max-h-[800px] overflow-y-auto pr-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Showing {filteredListings.length} verified parking spots</span>
                <span className="text-parkit-royal">Sorted by nearest</span>
              </div>

              {filteredListings.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
                  <Car className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">No matching spaces found</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try expanding search radius or adjusting category filters.
                  </p>
                </div>
              ) : (
                filteredListings.map((listing) => (
                  <ParkingCard
                    key={listing.id}
                    listing={listing}
                    distanceMeters={listing.distanceMeters}
                    isSelected={selectedListing?.id === listing.id}
                    onSelect={() => {
                      setSelectedListing(listing);
                    }}
                    onChat={() => setChatListing(listing)}
                    onCall={() => setCallListing(listing)}
                  />
                ))
              )}
            </div>

            {/* Right: Map Column (7 Cols) */}
            <div className="lg:col-span-7 sticky top-28 h-[750px]">
              <InteractiveMap
                listings={filteredListings}
                selectedListing={selectedListing}
                onSelectListing={(listing) => {
                  setSelectedListing(listing);
                }}
                onOpenDetails={(listing) => {
                  setSelectedListing(listing);
                  setIsDetailsOpen(true);
                }}
                searchCoords={searchCoords}
                onCoordsChange={(coords) => applyCoordinates(coords, coords.locality || "Selected Location", coords.isLiveLocation)}
                userLocation={userLocation}
                onLocateUser={handleTriggerGeolocation}
                onGetDirections={handleGetDirections}
                activeRoute={activeRoute}
                onClearRoute={() => setActiveRoute(null)}
              />
            </div>
          </div>
        )}

        {viewMode === "map" && (
          <div className="h-[780px]">
            <InteractiveMap
              listings={filteredListings}
              selectedListing={selectedListing}
              onSelectListing={(listing) => {
                setSelectedListing(listing);
              }}
              onOpenDetails={(listing) => {
                setSelectedListing(listing);
                setIsDetailsOpen(true);
              }}
              searchCoords={searchCoords}
              onCoordsChange={(coords) => applyCoordinates(coords, coords.locality || "Selected Location", coords.isLiveLocation)}
              userLocation={userLocation}
              onLocateUser={handleTriggerGeolocation}
              onGetDirections={handleGetDirections}
              activeRoute={activeRoute}
              onClearRoute={() => setActiveRoute(null)}
            />
          </div>
        )}

        {viewMode === "list" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
              <span>Showing {filteredListings.length} verified parking spaces</span>
              <span className="text-parkit-royal">Nearest to {selectedLocality}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <ParkingCard
                  key={listing.id}
                  listing={listing}
                  distanceMeters={listing.distanceMeters}
                  isSelected={selectedListing?.id === listing.id}
                  onSelect={() => {
                    setSelectedListing(listing);
                  }}
                  onChat={() => setChatListing(listing)}
                  onCall={() => setCallListing(listing)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating AI Helper Pill */}
      <button
        onClick={() => setShowAIAssistant(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-gradient-to-r from-parkit-royal to-parkit-sky text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition flex items-center gap-2 font-bold text-xs shadow-glow-royal"
      >
        <Bot className="w-4 h-4 text-cyan-200 animate-bounce" />
        <span>Ask PARKIT AI</span>
      </button>

      {/* Modals */}
      <ParkingDetailsModal
        isOpen={isDetailsOpen && !!selectedListing}
        listing={selectedListing}
        onClose={() => setIsDetailsOpen(false)}
        onChat={(l) => setChatListing(l)}
        onCall={(l) => setCallListing(l)}
        onBook={(l) => setBookingListing(l)}
        onGetDirections={(l) => {
          setIsDetailsOpen(false);
          handleGetDirections(l);
        }}
      />

      <BookingModal
        isOpen={!!bookingListing}
        listing={bookingListing}
        onClose={() => setBookingListing(null)}
      />

      <ChatModal
        isOpen={!!chatListing}
        listing={chatListing}
        onClose={() => setChatListing(null)}
      />

      <CallModal
        isOpen={!!callListing}
        listing={callListing}
        onClose={() => setCallListing(null)}
      />
    </div>
  );
}
