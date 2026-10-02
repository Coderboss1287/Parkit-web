import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radar,
  Play,
  Square,
  RefreshCw,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sparkles,
  MapPin
} from "lucide-react";

export default function HexagonalRadar({
  isSearching,
  currentRing,
  maxRings,
  maxRadiusMeters,
  onMaxRadiusChange,
  onStartSearch,
  onStopSearch,
  onExpandRings,
  foundCount,
  ringsSummary = []
}) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-premium border border-slate-200/90 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-parkit-royal flex items-center justify-center">
            <Radar className={`w-4 h-4 ${isSearching ? "animate-spin text-parkit-sky" : ""}`} />
          </div>
          <div>
            <h3 className="text-sm font-black text-parkit-dark flex items-center gap-1.5">
              <span>H3 Hexagonal Proximity Radar</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase border border-emerald-200">
                Core Engine
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Concentric geometric search expanding ring-by-ring (Ring 0 → Ring 3)
            </p>
          </div>
        </div>

        {/* Max Radius Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
          <span className="text-[10px] uppercase text-slate-400 pl-1.5 hidden sm:inline">Max:</span>
          {[500, 1000, 2000].map((radius) => (
            <button
              key={radius}
              onClick={() => onMaxRadiusChange(radius)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                maxRadiusMeters === radius
                  ? "bg-white text-parkit-royal shadow-sm"
                  : "hover:text-parkit-dark"
              }`}
            >
              {radius < 1000 ? `${radius}m` : `${radius / 1000}km`}
            </button>
          ))}
        </div>
      </div>

      {/* Live Search Status & Radar Animation */}
      <div className="py-4">
        {isSearching ? (
          <div className="flex items-center justify-between bg-blue-50/70 border border-blue-200/60 rounded-2xl p-3.5 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <span className="w-4 h-4 rounded-full bg-parkit-sky animate-ping absolute" />
                <span className="w-3 h-3 rounded-full bg-parkit-royal relative" />
              </div>
              <div>
                <p className="text-xs font-bold text-parkit-royal">
                  Searching nearby parking... Scanning Ring {currentRing}
                </p>
                <p className="text-[11px] text-slate-500">
                  Checking availability against vehicle type, category and schedule
                </p>
              </div>
            </div>
            <button
              onClick={onStopSearch}
              className="px-3 py-1.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm"
            >
              <Square className="w-3 h-3" />
              <span>Stop</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {foundCount > 0
                    ? `Found ${foundCount} verified parking spot(s) nearby!`
                    : "Ready to scan surrounding hexagonal zones"}
                </p>
                <p className="text-[11px] text-slate-500">
                  {foundCount > 0
                    ? "Click any map marker or card to inspect details and pre-booking chat"
                    : "Initiate spiral expansion from your location"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onStartSearch}
                className="px-4 py-2 bg-gradient-to-r from-parkit-royal to-parkit-sky hover:opacity-95 text-white text-xs font-extrabold rounded-xl transition shadow-md shadow-blue-500/20 flex items-center gap-1.5"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Scan Hex Rings</span>
              </button>
            </div>
          </div>
        )}

        {/* Ring Expansion Step Indicators */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          {[0, 1, 2, 3].map((ringNum) => {
            const cellCount = ringNum === 0 ? 1 : ringNum * 6;
            const isCompleted = currentRing > ringNum;
            const isCurrent = isSearching && currentRing === ringNum;

            return (
              <div
                key={ringNum}
                className={`p-2.5 rounded-2xl border text-center transition-all ${
                  isCurrent
                    ? "bg-blue-50 border-blue-400 ring-2 ring-blue-300"
                    : isCompleted
                    ? "bg-emerald-50/60 border-emerald-300"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-extrabold mb-1">
                  <span
                    className={
                      isCurrent
                        ? "text-parkit-royal"
                        : isCompleted
                        ? "text-emerald-700"
                        : "text-slate-400"
                    }
                  >
                    Ring {ringNum}
                  </span>
                  <span className="text-slate-400 font-medium">{cellCount} hex</span>
                </div>
                <div className="text-[11px] font-bold">
                  {isCurrent && <span className="text-parkit-sky animate-pulse">Scanning...</span>}
                  {isCompleted && <span className="text-emerald-700">✓ Done</span>}
                  {!isCurrent && !isCompleted && <span className="text-slate-400">Idle</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Show More Nearby Parking (Extends into next ring) */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-parkit-sky" />
          <span>Hexagon zone diameter: <strong>50m</strong> (H3 resolution standard)</span>
        </span>

        <button
          onClick={onExpandRings}
          className="text-xs font-bold text-parkit-royal hover:text-blue-800 flex items-center gap-1 group transition"
        >
          <PlusCircle className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
          <span>Show More Nearby Parking</span>
        </button>
      </div>
    </div>
  );
}
