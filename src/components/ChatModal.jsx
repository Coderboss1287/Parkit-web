import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCheck,
  Sparkles,
  Bot,
  UserCheck
} from "lucide-react";
import { useApp } from "../context/AppContext";

const QUICK_QUESTIONS = [
  "Is this parking available right now?",
  "Can my SUV/large car easily fit?",
  "What is the exact entry gate procedure?",
  "Is 24/7 security guard present at gate?",
  "Can I extend my booking if needed?"
];

export default function ChatModal({ isOpen, onClose, listing }) {
  const { messages, sendChatMessage, setBookingListing } = useApp();
  const [inputText, setInputText] = useState("");

  if (!isOpen || !listing) return null;

  const chatHistory = messages[listing.id] || [
    {
      id: "intro-msg",
      sender: "owner",
      text: `Hello! I'm ${listing.owner.name}. Feel free to ask any question about access, gate instructions or vehicle clearances before booking.`,
      timestamp: "Just now",
      date: "Today"
    }
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(listing.id, inputText);
    setInputText("");
  };

  const handleQuickQuestion = (q) => {
    sendChatMessage(listing.id, q);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[580px] max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-parkit-royal to-parkit-sky px-5 py-4 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-extrabold text-sm border border-white/30">
                  {listing.owner.name.charAt(0)}
                </div>
                <span className="w-3 h-3 rounded-full bg-parkit-green border-2 border-white absolute -bottom-0.5 -right-0.5 shadow-sm" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight text-white">
                    {listing.owner.name}
                  </h3>
                  <span className="px-1.5 py-0.5 rounded bg-white/20 text-[9px] font-bold uppercase tracking-wider text-cyan-100">
                    Host
                  </span>
                </div>
                <p className="text-[11px] text-cyan-100 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3 h-3 text-parkit-green" />
                  <span>Verified Owner • Replies {listing.owner.responseTime}</span>
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

          {/* Spot info bar */}
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200/80 flex items-center justify-between text-xs">
            <div className="truncate max-w-[280px]">
              <span className="text-slate-500">Inquiry for: </span>
              <strong className="text-parkit-dark">{listing.title}</strong>
            </div>
            <span className="font-extrabold text-parkit-royal">₹{listing.hourlyPrice}/hr</span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFBFD]">
            {chatHistory.map((msg) => {
              const isMe = msg.sender === "customer";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-sm leading-relaxed ${
                      isMe
                        ? "bg-gradient-to-r from-parkit-royal to-parkit-sky text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                    {msg.timestamp}
                    {isMe && <CheckCheck className="w-3 h-3 text-parkit-sky" />}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Pre-booking Questions Carousel */}
          <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(q)}
                className="inline-block px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-parkit-royal text-[11px] font-semibold transition flex-shrink-0"
              >
                💬 {q}
              </button>
            ))}
          </div>

          {/* Input & Book Direct CTA */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask owner about height, gate, directions..."
                className="flex-1 py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-parkit-sky focus:bg-white transition"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 bg-parkit-royal hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl shadow-sm transition"
              >
                <Send className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  setBookingListing(listing);
                }}
                className="py-2 px-3 bg-gradient-to-r from-emerald-600 to-parkit-green hover:opacity-95 text-white text-xs font-bold rounded-xl transition flex-shrink-0 shadow-sm"
              >
                Book Now
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
