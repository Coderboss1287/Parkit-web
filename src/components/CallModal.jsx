import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight
} from "lucide-react";

export default function CallModal({ isOpen, onClose, listing }) {
  if (!isOpen || !listing) return null;

  const hostPhone = listing.owner?.phone || "+91 98200 12345";
  const cleanPhone = hostPhone.replace(/[^0-9+]/g, "");

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
            aria-label="Close modal"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>

          {/* Direct Host Contact Header */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-parkit-royal text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-parkit-sky" />
              <span>Direct Host Contact</span>
            </div>

            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-parkit-royal to-parkit-sky flex items-center justify-center text-white shadow-xl">
                <Phone className="w-9 h-9" />
              </div>
            </div>

            <h3 className="text-xl font-black text-parkit-dark">{listing.owner?.name || "Verified Host"}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{listing.owner?.type || "Parking Space Manager"}</p>
            <p className="text-sm font-extrabold text-parkit-royal mt-2 font-mono">
              {hostPhone}
            </p>
          </div>

          {/* Verification Notice */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 mb-6 text-left space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Verified Listing Telephone</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Inquiry for <strong>{listing.title}</strong>. Clicking below launches your device's native telephone dialer.
            </p>
          </div>

          {/* Genuine Phone Dialer Link */}
          <a
            href={`tel:${cleanPhone}`}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-parkit-green hover:opacity-95 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 active:scale-98"
          >
            <Phone className="w-4 h-4" />
            <span>Call Host ({cleanPhone})</span>
          </a>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
