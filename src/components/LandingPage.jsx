import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Car,
  Building2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  IndianRupee,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Navigation,
  Bot,
  Zap,
  Lock,
  Layers
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { PARKING_CATEGORIES, LOCALITIES_MUMBAI } from "../data/categories";

const FAQ_ITEMS = [
  {
    q: "How does the Hexagonal Parking Search work?",
    a: "PARKIT uses the Uber H3 hexagonal spatial indexing system. When you search, the engine checks Ring 0 (your immediate 50m zone), expanding outward into Ring 1 (6 surrounding hexagons), Ring 2 (12 hexagons), and Ring 3 (18 hexagons) to locate the closest available, verified spot."
  },
  {
    q: "Can I chat with the parking space owner before booking?",
    a: "Yes! Every listing features in-app pre-booking chat and masked phone calling. You can verify gate clearances, SUV compatibility, and security protocols directly with the owner before paying."
  },
  {
    q: "How do owners receive payouts?",
    a: "PARKIT charges a standard 12% platform fee covering insurance and transaction fees. The remaining 88% is automatically credited to the owner's bank account or UPI ID upon guest check-in."
  },
  {
    q: "What prevents double-booking for the same parking space?",
    a: "PARKIT features real-time slot conflict prevention. Once a time slot is reserved and confirmed, it is locked in the registry and cannot be booked by any other driver."
  },
  {
    q: "What if I need to cancel my parking booking?",
    a: "Bookings can be cancelled anytime before the start time directly from the My Bookings page with instant refund simulation."
  }
];

