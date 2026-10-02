import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_SAMPLE_LISTINGS } from "../data/sampleListings";

const AppContext = createContext();

const STORAGE_KEYS = {
  USER: "parkit_user_v1",
  LISTINGS: "parkit_listings_v1",
  BOOKINGS: "parkit_bookings_v1",
  MESSAGES: "parkit_messages_v1",
  ACTIVE_MODE: "parkit_mode_v1"
};

const DEFAULT_BOOKINGS = [
  {
    id: "PKT-MUM-8924",
    listingId: "pkt-mum-001",
    listingTitle: "BKC G-Block Executive Basement Parking",
    category: "office",
    address: "Tower 2, G Block, Bandra Kurla Complex, Mumbai",
    date: "2026-10-03",
    startTime: "11:00",
    endTime: "14:00",
    durationHours: 3,
    hourlyRate: 75,
    rentalAmount: 225,
    platformFee: 27,
    totalAmount: 252,
    ownerEarnings: 198,
    status: "confirmed", // "confirmed" | "completed" | "cancelled"
    vehicleType: "four_wheeler",
    vehicleNumber: "MH 02 CZ 4421",
    bookingCreatedAt: "2026-10-02T12:00:00.000Z",
    ownerName: "Rajesh Singhania",
    ownerPhone: "+91 98201 •••••",
    pinCode: "8924",
    qrCode: "PKT-MUM-8924-GATE-VERIFIED"
  },
  {
    id: "PKT-NAV-3109",
    listingId: "pkt-mum-003",
    listingTitle: "Vashi Sector 17 Commercial Tower Lot",
    category: "commercial",
    address: "Commodity Exchange Building, Sector 17, Vashi, Navi Mumbai",
    date: "2026-09-28",
    startTime: "14:00",
    endTime: "17:00",
    durationHours: 3,
    hourlyRate: 85,
    rentalAmount: 255,
    platformFee: 31,
    totalAmount: 286,
    ownerEarnings: 224,
    status: "completed",
    vehicleType: "four_wheeler",
    vehicleNumber: "MH 43 AB 8912",
    bookingCreatedAt: "2026-09-28T10:00:00.000Z",
    ownerName: "Amit Deshmukh",
    ownerPhone: "+91 98690 •••••",
    pinCode: "3109",
    qrCode: "PKT-NAV-3109-GATE-VERIFIED"
  }
];

const DEFAULT_MESSAGES = {
  "pkt-mum-001": [
    {
      id: "msg-1",
      sender: "customer",
      text: "Hi Rajesh, is this parking covered and does it fit a Kia Seltos SUV?",
      timestamp: "10:15 AM",
      date: "Today"
    },
    {
      id: "msg-2",
      sender: "owner",
      text: "Hello! Yes, the basement ceiling clearance is 2.8m, easily accommodates full-size SUVs with roof carriers. Security guard will assist your bay entry.",
      timestamp: "10:17 AM",
      date: "Today"
    }
  ]
};

