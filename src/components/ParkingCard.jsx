import React from "react";
import {
  MapPin,
  Clock,
  Shield,
  Zap,
  Car,
  Eye,
  MessageSquare,
  Phone,
  CheckCircle,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { PARKING_CATEGORIES } from "../data/categories";

export default function ParkingCard({
  listing,
  distanceMeters,
  onSelect,
  onChat,
  onCall,
  isSelected
}) {
  const categoryInfo = PARKING_CATEGORIES.find((c) => c.id === listing.category) || {
    name: listing.category,
    badgeColor: "bg-slate-100 text-slate-800"
  };

  return (
    <div
      onClick={onSelect}
      className={`group bg-white rounded-3xl p-4 sm:p-5 shadow-premium hover:shadow-premium-lg border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
        isSelected
          ? "border-parkit-green ring-4 ring-emerald-500/15"
          : "border-slate-200/80 hover:border-parkit-sky/60"
      }`}
    >
      <div>
        {/* Image & Badges */}
        <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-slate-100">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top Floating Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span
              className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-sm ${categoryInfo.badgeColor}`}
            >
              {categoryInfo.name}
            </span>
            {listing.isCovered ? (
              <span className="px-2 py-1 rounded-xl text-[10px] font-bold bg-white/90 text-slate-800 backdrop-blur-md shadow-sm">
                Covered
              </span>
            ) : (
              <span className="px-2 py-1 rounded-xl text-[10px] font-bold bg-amber-500/90 text-white backdrop-blur-md shadow-sm">
                Open Bay
              </span>
            )}
          </div>

          {/* Top Right Price Tag */}
          <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-parkit-royal/95 backdrop-blur-md text-white font-black text-sm shadow-md flex items-center gap-0.5">
            <span>₹{listing.hourlyPrice}</span>
            <span className="text-[10px] font-semibold text-cyan-200">/hr</span>
          </div>

          {/* Availability Status Ribbon */}
          <div className="absolute bottom-3 left-3">
            {listing.isAvailable ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-600/90 text-white text-[10px] font-bold backdrop-blur-md shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Available Today
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-700/90 text-white text-[10px] font-bold backdrop-blur-md shadow-sm">
                Slot Occupied
              </span>
            )}
          </div>
        </div>

        {/* Title & Location */}
        <div className="mb-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-base font-extrabold text-parkit-dark group-hover:text-parkit-royal transition-colors line-clamp-1">
              {listing.title}
            </h3>
            <span className="flex items-center gap-1 text-xs font-bold text-amber-500 flex-shrink-0">
              ★ {listing.rating}
              <span className="text-[10px] text-slate-400 font-normal">({listing.reviewCount})</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 flex items-start gap-1 line-clamp-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
            <span>{listing.address}</span>
          </p>
        </div>

        {/* Distance & Hours info */}
        <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl mb-3 border border-slate-100">
          <span className="flex items-center gap-1 font-semibold">
            <Clock className="w-3.5 h-3.5 text-parkit-sky" />
            <span>{listing.schedule.openTime} – {listing.schedule.closeTime}</span>
          </span>
          {distanceMeters !== undefined && (
            <span className="font-bold text-parkit-royal">
              {distanceMeters < 1000 ? `${distanceMeters}m away` : `${(distanceMeters / 1000).toFixed(1)} km`}
            </span>
          )}
        </div>

        {/* Facilities Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {listing.hasCCTV && (
            <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold">
              CCTV
            </span>
          )}
          {listing.hasSecurity && (
            <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              24/7 Guard
            </span>
          )}
          {listing.hasEVCharging && (
            <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 text-[10px] font-bold flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" /> EV Charge
            </span>
          )}
          {listing.dailyPrice && (
            <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-medium">
              ₹{listing.dailyPrice}/day
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons: Contact Owner & Book Now */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChat(listing);
          }}
          className="p-2.5 rounded-xl border border-slate-200 hover:border-parkit-sky hover:text-parkit-royal text-slate-600 transition flex items-center justify-center bg-slate-50 hover:bg-white"
          title="Chat with Owner before booking"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCall(listing);
          }}
          className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:text-emerald-700 text-slate-600 transition flex items-center justify-center bg-slate-50 hover:bg-white"
          title="Call Owner (Masked Phone)"
        >
          <Phone className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onSelect}
          className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-parkit-royal to-parkit-sky hover:from-[#064294] hover:to-[#2298d4] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-[0.98]"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Book Parking</span>
        </button>
      </div>
    </div>
  );
}