export default function LandingPage() {
  const { changeMode, setShowAIAssistant } = useApp();

  const [locality, setLocality] = useState("BKC (Bandra Kurla Complex), Mumbai");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("13:00");
  const [openFaq, setOpenFaq] = useState(0);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    changeMode("rent_it");
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] overflow-x-hidden">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#EDF5FD] via-[#F4F8FC] to-[#F7FAFC]">
        {/* Animated Background Geometric Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-parkit-sky/20 to-parkit-royal/10 rounded-full blur-3xl pointer-events-none -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-parkit-green/15 rounded-full blur-3xl pointer-events-none -ml-36" />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            {/* Animated Tagline Pill */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm text-xs font-bold text-parkit-royal uppercase tracking-wider mb-5"
            >
              <span className="w-2 h-2 rounded-full bg-parkit-green animate-ping" />
              <span>FIND IT • RENT IT • PARK IT</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black text-parkit-dark tracking-tight leading-[1.1]"
            >
              Your Space. Your Spot. <br />
              <span className="bg-gradient-to-r from-parkit-royal via-parkit-sky to-parkit-green bg-clip-text text-transparent">
                Your PARKIT.
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-base sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto"
            >
              Find parking nearby or turn your empty parking space into income. Guaranteed reservations across Mumbai, Navi Mumbai, and Thane.
            </motion.p>

            {/* Dual CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 mt-8"
            >
              <button
                onClick={() => changeMode("rent_it")}
                className="px-8 py-4 bg-gradient-to-r from-parkit-royal to-parkit-sky hover:from-[#064294] hover:to-[#2298d4] text-white font-extrabold text-base rounded-2xl shadow-glow-royal hover:scale-105 active:scale-95 transition flex items-center gap-2.5"
              >
                <Car className="w-5 h-5" />
                <span>Find Parking</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => changeMode("give_to_rent")}
                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-base rounded-2xl border-2 border-slate-200 hover:border-parkit-green shadow-sm hover:scale-105 active:scale-95 transition flex items-center gap-2.5"
              >
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>List Your Space</span>
              </button>
            </motion.div>
          </div>

          {/* Location & Time Search Bar Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="max-w-4xl mx-auto bg-white rounded-3xl p-4 sm:p-6 shadow-premium-lg border border-slate-200/90"
          >
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-parkit-royal" />
                  Select City / Locality
                </label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-parkit-sky focus:bg-white"
                >
                  {LOCALITIES_MUMBAI.map((loc) => (
                    <option key={loc.name} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-parkit-royal" />
                  Parking Date
                </label>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-parkit-royal" />
                  Start & End Hours
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-1/2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  />
                  <span className="text-slate-400 text-xs">-</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-1/2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-parkit-royal to-parkit-sky hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Parking</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* 2. 8 PARKING CATEGORIES SHOWCASE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-parkit-royal uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            SELECT PARKING TYPE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-parkit-dark mt-2 tracking-tight">
            Comprehensive Space Categories
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto mt-2">
            Every category has verified availability rules, base pricing starting points, and distinct security measures.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PARKING_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => changeMode("rent_it")}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-premium hover:shadow-premium-lg hover:border-parkit-sky transition duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-parkit-royal flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-parkit-royal group-hover:text-white transition-all">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-parkit-dark group-hover:text-parkit-royal transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                <span className="text-xs font-black text-parkit-royal">
                  Base ~₹{cat.baseHourlyPrice}/hr
                </span>
                <span className="text-xs font-bold text-slate-400 group-hover:text-parkit-sky transition flex items-center gap-1">
                  View Spots <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW PARKIT WORKS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-parkit-dark mt-2 tracking-tight">
              How PARKIT Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* For Drivers */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-parkit-royal text-white flex items-center justify-center font-black">
                  <Car className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-parkit-dark">For Drivers (Rent It)</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-parkit-sky text-white flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-parkit-dark">Search Hexagonal Grid</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select your Mumbai locality or use GPS. The H3 radar expands concentric rings to find the nearest space.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-parkit-sky text-white flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-parkit-dark">Pre-Booking Chat with Owner</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Confirm vehicle clearances, gate numbers, and entry protocols before paying a single rupee.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-parkit-sky text-white flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-parkit-dark">Instant Gate Pass & Park</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Receive your 4-digit PIN code and digital QR pass. Show it to gate security for zero-friction access.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Space Owners */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-parkit-dark">For Space Owners (Give to Rent)</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-parkit-dark">List Your Idle Parking Bay</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Input your address, upload images, specify vehicle sizes, and toggle amenities like EV chargers or CCTV.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-parkit-dark">AI Suggested Price & Calendar</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Our dynamic pricing engine factors in your category, locality, and peak demand to recommend maximum earnings.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-parkit-dark">Automatic 88% Direct Payouts</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Earnings are transferred directly to your bank account after guest check-in without hassle.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VALUE COMPARISON / BENEFITS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-parkit-royal uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Why Choose PARKIT?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-parkit-dark tracking-tight">
              Eliminating Mumbai's Parking Anxiety
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Drivers in Mumbai spend an average of 24 minutes searching for parking near corporate hubs, malls, and hospitals. PARKIT transforms idle residential driveways and office bays into a seamless urban grid.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700">
                  Guaranteed reserved bay with zero chance of parking towing or traffic fines
                </span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700">
                  Save up to 40% compared to luxury valet parking charges in South Mumbai & BKC
                </span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-700">
                  24/7 security guard integration and digital QR gate verification
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Earning Highlight Card */}
          <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-5">
              <span className="px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold uppercase tracking-wider border border-white/20">
                Host Revenue Potential
              </span>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
                Turn That Empty Bay Into Up to ₹25,000 / Month
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Whether you have an empty society visitor slot during office hours, or an office space open on weekends, monetize it safely with verified community drivers.
              </p>

              <div className="pt-4">
                <button
                  onClick={() => changeMode("give_to_rent")}
                  className="px-6 py-3.5 bg-white text-emerald-900 font-extrabold text-sm rounded-xl shadow-lg hover:bg-emerald-50 transition active:scale-95"
                >
                  Start Listing Free →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-parkit-dark mt-1 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full text-left p-5 text-sm font-bold text-parkit-dark flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openFaq === idx ? "rotate-180 text-parkit-royal" : ""
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
