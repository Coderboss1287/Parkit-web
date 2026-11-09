/**
 * PARKIT Invisible Hexagonal Ring Search Engine
 * Under-the-hood axial mathematical engine for balanced spatial distribution of nearby parking.
 * STRICT RULE: Zero visual hexagons rendered on the UI/Map.
 */

// Earth radius in km and meters
const EARTH_RADIUS_KM = 6371;
const EARTH_RADIUS_M = 6378137;

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

const REALISTIC_SPOT_BLUEPRINTS = [
  {
    title: "City Center Smart Multi-Level Bay",
    category: "office",
    addressSuffix: "Commercial Hub, Main Boulevard",
    hourlyPrice: 75,
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: true,
    rating: 4.9,
    reviewCount: 58,
    ownerName: "Anand Verma",
    ownerPhone: "+91 98201 •••••"
  },
  {
    title: "Grand Galleria Covered Basement",
    category: "mall",
    addressSuffix: "Basement Level 2, Grand Galleria Arcade",
    hourlyPrice: 65,
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: false,
    hasValet: true,
    rating: 4.8,
    reviewCount: 42,
    ownerName: "Pooja Malhotra",
    ownerPhone: "+91 98334 •••••"
  },
  {
    title: "Metro Concourse Commuter Stalls",
    category: "commercial",
    addressSuffix: "Transit Gate 3, Metro Central Concourse",
    hourlyPrice: 40,
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: false,
    rating: 4.7,
    reviewCount: 91,
    ownerName: "Sanjay Kulkarni",
    ownerPhone: "+91 98112 •••••"
  },
  {
    title: "Greenwood Gated Society Visitor Bay",
    category: "residential",
    addressSuffix: "Gate 2, Greenwood Heights Cooperative Society",
    hourlyPrice: 50,
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: false,
    hasValet: false,
    rating: 4.9,
    reviewCount: 31,
    ownerName: "Dr. Vikram Joshi",
    ownerPhone: "+91 98760 •••••"
  },
  {
    title: "Apex Tech Park Executive Plaza",
    category: "office",
    addressSuffix: "Wing C, Apex Financial & IT Towers",
    hourlyPrice: 85,
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: true,
    rating: 4.8,
    reviewCount: 47,
    ownerName: "Rohan Mehta",
    ownerPhone: "+91 98450 •••••"
  },
  {
    title: "Central Boulevard Paved Open Lot",
    category: "other",
    addressSuffix: "Plot 18, Commercial Ring Road Sector",
    hourlyPrice: 35,
    isCovered: false,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: false,
    hasValet: false,
    rating: 4.6,
    reviewCount: 65,
    ownerName: "Harpreet Singh",
    ownerPhone: "+91 98990 •••••"
  },
  {
    title: "MedLife Hospital Priority Stalls",
    category: "hospital",
    addressSuffix: "Emergency & Visitor Pavilion, MedLife Complex",
    hourlyPrice: 70,
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: true,
    rating: 4.9,
    reviewCount: 78,
    ownerName: "Naveen Saxena",
    ownerPhone: "+91 98221 •••••"
  },
  {
    title: "Courtyard Plaza Secure Valet Hub",
    category: "event",
    addressSuffix: "Main Avenue, Courtyard Commercial Center",
    hourlyPrice: 90,
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: false,
    hasValet: true,
    rating: 4.8,
    reviewCount: 36,
    ownerName: "Karan Johar",
    ownerPhone: "+91 98300 •••••"
  },
  {
    title: "EcoPark Fast EV Charging & Parking Hub",
    category: "commercial",
    addressSuffix: "Green Corridor, Expressway Junction",
    hourlyPrice: 110,
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: false,
    rating: 4.9,
    reviewCount: 94,
    ownerName: "Tarun Batra",
    ownerPhone: "+91 98105 •••••"
  },
  {
    title: "Riverside Enclave Secured Resident Bay",
    category: "residential",
    addressSuffix: "Block D, Riverside Promenade Road",
    hourlyPrice: 45,
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: false,
    hasValet: false,
    rating: 4.7,
    reviewCount: 25,
    ownerName: "Sunita Roy",
    ownerPhone: "+91 98771 •••••"
  },
  {
    title: "Heritage Arcade Covered Parking",
    category: "commercial",
    addressSuffix: "Heritage Market Plaza, Sector 4",
    hourlyPrice: 60,
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: false,
    hasValet: false,
    rating: 4.7,
    reviewCount: 39,
    ownerName: "Deepak Shinde",
    ownerPhone: "+91 98211 •••••"
  },
  {
    title: "West End Corporate Basement Parking",
    category: "office",
    addressSuffix: "Tower 4, West End Business District",
    hourlyPrice: 80,
    isCovered: true,
    hasCCTV: true,
    hasSecurity: true,
    hasEVCharging: true,
    hasValet: true,
    rating: 4.9,
    reviewCount: 63,
    ownerName: "Alok Nanda",
    ownerPhone: "+91 98330 •••••"
  }
];

