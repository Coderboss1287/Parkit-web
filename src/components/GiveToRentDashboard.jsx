import React, { useState } from "react";
import {
  Building2,
  PlusCircle,
  Calendar,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Edit3,
  ShieldCheck,
  MessageSquare,
  BarChart3,
  Settings,
  User,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Lock,
  Layers
} from "lucide-react";
import { useApp } from "../context/AppContext";
import AddListingModal from "./AddListingModal";
import ChatModal from "./ChatModal";

export default function GiveToRentDashboard() {
  const {
    user,
    listings,
    bookings,
    deleteListing,
    updateListing,
    messages,
    showAddListing,
    setShowAddListing
  } = useApp();

  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'spaces' | 'availability' | 'bookings' | 'earnings' | 'messages'
  const [selectedChatListing, setSelectedChatListing] = useState(null);

  // Availability blocker states
  const [blockedDate, setBlockedDate] = useState("");
  const [blockedTimeStart, setBlockedTimeStart] = useState("14:00");
  const [blockedTimeEnd, setBlockedTimeEnd] = useState("16:00");
  const [blockedListingId, setBlockedListingId] = useState(listings[0]?.id || "");
  const [availabilityMessage, setAvailabilityMessage] = useState("");

  // Host earnings metrics in INR
  const totalHostEarnings = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((acc, b) => acc + (b.ownerEarnings || Math.round(b.totalAmount * 0.88)), 0);

  const totalBookingsCount = bookings.filter((b) => b.status !== "cancelled").length;
  const activeSpacesCount = listings.filter((l) => l.isAvailable).length;

  const handleToggleListing = (id, currentStatus) => {
    updateListing(id, { isAvailable: !currentStatus });
  };

  const handleBlockSlot = (e) => {
    e.preventDefault();
    if (!blockedDate || !blockedListingId) return;

    const target = listings.find((l) => l.id === blockedListingId);
    if (!target) return;

    const currentBlocked = target.schedule?.blockedDates || [];
    const currentSlots = target.schedule?.blockedSlots || [];

    const slotStr = `${blockedTimeStart}-${blockedTimeEnd}`;
    updateListing(blockedListingId, {
      schedule: {
        ...target.schedule,
        blockedDates: [...new Set([...currentBlocked, blockedDate])],
        blockedSlots: [...new Set([...currentSlots, slotStr])]
      }
    });

    setAvailabilityMessage(`Successfully blocked ${blockedDate} (${slotStr}) for ${target.title}!`);
    setTimeout(() => setAvailabilityMessage(""), 4000);
    setBlockedDate("");
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] pb-16">
      {/* Top Banner */}
      <section className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-bold uppercase tracking-wider mb-2 border border-white/15">
              <Building2 className="w-3.5 h-3.5 text-parkit-green" />
              <span>Owner Workspace • GIVE TO RENT</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Host Management & Earning Portal
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
              Turn idle residential, commercial and private parking bays into predictable monthly revenue across Mumbai.
            </p>
          </div>

          <button
            onClick={() => setShowAddListing(true)}
            className="self-start md:self-auto px-5 py-3 bg-white text-emerald-800 hover:bg-emerald-50 rounded-2xl font-extrabold text-sm shadow-xl flex items-center gap-2 transition hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>+ List New Parking Space</span>
          </button>
        </div>
      </section>

      {/* Workspace Navigation Bar */}
      <div className="bg-white border-b border-slate-200/90 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "spaces", label: `My Spaces (${listings.length})`, icon: Building2 },
              { id: "availability", label: "Availability Manager", icon: Calendar },
              { id: "bookings", label: `Reservations (${bookings.length})`, icon: Clock },
              { id: "earnings", label: "Revenue & Payouts", icon: IndianRupee },
              { id: "messages", label: "Messages & Inquiries", icon: MessageSquare }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-emerald-800 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-premium">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Total Host Earnings
                </span>
                <div className="text-3xl font-black text-emerald-700 flex items-center gap-1">
                  <span>₹{totalHostEarnings}</span>
                  <span className="text-xs font-semibold text-slate-400">INR</span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs font-bold text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% vs last month</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-premium">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Confirmed Bookings
                </span>
                <div className="text-3xl font-black text-parkit-royal">
                  {totalBookingsCount}
                </div>
                <p className="text-xs text-slate-500 mt-2">Zero booking double-allocation</p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-premium">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Active Listings Online
                </span>
                <div className="text-3xl font-black text-slate-800">
                  {activeSpacesCount} / {listings.length}
                </div>
                <p className="text-xs text-slate-500 mt-2">Ready for instant guest check-in</p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-premium">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Platform Commission
                </span>
                <div className="text-3xl font-black text-slate-700">12%</div>
                <p className="text-xs text-slate-500 mt-2">Net 88% direct payout to host</p>
              </div>
            </div>

            {/* Quick Actions & Recent Bookings Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-premium">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-black text-parkit-dark">
                    Recent Guest Check-ins & Bookings
                  </h3>
                  <button
                    onClick={() => setActiveTab("bookings")}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    View All ({bookings.length})
                  </button>
                </div>

                <div className="space-y-3">
                  {bookings.slice(0, 4).map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-parkit-dark">{b.listingTitle}</strong>
                          <span className="font-mono text-[10px] text-slate-400">({b.id})</span>
                        </div>
                        <p className="text-slate-500 mt-0.5">
                          {b.date} • {b.startTime} - {b.endTime} • {b.vehicleNumber}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-black text-emerald-700 text-sm">
                          +₹{b.ownerEarnings || Math.round(b.totalAmount * 0.88)}
                        </span>
                        <p className="text-[10px] text-slate-400">Payout</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Host Quick Guide */}
              <div className="lg:col-span-4 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-3xl border border-emerald-200 shadow-premium space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-emerald-950">
                  PARKIT Host Best Practices
                </h3>
                <ul className="space-y-2 text-xs text-emerald-900 leading-relaxed font-medium">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Always keep the 4-digit gate PIN updated with your society guards.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Block slots in advance when you or family members require the spot.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Quick responses to pre-booking chats lead to 3x higher booking frequency.</span>
                  </li>
                </ul>

                <button
                  onClick={() => setShowAddListing(true)}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  + Add Another Bay
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY SPACES */}
        {activeTab === "spaces" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-parkit-dark">
                Your Registered Parking Locations ({listings.length})
              </h2>
              <button
                onClick={() => setShowAddListing(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Space</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-premium flex flex-col justify-between"
                >
                  <div>
                    <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-3 bg-slate-100">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-white/90 text-slate-800 backdrop-blur-md">
                          {item.category}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <button
                          onClick={() => handleToggleListing(item.id, item.isAvailable)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase backdrop-blur-md transition ${
                            item.isAvailable
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-700 text-slate-200"
                          }`}
                        >
                          {item.isAvailable ? "● Live / Active" : "○ Disabled"}
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-extrabold text-parkit-dark line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.address}</p>

                    <div className="mt-3 grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Hourly</span>
                        <strong className="text-parkit-dark">₹{item.hourlyPrice}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Daily</span>
                        <strong className="text-parkit-dark">₹{item.dailyPrice || "-"}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Monthly</span>
                        <strong className="text-parkit-dark">₹{item.monthlyPrice || "-"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      Operating: {item.schedule?.openTime} - {item.schedule?.closeTime}
                    </span>

                    <button
                      onClick={() => deleteListing(item.id)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition"
                      title="Delete Space"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AVAILABILITY MANAGER */}
        {activeTab === "availability" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-premium space-y-5">
              <div>
                <h3 className="text-lg font-black text-parkit-dark">
                  Block Dates & Custom Time Slots
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Temporarily disable reservation for private usage or maintenance.
                </p>
              </div>

              {availabilityMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{availabilityMessage}</span>
                </div>
              )}

              <form onSubmit={handleBlockSlot} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Target Space
                  </label>
                  <select
                    value={blockedListingId}
                    onChange={(e) => setBlockedListingId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    {listings.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Date to Block
                  </label>
                  <input
                    type="date"
                    required
                    value={blockedDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setBlockedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Start Hour
                    </label>
                    <input
                      type="time"
                      value={blockedTimeStart}
                      onChange={(e) => setBlockedTimeStart(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      End Hour
                    </label>
                    <input
                      type="time"
                      value={blockedTimeEnd}
                      onChange={(e) => setBlockedTimeEnd(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Block Time Window</span>
                </button>
              </form>
            </div>

            {/* Currently Blocked Windows */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-premium space-y-4">
              <h3 className="text-base font-black text-parkit-dark">
                Active Calendar Restrictions
              </h3>
              <div className="space-y-3">
                {listings.map((l) => {
                  const blocked = l.schedule?.blockedDates || [];
                  const slots = l.schedule?.blockedSlots || [];
                  if (blocked.length === 0 && slots.length === 0) return null;

                  return (
                    <div key={l.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                      <strong className="text-parkit-dark block mb-1">{l.title}</strong>
                      <div className="flex flex-wrap gap-1.5">
                        {blocked.map((d, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
                            Date: {d}
                          </span>
                        ))}
                        {slots.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
                            Slot: {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RESERVATIONS */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-premium space-y-4">
            <h2 className="text-xl font-black text-parkit-dark">
              Incoming Renter Bookings ({bookings.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-bold">Booking ID</th>
                    <th className="pb-3 font-bold">Space Title</th>
                    <th className="pb-3 font-bold">Date & Time</th>
                    <th className="pb-3 font-bold">Vehicle Plate</th>
                    <th className="pb-3 font-bold">Gate PIN</th>
                    <th className="pb-3 font-bold">Payout (INR)</th>
                    <th className="pb-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 font-mono font-bold text-parkit-royal">{b.id}</td>
                      <td className="py-3.5 font-bold text-parkit-dark">{b.listingTitle}</td>
                      <td className="py-3.5 text-slate-600">
                        {b.date} • {b.startTime} - {b.endTime}
                      </td>
                      <td className="py-3.5 font-mono font-semibold text-slate-700">{b.vehicleNumber}</td>
                      <td className="py-3.5 font-mono font-black text-emerald-700">{b.pinCode}</td>
                      <td className="py-3.5 font-black text-emerald-700 text-sm">
                        ₹{b.ownerEarnings || Math.round(b.totalAmount * 0.88)}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            b.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : b.status === "completed"
                              ? "bg-slate-100 text-slate-600"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: REVENUE & EARNINGS */}
        {activeTab === "earnings" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-premium">
                <span className="text-xs text-slate-400 font-bold uppercase">Net Host Earnings</span>
                <div className="text-3xl font-black text-emerald-700 mt-1">₹{totalHostEarnings}</div>
                <p className="text-xs text-slate-500 mt-1">Directly credited to verified bank account</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-premium">
                <span className="text-xs text-slate-400 font-bold uppercase">PARKIT Marketplace Fee</span>
                <div className="text-3xl font-black text-slate-700 mt-1">
                  ₹{Math.round(totalHostEarnings * (12 / 88))}
                </div>
                <p className="text-xs text-slate-500 mt-1">12% covering insurance & payment gateways</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-premium">
                <span className="text-xs text-slate-400 font-bold uppercase">Average Spot Yield</span>
                <div className="text-3xl font-black text-parkit-royal mt-1">₹480/day</div>
                <p className="text-xs text-slate-500 mt-1">Peak weekends in BKC & Bandra</p>
              </div>
            </div>

            {/* Interactive Monthly Revenue SVG Bar Chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-premium space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-parkit-dark">Monthly Revenue Trend (2026)</h3>
                  <p className="text-xs text-slate-500">Gross host earnings across Mumbai spaces (₹ INR)</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Target: ₹25,000 / month
                </span>
              </div>

              {/* Responsive SVG Chart */}
              <div className="h-56 w-full pt-4">
                <div className="h-full flex items-end justify-between gap-2 px-2 pb-6 border-b border-slate-200">
                  {[
                    { month: "May", amount: 8400, height: "35%" },
                    { month: "Jun", amount: 12200, height: "50%" },
                    { month: "Jul", amount: 15600, height: "65%" },
                    { month: "Aug", amount: 18900, height: "78%" },
                    { month: "Sep", amount: 22400, height: "92%" },
                    { month: "Oct (Proj)", amount: 24800, height: "100%" }
                  ].map((col, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <span className="text-[11px] font-bold text-slate-500 group-hover:text-emerald-700 transition">
                        ₹{col.amount}
                      </span>
                      <div className="w-full max-w-[48px] bg-slate-100 rounded-t-xl overflow-hidden h-36 flex items-end">
                        <div
                          style={{ height: col.height }}
                          className="w-full bg-gradient-to-t from-emerald-600 to-parkit-green rounded-t-xl group-hover:from-emerald-700 group-hover:to-emerald-500 transition-all shadow-md"
                        />
                      </div>
                      <span className="text-xs font-extrabold text-slate-600">{col.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: MESSAGES & INQUIRIES */}
        {activeTab === "messages" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-premium space-y-4">
            <h2 className="text-xl font-black text-parkit-dark">
              Renter Questions & Chat Inquiries
            </h2>

            <div className="divide-y divide-slate-100">
              {listings.map((l) => {
                const history = messages[l.id];
                if (!history || history.length === 0) return null;
                const lastMsg = history[history.length - 1];

                return (
                  <div
                    key={l.id}
                    onClick={() => setSelectedChatListing(l)}
                    className="py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 px-3 rounded-2xl transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-100 text-parkit-royal flex items-center justify-center font-bold text-sm">
                        {l.title.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-parkit-dark">{l.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {lastMsg.sender === "customer" ? "Renter: " : "You: "} {lastMsg.text}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[10px] text-slate-400 font-semibold">{lastMsg.timestamp}</span>
                      <span className="block text-xs font-bold text-emerald-700">Open Chat →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AddListingModal
        isOpen={showAddListing}
        onClose={() => setShowAddListing(false)}
      />

      <ChatModal
        isOpen={!!selectedChatListing}
        listing={selectedChatListing}
        onClose={() => setSelectedChatListing(null)}
      />
    </div>
  );
}
