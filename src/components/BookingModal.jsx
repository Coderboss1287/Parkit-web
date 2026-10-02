import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  X,
  Calendar,
  Clock,
  Car,
  ShieldCheck,
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Download,
  Navigation,
  FileCheck
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { calculateRentalTotals } from "../utils/pricingEngine";
import { VEHICLE_TYPES } from "../data/categories";

export default function BookingModal({ isOpen, onClose, listing }) {
  const { user, createBooking, hasBookingConflict, setShowMyBookings } = useApp();

  const [date, setDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [startTime, setStartTime] = useState("10:00");
  const [durationHours, setDurationHours] = useState(2);
  const [rentalType, setRentalType] = useState("hourly"); // 'hourly' | 'daily' | 'monthly'
  const [vehicleType, setVehicleType] = useState("four_wheeler");
  const [vehicleNumber, setVehicleNumber] = useState("MH 02 CZ 4421");
  const [paymentMethod, setPaymentMethod] = useState("upi"); // 'upi' | 'card' | 'qr'
  const [paymentStep, setPaymentStep] = useState("checkout"); // 'checkout' | 'processing' | 'confirmed'
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [conflictError, setConflictError] = useState("");

  if (!isOpen || !listing) return null;

  // Calculate End Time
  const startHour = parseInt(startTime.split(":")[0], 10);
  const startMin = startTime.split(":")[1];
  const endHour = Math.min(23, startHour + Math.ceil(durationHours));
  const endTime = `${endHour.toString().padStart(2, "0")}:${startMin}`;

  // Pricing calculation
  let effectiveHourly = listing.hourlyPrice;
  const vehicleObj = VEHICLE_TYPES.find((v) => v.id === vehicleType);
  if (vehicleObj) {
    effectiveHourly = Math.round(listing.hourlyPrice * vehicleObj.multiplier);
  }

  let rentalBreakdown;
  if (rentalType === "daily" && listing.dailyPrice) {
    const rent = listing.dailyPrice;
    const fee = Math.round(rent * 0.12);
    rentalBreakdown = {
      rentalAmount: rent,
      platformFee: fee,
      totalPayable: rent + fee,
      ownerEarnings: rent - fee
    };
  } else if (rentalType === "monthly" && listing.monthlyPrice) {
    const rent = listing.monthlyPrice;
    const fee = Math.round(rent * 0.12);
    rentalBreakdown = {
      rentalAmount: rent,
      platformFee: fee,
      totalPayable: rent + fee,
      ownerEarnings: rent - fee
    };
  } else {
    rentalBreakdown = calculateRentalTotals(effectiveHourly, durationHours);
  }

  const handlePayAndConfirm = (e) => {
    e.preventDefault();
    setConflictError("");

    // Conflict check
    if (hasBookingConflict(listing.id, date, startTime, endTime)) {
      setConflictError(
        "Double-booking prevented: This slot is already booked by another driver for this time window. Please pick another time slot."
      );
      return;
    }

    setPaymentStep("processing");

    // Simulate Razorpay test mode payment processing
    setTimeout(() => {
      try {
        const booking = createBooking({
          listingId: listing.id,
          listingTitle: listing.title,
          category: listing.category,
          address: listing.address,
          date,
          startTime,
          endTime,
          durationHours: rentalType === "daily" ? 24 : rentalType === "monthly" ? 720 : durationHours,
          hourlyRate: effectiveHourly,
          rentalAmount: rentalBreakdown.rentalAmount,
          platformFee: rentalBreakdown.platformFee,
          totalAmount: rentalBreakdown.totalPayable,
          ownerEarnings: rentalBreakdown.ownerEarnings,
          vehicleType,
          vehicleNumber,
          ownerName: listing.owner.name,
          ownerPhone: listing.owner.maskedPhone
        });

        setConfirmedBooking(booking);
        setPaymentStep("confirmed");

        // Fire celebratory confetti!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        setConflictError(err.message);
        setPaymentStep("checkout");
      }
    }, 1400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-parkit-royal to-parkit-sky px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/parkit-icon.svg" alt="PARKIT" className="w-8 h-8 rounded-lg bg-white/10 p-1" />
              <div>
                <h3 className="font-extrabold text-sm tracking-tight">
                  {paymentStep === "confirmed" ? "Booking Confirmed" : "Transparent Checkout"}
                </h3>
                <p className="text-[11px] text-cyan-100">
                  {paymentStep === "confirmed" ? "Voucher Pass Ready" : "Guaranteed Reserved Spot"}
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

          <div className="overflow-y-auto p-6 space-y-5">
            {paymentStep === "checkout" && (
              <form onSubmit={handlePayAndConfirm} className="space-y-4">
                {/* Spot summary snippet */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                  <img
                    src={listing.image}
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-extrabold uppercase text-parkit-royal bg-blue-50 px-2 py-0.5 rounded">
                      {listing.category}
                    </span>
                    <h4 className="text-sm font-bold text-parkit-dark truncate mt-0.5">
                      {listing.title}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">{listing.address}</p>
                  </div>
                </div>

                {conflictError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                    <span>{conflictError}</span>
                  </div>
                )}

                {/* Rental Type Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Rental Duration Mode
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRentalType("hourly")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                        rentalType === "hourly"
                          ? "bg-parkit-royal text-white border-parkit-royal shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      Hourly
                    </button>
                    {listing.dailyPrice && (
                      <button
                        type="button"
                        onClick={() => setRentalType("daily")}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                          rentalType === "daily"
                            ? "bg-parkit-royal text-white border-parkit-royal shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        Full Day (₹{listing.dailyPrice})
                      </button>
                    )}
                    {listing.monthlyPrice && (
                      <button
                        type="button"
                        onClick={() => setRentalType("monthly")}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                          rentalType === "monthly"
                            ? "bg-parkit-royal text-white border-parkit-royal shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        Monthly (₹{listing.monthlyPrice})
                      </button>
                    )}
                  </div>
                </div>

                {/* Date & Time Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Booking Date
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>

                {/* Duration Picker for Hourly */}
                {rentalType === "hourly" && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Duration (Hours)
                      </label>
                      <span className="text-xs font-bold text-parkit-royal">
                        {durationHours} hour(s) • Ends at {endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {[0.5, 1, 2, 3, 4, 6, 8].map((hrs) => (
                        <button
                          key={hrs}
                          type="button"
                          onClick={() => setDurationHours(hrs)}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                            durationHours === hrs
                              ? "bg-blue-50 border-parkit-sky text-parkit-royal ring-2 ring-blue-200"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {hrs === 0.5 ? "30m" : `${hrs}h`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vehicle Selection & License Plate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Vehicle Type
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                    >
                      {VEHICLE_TYPES.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Vehicle Number Plate
                    </label>
                    <input
                      type="text"
                      required
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                      placeholder="MH 02 CZ 4421"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 uppercase"
                    />
                  </div>
                </div>

                {/* Razorpay Test Mode Payment Simulator Options */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Payment Gateway (Razorpay Sandbox)
                    </label>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ⚡ Test Mode Active
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("upi")}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                        paymentMethod === "upi"
                          ? "bg-blue-50 border-parkit-sky text-parkit-royal ring-2 ring-blue-200"
                          : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-parkit-sky" />
                      <span>UPI / GPay / PhonePe</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                        paymentMethod === "card"
                          ? "bg-blue-50 border-parkit-sky text-parkit-royal ring-2 ring-blue-200"
                          : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-parkit-royal" />
                      <span>Debit / Credit Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("qr")}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                        paymentMethod === "qr"
                          ? "bg-blue-50 border-parkit-sky text-parkit-royal ring-2 ring-blue-200"
                          : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      <span>Instant Scan QR</span>
                    </button>
                  </div>
                </div>

                {/* Transparent Financial Breakdown */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Transparent Price Summary
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>
                      Parking Rental ({rentalType === "hourly" ? `${durationHours}h × ₹${effectiveHourly}` : rentalType})
                    </span>
                    <span className="font-bold text-slate-800">₹{rentalBreakdown.rentalAmount}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>PARKIT Platform Commission (12%)</span>
                    <span className="font-bold text-slate-800">₹{rentalBreakdown.platformFee}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                    <span className="font-black text-parkit-dark">Total Amount Payable</span>
                    <span className="text-xl font-black text-parkit-royal">₹{rentalBreakdown.totalPayable}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 italic pt-1">
                    *Owner payout: ₹{rentalBreakdown.ownerEarnings} (88% transferred upon check-in)
                  </p>
                </div>

                {/* Submit Checkout Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-parkit-green hover:opacity-95 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/25 transition active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm & Pay ₹{rentalBreakdown.totalPayable}</span>
                </button>
              </form>
            )}

            {paymentStep === "processing" && (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full border-4 border-parkit-sky border-t-transparent animate-spin mx-auto" />
                <h3 className="text-lg font-black text-parkit-dark">
                  Processing Razorpay Test Payment...
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Authorizing transaction of ₹{rentalBreakdown.totalPayable} and reserving your parking bay in the spatial registry.
                </p>
              </div>
            )}

            {paymentStep === "confirmed" && confirmedBooking && (
              <div className="space-y-5 animate-fadeIn">
                {/* Success Card */}
                <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-emerald-950">Parking Space Reserved!</h3>
                  <p className="text-xs text-emerald-700 mt-1">
                    Booking ID: <strong className="font-mono text-sm">{confirmedBooking.id}</strong>
                  </p>
                </div>

                {/* Digital Gate Pass Voucher */}
                <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-5 space-y-4 relative">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        Gate Verification PIN
                      </span>
                      <div className="text-2xl font-black font-mono tracking-widest text-parkit-royal">
                        {confirmedBooking.pinCode}
                      </div>
                    </div>
                    {/* Simulated QR Code */}
                    <div className="w-16 h-16 bg-slate-100 rounded-xl p-1.5 border border-slate-200 flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-slate-800" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Date & Time</span>
                      <strong className="text-slate-800">
                        {confirmedBooking.date} • {confirmedBooking.startTime} – {confirmedBooking.endTime}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Vehicle</span>
                      <strong className="text-slate-800">{confirmedBooking.vehicleNumber}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Address</span>
                      <strong className="text-slate-800 line-clamp-1">{confirmedBooking.address}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Paid</span>
                      <strong className="text-emerald-700">₹{confirmedBooking.totalAmount} (Confirmed)</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-2xl text-[11px] text-slate-700 space-y-1">
                    <strong>Access Instructions:</strong>
                    <p className="text-slate-600">
                      Show this 4-digit PIN ({confirmedBooking.pinCode}) or QR scan to the gate security guard upon arrival. Entry boom barrier will open automatically.
                    </p>
                  </div>
                </div>

                {/* Bottom confirmation actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      onClose();
                      setShowMyBookings(true);
                    }}
                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <FileCheck className="w-4 h-4 text-slate-500" />
                    <span>View in My Bookings</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="py-3 px-4 bg-parkit-royal hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Done</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
