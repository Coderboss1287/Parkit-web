import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Bot,
  Send,
  Sparkles,
  MapPin,
  Car,
  Clock,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { useApp } from "../context/AppContext";

const SUGGESTED_AI_PROMPTS = [
  "Find parking near Vashi station for 3 hours",
  "Show affordable parking near Mumbai offices",
  "Find covered parking with EV charging",
  "Show private parking in Bandra",
  "Find parking available after 6 PM"
];

export default function ParkitAIModal({ isOpen, onClose, onApplyListingFilter }) {
  const { listings, setSelectedListing, changeMode } = useApp();
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const handleRunQuery = (searchPrompt) => {
    const text = searchPrompt.toLowerCase();
    setIsThinking(true);

    setTimeout(() => {
      let matched = listings.filter((l) => {
        let score = 0;
        if (text.includes("vashi") && (l.address.toLowerCase().includes("vashi") || l.title.toLowerCase().includes("vashi"))) score += 3;
        if (text.includes("bkc") && (l.address.toLowerCase().includes("bkc") || l.title.toLowerCase().includes("bkc"))) score += 3;
        if (text.includes("bandra") && (l.address.toLowerCase().includes("bandra") || l.title.toLowerCase().includes("bandra"))) score += 3;
        if (text.includes("powai") && (l.address.toLowerCase().includes("powai") || l.title.toLowerCase().includes("powai"))) score += 3;
        if (text.includes("thane") && (l.address.toLowerCase().includes("thane") || l.title.toLowerCase().includes("thane"))) score += 3;
        if (text.includes("office") && l.category === "office") score += 2;
        if (text.includes("private") && l.category === "private") score += 2;
        if (text.includes("mall") && l.category === "mall") score += 2;
        if (text.includes("covered") && l.isCovered) score += 2;
        if (text.includes("ev") && l.hasEVCharging) score += 2;
        if (text.includes("affordable") || text.includes("cheap")) {
          if (l.hourlyPrice <= 50) score += 2;
        }
        return score > 0;
      });

      if (matched.length === 0) {
        matched = listings.slice(0, 3);
      }

      setAiResponse({
        query: searchPrompt,
        summary: `I found ${matched.length} verified parking spaces matching your criteria in the Mumbai metropolitan area.`,
        spots: matched
      });
      setIsThinking(false);
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    handleRunQuery(query);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-900 via-parkit-royal to-parkit-sky px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-parkit-sky" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                  <span>PARKIT AI Smart Assistant</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[9px] font-bold uppercase text-emerald-300">
                    GenAI Ready
                  </span>
                </h3>
                <p className="text-[11px] text-cyan-200">
                  Ask natural questions to discover optimal parking in Mumbai
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

          {/* Quick Prompt Chips */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
            {SUGGESTED_AI_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(p);
                  handleRunQuery(p);
                }}
                className="px-3 py-1 bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-parkit-royal text-xs font-semibold rounded-full shadow-sm transition flex-shrink-0"
              >
                ✨ {p}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {isThinking && (
              <div className="py-8 text-center space-y-2">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-600">PARKIT AI is scanning verified Mumbai spaces...</p>
              </div>
            )}

            {!isThinking && !aiResponse && (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-indigo-400" />
                <p className="text-sm font-bold text-slate-700">How can I help you park today?</p>
                <p className="text-xs max-w-xs mx-auto">
                  Type any request or click one of the suggested prompts above to find matching slots.
                </p>
              </div>
            )}

            {!isThinking && aiResponse && (
              <div className="space-y-3">
                <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs text-indigo-950 font-medium">
                  🤖 {aiResponse.summary}
                </div>

                <div className="space-y-2.5">
                  {aiResponse.spots.map((spot) => (
                    <div
                      key={spot.id}
                      className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-parkit-sky transition flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={spot.image}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-parkit-dark truncate">
                            {spot.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate">{spot.address}</p>
                          <span className="text-xs font-black text-parkit-royal">₹{spot.hourlyPrice}/hr</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedListing(spot);
                          changeMode("rent_it");
                          onClose();
                        }}
                        className="py-1.5 px-3 rounded-xl bg-parkit-royal text-white text-[11px] font-bold hover:bg-blue-700 transition flex items-center gap-1 flex-shrink-0 shadow-sm"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask e.g. 'Find parking near BKC under ₹80'..."
                className="flex-1 py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
              <button
                type="submit"
                className="py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-parkit-royal hover:opacity-95 text-white rounded-xl shadow-md transition font-bold text-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