export function AppProvider({ children }) {
  // Auth state
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Current view mode: 'landing' | 'purpose_select' | 'rent_it' | 'give_to_rent'
  const [activeMode, setActiveMode] = useState(() => {
    return "landing";
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authRedirectMode, setAuthRedirectMode] = useState("purpose_select");

  // SVG Wave Page Transition trigger
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Listings state with persistence
  const [listings, setListings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LISTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SAMPLE_LISTINGS;
    } catch {
      return INITIAL_SAMPLE_LISTINGS;
    }
  });

  // Bookings state with persistence
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : DEFAULT_BOOKINGS;
    } catch {
      return DEFAULT_BOOKINGS;
    }
  });

  // Chat messages with persistence
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return saved ? JSON.parse(saved) : DEFAULT_MESSAGES;
    } catch {
      return DEFAULT_MESSAGES;
    }
  });

  // Modals
  const [selectedListing, setSelectedListing] = useState(null);
  const [bookingListing, setBookingListing] = useState(null);
  const [chatListing, setChatListing] = useState(null);
  const [callListing, setCallListing] = useState(null);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [showAddListing, setShowAddListing] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  // Mode Transition with liquid SVG wave
  const changeMode = (newMode) => {
    if (newMode === activeMode) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveMode(newMode);
    }, 400);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 900);
  };

  // Auth actions
  const login = (userData) => {
    const defaultUser = {
      id: "usr-" + Date.now(),
      name: userData?.name || "Demo User",
      email: userData?.email || "demo@parkit.in",
      role: "all",
      isDemo: true
    };
    setUser(defaultUser);
    setShowAuthModal(false);
    changeMode(authRedirectMode || "purpose_select");
  };

  const logout = () => {
    setUser(null);
    changeMode("landing");
  };

  // Add Listing
  const addListing = (newListingData) => {
    const newListing = {
      ...newListingData,
      id: "pkt-" + Date.now().toString(36),
      rating: 5.0,
      reviewCount: 1,
      isAvailable: true,
      owner: {
        id: user?.id || "own-demo",
        name: user?.name || "Current Host",
        type: "Verified Owner",
        phone: "+91 98200 XXXXX",
        maskedPhone: "+91 98200 •••••",
        verified: true,
        responseRate: "100%",
        responseTime: "< 5 mins"
      }
    };
    setListings((prev) => [newListing, ...prev]);
    return newListing;
  };

  // Update Listing
  const updateListing = (id, updatedFields) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  // Delete Listing
  const deleteListing = (id) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
  };

  // Double booking & slot conflict detection
  const hasBookingConflict = (listingId, bookingDate, startTime, endTime) => {
    return bookings.some((b) => {
      if (b.listingId !== listingId || b.status === "cancelled") return false;
      if (b.date !== bookingDate) return false;

      // Check time overlap: (StartA < EndB) and (EndA > StartB)
      return startTime < b.endTime && endTime > b.startTime;
    });
  };

  // Create Booking
  const createBooking = (bookingData) => {
    // Check conflicts
    if (
      hasBookingConflict(
        bookingData.listingId,
        bookingData.date,
        bookingData.startTime,
        bookingData.endTime
      )
    ) {
      throw new Error(
        "This parking slot is already booked for the selected time window. Please choose another slot."
      );
    }

    const newBooking = {
      ...bookingData,
      id: "PKT-" + Math.floor(1000 + Math.random() * 9000),
      pinCode: Math.floor(1000 + Math.random() * 9000).toString(),
      status: "confirmed",
      bookingCreatedAt: new Date().toISOString(),
      qrCode: `PKT-${Date.now()}-CONFIRMED`
    };

    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  // Cancel Booking
  const cancelBooking = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b))
    );
  };

  // Send Chat Message
  const sendChatMessage = (listingId, text) => {
    if (!text.trim()) return;

    const newMsg = {
      id: "msg-" + Date.now(),
      sender: "customer",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: "Today"
    };

    setMessages((prev) => {
      const existing = prev[listingId] || [];
      return {
        ...prev,
        [listingId]: [...existing, newMsg]
      };
    });

    // Simulated Owner Auto-Reply after 1.2 seconds for realistic prototype feel
    setTimeout(() => {
      const autoResponses = [
        "Yes, the parking space is completely available as listed! You can proceed to book.",
        "Yes, 24/7 security guard is stationed at the gate and will verify your PARKIT PIN code.",
        "Yes, entry is wide and easily fits large SUVs and sedans. High clearance.",
        "Sure, you can extend your duration anytime through the app if no overlapping slot is booked."
      ];
      const randomReply = autoResponses[Math.floor(Math.random() * autoResponses.length)];

      const replyMsg = {
        id: "msg-reply-" + Date.now(),
        sender: "owner",
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        date: "Today"
      };

      setMessages((prev) => ({
        ...prev,
        [listingId]: [...(prev[listingId] || []), replyMsg]
      }));
    }, 1200);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        activeMode,
        setActiveMode,
        changeMode,
        isTransitioning,
        showAuthModal,
        setShowAuthModal,
        authRedirectMode,
        setAuthRedirectMode,
        login,
        logout,
        listings,
        setListings,
        addListing,
        updateListing,
        deleteListing,
        bookings,
        createBooking,
        cancelBooking,
        hasBookingConflict,
        messages,
        sendChatMessage,
        selectedListing,
        setSelectedListing,
        bookingListing,
        setBookingListing,
        chatListing,
        setChatListing,
        callListing,
        setCallListing,
        showMyBookings,
        setShowMyBookings,
        showAddListing,
        setShowAddListing,
        showAIAssistant,
        setShowAIAssistant
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
