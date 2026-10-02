import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Clock,
  Shield,
  Zap,
  Car,
  CheckCircle,
  MessageSquare,
  Phone,
  Calendar,
  Share2,
  Bookmark,
  ExternalLink,
  Info
} from "lucide-react";
import { PARKING_CATEGORIES } from "../data/categories";

export default function ParkingDetailsModal({
  isOpen,
  onClose,
  listing,
  onChat,
  onCall,
  onBook,
  onGetDirections
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen || !listing) return null;

  const categoryInfo = PARKING_CATEGORIES.find((c) => c.id === listing.category) || {
    name: listing.category,
    badgeColor: "bg-slate-100 text-slate-800"
  };

  const images = listing.images && listing.images.length > 0 ? listing.images : [listing.image];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md backdrop-blur-md flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* Image Gallery */}
            <div>
              <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-100 shadow-inner mb-3">
                <img
                  src={images[activeImageIndex]}
                  alt={listing.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wider backdrop-blur-md shadow-md ${categoryInfo.badgeColor}`}
                  >
                    {categoryInfo.name}
                  </span>
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white/90 text-slate-800 backdrop-blur-md shadow-md">
                    {listing.isCovered ? "Covered Bay" : "Open Parking"}
                  </span>
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition ${
                        activeImageIndex === idx ? "border-parkit-sky ring-2 ring-blue-200" : "border-slate-200 opacity-70"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title, Rating & Pricing Row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-parkit-dark tracking-tight">
                  {listing.title}
                </h2>
                <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{listing.address}</span>
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="text-amber-500 font-bold flex items-center gap-1">
                    ★ {listing.rating} ({listing.reviewCount} verified reviews)
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                    Verified Host Spot
                  </span>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/90 text-right flex-shrink-0">
                <div className="text-2xl font-black text-parkit-royal">
                  ₹{listing.hourlyPrice}
                  <span className="text-xs font-normal text-slate-500">/hr</span>
                </div>
                {listing.dailyPrice && (
                  <p className="text-xs text-slate-500 font-medium">₹{listing.dailyPrice} full day</p>
                )}
                {listing.monthlyPrice && (
                  <p className="text-[11px] text-parkit-sky font-bold">₹{listing.monthlyPrice}/month</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                About This Parking Space
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{listing.description}</p>
            </div>

            {/* Amenities Grid */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Included Facilities & Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                  <Car className="w-4 h-4 text-parkit-sky" />
                  <span>{listing.isCovered ? "Covered Canopy" : "Open Layout"}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>{listing.hasSecurity ? "24/7 Gate Guard" : "Gated Key Access"}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span>{listing.hasEVCharging ? "EV Fast Charging" : "Standard Bay"}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{listing.schedule.openTime} - {listing.schedule.closeTime}</span>
                </div>
              </div>
            </div>

            {/* Pre-Booking Owner Card with Contact / Chat */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-blue-50/60 to-cyan-50/40 border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-parkit-royal text-white font-black text-base flex items-center justify-center shadow-md">
                  {listing.owner.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-parkit-dark flex items-center gap-1.5">
                    <span>{listing.owner.name}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Verified Host
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Response time: {listing.owner.responseTime} • Response rate: {listing.owner.responseRate}
                  </p>
                </div>
              </div>

              {/* Pre-Booking Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onChat(listing)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-slate-200 hover:border-parkit-sky text-parkit-royal font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat With Owner</span>
                </button>
                <button
                  onClick={() => onCall(listing)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-slate-200 hover:border-emerald-400 text-emerald-700 font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Owner</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions Bar */}
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 block">Total Hourly Rate</span>
              <span className="text-2xl font-black text-parkit-royal">₹{listing.hourlyPrice}</span>
              <span className="text-xs text-slate-400"> + ₹{Math.round(listing.hourlyPrice * 0.12)} platform fee</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onGetDirections(listing)}
                className="px-4 py-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <ExternalLink className="w-4 h-4 text-slate-500" />
                <span>Directions</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onBook(listing);
                }}
                className="px-6 py-3 bg-gradient-to-r from-parkit-royal to-parkit-sky hover:from-[#064294] hover:to-[#2298d4] text-white font-extrabold text-sm rounded-xl shadow-glow-royal transition active:scale-[0.98] flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Book This Space</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
