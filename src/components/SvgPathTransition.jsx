import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Animated SVG Path Effect inspired by the user's reference video.
 * Features an organic morphing SVG curve wave that slides across the screen on page/mode change.
 */
export default function SvgPathTransition({ isActive }) {
  const curveVariants = {
    initial: {
      d: "M 0 0 V 100 Q 50 100 100 100 V 0 Z",
      y: "-100%"
    },
    enter: {
      d: "M 0 0 V 100 Q 50 160 100 100 V 0 Z",
      y: "0%",
      transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] }
    },
    exit: {
      d: "M 0 0 V 100 Q 50 40 100 100 V 0 Z",
      y: "100%",
      transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: 0.1 }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key="svg-path-transition"
          className="svg-transition-overlay flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            className="w-full h-full absolute inset-0 preserve-3d"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0752B5" />
                <stop offset="60%" stopColor="#35B5F6" />
                <stop offset="100%" stopColor="#75D84C" />
              </linearGradient>
            </defs>
            <motion.path
              fill="url(#waveGradient)"
              variants={curveVariants}
              initial="initial"
              animate="enter"
              exit="exit"
            />
          </svg>

          {/* Centered cinematic branding reveal while wave sweeps */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center justify-center text-white"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md p-3 shadow-2xl flex items-center justify-center border border-white/30 mb-3">
              <img src="/parkit-icon.svg" alt="PARKIT" className="w-full h-full object-contain filter drop-shadow-md" />
            </div>
            <div className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
              <span>PARK</span>
              <span className="text-parkit-sky">IT</span>
              <span className="w-2 h-2 rounded-full bg-parkit-green inline-block animate-pulse"></span>
            </div>
            <p className="text-xs font-semibold tracking-widest uppercase text-white/80 mt-1">
              FIND IT • RENT IT • PARK IT
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
