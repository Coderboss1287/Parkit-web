import { calculateHaversineDistanceKm } from "./hexagonalSearch";

// Curated high quality parking facility imagery
const PARKING_IMAGES = [
  "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1562920616-09559c340b07?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1000&q=80"
];

const SPOT_CONFIGS = [
  {
    title: "City Tech Hub Executive Basement",
    category: "office",
    addressPrefix: "Tower A, Tech Park Zone, Main Boulevard",
    distKm: 1.15,
    bearing: 25,
    hourlyPrice: 75,
    vehicleTypes: ["four_wheeler", "suv", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: true,
    rating: 4.9,
    reviewCount: 52,
    ownerName: "Anand Verma",
    ownerPhone: "+91 98201 •••••",
    desc: "Direct underground access with wide driving lanes, 22kW EV charging, and 24/7 boom barrier security."
  },
  {
    title: "Grand Galleria Smart Underground Parking",
    category: "mall",
    addressPrefix: "Basement Level 2, Grand Galleria Arcade",
    distKm: 1.55,
    bearing: 75,
    hourlyPrice: 65,
    vehicleTypes: ["four_wheeler", "suv"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: false,
    hasValet: true,
    rating: 4.8,
    reviewCount: 38,
    ownerName: "Pooja Malhotra",
    ownerPhone: "+91 98334 •••••",
    desc: "Convenient mall entrance bay with automated ticketless entry and wide parking slots."
  },
  {
    title: "Metro Station Commuter Bay Stalls",
    category: "commercial",
    addressPrefix: "Concourse Transit Gate 3, Metro Central",
    distKm: 1.95,
    bearing: 130,
    hourlyPrice: 40,
    vehicleTypes: ["four_wheeler", "two_wheeler", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: false,
    rating: 4.7,
    reviewCount: 84,
    ownerName: "Sanjay Kulkarni",
    ownerPhone: "+91 98112 •••••",
    desc: "Affordable sheltered commuter lot adjacent to the transit station with direct concourse walkway."
  },
  {
    title: "Greenwood Residency Reserved Bay",
    category: "residential",
    addressPrefix: "Gate 2, Greenwood Heights Cooperative Society",
    distKm: 2.35,
    bearing: 175,
    hourlyPrice: 50,
    vehicleTypes: ["four_wheeler", "two_wheeler"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: false,
    hasValet: false,
    rating: 4.9,
    reviewCount: 29,
    ownerName: "Dr. Vikram Joshi",
    ownerPhone: "+91 98760 •••••",
    desc: "Dedicated personal visitor bay in a peaceful gated society with 24/7 security intercom."
  },
  {
    title: "Apex Business Center Executive Slot",
    category: "office",
    addressPrefix: "Wing C, Apex Financial & IT Towers",
    distKm: 2.80,
    bearing: 220,
    hourlyPrice: 85,
    vehicleTypes: ["four_wheeler", "suv", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: true,
    rating: 4.8,
    reviewCount: 46,
    ownerName: "Rohan Mehta",
    ownerPhone: "+91 98450 •••••",
    desc: "Reserved corporate parking bay with RFID automated gate and premium security surveillance."
  },
  {
    title: "Central Boulevard Open Visitor Lot",
    category: "other",
    addressPrefix: "Plot 18, Commercial Ring Road Sector",
    distKm: 3.20,
    bearing: 265,
    hourlyPrice: 35,
    vehicleTypes: ["four_wheeler", "two_wheeler", "suv"],
    isCovered: false,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: false,
    hasValet: false,
    rating: 4.6,
    reviewCount: 61,
    ownerName: "Harpreet Singh",
    ownerPhone: "+91 98990 •••••",
    desc: "Spacious paved ground-level open parking. Economical daily and hourly rates with guard on duty."
  },
  {
    title: "MedLife Hospital Reserved Stalls",
    category: "hospital",
    addressPrefix: "Emergency & Visitor Pavilion, MedLife Complex",
    distKm: 3.65,
    bearing: 305,
    hourlyPrice: 70,
    vehicleTypes: ["four_wheeler", "suv", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: true,
    rating: 4.9,
    reviewCount: 73,
    ownerName: "Naveen Saxena",
    ownerPhone: "+91 98221 •••••",
    desc: "Priority sheltered parking with wheelchair-friendly ramps, ambulance lane clearance, and valet."
  },
  {
    title: "Courtyard Plaza Secure Valet Hub",
    category: "event",
    addressPrefix: "Main Avenue, Courtyard Commercial Center",
    distKm: 4.10,
    bearing: 345,
    hourlyPrice: 90,
    vehicleTypes: ["four_wheeler", "suv"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: false,
    hasValet: true,
    rating: 4.8,
    reviewCount: 34,
    ownerName: "Karan Johar",
    ownerPhone: "+91 98300 •••••",
    desc: "Professional valet managed parking ideal for dining, events, and shopping with key check-in."
  },
  {
    title: "EcoPark Fast EV Charging & Parking Hub",
    category: "commercial",
    addressPrefix: "Sector 7 Green Corridor, Expressway Junction",
    distKm: 4.55,
    bearing: 100,
    hourlyPrice: 110,
    vehicleTypes: ["four_wheeler", "suv", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: false,
    rating: 4.9,
    reviewCount: 95,
    ownerName: "Tarun Batra",
    ownerPhone: "+91 98105 •••••",
    desc: "60kW DC Fast EV charging stations integrated with secure parking bay and café lounge."
  },
  {
    title: "Riverside View Society Bay",
    category: "residential",
    addressPrefix: "Enclave Block D, Riverside Promenade Road",
    distKm: 4.85,
    bearing: 205,
    hourlyPrice: 45,
    vehicleTypes: ["four_wheeler", "two_wheeler"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: false,
    hasValet: false,
    rating: 4.7,
    reviewCount: 22,
    ownerName: "Sunita Roy",
    ownerPhone: "+91 98771 •••••",
    desc: "Safe residential community slot with guard assistance and CCTV coverage."
  }
];

/**
 * Spherical geodesy coordinate displacement
 * Calculates lat/lng at a given distance (km) and bearing (degrees) from origin
 */
function calculateDestinationPoint(centerLat, centerLng, distanceKm, bearingDeg) {
  const R = 6371; // Earth radius in km
  const brng = (bearingDeg * Math.PI) / 180;
  const lat1 = (centerLat * Math.PI) / 180;
  const lon1 = (centerLng * Math.PI) / 180;

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distanceKm / R) +
    Math.cos(lat1) * Math.sin(distanceKm / R) * Math.cos(brng)
  );

  const lon2 = lon1 + Math.atan2(
    Math.sin(brng) * Math.sin(distanceKm / R) * Math.cos(lat1),
    Math.cos(distanceKm / R) - Math.sin(lat1) * Math.sin(lat2)
  );

  return {
    lat: parseFloat((lat2 * (180 / Math.PI)).toFixed(6)),
    lng: parseFloat((lon2 * (180 / Math.PI)).toFixed(6))
  };
}

/**
 * Generates 8-10 realistic mock parking spots within 1 km to 5 km around user coordinates
 */
export function generateNearbyMockParkingSpots(userLat, userLng, localityLabel = "Current Location Area") {
  return SPOT_CONFIGS.map((cfg, index) => {
    const coords = calculateDestinationPoint(userLat, userLng, cfg.distKm, cfg.bearing);
    const actualDistKm = calculateHaversineDistanceKm(userLat, userLng, coords.lat, coords.lng);

    const img = PARKING_IMAGES[index % PARKING_IMAGES.length];
    const secondaryImg = PARKING_IMAGES[(index + 3) % PARKING_IMAGES.length];

    return {
      id: `pkt-nearby-${index + 1}`,
      title: cfg.title,
      category: cfg.category,
      address: `${cfg.addressPrefix}, ${localityLabel}`,
      locality: localityLabel,
      lat: coords.lat,
      lng: coords.lng,
      hourlyPrice: cfg.hourlyPrice,
      dailyPrice: cfg.hourlyPrice * 7,
      monthlyPrice: cfg.hourlyPrice * 115,
      vehicleTypes: cfg.vehicleTypes,
      isCovered: cfg.isCovered,
      hasCCTV: cfg.hasCCTV,
      hasSecurity: cfg.hasSecurity,
      hasEVCharging: cfg.hasEVCharging,
      hasValet: cfg.hasValet,
      isAvailable: true,
      rating: cfg.rating,
      reviewCount: cfg.reviewCount,
      image: img,
      images: [img, secondaryImg],
      schedule: {
        openTime: "07:00",
        closeTime: "23:00",
        recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        blockedDates: [],
        blockedSlots: []
      },
      owner: {
        id: `own-nearby-${index + 1}`,
        name: cfg.ownerName,
        type: "Verified Host",
        phone: cfg.ownerPhone,
        maskedPhone: cfg.ownerPhone,
        verified: true,
        responseRate: "99%",
        responseTime: "< 5 mins"
      },
      description: cfg.desc,
      isDynamicNearby: true,
      distanceKm: actualDistKm,
      distanceMeters: Math.round(actualDistKm * 1000)
    };
  });
}
