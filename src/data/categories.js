export const PARKING_CATEGORIES = [
  {
    id: "private",
    name: "Private Parking",
    shortName: "Private",
    baseHourlyPrice: 30,
    icon: "Home",
    description: "Independent bungalow driveways, private villas, and dedicated personal spaces.",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200"
  },
  {
    id: "residential",
    name: "Residential / Society Parking",
    shortName: "Residential",
    baseHourlyPrice: 40,
    icon: "Building2",
    description: "Secure visitor bays and vacant resident spots in gated housing societies.",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
  },
  {
    id: "office",
    name: "Office Parking",
    shortName: "Office",
    baseHourlyPrice: 60,
    icon: "Briefcase",
    description: "Executive basement spots and tech park parking available on weekdays/weekends.",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200"
  },
  {
    id: "commercial",
    name: "Commercial Building Parking",
    shortName: "Commercial",
    baseHourlyPrice: 80,
    icon: "Building",
    description: "Multi-level parking towers in commercial business hubs with dedicated security.",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200"
  },
  {
    id: "mall",
    name: "Mall / Shopping Complex Parking",
    shortName: "Mall / Shopping",
    baseHourlyPrice: 100,
    icon: "ShoppingBag",
    description: "Prime covered parking near premier shopping centres and retail malls.",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200"
  },
  {
    id: "hospital",
    name: "Hospital Parking",
    shortName: "Hospital",
    baseHourlyPrice: 70,
    icon: "HeartPulse",
    description: "Priority reserved spaces in and adjacent to major medical centres.",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-200"
  },
  {
    id: "event",
    name: "Event Parking",
    shortName: "Event",
    baseHourlyPrice: 100,
    icon: "Ticket",
    description: "Managed parking near stadiums, concert grounds, and convention centres.",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-200"
  },
  {
    id: "other",
    name: "Other Parking",
    shortName: "Other",
    baseHourlyPrice: 40,
    icon: "Compass",
    description: "Open secured transit plots, transit station lots, and community spaces.",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-200"
  }
];

export const VEHICLE_TYPES = [
  { id: "four_wheeler", label: "Car / Hatchback / Sedan", icon: "Car", multiplier: 1.0 },
  { id: "suv", label: "SUV / Large Car", icon: "Truck", multiplier: 1.25 },
  { id: "two_wheeler", label: "Two Wheeler / Bike", icon: "Bike", multiplier: 0.45 },
  { id: "ev", label: "Electric Vehicle (EV)", icon: "Zap", multiplier: 1.15 }
];

export const LOCALITIES_MUMBAI = [
  { name: "All Localities", lat: 19.0760, lng: 72.8777, zoom: 11 },
  { name: "Bandra West, Mumbai", lat: 19.0596, lng: 72.8295, zoom: 14 },
  { name: "BKC (Bandra Kurla Complex), Mumbai", lat: 19.0657, lng: 72.8687, zoom: 14 },
  { name: "Lower Parel, Mumbai", lat: 18.9953, lng: 72.8304, zoom: 14 },
  { name: "Colaba / Fort, South Mumbai", lat: 18.9220, lng: 72.8347, zoom: 14 },
  { name: "Andheri West, Mumbai", lat: 19.1363, lng: 72.8277, zoom: 14 },
  { name: "Powai, Mumbai", lat: 19.1176, lng: 72.9060, zoom: 14 },
  { name: "Vashi Sector 17, Navi Mumbai", lat: 19.0771, lng: 72.9986, zoom: 14 },
  { name: "Vashi Railway Station, Navi Mumbai", lat: 19.0645, lng: 72.9950, zoom: 14 },
  { name: "CBD Belapur, Navi Mumbai", lat: 19.0197, lng: 73.0427, zoom: 14 },
  { name: "Panvel, Navi Mumbai", lat: 18.9894, lng: 73.1175, zoom: 14 },
  { name: "Naupada, Thane West", lat: 19.1860, lng: 72.9734, zoom: 14 },
  { name: "Ghodbunder Road, Thane", lat: 19.2612, lng: 72.9647, zoom: 14 }
];
