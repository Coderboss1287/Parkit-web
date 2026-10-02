import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Mail, User, ShieldCheck, Sparkles, KeyRound, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AuthModal({ isOpen, onClose, initialMode = "login" }) {
  const { login } = useApp();
  const [authMode, setAuthMode] = useState(initialMode); // 'login' | 'signup' | 'forgot'
  const [formData, setFormData] = useState({
    name: "Aarav Sharma",
    email: "aarav.sharma@mumbai.in",
    password: "••••••••"
  });
  const [showForgotSuccess, setShowForgotSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authMode === "forgot") {
      setShowForgotSuccess(true);
      setTimeout(() => {
        setShowForgotSuccess(false);
        setAuthMode("login");
      }, 2500);
      return;
    }

    login({
      name: formData.name || "Demo User",
      email: formData.email || "user@parkit.in"
    });
  };

  const handleDemoQuickLogin = (role) => {
    if (role === "renter") {
      login({
        name: "Vikram Malhotra (Renter)",
        email: "vikram.malhotra@gmail.com"
      });
    } else {
      login({
        name: "Rajesh Singhania (Owner)",
        email: "rajesh.singhania@bkcspaces.com"
      });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        >
          {/* Top Banner indicating prototype demo mode */}
          <div className="bg-gradient-to-r from-parkit-royal to-parkit-sky px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/parkit-icon.svg" alt="PARKIT" className="w-8 h-8 rounded-lg bg-white/10 p-1" />
                <span className="font-extrabold text-lg tracking-tight">PARKIT</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <p className="text-xs text-cyan-100 mt-2 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-parkit-green" />
              <span>Prototype Mode: Ready for Supabase Auth integration</span>
            </p>
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-black text-parkit-dark tracking-tight">
                {authMode === "forgot" ? "Reset Your Password" : "Welcome to PARKIT"}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {authMode === "login" && "Access your parking spots, bookings and earnings"}
                {authMode === "signup" && "Join India's premier parking marketplace in seconds"}
                {authMode === "forgot" && "Enter your email to receive a password reset link"}
              </p>
            </div>

            {/* Quick Demo Login Preset Buttons */}
            <div className="mb-6 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
                <span>Instant 1-Click Demo Login</span>
                <span className="text-parkit-royal font-semibold">Test Mode</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoQuickLogin("renter")}
                  className="py-2 px-3 text-xs font-semibold bg-white border border-slate-200 hover:border-parkit-sky hover:text-parkit-royal rounded-xl shadow-sm transition text-left flex flex-col"
                >
                  <span className="text-slate-800 font-bold">Driver / Renter</span>
                  <span className="text-[10px] text-slate-400">Vikram M.</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoQuickLogin("owner")}
                  className="py-2 px-3 text-xs font-semibold bg-white border border-slate-200 hover:border-parkit-green hover:text-emerald-700 rounded-xl shadow-sm transition text-left flex flex-col"
                >
                  <span className="text-slate-800 font-bold">Space Owner</span>
                  <span className="text-[10px] text-slate-400">Rajesh S.</span>
                </button>
              </div>
            </div>

            {showForgotSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-emerald-800 text-sm">
                <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                <p className="font-bold">Password Reset Email Sent!</p>
                <p className="text-xs text-emerald-600 mt-1">Check your inbox for the simulation link.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {authMode === "signup" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-parkit-sky focus:bg-white transition"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-parkit-sky focus:bg-white transition"
                    />
                  </div>
                </div>

                {authMode !== "forgot" && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Password
                      </label>
                      {authMode === "login" && (
                        <button
                          type="button"
                          onClick={() => setAuthMode("forgot")}
                          className="text-xs text-parkit-royal hover:underline font-semibold"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-parkit-sky focus:bg-white transition"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-parkit-royal to-parkit-sky hover:from-[#064294] hover:to-[#2298d4] text-white font-bold rounded-xl shadow-glow-royal transition active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {authMode === "login" && "Login to Account"}
                  {authMode === "signup" && "Create Free Account"}
                  {authMode === "forgot" && "Send Reset Link"}
                </button>
              </form>
            )}

            {/* Toggle Modes */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
              {authMode === "login" && (
                <p>
                  Don't have an account?{" "}
                  <button
                    onClick={() => setAuthMode("signup")}
                    className="text-parkit-royal font-bold hover:underline"
                  >
                    Sign Up Free
                  </button>
                </p>
              )}
              {authMode === "signup" && (
                <p>
                  Already have an account?{" "}
                  <button
                    onClick={() => setAuthMode("login")}
                    className="text-parkit-royal font-bold hover:underline"
                  >
                    Login here
                  </button>
                </p>
              )}
              {authMode === "forgot" && (
                <p>
                  Remembered your password?{" "}
                  <button
                    onClick={() => setAuthMode("login")}
                    className="text-parkit-royal font-bold hover:underline"
                  >
                    Back to Login
                  </button>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
