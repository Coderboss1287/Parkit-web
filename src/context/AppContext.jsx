import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_SAMPLE_LISTINGS } from "../data/sampleListings";
import { atlasMaps } from "../services/atlasMapsClient";

const AppContext = createContext();

const STORAGE_KEYS = {
  USER: "parkit_user_v1",
  LISTINGS: "parkit_listings_v1",
  BOOKINGS: "parkit_bookings_v1",
  MESSAGES: "parkit_messages_v1",
  ACTIVE_MODE: "parkit_mode_v1"
};

const DEFAULT_BOOKINGS = [];

const DEFAULT_MESSAGES = {};

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
  const [authInitialMode, setAuthInitialMode] = useState("signup"); // 'signup' | 'login'
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
  // User live geolocation state
  const [userLocation, setUserLocation] = useState(null);

  // Helper to cleanly merge/update dynamically generated nearby listings without duplicates
  const setNearbyDynamicSpots = (spots) => {
    setListings((prev) => {
      const nonDynamic = prev.filter((item) => !item.id.startsWith("pkt-nearby-"));
      return [...spots, ...nonDynamic];
    });
  };

  // Sync with persistent SQLite database on mount
  useEffect(() => {
    let isMounted = true;
    async function initDatabaseSync() {
      try {
        const [dbListings, dbBookings] = await Promise.all([
          atlasMaps.fetchListings(),
          atlasMaps.fetchBookings()
        ]);
        if (isMounted) {
          if (Array.isArray(dbListings) && dbListings.length > 0) {
            setListings((prev) => {
              const dynamic = prev.filter((item) => item.id.startsWith("pkt-nearby-"));
              return [...dynamic, ...dbListings];
            });
          }
          if (Array.isArray(dbBookings) && dbBookings.length > 0) {
            setBookings(dbBookings);
          }
        }
      } catch (err) {
        console.warn("Initial database sync deferred:", err);
      }
    }
    initDatabaseSync();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch persistent chat messages when a chat is opened for a listing
  useEffect(() => {
    if (!chatListing?.id) return;
    let isMounted = true;
    async function loadChatMessages() {
      try {
        const dbMsgs = await atlasMaps.fetchMessages(chatListing.id);
        if (isMounted && Array.isArray(dbMsgs) && dbMsgs.length > 0) {
          setMessages((prev) => ({
            ...prev,
            [chatListing.id]: dbMsgs
          }));
        }
      } catch (err) {
        console.warn("Failed to load chat messages from DB:", err);
      }
    }
    loadChatMessages();
    return () => {
      isMounted = false;
    };
  }, [chatListing]);

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
  const signup = async (userData) => {
    const dbUser = await atlasMaps.signupUser(userData);
    if (!dbUser || !dbUser.id) {
      throw new Error("Registration failed. Please try again.");
    }

    const sessionUser = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      phone: dbUser.phone || "",
      role: dbUser.role || "all",
      createdAt: dbUser.createdAt,
      lastLoginAt: dbUser.lastLoginAt
    };

    setUser(sessionUser);
    setShowAuthModal(false);
    changeMode(authRedirectMode || "purpose_select");
    return sessionUser;
  };

  const login = async (userData) => {
    if (userData?.authMode === "signup") {
      return signup(userData);
    }

    const email = (userData?.email || "").trim().toLowerCase();
    const dbUser = await atlasMaps.loginUser({
      email,
      password: userData?.password,
      authMode: "login"
    });

    if (!dbUser || !dbUser.id) {
      throw new Error("Authentication failed. Please check your credentials.");
    }

    const sessionUser = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      phone: dbUser.phone || "",
      role: dbUser.role || "all",
      createdAt: dbUser.createdAt,
      lastLoginAt: dbUser.lastLoginAt
    };

    setUser(sessionUser);
    setShowAuthModal(false);
    changeMode(authRedirectMode || "purpose_select");
    return sessionUser;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch {}
    changeMode("landing");
  };

  // Add Listing
  const addListing = async (newListingData) => {
    const listingId = "pkt-" + Date.now().toString(36);
    const localListing = {
      ...newListingData,
      id: listingId,
      rating: 5.0,
      reviewCount: 1,
      isAvailable: true,
      owner: {
        id: user?.id || `own-${Date.now()}`,
        name: user?.name || "Verified Space Host",
        type: "Verified Owner",
        phone: user?.phone || "+91 98200 XXXXX",
        maskedPhone: user?.phone ? `${user.phone.slice(0, 8)}•••••` : "+91 98200 •••••",
        verified: true,
        responseRate: "100%",
        responseTime: "< 5 mins"
      }
    };

    setListings((prev) => [localListing, ...prev]);

    try {
      const createdInDb = await atlasMaps.createListing({
        ...localListing,
        hourlyPrice: Number(localListing.hourlyPrice || 50),
        dailyPrice: Number(localListing.dailyPrice || (localListing.hourlyPrice * 8)),
        monthlyPrice: Number(localListing.monthlyPrice || (localListing.hourlyPrice * 120)),
        lat: Number(localListing.lat || 19.0760),
        lng: Number(localListing.lng || 72.8777)
      });
      if (createdInDb && createdInDb.id) {
        setListings((prev) =>
          prev.map((item) => (item.id === listingId ? createdInDb : item))
        );
        return createdInDb;
      }
    } catch (err) {
      console.warn("Backend createListing sync deferred:", err);
    }

    return localListing;
  };

  // Update Listing
  const updateListing = async (id, updatedFields) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );

    try {
      await atlasMaps.updateListing(id, updatedFields);
    } catch (err) {
      console.warn("Backend updateListing sync deferred:", err);
    }
  };

  // Delete Listing
  const deleteListing = async (id) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
    try {
      await atlasMaps.deleteListing(id);
    } catch (err) {
      console.warn("Backend deleteListing sync deferred:", err);
    }
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
  const createBooking = async (bookingData) => {
    // 1. Client-side conflict check for instant feedback
    if (
      hasBookingConflict(
        bookingData.listingId,
        bookingData.date,
        bookingData.startTime,
        bookingData.endTime
      )
    ) {
      throw new Error(
        "Double-booking prevented: This slot is already booked by another driver for this time window. Please pick another time slot."
      );
    }

    // 2. Persist to database (handles server-side 409 Conflict check)
    try {
      const payload = {
        listingId: bookingData.listingId,
        listingTitle: bookingData.listingTitle,
        userEmail: user?.email || bookingData.userEmail || "",
        userName: user?.name || bookingData.userName || "Customer",
        category: bookingData.category,
        address: bookingData.address,
        date: bookingData.date,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        durationHours: Number(bookingData.durationHours || 1),
        hourlyRate: Number(bookingData.hourlyRate || 50),
        rentalAmount: Number(bookingData.rentalAmount || 50),
        platformFee: Number(bookingData.platformFee || 0),
        totalAmount: Number(bookingData.totalAmount || 50),
        ownerEarnings: Number(bookingData.ownerEarnings || 0),
        vehicleType: bookingData.vehicleType || "four_wheeler",
        vehicleNumber: bookingData.vehicleNumber,
        ownerName: bookingData.ownerName,
        ownerPhone: bookingData.ownerPhone
      };

      const dbBooking = await atlasMaps.createBooking(payload);
      if (dbBooking && dbBooking.id) {
        setBookings((prev) => [dbBooking, ...prev]);
        return dbBooking;
      }
    } catch (err) {
      if (err.status === 409 || err.message?.includes("already booked")) {
        throw err;
      }
      console.warn("Backend createBooking failed, falling back to local booking:", err);
    }

    // Offline / fallback creation
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
  const cancelBooking = async (bookingId) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b))
    );

    try {
      await atlasMaps.cancelBooking(bookingId);
    } catch (err) {
      console.warn("Backend cancelBooking sync deferred:", err);
    }
  };

  // Send Chat Message
  const sendChatMessage = async (listingId, text) => {
    if (!text.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsg = {
      id: "msg-" + Date.now(),
      sender: "customer",
      senderName: user?.name || "Customer",
      text,
      timestamp: timeStr,
      date: "Today"
    };

    setMessages((prev) => {
      const existing = prev[listingId] || [];
      return {
        ...prev,
        [listingId]: [...existing, newMsg]
      };
    });

    try {
      await atlasMaps.sendChatMessage(listingId, {
        sender: "customer",
        senderName: user?.name || "Customer",
        text,
        timestamp: timeStr,
        date: "Today"
      });
    } catch (err) {
      console.warn("Backend chat message send deferred:", err);
    }
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
        authInitialMode,
        setAuthInitialMode,
        authRedirectMode,
        setAuthRedirectMode,
        signup,
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
        setShowAIAssistant,
        userLocation,
        setUserLocation,
        setNearbyDynamicSpots
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