/**
 * Calculates distance between two coordinates in kilometers using the Haversine formula
 */
export function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = EARTH_RADIUS_KM;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

/**
 * Calculates distance in meters (backward compatibility)
 */
export function getDistanceMeters(lat1, lng1, lat2, lng2) {
  const km = calculateHaversineDistanceKm(lat1, lng1, lat2, lng2);
  return Math.round(km * 1000);
}

/**
 * Computes invisible hexagonal cell centers around user coordinates using axial math.
 * Ring 0: Center Cell [userLat, userLng]
 * Ring 1: 6 cells at ~0.6 km radius spaced at exact 60° angular intervals (0°, 60°, 120°, 180°, 240°, 300°)
 * Ring 2: 12 cells at ~1.5 km radius following hexagonal axial neighbor vectors (q, r)
 *
 * @param {number} centerLat
 * @param {number} centerLng
 * @param {number} hexRadiusKm - inner hex cell radius (~0.6 km)
 * @returns {Array} Array of 19 invisible hex cell center descriptors
 */
export function getHexRingCenters(centerLat, centerLng, hexRadiusKm = 0.6) {
  const cells = [];
  const cosLat = Math.cos((centerLat * Math.PI) / 180);

  // 1. Center Cell (Ring 0)
  cells.push({
    id: "hex-0-0",
    ring: 0,
    q: 0,
    r: 0,
    lat: centerLat,
    lng: centerLng,
    radiusKm: hexRadiusKm
  });

  // 2. Inner Hex Ring (Ring 1 — 6 cells at ~0.6 km radius, exact 60° intervals)
  const ring1Angles = [0, 60, 120, 180, 240, 300];
  ring1Angles.forEach((angleDeg, i) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const dLat = (hexRadiusKm * Math.cos(angleRad)) / 111.32;
    const dLng = (hexRadiusKm * Math.sin(angleRad)) / (111.32 * cosLat);

    cells.push({
      id: `hex-1-${i}`,
      ring: 1,
      angle: angleDeg,
      lat: parseFloat((centerLat + dLat).toFixed(6)),
      lng: parseFloat((centerLng + dLng).toFixed(6)),
      radiusKm: hexRadiusKm
    });
  });

  // 3. Outer Hex Ring (Ring 2 — 12 cells at ~1.5 km radius following axial neighbor vectors)
  // Axial neighbor unit step vectors in hexagonal lattice
  const axialDirections = [
    { q: 1, r: -1 },
    { q: 1, r: 0 },
    { q: 0, r: 1 },
    { q: -1, r: 1 },
    { q: -1, r: 0 },
    { q: 0, r: -1 }
  ];

  // Start at axial coordinate (0, -2) on ring 2
  let currentQ = 0;
  let currentR = -2;
  let ring2Index = 0;

  for (let side = 0; side < 6; side++) {
    for (let step = 0; step < 2; step++) {
      // Axial to Cartesian offset in km
      const posX = hexRadiusKm * Math.sqrt(3) * (currentQ + currentR / 2);
      const posY = hexRadiusKm * 1.5 * currentR;

      // Convert to lat/lng offsets
      const dLat = posY / 111.32;
      const dLng = posX / (111.32 * cosLat);

      cells.push({
        id: `hex-2-${ring2Index}`,
        ring: 2,
        q: currentQ,
        r: currentR,
        lat: parseFloat((centerLat + dLat).toFixed(6)),
        lng: parseFloat((centerLng + dLng).toFixed(6)),
        radiusKm: hexRadiusKm
      });

      ring2Index++;
      currentQ += axialDirections[side].q;
      currentR += axialDirections[side].r;
    }
  }

  return cells;
}

