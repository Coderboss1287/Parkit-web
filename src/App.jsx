import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SvgPathTransition from "./components/SvgPathTransition";
import CinematicIntro from "./components/CinematicIntro";
import AuthModal from "./components/AuthModal";
import PurposeSelection from "./components/PurposeSelection";
import LandingPage from "./components/LandingPage";
import RentItDashboard from "./components/RentItDashboard";
import GiveToRentDashboard from "./components/GiveToRentDashboard";
import MyBookingsModal from "./components/MyBookingsModal";
import AddListingModal from "./components/AddListingModal";
import ParkitAIModal from "./components/ParkitAIModal";

function AppContent() {
  const {
    user,
    isAuthenticated,
    activeMode,
    changeMode,
    isTransitioning,
    showAuthModal,
    setShowAuthModal,
    showMyBookings,
    setShowMyBookings,
    showAddListing,
    setShowAddListing,
    showAIAssistant,
    setShowAIAssistant
  } = useApp();

  const [hasCompletedIntro, setHasCompletedIntro] = useState(() => {
    // Only show cinematic intro on fresh launch
    return sessionStorage.getItem("parkit_intro_done") === "true";
  });

  const handleCompleteIntro = () => {
    sessionStorage.setItem("parkit_intro_done", "true");
    setHasCompletedIntro(true);

    // If not authenticated, open auth prompt
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      changeMode("purpose_select");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFC] text-parkit-dark relative selection:bg-parkit-sky selection:text-white">
      {/* 1. Cinematic Logo Reveal on website open */}
      {!hasCompletedIntro && <CinematicIntro onComplete={handleCompleteIntro} />}

      {/* 2. Animated SVG Wave Path Transition inspired by reference video */}
      <SvgPathTransition isActive={isTransitioning} />

      {/* 3. Global Navbar (shown on all pages except full-screen purpose select) */}
      {activeMode !== "purpose_select" && <Navbar />}

      {/* 4. Active Mode View Dispatcher */}
      <div className="flex-1">
        {activeMode === "purpose_select" && <PurposeSelection />}
        {activeMode === "landing" && <LandingPage />}
        {activeMode === "rent_it" && <RentItDashboard />}
        {activeMode === "give_to_rent" && <GiveToRentDashboard />}
      </div>

      {/* 5. Footer (shown on landing and dashboards) */}
      {activeMode !== "purpose_select" && <Footer />}

      {/* Global Shared Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <MyBookingsModal
        isOpen={showMyBookings}
        onClose={() => setShowMyBookings(false)}
      />

      <AddListingModal
        isOpen={showAddListing}
        onClose={() => setShowAddListing(false)}
      />

      <ParkitAIModal
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
