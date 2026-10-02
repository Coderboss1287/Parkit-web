/**
 * PARKIT Dynamic Pricing & AI Suggestion Engine
 * Formula:
 * Suggested Price = Category Base Price + Location Adjustment + Facility Premium + Demand Adjustment
 */

export const BASE_CATEGORY_PRICES = {
  private: 30,
  residential: 40,
  office: 60,
  commercial: 80,
  mall: 100,
  hospital: 70,
  event: 100,
  other: 40
};

export const LOCATION_PREMIUMS = {
  "Colaba / Fort, South Mumbai": 35,
  "BKC (Bandra Kurla Complex), Mumbai": 30,
  "Lower Parel, Mumbai": 25,
  "Bandra West, Mumbai": 20,
  "Powai, Mumbai": 15,
  "Andheri West, Mumbai": 12,
  "Vashi Sector 17, Navi Mumbai": 10,
  "Vashi Railway Station, Navi Mumbai": 5,
  "CBD Belapur, Navi Mumbai": 5,
  "Naupada, Thane West": 10,
  "Ghodbunder Road, Thane": 5,
  "Panvel, Navi Mumbai": 0,
  "default": 10
};

export function calculateSuggestedPrice({
  category = "residential",
  locality = "default",
  isCovered = false,
  hasCCTV = false,
  hasSecurity = false,
  hasEVCharging = false,
  vehicleType = "four_wheeler",
  hourOfDay = new Date().getHours(),
  isWeekend = [0, 6].includes(new Date().getDay())
}) {
  // 1. Base Category Price
  const basePrice = BASE_CATEGORY_PRICES[category] || 40;

  // 2. Location Adjustment
  const locationAdjustment = LOCATION_PREMIUMS[locality] ?? LOCATION_PREMIUMS["default"];

  // 3. Facility Premium
  let facilityPremium = 0;
  if (isCovered) facilityPremium += 10;
  if (hasCCTV) facilityPremium += 5;
  if (hasSecurity) facilityPremium += 10;
  if (hasEVCharging) facilityPremium += 20;

  // 4. Demand Adjustment (Peak morning 9-11 AM & evening 6-9 PM, weekends)
  let demandAdjustment = 0;
  const isPeakHour = (hourOfDay >= 9 && hourOfDay <= 11) || (hourOfDay >= 18 && hourOfDay <= 21);
  if (isPeakHour) demandAdjustment += 15;
  if (isWeekend) demandAdjustment += 10;

  // 5. Vehicle Type Adjustment
  let vehicleMultiplier = 1.0;
  if (vehicleType === "two_wheeler") vehicleMultiplier = 0.5;
  if (vehicleType === "suv") vehicleMultiplier = 1.2;
  if (vehicleType === "ev") vehicleMultiplier = 1.15;

  const rawTotal = (basePrice + locationAdjustment + facilityPremium + demandAdjustment) * vehicleMultiplier;
  const roundedPrice = Math.round(rawTotal / 5) * 5; // round to nearest ₹5

  return {
    basePrice,
    locationAdjustment,
    facilityPremium,
    demandAdjustment,
    vehicleMultiplier,
    isPeakHour,
    isWeekend,
    suggestedPrice: Math.max(20, roundedPrice),
    breakdown: [
      { label: `Base (${category.toUpperCase()})`, value: `₹${basePrice}` },
      { label: "Location Premium", value: `+₹${locationAdjustment}` },
      { label: "Amenities Premium", value: `+₹${facilityPremium}` },
      { label: "Demand Dynamic", value: `+₹${demandAdjustment}` },
    ]
  };
}

/**
 * Calculates rental breakdown in Indian Rupees (₹)
 * 12% PARKIT platform fee, 88% Owner payout
 */
export function calculateRentalTotals(hourlyRate, durationHours = 2) {
  const effectiveHours = Math.max(0.5, Number(durationHours) || 1);
  const rentalAmount = Math.round(hourlyRate * effectiveHours);
  const platformFee = Math.round(rentalAmount * 0.12);
  const totalPayable = rentalAmount + platformFee;
  const ownerEarnings = rentalAmount - Math.round(rentalAmount * 0.12);

  return {
    durationHours: effectiveHours,
    hourlyRate,
    rentalAmount,
    platformFee,
    totalPayable,
    ownerEarnings,
    currency: "₹"
  };
}
