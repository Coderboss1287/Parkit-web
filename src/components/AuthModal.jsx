import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { useApp } from "../context/AppContext";
import ParkitLogo from "./ParkitLogo";

export default function AuthModal({ isOpen, onClose, initialMode }) {
  const { login, signup, authInitialMode } = useApp();
  
  // Default to 'signup' as primary option
  const [authMode, setAuthMode] = useState("signup"); // 'signup' | 'login' | 'forgot'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotSuccess, setShowForgotSuccess] = useState(false);

  // Sync mode with props / context when opened
  useEffect(() => {
    if (isOpen) {
      setAuthMode(initialMode || authInitialMode || "signup");
      setErrorMessage("");
      setSuccessMessage("");
      setIsSubmitting(false);
    }
  }, [isOpen, initialMode, authInitialMode]);

  if (!isOpen) return null;

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;
  const passwordsDiffer =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  const validateEmail = (email) => {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (authMode === "forgot") {
      if (!validateEmail(formData.email)) {
        setErrorMessage("Please enter a valid email address.");
        return;
      }
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
      if (!validateEmail(formData.email)) {
        setErrorMessage("Please enter a valid email address.");
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
    } else {
      // login mode
      if (!validateEmail(formData.email)) {
        setErrorMessage("Please enter a valid email address.");
        return;
      }
      if (!formData.password) {
        setErrorMessage("Password is required to log in.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (authMode === "signup") {
        const user = await signup({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone?.trim() || null,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });
        setSuccessMessage(`Account created successfully! Welcome to PARKIT, ${user.name}.`);
      } else {
        await login({
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        });
      }
    } catch (err) {
      setErrorMessage(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-parkit-royal to-parkit-sky px-5 sm:px-6 py-4 text-white flex-shrink-0">
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
                aria-label="Close modal"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <p className="text-xs text-cyan-100 mt-1.5 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-parkit-green" />
              <span>Verified Account Authentication</span>
            </p>
          </div>

          <div className="p-5 sm:p-7 overflow-y-auto">
            <div className="mb-5 text-center">
              <h2 className="text-xl sm:text-2xl font-black text-parkit-dark tracking-tight">
                {authMode === "forgot"
                  ? "Reset Your Password"
                  : authMode === "signup"
                  ? "Create Your Account"
                  : "Welcome to PARKIT"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {authMode === "signup" && "New users must sign up before logging in"}
                {authMode === "login" && "Enter your registered email and password to log in to your account"}
                {authMode === "forgot" && "Enter your registered email to receive a password reset link"}
              </p>
            </div>

            {/* Error Banner with helpful action link */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">
                  <span className="font-semibold">{errorMessage}</span>
                  {errorMessage.includes("Account not found") && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("signup");
                        setErrorMessage("");
                      }}
                      className="block mt-1 font-bold text-parkit-royal hover:underline"
                    >
                      Click here to sign up for a new account →
                    </button>
                  )}
                  {errorMessage.includes("already registered") && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("login");
                        setErrorMessage("");
                      }}
                      className="block mt-1 font-bold text-parkit-royal hover:underline"
                    >
                      Click here to log in instead →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Success Banner */}
            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-semibold">{successMessage}</span>
              </div>
            )}

            {showForgotSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-emerald-800 text-sm">
                <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                <p className="font-bold">Password Reset Instructions Sent</p>
                <p className="text-xs text-emerald-600 mt-1">If this email is registered, you will receive a reset link shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* 1. Full Name (Sign Up only) */}
                {authMode === "signup" && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errorMessage) setErrorMessage("");
                        }}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-parkit-sky focus:bg-white transition disabled:opacity-60"
                      />
                    </div>
                  </div>
                )}

                {/* 2. Email Address */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      disabled={isSubmitting}
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errorMessage) setErrorMessage("");
                      }}
                      placeholder="yourname@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-parkit-sky focus:bg-white transition disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* 3. Mobile Number (Sign Up only) */}
                {authMode === "signup" && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Mobile Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        disabled={isSubmitting}
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errorMessage) setErrorMessage("");
                        }}
                        placeholder="+91 98200 00000"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-parkit-sky focus:bg-white transition disabled:opacity-60"
                      />
                    </div>
                  </div>
                )}

                {/* 4. Password */}
                {authMode !== "forgot" && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Password <span className="text-rose-500">*</span>
                      </label>
                      {authMode === "login" && (
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode("forgot");
                            setErrorMessage("");
                          }}
                          className="text-[11px] text-parkit-royal hover:underline font-semibold"
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
                        disabled={isSubmitting}
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({ ...formData, password: e.target.value });
                          if (errorMessage) setErrorMessage("");
                        }}
                        placeholder="•••••••• (min 6 characters)"
                        className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-parkit-sky focus:bg-white transition disabled:opacity-60"
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

                {/* 5. Confirm Password (Sign Up only) */}
                {authMode === "signup" && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Confirm Password <span className="text-rose-500">*</span>
                      </label>
                      {passwordsMatch && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Match
                        </span>
                      )}
                      {passwordsDiffer && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-rose-600" /> Mismatch
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        minLength={6}
                        disabled={isSubmitting}
                        value={formData.confirmPassword}
                        onChange={(e) => {
                          setFormData({ ...formData, confirmPassword: e.target.value });
                          if (errorMessage) setErrorMessage("");
                        }}
                        placeholder="Re-enter password"
                        className={`w-full pl-10 pr-11 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:bg-white transition disabled:opacity-60 ${
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
                  className="w-full py-3 bg-gradient-to-r from-parkit-royal to-parkit-sky hover:from-[#064294] hover:to-[#2298d4] text-white font-bold rounded-xl shadow-glow-royal transition active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 mt-2 text-xs sm:text-sm"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : null}
                  {authMode === "signup" && "Create Free Account"}
                  {authMode === "login" && "Login to Account"}
                  {authMode === "forgot" && "Send Reset Link"}
                  {!isSubmitting && <ArrowRight className="w-4 h-4 ml-0.5" />}
                </button>
              </form>
            )}

            {/* Toggle Modes Footer */}
            <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              {authMode === "signup" && (
                <p>
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className="text-parkit-royal font-bold hover:underline"
                  >
                    Log in here
                  </button>
                </p>
              )}
              {authMode === "login" && (
                <p>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("signup");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className="text-parkit-royal font-bold hover:underline ml-1"
                  >
                    Sign Up Free
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
                      setSuccessMessage("");
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