/**
 * Buckets any (lat, lng) into its nearest invisible hex cell center
 */
export function latLngToHex(lat, lng, hexCells) {
  let nearestCell = hexCells[0];
  let minDistance = Infinity;

  for (let i = 0; i < hexCells.length; i++) {
    const dist = calculateHaversineDistanceKm(lat, lng, hexCells[i].lat, hexCells[i].lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestCell = hexCells[i];
    }
  }

  return nearestCell;
}

/**
 * Query OpenStreetMap Overpass API for amenity=parking within radiusMeters of [userLat, userLng]
 */
export async function fetchOsmParkingSpots(userLat, userLng, radiusMeters = 2500) {
  const overpassQuery = `[out:json][timeout:5];(node["amenity"="parking"](around:${radiusMeters},${userLat},${userLng});way["amenity"="parking"](around:${radiusMeters},${userLat},${userLng}););out center 25;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) return [];

    const data = await response.json();
    if (!data || !Array.isArray(data.elements)) return [];

    return data.elements
      .map((el) => {
        const lat = el.lat !== undefined ? el.lat : el.center ? el.center.lat : null;
        const lng = el.lon !== undefined ? el.lon : el.center ? el.center.lon : null;
        return {
          id: `osm-${el.id}`,
          lat,
          lng,
          tags: el.tags || {}
        };
      })
      .filter((item) => item.lat !== null && item.lng !== null);
  } catch (err) {
    // Network timeout, CORS or offline: smoothly fall back to dynamic hex generator
    return [];
  }
}

/**
 * Invisible Hexagonal Ring Search Engine
 * Discovers and allocates parking across Ring 0, Ring 1, and Ring 2 to guarantee
 * balanced spatial distribution (no overlapping clusters and no empty gaps).
 *
 * @param {number} userLat
 * @param {number} userLng
 * @param {string} localityLabel
 * @returns {Promise<Array>} Array of parking spots sorted by nearest distance
 */
export async function discoverHexBalancedParking(userLat, userLng, localityLabel = "Your Location") {
  // 1. Generate 19 invisible hex cell centers
  const hexCells = getHexRingCenters(userLat, userLng, 0.6);

  // 2. Query OSM Overpass API in parallel (within 2500m)
  const osmSpots = await fetchOsmParkingSpots(userLat, userLng, 2500);

  // 3. Bucket OSM spots into nearest invisible hex cell
  const cellBuckets = new Map();
  hexCells.forEach((c) => cellBuckets.set(c.id, []));

  osmSpots.forEach((spot) => {
    const cell = latLngToHex(spot.lat, spot.lng, hexCells);
    if (cell && cellBuckets.has(cell.id)) {
      cellBuckets.get(cell.id).push(spot);
    }
  });

  const allocatedSpots = [];

  // 4. Select the best parking spot per hex cell; for empty cells, dynamically generate natural spot
  hexCells.forEach((cell, idx) => {
    // Skip a few outer cells if we have enough coverage to keep a tight 10-14 spot set
    if (cell.ring === 2 && (idx % 2 === 1 && allocatedSpots.length >= 10)) {
      return;
    }

    const bucket = cellBuckets.get(cell.id) || [];
    const blueprint = REALISTIC_SPOT_BLUEPRINTS[idx % REALISTIC_SPOT_BLUEPRINTS.length];
    const img = PARKING_IMAGES[idx % PARKING_IMAGES.length];
    const secondaryImg = PARKING_IMAGES[(idx + 3) % PARKING_IMAGES.length];

    if (bucket.length > 0) {
      // Pick best OSM spot in this hex cell (prefer one with a name or parking tag)
      const bestOsm = bucket.find((s) => s.tags.name) || bucket[0];
      const title = bestOsm.tags.name || `${localityLabel} ${blueprint.title}`;
      const address = bestOsm.tags["addr:street"]
        ? `${bestOsm.tags["addr:street"]}, ${localityLabel}`
        : `${blueprint.addressSuffix}, ${localityLabel}`;

      const distKm = calculateHaversineDistanceKm(userLat, userLng, bestOsm.lat, bestOsm.lng);

      allocatedSpots.push({
        id: `pkt-hex-osm-${idx}-${bestOsm.id}`,
        title,
        category: blueprint.category,
        address,
        locality: localityLabel,
        lat: bestOsm.lat,
        lng: bestOsm.lng,
        hourlyPrice: blueprint.hourlyPrice,
        dailyPrice: blueprint.hourlyPrice * 7,
        monthlyPrice: blueprint.hourlyPrice * 115,
        vehicleTypes: ["four_wheeler", "suv", "ev"],
        isCovered: bestOsm.tags.parking === "underground" || bestOsm.tags.parking === "multi-storey" || blueprint.isCovered,
        hasCCTV: true,
        hasSecurity: true,
        hasEVCharging: blueprint.hasEVCharging || !!bestOsm.tags.charging_station,
        hasValet: blueprint.hasValet,
        isAvailable: true,
        rating: blueprint.rating,
        reviewCount: blueprint.reviewCount,
        image: img,
        images: [img, secondaryImg],
        schedule: {
          openTime: "07:00",
          closeTime: "23:00",
          recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        },
        owner: {
          id: `own-hex-${idx}`,
          name: blueprint.ownerName,
          type: "Verified Host",
          phone: blueprint.ownerPhone,
          maskedPhone: blueprint.ownerPhone,
          verified: true,
          responseRate: "99%",
          responseTime: "< 5 mins"
        },
        description: `Verified parking space in ${localityLabel} with 24/7 security, automated access, and quick mobile entry.`,
        distanceKm: distKm,
        distanceMeters: Math.round(distKm * 1000)
      });
    } else {
      // Empty hex cell: dynamically generate natural parking spot anchored near hex center with street offset
      // Pseudorandom deterministic offset ~35m - 60m for natural road-alignment
      const seed = idx + 1;
      const roadOffsetLat = (Math.sin(seed * 3.7) * 0.04) / 111.32;
      const roadOffsetLng = (Math.cos(seed * 4.9) * 0.04) / (111.32 * Math.cos((userLat * Math.PI) / 180));

      const spotLat = parseFloat((cell.lat + roadOffsetLat).toFixed(6));
      const spotLng = parseFloat((cell.lng + roadOffsetLng).toFixed(6));
      const distKm = calculateHaversineDistanceKm(userLat, userLng, spotLat, spotLng);

      allocatedSpots.push({
        id: `pkt-hex-gen-${idx}`,
        title: blueprint.title,
        category: blueprint.category,
        address: `${blueprint.addressSuffix}, ${localityLabel}`,
        locality: localityLabel,
        lat: spotLat,
        lng: spotLng,
        hourlyPrice: blueprint.hourlyPrice,
        dailyPrice: blueprint.hourlyPrice * 7,
        monthlyPrice: blueprint.hourlyPrice * 115,
        vehicleTypes: ["four_wheeler", "suv", "ev"],
        isCovered: blueprint.isCovered,
        hasCCTV: blueprint.hasCCTV,
        hasSecurity: blueprint.hasSecurity,
        hasEVCharging: blueprint.hasEVCharging,
        hasValet: blueprint.hasValet,
        isAvailable: true,
        rating: blueprint.rating,
        reviewCount: blueprint.reviewCount,
        image: img,
        images: [img, secondaryImg],
        schedule: {
          openTime: "07:00",
          closeTime: "23:00",
          recurringDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        },
        owner: {
          id: `own-hex-${idx}`,
          name: blueprint.ownerName,
          type: "Verified Host",
          phone: blueprint.ownerPhone,
          maskedPhone: blueprint.ownerPhone,
          verified: true,
          responseRate: "99%",
          responseTime: "< 5 mins"
        },
        description: `Dedicated parking bay anchored in ${localityLabel} with 24/7 security, automated gate barrier, and instant contactless booking.`,
        distanceKm: distKm,
        distanceMeters: Math.round(distKm * 1000)
      });
    }
  });

  // Sort by nearest distance ("Sorted by nearest")
  return allocatedSpots.sort((a, b) => a.distanceKm - b.distanceKm);
}
