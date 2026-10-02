import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Car, ShieldCheck, ArrowRight } from "lucide-react";

export default function CinematicIntro({ onComplete }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 600);
    const timer2 = setTimeout(() => setStep(2), 1400);
    const timer3 = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0C1A30] via-[#0752B5] to-[#0A2540] overflow-hidden text-white">
      {/* Dynamic Geometric Background Grid */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(53, 181, 246, 0.4) 2px, transparent 0)`,
            backgroundSize: "50px 50px"
          }}
        />
      </div>

      {/* Floating Animated Hexagonal Rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute w-[600px] h-[600px] border border-cyan-400/20 rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute w-[800px] h-[800px] border border-emerald-400/15 rounded-full pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
        {/* Animated Pin Drop into Hexagon Shield */}
        <div className="relative mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -45, y: -80 }}
            animate={{ scale: 1, rotate: 0, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 0.8
            }}
            className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#0752B5] via-[#35B5F6] to-[#75D84C] p-1 shadow-glow-sky relative flex items-center justify-center"
          >
            <div className="w-full h-full bg-[#0C1A30] rounded-[22px] flex items-center justify-center relative overflow-hidden">
              <img
                src="/parkit-icon.svg"
                alt="PARKIT Icon"
                className="w-16 h-16 object-contain filter drop-shadow-[0_4px_12px_rgba(53,181,246,0.6)]"
              />
              <motion.div
                animate={{ scale: [1, 1.8, 2.2], opacity: [0.7, 0.3, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl bg-cyan-400/20 pointer-events-none"
              />
            </div>
          </motion.div>
        </div>

        {/* Wordmark Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex items-center gap-1 text-5xl md:text-6xl font-black tracking-tight"
        >
          <span className="text-white">PARK</span>
          <span className="text-parkit-sky">IT</span>
          <span className="w-3.5 h-3.5 rounded-full bg-parkit-green inline-block shadow-glow-green animate-pulse ml-1" />
        </motion.div>

        {/* Tagline Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-3 flex items-center gap-2 text-sm md:text-base font-bold tracking-[0.25em] text-cyan-200/90 uppercase"
        >
          <span>FIND IT</span>
          <span className="text-parkit-green">•</span>
          <span>RENT IT</span>
          <span className="text-parkit-sky">•</span>
          <span>PARK IT</span>
        </motion.div>

        {/* Dynamic Status Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-8 flex items-center gap-2 text-xs text-slate-300 font-medium bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/15"
        >
          <span className="w-2 h-2 rounded-full bg-parkit-green animate-ping" />
          <span>
            {step === 0 && "Initializing Mumbai spatial grid..."}
            {step === 1 && "Indexing verified parking bays..."}
            {step === 2 && "Welcome to India's parking marketplace"}
          </span>
        </motion.div>

        {/* Quick Skip button */}
        <button
          onClick={onComplete}
          className="mt-6 text-xs text-white/60 hover:text-white transition flex items-center gap-1 underline underline-offset-4"
        >
          Skip Intro <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
