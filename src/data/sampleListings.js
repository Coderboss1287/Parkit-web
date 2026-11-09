export const INITIAL_SAMPLE_LISTINGS = [
  {
    id: "pkt-mum-001",
    title: "BKC G-Block Executive Basement Parking",
    category: "office",
    address: "Tower 2, G Block, Bandra Kurla Complex, Mumbai, Maharashtra 400051",
    locality: "BKC (Bandra Kurla Complex), Mumbai",
    lat: 19.0657,
    lng: 72.8687,
    hourlyPrice: 75,
    dailyPrice: 650,
    monthlyPrice: 9500,
    vehicleTypes: ["four_wheeler", "suv", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: true,
    isAvailable: true,
    rating: 4.9,
    reviewCount: 48,
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "08:00",
      closeTime: "22:00",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      blockedDates: ["2026-10-15"],
      blockedSlots: ["13:00-14:00"]
    },
    owner: {
      id: "own-101",
      name: "Rajesh Singhania",
      type: "Commercial Hub Manager",
      phone: "+91 98201 XXXXX",
      maskedPhone: "+91 98201 •••••",
      verified: true,
      responseRate: "98%",
      responseTime: "< 5 mins"
    },
    description: "Ultra-secure, well-lit executive basement slot directly beneath BKC Financial Centre. Equipped with 22kW Type-2 fast EV charger, boom barriers, and 24/7 security personnel."
  },
  {
    id: "pkt-mum-002",
    title: "Sea Breeze Society Reserved Resident Bay",
    category: "residential",
    address: "Sea Breeze CHS, Perry Cross Road, Bandra West, Mumbai, Maharashtra 400050",
    locality: "Bandra West, Mumbai",
    lat: 19.0596,
    lng: 72.8295,
    hourlyPrice: 50,
    dailyPrice: 420,
    monthlyPrice: 6200,
    vehicleTypes: ["four_wheeler", "suv", "two_wheeler"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: false,
    hasValet: false,
    isAvailable: true,
    rating: 4.8,
    reviewCount: 34,
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "06:00",
      closeTime: "23:59",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-102",
      name: "Pooja Merchant",
      type: "Society Resident",
      phone: "+91 98192 XXXXX",
      maskedPhone: "+91 98192 •••••",
      verified: true,
      responseRate: "95%",
      responseTime: "< 10 mins"
    },
    description: "Gated residential parking slot available while owner is at office. 2-minute walk from Carter Road. Society security verified with QR visitor check-in."
  },
  {
    id: "pkt-mum-003",
    title: "Vashi Sector 17 Commercial Tower Lot",
    category: "commercial",
    address: "Commodity Exchange Building, Sector 17, Vashi, Navi Mumbai, Maharashtra 400703",
    locality: "Vashi Sector 17, Navi Mumbai",
    lat: 19.0771,
    lng: 72.9986,
    hourlyPrice: 85,
    dailyPrice: 700,
    monthlyPrice: 8000,
    vehicleTypes: ["four_wheeler", "suv", "two_wheeler", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: false,
    isAvailable: true,
    rating: 4.7,
    reviewCount: 62,
    image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "07:00",
      closeTime: "23:00",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-103",
      name: "Amit Deshmukh",
      type: "Facility Supervisor",
      phone: "+91 98690 XXXXX",
      maskedPhone: "+91 98690 •••••",
      verified: true,
      responseRate: "100%",
      responseTime: "< 2 mins"
    },
    description: "Heart of Vashi shopping and banking district. Multilevel covered parking with automated entry ticket scan, wide ramps, and dedicated EV charging stations."
  },
  {
    id: "pkt-mum-004",
    title: "Vashi Railway Station North Plaza Parking",
    category: "other",
    address: "Station Complex, Sector 30A, Vashi, Navi Mumbai, Maharashtra 400703",
    locality: "Vashi Railway Station, Navi Mumbai",
    lat: 19.0645,
    lng: 72.9950,
    hourlyPrice: 40,
    dailyPrice: 320,
    monthlyPrice: 4500,
    vehicleTypes: ["four_wheeler", "two_wheeler"],
    isCovered: false,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: false,
    hasValet: false,
    isAvailable: true,
    rating: 4.5,
    reviewCount: 110,
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "05:00",
      closeTime: "23:59",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-104",
      name: "Sunil Kadam",
      type: "Station Parking Contractor",
      phone: "+91 99203 XXXXX",
      maskedPhone: "+91 99203 •••••",
      verified: true,
      responseRate: "90%",
      responseTime: "< 15 mins"
    },
    description: "Direct walkover to Vashi Harbour Line railway platform and Inorbit mall. Ideal for daily commuters to South Mumbai or Thane."
  },
  {
    id: "pkt-mum-005",
    title: "Lilavati Hospital Proximity Reserved Bay",
    category: "hospital",
    address: "Near Lilavati Hospital, Bandra Reclamation, Bandra West, Mumbai, Maharashtra 400050",
    locality: "Bandra West, Mumbai",
    lat: 19.0515,
    lng: 72.8290,
    hourlyPrice: 80,
    dailyPrice: 650,
    monthlyPrice: 7500,
    vehicleTypes: ["four_wheeler", "suv"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: false,
    hasValet: true,
    isAvailable: true,
    rating: 4.9,
    reviewCount: 51,
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "00:00",
      closeTime: "23:59",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-105",
      name: "Dr. Farhan Qureshi",
      type: "Clinic Owner",
      phone: "+91 98205 XXXXX",
      maskedPhone: "+91 98205 •••••",
      verified: true,
      responseRate: "97%",
      responseTime: "< 5 mins"
    },
    description: "Reserved private bay situated 120 metres from Lilavati emergency gate. Priority access for medical visits, patient attendants, and visitors."
  },
  {
    id: "pkt-mum-006",
    title: "Lower Parel Palladium & Phoenix Mall Premium Bay",
    category: "mall",
    address: "Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013",
    locality: "Lower Parel, Mumbai",
    lat: 18.9953,
    lng: 72.8304,
    hourlyPrice: 110,
    dailyPrice: 900,
    monthlyPrice: 12500,
    vehicleTypes: ["four_wheeler", "suv", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: true,
    isAvailable: true,
    rating: 4.9,
    reviewCount: 95,
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "10:00",
      closeTime: "23:30",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-106",
      name: "High Street Valet Services",
      type: "Commercial Partner",
      phone: "+91 98334 XXXXX",
      maskedPhone: "+91 98334 •••••",
      verified: true,
      responseRate: "99%",
      responseTime: "< 3 mins"
    },
    description: "Skip the notorious 45-minute mall weekend parking queues! VIP pre-reserved bay with guaranteed direct elevator access to Palladium luxury stores."
  },
  {
    id: "pkt-mum-007",
    title: "Colaba Causeway Heritage Villa Driveway",
    category: "private",
    address: "Bakehouse Lane, Near Regal Cinema, Colaba, Mumbai, Maharashtra 400001",
    locality: "Colaba / Fort, South Mumbai",
    lat: 18.9220,
    lng: 72.8347,
    hourlyPrice: 45,
    dailyPrice: 380,
    monthlyPrice: 6000,
    vehicleTypes: ["four_wheeler", "two_wheeler"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: false,
    hasEVCharging: false,
    hasValet: false,
    isAvailable: true,
    rating: 4.6,
    reviewCount: 28,
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "08:00",
      closeTime: "22:00",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-107",
      name: "Cyrus Mistry",
      type: "Private Homeowner",
      phone: "+91 98211 XXXXX",
      maskedPhone: "+91 98211 •••••",
      verified: true,
      responseRate: "92%",
      responseTime: "< 15 mins"
    },
    description: "Private gated villa driveway right behind Colaba Causeway shopping lane. Shaded canopy, private locked gate with combination lock sent upon booking."
  },
  {
    id: "pkt-mum-008",
    title: "Jio World Convention Centre Event Hub",
    category: "event",
    address: "G Block, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400098",
    locality: "BKC (Bandra Kurla Complex), Mumbai",
    lat: 19.0620,
    lng: 72.8650,
    hourlyPrice: 120,
    dailyPrice: 950,
    monthlyPrice: 14000,
    vehicleTypes: ["four_wheeler", "suv", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: true,
    isAvailable: true,
    rating: 4.9,
    reviewCount: 142,
    image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "07:00",
      closeTime: "23:59",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-108",
      name: "BKC Events Logistics",
      type: "Event Coordinator",
      phone: "+91 98700 XXXXX",
      maskedPhone: "+91 98700 •••••",
      verified: true,
      responseRate: "100%",
      responseTime: "< 2 mins"
    },
    description: "Designated premium event parking adjacent to Jio World Convention Hall 1 & 2. Zero-delay entry lane with fast tag QR scanner and covered transit tunnel."
  },
  {
    id: "pkt-mum-009",
    title: "Viviana Mall & Cadbury Junction Covered Slot",
    category: "mall",
    address: "Eastern Express Highway, Service Rd, Laxmi Nagar, Thane West, Maharashtra 400606",
    locality: "Naupada, Thane West",
    lat: 19.2065,
    lng: 72.9723,
    hourlyPrice: 90,
    dailyPrice: 720,
    monthlyPrice: 7500,
    vehicleTypes: ["four_wheeler", "suv", "two_wheeler", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: false,
    isAvailable: true,
    rating: 4.8,
    reviewCount: 77,
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "09:00",
      closeTime: "23:00",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-109",
      name: "Thane Plaza Management",
      type: "Commercial Host",
      phone: "+91 98199 XXXXX",
      maskedPhone: "+91 98199 •••••",
      verified: true,
      responseRate: "96%",
      responseTime: "< 5 mins"
    },
    description: "Strategically located right off Eastern Express Highway next to Viviana Mall. Secure underground parking, automated boom barrier, EV charging bay."
  },
  {
    id: "pkt-mum-010",
    title: "Panvel Station & Khanda Colony Gated Bay",
    category: "residential",
    address: "Sector 9, Khanda Colony, New Panvel, Navi Mumbai, Maharashtra 410206",
    locality: "Panvel, Navi Mumbai",
    lat: 18.9984,
    lng: 73.1115,
    hourlyPrice: 35,
    dailyPrice: 280,
    monthlyPrice: 3800,
    vehicleTypes: ["four_wheeler", "two_wheeler"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: false,
    hasValet: false,
    isAvailable: true,
    rating: 4.7,
    reviewCount: 42,
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "05:30",
      closeTime: "23:30",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-110",
      name: "Nikhil Patil",
      type: "Homeowner",
      phone: "+91 98207 XXXXX",
      maskedPhone: "+91 98207 •••••",
      verified: true,
      responseRate: "94%",
      responseTime: "< 10 mins"
    },
    description: "Budget-friendly covered spot 5 minutes from Panvel Terminus and Old Mumbai-Pune Highway. Perfect for outstation travellers leaving cars overnight."
  },
  {
    id: "pkt-mum-011",
    title: "Hiranandani Gardens Tech Hub Covered Bay",
    category: "office",
    address: "High Street, Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076",
    locality: "Powai, Mumbai",
    lat: 19.1176,
    lng: 72.9060,
    hourlyPrice: 65,
    dailyPrice: 550,
    monthlyPrice: 7800,
    vehicleTypes: ["four_wheeler", "suv", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: false,
    isAvailable: true,
    rating: 4.9,
    reviewCount: 56,
    image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "07:30",
      closeTime: "22:30",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-111",
      name: "Vikram Shenoy",
      type: "Tech Park Bay Owner",
      phone: "+91 98331 XXXXX",
      maskedPhone: "+91 98331 •••••",
      verified: true,
      responseRate: "99%",
      responseTime: "< 3 mins"
    },
    description: "Basement level B1 reserved spot within Hiranandani Powai. Clean paved flooring, 24/7 guard booth, and slow/fast EV charger option."
  },
  {
    id: "pkt-mum-012",
    title: "Lokhandwala Complex Private Driveway",
    category: "private",
    address: "4th Cross Road, Lokhandwala Complex, Andheri West, Mumbai, Maharashtra 400053",
    locality: "Andheri West, Mumbai",
    lat: 19.1363,
    lng: 72.8277,
    hourlyPrice: 38,
    dailyPrice: 320,
    monthlyPrice: 5200,
    vehicleTypes: ["four_wheeler", "two_wheeler"],
    isCovered: false,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: false,
    hasValet: false,
    isAvailable: false,
    rating: 4.4,
    reviewCount: 19,
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "09:00",
      closeTime: "21:00",
      recurringDays: ["Monday", "Wednesday", "Friday"],
      blockedDates: ["2026-10-02"],
      blockedSlots: []
    },
    owner: {
      id: "own-112",
      name: "Karan Johar",
      type: "Private Homeowner",
      phone: "+91 98200 XXXXX",
      maskedPhone: "+91 98200 •••••",
      verified: true,
      responseRate: "88%",
      responseTime: "< 25 mins"
    },
    description: "Currently booked until tonight. Located right in Lokhandwala Market vicinity. Suitable for weekend café hoppers and shoppers."
  },
  // WORLDWIDE LISTINGS: NEW YORK
  {
    id: "pkt-nyc-001",
    title: "Midtown Manhattan Executive Valet Garage",
    category: "commercial",
    address: "350 5th Avenue, Midtown Manhattan, New York, NY 10118, USA",
    locality: "New York, USA",
    lat: 40.7484,
    lng: -73.9857,
    hourlyPrice: 18,
    dailyPrice: 95,
    monthlyPrice: 650,
    currencySymbol: "$",
    currency: "USD",
    vehicleTypes: ["four_wheeler", "suv", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: true,
    isAvailable: true,
    rating: 4.9,
    reviewCount: 112,
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "00:00",
      closeTime: "23:59",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-nyc-1",
      name: "Marcus Vance",
      type: "Garage Supervisor",
      phone: "+1 212 555 0192",
      maskedPhone: "+1 212 555 ••••",
      verified: true,
      responseRate: "99%",
      responseTime: "< 2 mins"
    },
    description: "Premier climate-controlled covered parking directly across from Empire State Building. Automated license plate recognition and Tesla Superchargers on B2."
  },
  {
    id: "pkt-nyc-002",
    title: "Times Square Broadway Theater Parking Bay",
    category: "event",
    address: "220 W 44th St, Times Square, New York, NY 10036, USA",
    locality: "New York, USA",
    lat: 40.7580,
    lng: -73.9855,
    hourlyPrice: 22,
    dailyPrice: 120,
    monthlyPrice: 780,
    currencySymbol: "$",
    currency: "USD",
    vehicleTypes: ["four_wheeler", "suv", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: true,
    isAvailable: true,
    rating: 4.8,
    reviewCount: 84,
    image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "06:00",
      closeTime: "23:59",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-nyc-2",
      name: "David Chen",
      type: "Theater District Host",
      phone: "+1 917 555 3341",
      maskedPhone: "+1 917 555 ••••",
      verified: true,
      responseRate: "97%",
      responseTime: "< 5 mins"
    },
    description: "Guaranteed reserved parking right next to Broadway theaters. Avoid the post-show gridlock with swift elevator exit and 24/7 security."
  },
  // WORLDWIDE LISTINGS: LONDON
  {
    id: "pkt-ldn-001",
    title: "Westminster Parliament Square Secure Bay",
    category: "office",
    address: "Great George St, Westminster, London SW1P 3AA, United Kingdom",
    locality: "London, UK",
    lat: 51.5014,
    lng: -0.1276,
    hourlyPrice: 14,
    dailyPrice: 70,
    monthlyPrice: 480,
    currencySymbol: "£",
    currency: "GBP",
    vehicleTypes: ["four_wheeler", "suv", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: false,
    isAvailable: true,
    rating: 4.9,
    reviewCount: 96,
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "07:00",
      closeTime: "22:00",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-ldn-1",
      name: "Alistair Finch",
      type: "Commercial Host",
      phone: "+44 20 7946 0912",
      maskedPhone: "+44 20 •••• 0912",
      verified: true,
      responseRate: "100%",
      responseTime: "< 3 mins"
    },
    description: "Inside the London Congestion & ULEZ zone. Secured underground car park with high surveillance, electric barrier pass, and CCS Rapid Chargers."
  },
  {
    id: "pkt-ldn-002",
    title: "Canary Wharf Financial Underground Bay",
    category: "commercial",
    address: "Bank St, Canary Wharf, London E14 5JP, United Kingdom",
    locality: "London, UK",
    lat: 51.5033,
    lng: -0.0195,
    hourlyPrice: 12,
    dailyPrice: 60,
    monthlyPrice: 420,
    currencySymbol: "£",
    currency: "GBP",
    vehicleTypes: ["four_wheeler", "suv", "two_wheeler", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: true,
    isAvailable: true,
    rating: 4.8,
    reviewCount: 65,
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "06:00",
      closeTime: "23:59",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-ldn-2",
      name: "Victoria Sterling",
      type: "Tower Logistics",
      phone: "+44 20 7946 0884",
      maskedPhone: "+44 20 •••• 0884",
      verified: true,
      responseRate: "98%",
      responseTime: "< 4 mins"
    },
    description: "Executive basement parking directly below corporate headquarters in Canary Wharf. Smooth direct link to Jubilee line and Elizabeth line."
  },
  // WORLDWIDE LISTINGS: TOKYO
  {
    id: "pkt-tky-001",
    title: "Shibuya Crossing Automated Parking Tower",
    category: "commercial",
    address: "2 Chome-21-1 Shibuya, Tokyo 150-8510, Japan",
    locality: "Tokyo, Japan",
    lat: 35.6595,
    lng: 139.7005,
    hourlyPrice: 800,
    dailyPrice: 3800,
    monthlyPrice: 32000,
    currencySymbol: "¥",
    currency: "JPY",
    vehicleTypes: ["four_wheeler", "suv"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: false,
    isAvailable: true,
    rating: 4.9,
    reviewCount: 140,
    image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "00:00",
      closeTime: "23:59",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-tky-1",
      name: "Kenji Sato",
      type: "Tower Operator",
      phone: "+81 3 5555 0143",
      maskedPhone: "+81 3 •••• 0143",
      verified: true,
      responseRate: "100%",
      responseTime: "< 1 min"
    },
    description: "State-of-the-art robotic stacking parking tower 90 meters from Shibuya Scramble Crossing. Fast automated retrieval in under 90 seconds."
  },
  // WORLDWIDE LISTINGS: PARIS
  {
    id: "pkt-par-001",
    title: "Champs-Élysées Franklin Roosevelt Covered Lot",
    category: "commercial",
    address: "Av. des Champs-Élysées, 75008 Paris, France",
    locality: "Paris, France",
    lat: 48.8698,
    lng: 2.3075,
    hourlyPrice: 15,
    dailyPrice: 75,
    monthlyPrice: 520,
    currencySymbol: "€",
    currency: "EUR",
    vehicleTypes: ["four_wheeler", "suv", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: true,
    isAvailable: true,
    rating: 4.9,
    reviewCount: 78,
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "06:00",
      closeTime: "23:30",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-par-1",
      name: "Jean-Pierre Laurent",
      type: "Stationnement Gestionnaire",
      phone: "+33 1 42 68 00 22",
      maskedPhone: "+33 1 •• •• 00 22",
      verified: true,
      responseRate: "96%",
      responseTime: "< 5 mins"
    },
    description: "Prime covered parking in the 8th arrondissement. Wide ramp access accommodating large vehicles, clean barrier entry with PIN keypad."
  },
  // WORLDWIDE LISTINGS: DUBAI
  {
    id: "pkt-dxb-001",
    title: "Downtown Dubai Burj Khalifa Boulevard Bay",
    category: "commercial",
    address: "Sheikh Mohammed bin Rashid Blvd, Downtown Dubai, UAE",
    locality: "Dubai, UAE",
    lat: 25.1972,
    lng: 55.2744,
    hourlyPrice: 35,
    dailyPrice: 220,
    monthlyPrice: 1600,
    currencySymbol: "AED ",
    currency: "AED",
    vehicleTypes: ["four_wheeler", "suv", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: true,
    isAvailable: true,
    rating: 4.9,
    reviewCount: 185,
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "00:00",
      closeTime: "23:59",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-dxb-1",
      name: "Tariq Al-Mansoor",
      type: "Boulevard Facility Manager",
      phone: "+971 4 367 0000",
      maskedPhone: "+971 4 ••• ••••",
      verified: true,
      responseRate: "100%",
      responseTime: "< 2 mins"
    },
    description: "Direct air-conditioned pedestrian link to Dubai Mall and Burj Khalifa. High security clearance, wide supercar-friendly bays, and valet assist."
  },
  // WORLDWIDE LISTINGS: SINGAPORE
  {
    id: "pkt-sin-001",
    title: "Marina Bay Financial Centre Tower Parking",
    category: "office",
    address: "10 Marina Blvd, Marina Bay, Singapore 018983",
    locality: "Singapore",
    lat: 1.2805,
    lng: 103.8540,
    hourlyPrice: 8,
    dailyPrice: 45,
    monthlyPrice: 380,
    currencySymbol: "S$",
    currency: "SGD",
    vehicleTypes: ["four_wheeler", "suv", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: false,
    isAvailable: true,
    rating: 4.9,
    reviewCount: 92,
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "06:00",
      closeTime: "23:59",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-sin-1",
      name: "Wei Ling Tan",
      type: "Commercial Host",
      phone: "+65 6789 0123",
      maskedPhone: "+65 6789 ••••",
      verified: true,
      responseRate: "99%",
      responseTime: "< 3 mins"
    },
    description: "Clean, ultra-secure basement bay in Singapore's financial core. Electronic ERP barrier sync and 50kW DC fast charging."
  },
  // WORLDWIDE LISTINGS: SYDNEY
  {
    id: "pkt-syd-001",
    title: "Sydney CBD Harbour Bridge View Parking",
    category: "commercial",
    address: "George St, The Rocks, Sydney NSW 2000, Australia",
    locality: "Sydney, Australia",
    lat: -33.8588,
    lng: 151.2090,
    hourlyPrice: 16,
    dailyPrice: 80,
    monthlyPrice: 550,
    currencySymbol: "A$",
    currency: "AUD",
    vehicleTypes: ["four_wheeler", "suv", "two_wheeler", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: false,
    isAvailable: true,
    rating: 4.8,
    reviewCount: 71,
    image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "06:30",
      closeTime: "23:00",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-syd-1",
      name: "Liam O'Connor",
      type: "Harbour Properties",
      phone: "+61 2 9250 0111",
      maskedPhone: "+61 2 •••• 0111",
      verified: true,
      responseRate: "97%",
      responseTime: "< 5 mins"
    },
    description: "Short walk to Circular Quay, Sydney Opera House and Barangaroo. Covered multi-deck bay with automated boom gate access."
  },
  // WORLDWIDE LISTINGS: BERLIN
  {
    id: "pkt-ber-001",
    title: "Berlin Alexanderplatz Central Underground Lot",
    category: "commercial",
    address: "Alexanderstraße, 10178 Berlin, Germany",
    locality: "Berlin, Germany",
    lat: 52.5219,
    lng: 13.4132,
    hourlyPrice: 10,
    dailyPrice: 50,
    monthlyPrice: 360,
    currencySymbol: "€",
    currency: "EUR",
    vehicleTypes: ["four_wheeler", "suv", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: false,
    isAvailable: true,
    rating: 4.7,
    reviewCount: 59,
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "00:00",
      closeTime: "23:59",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-ber-1",
      name: "Maximilian Weber",
      type: "Parkhaus Manager",
      phone: "+49 30 2400 0012",
      maskedPhone: "+49 30 •••• 0012",
      verified: true,
      responseRate: "98%",
      responseTime: "< 4 mins"
    },
    description: "Spacious underground parkhaus right beneath Alexanderplatz. Easy navigation, EV charging pillars, 24/7 staff support."
  },
  // WORLDWIDE LISTINGS: TORONTO
  {
    id: "pkt-tor-001",
    title: "Toronto Downtown Financial District Bay",
    category: "office",
    address: "Bay St & King St W, Toronto, ON M5H 2Y4, Canada",
    locality: "Toronto, Canada",
    lat: 43.6487,
    lng: -79.3817,
    hourlyPrice: 15,
    dailyPrice: 75,
    monthlyPrice: 490,
    currencySymbol: "C$",
    currency: "CAD",
    vehicleTypes: ["four_wheeler", "suv", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: false,
    isAvailable: true,
    rating: 4.8,
    reviewCount: 68,
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "06:00",
      closeTime: "23:00",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-tor-1",
      name: "Ethan Tremblay",
      type: "Tower Host",
      phone: "+1 416 555 0184",
      maskedPhone: "+1 416 555 ••••",
      verified: true,
      responseRate: "99%",
      responseTime: "< 2 mins"
    },
    description: "Heated underground commercial lot directly connected to PATH underground walkway system. Perfect in winter and summer alike."
  },
  // WORLDWIDE LISTINGS: SAN FRANCISCO
  {
    id: "pkt-sfo-001",
    title: "San Francisco Union Square & Financial Garage",
    category: "commercial",
    address: "Post St, Union Square, San Francisco, CA 94108, USA",
    locality: "San Francisco, USA",
    lat: 37.7885,
    lng: -122.4075,
    hourlyPrice: 16,
    dailyPrice: 85,
    monthlyPrice: 620,
    currencySymbol: "$",
    currency: "USD",
    vehicleTypes: ["four_wheeler", "suv", "ev"],
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: true,
    isAvailable: true,
    rating: 4.8,
    reviewCount: 94,
    image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80"
    ],
    schedule: {
      openTime: "06:00",
      closeTime: "23:59",
      recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      blockedDates: [],
      blockedSlots: []
    },
    owner: {
      id: "own-sfo-1",
      name: "Sarah Jenkins",
      type: "Property Partner",
      phone: "+1 415 555 0127",
      maskedPhone: "+1 415 555 ••••",
      verified: true,
      responseRate: "98%",
      responseTime: "< 5 mins"
    },
    description: "Secure indoor garage in downtown San Francisco. 24/7 security attendant, high gate clearance, and level 2 EV charging stations."
  }
];

