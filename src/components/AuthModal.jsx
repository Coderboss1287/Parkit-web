import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2
} from "lucide-react";
import { useApp } from "../context/AppContext";
import ParkitLogo from "./ParkitLogo";

export default function AuthModal({ isOpen, onClose, initialMode = "login" }) {
  const { login } = useApp();
  const [authMode, setAuthMode] = useState(initialMode); // 'login' | 'signup' | 'forgot'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotSuccess, setShowForgotSuccess] = useState(false);

  if (!isOpen) return null;

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;
  const passwordsDiffer =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (authMode === "forgot") {
      setShowForgotSuccess(true);
      setTimeout(() => {
        setShowForgotSuccess(false);
        setAuthMode("login");
      }, 2500);
      return;
    }

    if (authMode === "signup") {
      if (!formData.name?.trim()) {
        setErrorMessage("Please enter your full name.");
        return;
      }
      if (formData.password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Passwords do not match. Please ensure both fields are identical.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await login({
        name: formData.name || (authMode === "signup" ? "New User" : "Demo User"),
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        authMode
      });
    } catch (err) {
      setErrorMessage(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoQuickLogin = (role) => {
    setErrorMessage("");
    if (role === "renter") {
      login({
        name: "Vikram Malhotra (Renter)",
        email: "vikram.malhotra@gmail.com",
        password: "password123",
        authMode: "login"
      });
    } else {
      login({
        name: "Rajesh Singhania (Owner)",
        email: "rajesh.singhania@bkcspaces.com",
        password: "password123",
        authMode: "login"
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
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-parkit-royal to-parkit-sky px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 p-1 flex items-center justify-center">
                  <ParkitLogo className="w-full h-full object-contain" />
                </div>
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
              <span>ATLAS MAPS & SQLite Secured Authentication</span>
            </p>
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-black text-parkit-dark tracking-tight">
                {authMode === "forgot"
                  ? "Reset Your Password"
                  : authMode === "signup"
                  ? "Create Your Account"
                  : "Welcome to PARKIT"}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {authMode === "login" && "Access your parking spots, bookings and earnings"}
                {authMode === "signup" && "Join India's premier parking marketplace in seconds"}
                {authMode === "forgot" && "Enter your email to receive a password reset link"}
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{errorMessage}</span>
              </div>
            )}

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
                {/* 1. Full Name (Sign Up only) */}
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
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errorMessage) setErrorMessage("");
                        }}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-parkit-sky focus:bg-white transition"
                      />
                    </div>
                  </div>
                )}

                {/* 2. Gmail / Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {authMode === "signup" ? "Gmail / Email Address" : "Email Address"}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errorMessage) setErrorMessage("");
                      }}
                      placeholder="yourname@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-parkit-sky focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* 3. Password */}
                {authMode !== "forgot" && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Password
                      </label>
                      {authMode === "login" && (
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode("forgot");
                            setErrorMessage("");
                          }}
                          className="text-xs text-parkit-royal hover:underline font-semibold"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({ ...formData, password: e.target.value });
                          if (errorMessage) setErrorMessage("");
                        }}
                        placeholder="•••••••• (min 6 chars)"
                        className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-parkit-sky focus:bg-white transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. Confirm Password (Sign Up only) with Live Match Feedback */}
                {authMode === "signup" && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Confirm Password
                      </label>
                      {/* Live visual feedback badge */}
                      {passwordsMatch && (
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 animate-fade-in">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Passwords Match
                        </span>
                      )}
                      {passwordsDiffer && (
                        <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1 animate-fade-in">
                          <AlertCircle className="w-3 h-3 text-rose-600" /> Passwords Do Not Match
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={formData.confirmPassword}
                        onChange={(e) => {
                          setFormData({ ...formData, confirmPassword: e.target.value });
                          if (errorMessage) setErrorMessage("");
                        }}
                        placeholder="Re-enter password"
                        className={`w-full pl-10 pr-11 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white transition ${
                          passwordsDiffer
                            ? "border-rose-300 focus:ring-rose-400"
                            : passwordsMatch
                            ? "border-emerald-300 focus:ring-emerald-400"
                            : "border-slate-200 focus:ring-parkit-sky"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-parkit-royal to-parkit-sky hover:from-[#064294] hover:to-[#2298d4] text-white font-bold rounded-xl shadow-glow-royal transition active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : null}
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
                    onClick={() => {
                      setAuthMode("signup");
                      setErrorMessage("");
                    }}
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
                    onClick={() => {
                      setAuthMode("login");
                      setErrorMessage("");
                    }}
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
                    onClick={() => {
                      setAuthMode("login");
                      setErrorMessage("");
                    }}
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
