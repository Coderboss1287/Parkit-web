/**
 * PARKIT Hexagonal Proximity Search Algorithm
 * Implements a mathematically consistent hexagonal spatial grid with ring expansion:
 * Ring 0: 1 cell (Customer's current spot)
 * Ring 1: 6 cells
 * Ring 2: 12 cells
 * Ring 3: 18 cells
 * Ring k: 6 * k cells
 */

// Earth radius in meters
const EARTH_RADIUS = 6378137;

/**
 * Calculates distance between two coordinates in meters (Haversine formula)
 */
export function getDistanceMeters(lat1, lng1, lat2, lng2) {
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS * c);
}

/**
 * Offset lat/lng by dx, dy in meters
 */
export function offsetLatLng(lat, lng, dx, dy) {
  const dLat = (dy / EARTH_RADIUS) * (180 / Math.PI);
  const dLng = (dx / (EARTH_RADIUS * Math.cos((lat * Math.PI) / 180))) * (180 / Math.PI);
  return {
    lat: lat + dLat,
    lng: lng + dLng
  };
}

/**
 * Computes vertices for a regular hexagon centered at (lat, lng) with radius (meters)
 */
export function getHexagonPolygon(centerLat, centerLng, radiusMeters) {
  const vertices = [];
  for (let i = 0; i < 6; i++) {
    // Pointy topped hexagon angle: 30, 90, 150, 210, 270, 330 deg
    const angle = (Math.PI / 180) * (60 * i - 30);
    const dx = radiusMeters * Math.cos(angle);
    const dy = radiusMeters * Math.sin(angle);
    const pt = offsetLatLng(centerLat, centerLng, dx, dy);
    vertices.push([pt.lat, pt.lng]);
  }
  return vertices;
}

/**
 * Generates hexagonal grid rings around centerLat, centerLng
 * @param {number} centerLat
 * @param {number} centerLng
 * @param {number} hexRadiusMeters - radius of individual hexagon (default 75m for smooth visual display)
 * @param {number} maxRings - number of concentric rings to generate
 */
export function generateHexagonalRings(centerLat, centerLng, hexRadiusMeters = 80, maxRings = 4) {
  // Spacing between adjacent hexagon centers
  const dxStep = Math.sqrt(3) * hexRadiusMeters;
  const dyStep = (3 / 2) * hexRadiusMeters;

  const rings = [];
  const visitedCellKeys = new Set();

  for (let r = 0; r <= maxRings; r++) {
    const ringCells = [];

    if (r === 0) {
      // Ring 0: Center cell
      const key = "0,0";
      visitedCellKeys.add(key);
      ringCells.push({
        id: `hex-0-0`,
        ring: 0,
        center: { lat: centerLat, lng: centerLng },
        polygon: getHexagonPolygon(centerLat, centerLng, hexRadiusMeters),
        radius: hexRadiusMeters,
        status: "unsearched", // "unsearched" | "searching" | "found" | "empty"
        matchingListings: [],
        distanceMeters: 0
      });
    } else {
      // Axial directions for pointy-top hexagon rings
      const directions = [
        { q: 1, r: -1 },
        { q: 1, r: 0 },
        { q: 0, r: 1 },
        { q: -1, r: 1 },
        { q: -1, r: 0 },
        { q: 0, r: -1 }
      ];

      // Start at position for ring r
      let curQ = 0;
      let curR = -r;

      for (let side = 0; side < 6; side++) {
        for (let step = 0; step < r; step++) {
          const key = `${curQ},${curR}`;
          if (!visitedCellKeys.has(key)) {
            visitedCellKeys.add(key);

            // Compute Cartesian offset from axial coords
            const posX = hexRadiusMeters * Math.sqrt(3) * (curQ + curR / 2);
            const posY = hexRadiusMeters * (3 / 2) * curR;

            const cellCenter = offsetLatLng(centerLat, centerLng, posX, posY);
            const distance = getDistanceMeters(centerLat, centerLng, cellCenter.lat, cellCenter.lng);

            ringCells.push({
              id: `hex-${r}-${side}-${step}`,
              ring: r,
              center: cellCenter,
              polygon: getHexagonPolygon(cellCenter.lat, cellCenter.lng, hexRadiusMeters),
              radius: hexRadiusMeters,
              status: "unsearched",
              matchingListings: [],
              distanceMeters: distance
            });
          }

          curQ += directions[side].q;
          curR += directions[side].r;
        }
      }
    }

    rings.push({
      ringNumber: r,
      cellCount: ringCells.length,
      cells: ringCells
    });
  }

  return rings;
}

/**
 * Matches listings to a given hexagon cell
 */
export function findListingsInCell(cell, allListings, filters = {}) {
  return allListings.filter((listing) => {
    // Spatial proximity to cell center (within cell radius * 1.25)
    const dist = getDistanceMeters(cell.center.lat, cell.center.lng, listing.lat, listing.lng);
    if (dist > cell.radius * 1.35) return false;

    // Filter checks
    if (filters.category && filters.category !== "all" && listing.category !== filters.category) {
      return false;
    }
    if (filters.vehicleType && !listing.vehicleTypes.includes(filters.vehicleType)) {
      return false;
    }
    if (filters.maxPrice && listing.hourlyPrice > filters.maxPrice) {
      return false;
    }
    if (filters.isCovered && !listing.isCovered) {
      return false;
    }
    if (filters.hasEV && !listing.hasEVCharging) {
      return false;
    }
    if (filters.hasSecurity && !listing.hasSecurity) {
      return false;
    }
    if (filters.requireAvailableOnly && !listing.isAvailable) {
      return false;
    }

    return true;
  });
}
