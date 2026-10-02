import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Car,
  QrCode,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Navigation,
  FileText
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function MyBookingsModal({ isOpen, onClose }) {
  const { bookings, cancelBooking, setChatListing, listings } = useApp();
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'confirmed' | 'completed' | 'cancelled'
  const [cancellingBookingId, setCancellingBookingId] = useState(null);

  if (!isOpen) return null;

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "all") return true;
    return b.status === activeTab;
  });

  const handleConfirmCancel = (id) => {
    cancelBooking(id);
    setCancellingBookingId(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-parkit-royal to-parkit-sky px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-cyan-200" />
              <div>
                <h3 className="font-extrabold text-base tracking-tight">My Reserved Parking Spaces</h3>
                <p className="text-[11px] text-cyan-100">Manage your active reservations, PIN vouchers and receipts</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="px-6 pt-4 pb-2 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
            {[
              { id: "all", label: "All Bookings", count: bookings.length },
              { id: "confirmed", label: "Upcoming / Active", count: bookings.filter((b) => b.status === "confirmed").length },
              { id: "completed", label: "Completed", count: bookings.filter((b) => b.status === "completed").length },
              { id: "cancelled", label: "Cancelled", count: bookings.filter((b) => b.status === "cancelled").length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-parkit-royal text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeTab === tab.id ? "bg-white/20 text-white" : "bg-white text-slate-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Bookings List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            {filteredBookings.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Calendar className="w-10 h-10 mx-auto opacity-40 text-slate-400" />
                <p className="text-sm font-bold">No bookings found in this view</p>
                <p className="text-xs">Explore nearby parking spots on the map to reserve a space.</p>
              </div>
            ) : (
              filteredBookings.map((b) => {
                const targetListing = listings.find((l) => l.id === b.listingId);

                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-parkit-royal bg-blue-50 px-2 py-0.5 rounded">
                            {b.id}
                          </span>
                          {b.status === "confirmed" && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                              Active Booking
                            </span>
                          )}
                          {b.status === "completed" && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                              Completed
                            </span>
                          )}
                          {b.status === "cancelled" && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-700">
                              Cancelled
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-extrabold text-parkit-dark mt-1">
                          {b.listingTitle}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{b.address}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-black text-parkit-royal">₹{b.totalAmount}</span>
                        <p className="text-[10px] text-slate-400 font-medium">INR (Total Paid)</p>
                      </div>
                    </div>

                    {/* Booking Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Date</span>
                        <strong className="text-slate-800">{b.date}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Time Window</span>
                        <strong className="text-slate-800">
                          {b.startTime} - {b.endTime}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Vehicle Plate</span>
                        <strong className="text-slate-800">{b.vehicleNumber}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Gate PIN Code</span>
                        <strong className="text-parkit-royal font-mono font-black">{b.pinCode}</strong>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <div className="text-[11px] text-slate-500 font-medium">
                        Host: <strong>{b.ownerName}</strong> ({b.ownerPhone})
                      </div>

                      <div className="flex items-center gap-2">
                        {targetListing && (
                          <button
                            onClick={() => {
                              onClose();
                              setChatListing(targetListing);
                            }}
                            className="px-3 py-1.5 bg-blue-50 text-parkit-royal font-bold rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Contact Host</span>
                          </button>
                        )}

                        {b.status === "confirmed" && (
                          <button
                            onClick={() => setCancellingBookingId(b.id)}
                            className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold rounded-lg transition"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Cancel confirmation inline modal */}
                    {cancellingBookingId === b.id && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs text-rose-800">
                        <p className="font-bold flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          Are you sure you want to cancel this booking?
                        </p>
                        <p className="text-[11px] text-slate-600">
                          100% refund of ₹{b.totalAmount} will be returned to your test payment method.
                        </p>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => setCancellingBookingId(null)}
                            className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-600 font-bold"
                          >
                            Keep Booking
                          </button>
                          <button
                            onClick={() => handleConfirmCancel(b.id)}
                            className="px-2.5 py-1 bg-rose-600 text-white rounded-md font-bold hover:bg-rose-700"
                          >
                            Yes, Cancel Now
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