/**
 * Generates realistic nearby sample listings around any worldwide coordinate
 * when no pre-configured sample listings are within proximity range.
 * This guarantees PARKIT works seamlessly across the entire globe!
 */
export function generateNearbySampleSpots(centerLat, centerLng, localityLabel = "Local Area") {
  const categories = ["commercial", "residential", "office", "private", "mall"];
  const spotTypes = [
    { title: "Central Executive Bay", cat: "commercial", price: 65, symbol: "₹" },
    { title: "Gated Resident Visitor Parking", cat: "residential", price: 45, symbol: "₹" },
    { title: "Tower Basement Reserved Bay", cat: "office", price: 75, symbol: "₹" },
    { title: "Private Driveway Shaded Spot", cat: "private", price: 40, symbol: "₹" }
  ];

  // Distribute 4 realistic spots around the coordinate (between 80m and 450m)
  const offsets = [
    { dLat: 0.0012, dLng: 0.0015 },
    { dLat: -0.0018, dLng: 0.0011 },
    { dLat: 0.0016, dLng: -0.0022 },
    { dLat: -0.0014, dLng: -0.0016 }
  ];

  const images = [
    "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80"
  ];

  return spotTypes.map((template, idx) => {
    const lat = Number((centerLat + offsets[idx].dLat).toFixed(6));
    const lng = Number((centerLng + offsets[idx].dLng).toFixed(6));
    const id = `pkt-geo-${Math.abs(Math.round(lat * 1000))}-${Math.abs(Math.round(lng * 1000))}-${idx}`;

    return {
      id,
      title: `${localityLabel.split(",")[0].trim()} ${template.title}`,
      category: template.cat,
      address: `Near ${localityLabel}`,
      locality: localityLabel,
      lat,
      lng,
      hourlyPrice: template.price,
      dailyPrice: template.price * 8,
      monthlyPrice: template.price * 100,
      currencySymbol: template.symbol,
      vehicleTypes: ["four_wheeler", "suv", "two_wheeler", "ev"],
      isCovered: idx % 2 === 0,
      hasCCTV: true,
      hasSecurity: true,
      hasEVCharging: idx === 0 || idx === 2,
      hasValet: idx === 0,
      isAvailable: true,
      rating: Number((4.6 + (idx * 0.1)).toFixed(1)),
      reviewCount: 24 + idx * 18,
      image: images[idx % images.length],
      images: [images[idx % images.length]],
      schedule: {
        openTime: "06:00",
        closeTime: "23:59",
        recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        blockedDates: [],
        blockedSlots: []
      },
      owner: {
        id: `own-geo-${idx}`,
        name: idx === 0 ? "Alex Morgan" : idx === 1 ? "Priya Sharma" : idx === 2 ? "James Wilson" : "Elena Rostova",
        type: "Verified Host",
        phone: "+1 800 555 0100",
        maskedPhone: "+1 800 ••• ••••",
        verified: true,
        responseRate: "98%",
        responseTime: "< 5 mins"
      },
      description: `Guaranteed reserved parking space situated conveniently in ${localityLabel}. Clean, well-maintained with barrier entrance and 24/7 security verification.`
    };
  });
}

