import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Phone,
  PhoneCall,
  PhoneOff,
  ShieldCheck,
  Lock,
  UserCheck,
  Clock,
  Sparkles
} from "lucide-react";

export default function CallModal({ isOpen, onClose, listing }) {
  const [callState, setCallState] = useState("ready"); // 'ready' | 'calling' | 'connected'

  if (!isOpen || !listing) return null;

  const handleStartCall = () => {
    setCallState("calling");
    setTimeout(() => {
      setCallState("connected");
    }, 2000);
  };

  const handleEndCall = () => {
    setCallState("ready");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-center p-6 sm:p-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>

          {/* Masked Call Header */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-parkit-royal text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200">
              <Lock className="w-3 h-3 text-parkit-sky" />
              <span>PARKIT Masked Call System</span>
            </div>

            <div className="relative w-20 h-20 mx-auto mb-4">
              <div
                className={`w-full h-full rounded-3xl bg-gradient-to-tr from-parkit-royal to-parkit-sky flex items-center justify-center text-white shadow-xl ${
                  callState !== "ready" ? "animate-pulse ring-4 ring-cyan-300" : ""
                }`}
              >
                {callState === "connected" ? (
                  <PhoneCall className="w-9 h-9 animate-bounce text-parkit-green" />
                ) : (
                  <Phone className="w-9 h-9" />
                )}
              </div>
            </div>

            <h3 className="text-xl font-black text-parkit-dark">{listing.owner.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{listing.owner.type}</p>
            <p className="text-xs font-extrabold text-parkit-royal mt-1">
              Virtual Masked Line: {listing.owner.maskedPhone}
            </p>
          </div>

          {/* Privacy & Consent Notice */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 mb-6 text-left space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Host Consent Active</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Personal phone numbers are masked by PARKIT IVR to protect privacy. Call connects via secure cloud bridge.
            </p>
          </div>

          {/* State Based Action Buttons */}
          {callState === "ready" && (
            <button
              onClick={handleStartCall}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-parkit-green hover:opacity-95 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Initiate Free Masked Call</span>
            </button>
          )}

          {callState === "calling" && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-parkit-royal animate-pulse">
                Dialing virtual bridge... Waiting for host to pick up
              </p>
              <button
                onClick={handleEndCall}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-2xl transition flex items-center justify-center gap-2"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Call</span>
              </button>
            </div>
          )}

          {callState === "connected" && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Call In Progress (00:14)</span>
              </div>
              <button
                onClick={handleEndCall}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-2xl transition flex items-center justify-center gap-2"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Hang Up</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
