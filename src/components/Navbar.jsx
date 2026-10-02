import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Car,
  Building2,
  Calendar,
  Sparkles,
  User,
  LogOut,
  PlusCircle,
  Menu,
  X,
  Compass,
  Repeat,
  ShieldCheck,
  Bot
} from "lucide-react";

export default function Navbar() {
  const {
    user,
    isAuthenticated,
    activeMode,
    changeMode,
    setShowAuthModal,
    setAuthRedirectMode,
    logout,
    setShowMyBookings,
    setShowAddListing,
    setShowAIAssistant,
    bookings
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const activeBookingsCount = bookings.filter((b) => b.status === "confirmed").length;

  const handleSwitchMode = () => {
    if (activeMode === "rent_it") {
      changeMode("give_to_rent");
    } else if (activeMode === "give_to_rent") {
      changeMode("rent_it");
    } else {
      changeMode("purpose_select");
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <div
            onClick={() => changeMode("landing")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-parkit-royal to-parkit-sky p-0.5 shadow-md shadow-blue-500/15 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center p-1.5">
                <img src="/parkit-icon.svg" alt="PARKIT Logo" className="w-full h-full object-contain" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-parkit-royal tracking-tight">PARK</span>
                <span className="text-2xl font-black text-parkit-sky tracking-tight">IT</span>
                <span className="w-2.5 h-2.5 rounded-full bg-parkit-green inline-block shadow-glow-green ml-0.5 animate-pulse" />
              </div>
              <div className="text-[9.5px] font-extrabold tracking-[0.2em] uppercase text-slate-400 -mt-1 hidden sm:block">
                FIND IT <span className="text-parkit-green">•</span> RENT IT <span className="text-parkit-sky">•</span> PARK IT
              </div>
            </div>
          </div>

          {/* Center Navigation Links / Mode Indicators */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => changeMode("landing")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeMode === "landing"
                  ? "bg-white text-parkit-royal shadow-sm"
                  : "text-slate-600 hover:text-parkit-dark"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore</span>
            </button>

            <button
              onClick={() => changeMode("rent_it")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeMode === "rent_it"
                  ? "bg-gradient-to-r from-parkit-royal to-parkit-sky text-white shadow-sm"
                  : "text-slate-600 hover:text-parkit-royal"
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Rent It (Find Parking)</span>
            </button>

            <button
              onClick={() => changeMode("give_to_rent")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeMode === "give_to_rent"
                  ? "bg-gradient-to-r from-emerald-600 to-parkit-green text-white shadow-sm"
                  : "text-slate-600 hover:text-emerald-700"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Give to Rent (Host)</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Currency Pill */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <span>₹ INR</span>
            </div>

            {/* AI Assistant Button */}
            <button
              onClick={() => setShowAIAssistant(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
              title="Open PARKIT AI Assistant"
            >
              <Bot className="w-4 h-4 text-parkit-sky animate-bounce" />
              <span>PARKIT AI</span>
            </button>

            {/* Switch Mode Button */}
            <button
              onClick={handleSwitchMode}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
              title="Switch between Renter and Host mode"
            >
              <Repeat className="w-3.5 h-3.5 text-parkit-royal" />
              <span>Switch Mode</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* My Bookings Trigger */}
                <button
                  onClick={() => setShowMyBookings(true)}
                  className="relative px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-parkit-sky text-slate-700 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5 text-parkit-royal" />
                  <span>My Bookings</span>
                  {activeBookingsCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-parkit-sky text-white text-[10px] flex items-center justify-center font-extrabold shadow-sm">
                      {activeBookingsCount}
                    </span>
                  )}
                </button>

                {/* Host Quick Add Parking Space */}
                {activeMode === "give_to_rent" && (
                  <button
                    onClick={() => setShowAddListing(true)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-parkit-green text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 hover:opacity-95 transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Add Space</span>
                  </button>
                )}

                {/* User Profile Pill */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition text-xs font-bold text-slate-800"
                  >
                    <div className="w-6 h-6 rounded-full bg-parkit-royal text-white flex items-center justify-center text-[10px] font-black">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <span className="max-w-[100px] truncate">{user?.name?.split(" ")[0]}</span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setShowMyBookings(true);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4 text-slate-400" />
                        My Bookings
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          changeMode("purpose_select");
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Repeat className="w-4 h-4 text-slate-400" />
                        Change Purpose
                      </button>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthRedirectMode(activeMode);
                    setShowAuthModal(true);
                  }}
                  className="px-4 py-2 text-xs font-bold text-parkit-royal hover:bg-blue-50 rounded-xl transition"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setAuthRedirectMode(activeMode);
                    setShowAuthModal(true);
                  }}
                  className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-parkit-royal to-parkit-sky text-white rounded-xl shadow-md shadow-blue-500/20 hover:opacity-95 transition"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setShowAIAssistant(true)}
              className="p-2 rounded-xl bg-blue-50 text-parkit-royal"
            >
              <Bot className="w-5 h-5 text-parkit-sky" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                changeMode("rent_it");
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 bg-blue-50 text-parkit-royal font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
            >
              <Car className="w-4 h-4" />
              Rent It
            </button>
            <button
              onClick={() => {
                changeMode("give_to_rent");
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              Give to Rent
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                changeMode("purpose_select");
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 text-sm font-semibold text-slate-700 flex items-center gap-2"
            >
              <Repeat className="w-4 h-4 text-slate-400" />
              Switch Mode / Purpose
            </button>
            <button
              onClick={() => {
                setShowMyBookings(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 text-sm font-semibold text-slate-700 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-slate-400" />
              My Bookings ({activeBookingsCount})
            </button>
          </div>

          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Logged in: {user?.name}</span>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-rose-600 font-bold"
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setShowAuthModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-parkit-royal text-white font-bold text-sm rounded-xl"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
