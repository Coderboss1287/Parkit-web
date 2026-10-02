import React from "react";
import { motion } from "framer-motion";
import { Building2, Car, ArrowRight, ShieldCheck, IndianRupee, Sparkles, Navigation } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function PurposeSelection() {
  const { user, changeMode } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] via-[#EDF4FC] to-[#E2EEFC] flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      {/* Decorative Geometric Background Gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-parkit-sky/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-parkit-green/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-parkit-royal/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Logo */}
      <header className="relative z-10 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-premium p-2 flex items-center justify-center border border-slate-100">
            <img src="/parkit-icon.svg" alt="PARKIT" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black text-parkit-royal tracking-tight">PARK</span>
              <span className="text-2xl font-black text-parkit-sky tracking-tight">IT</span>
              <span className="w-2 h-2 rounded-full bg-parkit-green inline-block ml-0.5 animate-pulse" />
            </div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
              FIND IT • RENT IT • PARK IT
            </p>
          </div>
        </div>

        {/* User greeting */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-sm text-xs font-semibold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Signed in as <strong className="text-parkit-royal">{user?.name || "Demo User"}</strong></span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-5xl mx-auto w-full my-auto py-8">
        <div className="text-center mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-parkit-royal text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-parkit-sky" />
            Two-Sided Smart Parking Ecosystem
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-parkit-dark tracking-tight"
          >
            WHAT WOULD YOU LIKE <br className="hidden sm:inline" />
            TO DO TODAY?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-sm md:text-base max-w-xl mx-auto mt-3"
          >
            Select an action to launch your customized workspace. You can switch between Renter and Host modes anytime.
          </motion.p>
        </div>

        {/* The Two Main Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* CARD 1: GIVE TO RENT */}
          <motion.div
            whileHover={{ y: -8, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative bg-white rounded-3xl p-8 md:p-10 shadow-premium-lg border-2 border-transparent hover:border-parkit-green/60 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            onClick={() => changeMode("give_to_rent")}
          >
            {/* Ambient hover glow */}
            <div className="absolute top-0 right-0 w-56 h-56 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100/70 transition-colors pointer-events-none" />

            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6 border border-emerald-200">
                <IndianRupee className="w-3 h-3" />
                Monetize Idle Space
              </div>

              {/* Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-parkit-green text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-6 group-hover:rotate-3 transition-transform">
                <Building2 className="w-8 h-8" />
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-2xl md:text-3xl font-black text-parkit-dark tracking-tight mb-2 group-hover:text-emerald-700 transition-colors">
                GIVE TO RENT
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Have an empty parking space? Turn it into income. List driveways, society slots, corporate basements or private garages.
              </p>

              {/* Quick Perks */}
              <div className="space-y-2 mb-8 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Earn up to ₹25,000/month with zero hassle</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Set your own calendar, hourly rates & blocked hours</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-parkit-green hover:from-emerald-700 hover:to-emerald-500 text-white font-extrabold text-sm md:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 group-hover:shadow-emerald-600/40 transition-all"
            >
              <span>List Your Space</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* CARD 2: RENT IT */}
          <motion.div
            whileHover={{ y: -8, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative bg-white rounded-3xl p-8 md:p-10 shadow-premium-lg border-2 border-transparent hover:border-parkit-sky/60 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            onClick={() => changeMode("rent_it")}
          >
            {/* Ambient hover glow */}
            <div className="absolute top-0 right-0 w-56 h-56 bg-sky-50 rounded-full blur-2xl group-hover:bg-sky-100/70 transition-colors pointer-events-none" />

            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-parkit-royal text-xs font-bold uppercase tracking-wider mb-6 border border-blue-200">
                <Navigation className="w-3 h-3 text-parkit-sky" />
                Hexagonal Spatial Search
              </div>

              {/* Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-parkit-royal to-parkit-sky text-white flex items-center justify-center shadow-lg shadow-blue-500/25 mb-6 group-hover:-rotate-3 transition-transform">
                <Car className="w-8 h-8" />
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-2xl md:text-3xl font-black text-parkit-dark tracking-tight mb-2 group-hover:text-parkit-royal transition-colors">
                RENT IT
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Find your perfect parking spot nearby. Book guaranteed hourly, daily or monthly spaces in Mumbai, Navi Mumbai & Thane.
              </p>

              {/* Quick Perks */}
              <div className="space-y-2 mb-8 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-parkit-sky" />
                  <span>30% cheaper than commercial valets & traffic tickets</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-parkit-sky" />
                  <span>Pre-booking chat with owner & verified gate access</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-parkit-royal to-parkit-sky hover:from-[#064294] hover:to-[#2298d4] text-white font-extrabold text-sm md:text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 group-hover:shadow-blue-600/40 transition-all"
            >
              <span>Find Parking</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Explore Landing Page Link */}
        <div className="text-center mt-8">
          <button
            onClick={() => changeMode("landing")}
            className="text-xs font-bold text-slate-500 hover:text-parkit-royal transition underline underline-offset-4"
          >
            ← View PARKIT Landing Page & Product Overview
          </button>
        </div>
      </main>

      {/* Footer info */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full text-center text-xs text-slate-400">
        PARKIT © 2026 • Designed for seamless urban mobility across Mumbai Metropolitan Region
      </footer>
    </div>
  );
}
