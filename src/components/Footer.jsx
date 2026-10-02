import React from "react";
import { ShieldCheck, Mail, Phone, MapPin, IndianRupee, Heart } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Footer() {
  const { changeMode } = useApp();

  return (
    <footer className="bg-[#0C1A30] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 p-2 flex items-center justify-center border border-white/20">
                <img src="/parkit-icon.svg" alt="PARKIT" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-black text-white tracking-tight">PARK</span>
                  <span className="text-2xl font-black text-parkit-sky tracking-tight">IT</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-parkit-green inline-block ml-1 shadow-glow-green animate-pulse" />
                </div>
                <p className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-cyan-200">
                  FIND IT • RENT IT • PARK IT
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              India's first smart two-sided parking rental marketplace. We connect drivers seeking guaranteed spaces with verified homeowners, societies, and corporate complexes across Mumbai, Navi Mumbai, and Thane.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
                <IndianRupee className="w-3.5 h-3.5 text-parkit-green" />
                All Prices in Indian Rupees (₹ INR)
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">For Drivers</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => changeMode("rent_it")} className="hover:text-parkit-sky transition">
                  Find Parking Nearby
                </button>
              </li>
              <li>
                <button onClick={() => changeMode("rent_it")} className="hover:text-parkit-sky transition">
                  Mumbai Metro Station Lots
                </button>
              </li>
              <li>
                <button onClick={() => changeMode("rent_it")} className="hover:text-parkit-sky transition">
                  BKC Executive Bays
                </button>
              </li>
              <li>
                <button onClick={() => changeMode("rent_it")} className="hover:text-parkit-sky transition">
                  EV Charging Proximity Spots
                </button>
              </li>
            </ul>
          </div>

          {/* For Hosts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">For Property Owners</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => changeMode("give_to_rent")} className="hover:text-parkit-green transition">
                  List Your Space
                </button>
              </li>
              <li>
                <button onClick={() => changeMode("give_to_rent")} className="hover:text-parkit-green transition">
                  Host Earnings Calculator
                </button>
              </li>
              <li>
                <button onClick={() => changeMode("give_to_rent")} className="hover:text-parkit-green transition">
                  Society Visitor Bays
                </button>
              </li>
              <li>
                <button onClick={() => changeMode("give_to_rent")} className="hover:text-parkit-green transition">
                  Corporate Weekend Lots
                </button>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Coverage Hubs</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Bandra West & Carter Road</li>
              <li>Bandra Kurla Complex (BKC)</li>
              <li>Lower Parel & Worli</li>
              <li>Vashi & CBD Belapur</li>
              <li>Thane West & Ghodbunder</li>
              <li>Panvel Terminus Hub</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 PARKIT Technologies India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Security Safeguards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
