import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  PlusCircle,
  Building2,
  MapPin,
  Clock,
  Shield,
  Zap,
  Car,
  Sparkles,
  IndianRupee,
  CheckCircle,
  Calendar,
  Layers
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { PARKING_CATEGORIES, LOCALITIES_MUMBAI, VEHICLE_TYPES } from "../data/categories";
import { calculateSuggestedPrice } from "../utils/pricingEngine";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AddListingModal({ isOpen, onClose }) {
  const { addListing } = useApp();

  const [formData, setFormData] = useState({
    title: "",
    category: "residential",
    locality: "BKC (Bandra Kurla Complex), Mumbai",
    address: "",
    lat: 19.0657,
    lng: 72.8687,
    hourlyPrice: 50,
    dailyPrice: 450,
    monthlyPrice: 6500,
    vehicleTypes: ["four_wheeler", "suv"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: false,
    hasValet: false,
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80",
    openTime: "08:00",
    closeTime: "22:00",
    recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    description: ""
  });

  // Calculate AI Suggested Price dynamically
  const suggestedObj = calculateSuggestedPrice({
    category: formData.category,
    locality: formData.locality,
    isCovered: formData.isCovered,
    hasCCTV: formData.hasCCTV,
    hasSecurity: formData.hasSecurity,
    hasEVCharging: formData.hasEVCharging,
    vehicleType: formData.vehicleTypes[0] || "four_wheeler"
  });

  // Keep price initially in sync with AI suggestion if untouched
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      hourlyPrice: suggestedObj.suggestedPrice,
      dailyPrice: suggestedObj.suggestedPrice * 8,
      monthlyPrice: suggestedObj.suggestedPrice * 120
    }));
  }, [
    formData.category,
    formData.locality,
    formData.isCovered,
    formData.hasCCTV,
    formData.hasSecurity,
    formData.hasEVCharging
  ]);

  if (!isOpen) return null;

  const handleLocalityChange = (locName) => {
    const loc = LOCALITIES_MUMBAI.find((l) => l.name === locName);
    if (loc) {
      setFormData({
        ...formData,
        locality: locName,
        lat: loc.lat,
        lng: loc.lng
      });
    }
  };

  const handleToggleRecurringDay = (day) => {
    const current = [...formData.recurringDays];
    if (current.includes(day)) {
      setFormData({ ...formData, recurringDays: current.filter((d) => d !== day) });
    } else {
      setFormData({ ...formData, recurringDays: [...current, day] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addListing({
      title: formData.title,
      category: formData.category,
      locality: formData.locality,
      address: formData.address || `${formData.locality}, Mumbai, Maharashtra`,
      lat: formData.lat + (Math.random() - 0.5) * 0.005, // subtle geo offset for variety
      lng: formData.lng + (Math.random() - 0.5) * 0.005,
      hourlyPrice: Number(formData.hourlyPrice),
      dailyPrice: Number(formData.dailyPrice),
      monthlyPrice: Number(formData.monthlyPrice),
      vehicleTypes: formData.vehicleTypes,
      isCovered: formData.isCovered,
      hasCCTV: formData.hasCCTV,
      hasSecurity: formData.hasSecurity,
      hasEVCharging: formData.hasEVCharging,
      hasValet: formData.hasValet,
      image: formData.image,
      images: [formData.image],
      schedule: {
        openTime: formData.openTime,
        closeTime: formData.closeTime,
        recurringDays: formData.recurringDays,
        blockedDates: [],
        blockedSlots: []
      },
      description: formData.description || "Verified parking bay listed by owner on PARKIT marketplace."
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-parkit-green px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-white" />
              <div>
                <h3 className="font-extrabold text-base tracking-tight">List a New Parking Space</h3>
                <p className="text-[11px] text-emerald-100">
                  GIVE TO RENT • Turn vacant driveways, lots & bays into monthly income
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Parking Space Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Bandra West Society Covered Bay"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  SELECT PARKING TYPE (Category) *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                >
                  {PARKING_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} (Base ₹{cat.baseHourlyPrice}/hr)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Locality & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mumbai Locality / Region *
                </label>
                <select
                  value={formData.locality}
                  onChange={(e) => handleLocalityChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                >
                  {LOCALITIES_MUMBAI.filter((l) => l.name !== "All Localities").map((loc) => (
                    <option key={loc.name} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Building / Gate Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Wing B, Hiranandani Estate, Thane West"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* AI Suggested Pricing Widget & Breakdown */}
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider">
                    AI Suggested Price Engine
                  </span>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-sm">
                  Suggested: ₹{suggestedObj.suggestedPrice}/hour
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] mb-3">
                {suggestedObj.breakdown.map((item, idx) => (
                  <div key={idx} className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                    <span className="text-slate-500 block text-[10px]">{item.label}</span>
                    <strong className="text-emerald-800">{item.value}</strong>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-emerald-800 italic">
                Formula: Suggested Price = Category Base (₹{suggestedObj.basePrice}) + Location Adj (₹{suggestedObj.locationAdjustment}) + Facility Premium (₹{suggestedObj.facilityPremium}) + Demand Dynamic (₹{suggestedObj.demandAdjustment}).
              </p>
            </div>

            {/* Custom Price Overrides */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hourly Rate (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="20"
                  value={formData.hourlyPrice}
                  onChange={(e) => setFormData({ ...formData, hourlyPrice: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Day Rate (₹)
                </label>
                <input
                  type="number"
                  min="150"
                  value={formData.dailyPrice}
                  onChange={(e) => setFormData({ ...formData, dailyPrice: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Monthly Pass (₹)
                </label>
                <input
                  type="number"
                  min="1000"
                  value={formData.monthlyPrice}
                  onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>
            </div>

            {/* Facilities Checkboxes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Parking Amenities & Security
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <label className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={formData.isCovered}
                    onChange={(e) => setFormData({ ...formData, isCovered: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Covered Bay</span>
                </label>

                <label className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={formData.hasCCTV}
                    onChange={(e) => setFormData({ ...formData, hasCCTV: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>CCTV Surveillance</span>
                </label>

                <label className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={formData.hasSecurity}
                    onChange={(e) => setFormData({ ...formData, hasSecurity: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>24/7 Gate Guard</span>
                </label>

                <label className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={formData.hasEVCharging}
                    onChange={(e) => setFormData({ ...formData, hasEVCharging: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>EV Fast Charger</span>
                </label>
              </div>
            </div>

            {/* Operating Hours & Recurring Available Days */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Opening Time
                  </label>
                  <input
                    type="time"
                    value={formData.openTime}
                    onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Closing Time
                  </label>
                  <input
                    type="time"
                    value={formData.closeTime}
                    onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Recurring Open Days (e.g. Monday–Friday, 6 PM–11 PM)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = formData.recurringDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleRecurringDay(day)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          isSelected
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Access Instructions & Description
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mention gate number, height clearance, guard phone or security directions..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-parkit-green hover:opacity-95 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/25 transition active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Publish Parking Space to Marketplace</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
