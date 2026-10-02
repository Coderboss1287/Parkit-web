# PARKIT — Complete Full-Stack Parking Marketplace

> **"FIND IT | RENT IT | PARK IT"**  
> India's premier two-sided smart parking marketplace connecting drivers with empty parking spaces across Mumbai, Navi Mumbai, Thane, and Panvel.

---

## 🚀 Live Demo & Quick Start

### 1. Requirements
- Node.js (v18+)
- npm or yarn

### 2. Run Locally
```bash
# Navigate to project folder
cd "c:\Users\HP\Downloads\IIT G"

# Install dependencies (if not already installed)
npm install

# Start the Vite development server
npm run dev
```

Visit the application in your browser at:
`http://localhost:5173/`

To create an optimized production build:
```bash
npm run build
npm run preview
```

---

## 🎨 1. Brand Identity & Design System

The application strictly implements the PARKIT brand guidelines:
- **Sky Blue**: `#35B5F6`
- **Royal Blue**: `#0752B5`
- **Green**: `#75D84C`
- **White**: `#FFFFFF`
- **Light Background**: `#F7FAFC`
- **Dark Text**: `#172B4D`
- **Currency**: **ALWAYS Indian Rupees (₹ INR)** across all checkout steps, listings, and payout charts. Never USD or $.

### Visual Design & Reference Video Inspiration
- **Animated SVG Path Transitions**: Liquid morphing wave wipe inspired by the reference video (`recording.mp4`) that sweeps between page switches.
- **Cinematic Logo Reveal**: High-impact startup splash screen with pulsating radar rings and Mumbai spatial grid initialization.
- **Modern Startup Aesthetic**: Glassmorphism (`backdrop-blur-md`), rounded 3xl cards, subtle multi-layer drop shadows, and Framer Motion micro-interactions.

---

## 🔄 2. Website Entry Flow

The application follows the exact required sequence:
1. **Website Opens** → Cinematic Intro & Logo Reveal.
2. **Authentication** → Common "Welcome to PARKIT" login/signup with instant 1-click test credentials (or custom login).
3. **Purpose Selection Screen** → Full-screen choice:
   - **GIVE TO RENT** (*"Have an empty parking space? Turn it into income."* → CTA: *List Your Space*)
   - **RENT IT** (*"Find your perfect parking spot nearby."* → CTA: *Find Parking*)
4. **Relevant Dashboard Opens**:
   - Customer Dashboard for **RENT IT**
   - Owner Dashboard for **GIVE TO RENT**
5. **Switch Mode**: Users never need two accounts. The top navigation bar includes **"Switch Mode"** to change roles dynamically.

---

## ⬡ 3. H3 Hexagonal Parking Search Algorithm

PARKIT features a proximity-based hexagonal spatial grid search:
- **Cell Geometry**: 50m diameter mathematically consistent hexagonal zones.
- **Spiral Ring Expansion**:
  - **Ring 0**: Searches customer's immediate cell first.
  - **Ring 1**: Searches the 6 surrounding hexagons.
  - **Ring 2**: Searches the outer ring of 12 hexagons.
  - **Ring 3**: Expands to 18 hexagons outward.
- **Map Overlays**:
  - ⚪ **Grey**: Unsearched
  - 🔵 **Blue**: Currently searching ring
  - 🟢 **Green**: Matching parking found
  - 🔴 **Red**: No matching parking in cell
- **Controls**: Configurable maximum search radii (500m, 1km, 2km), "Show More Nearby Parking" button, and filters by category, vehicle type, and schedule.

---

## 🗺️ 4. Mumbai Map Integration

- **Initial Coordinates**: Lat `19.0760`, Lng `72.8777` (Mumbai, Maharashtra, India) at Zoom `11`.
- **Localities**: South Mumbai (Colaba, Fort), Bandra West, BKC, Lower Parel, Powai, Andheri West, Vashi Sector 17, Vashi Station, Belapur, Panvel, and Thane.
- **Map Markers**:
  - 🔵 **Blue Marker**: Available parking spaces with price badge in ₹/hr.
  - 🟢 **Green Marker**: Selected active parking space with pulsating radar ring.
  - ⚪ **Grey Marker**: Unavailable / occupied parking space.
- **Interactive Features**: Map/List toggle, Get Directions link (Google Maps route), GPS current location button, and OpenStreetMap / Google Maps fallback (`VITE_GOOGLE_MAPS_API_KEY`).

---

## 🏷️ 5. 8 Parking Categories

Every category has a dedicated filter, icon, and baseline pricing:
1. **Private Parking** (Base: ₹30/hr) — Bungalow driveways, private villas.
2. **Residential / Society Parking** (Base: ₹40/hr) — Visitor bays in gated housing societies.
3. **Office Parking** (Base: ₹60/hr) — Executive basement slots in corporate towers.
4. **Commercial Building Parking** (Base: ₹80/hr) — Business hub towers with dedicated security.
5. **Mall / Shopping Complex Parking** (Base: ₹100/hr) — Premium parking near retail malls (e.g. Phoenix, Inorbit).
6. **Hospital Parking** (Base: ₹70/hr) — Priority reserved spaces near major medical hubs (Lilavati, Fortis).
7. **Event Parking** (Base: ₹100/hr) — Managed parking near stadiums and convention halls (Jio World, MMRDA).
8. **Other Parking** (Base: ₹40/hr) — Transit depot lots, railway station hubs.

---

## 💰 6. Category-Based AI Suggested Pricing

Dynamic pricing formula:
$$\text{Suggested Price} = \text{Category Base Price} + \text{Location Adjustment} + \text{Facility Premium} + \text{Demand Adjustment}$$

- **Location Premiums**: South Mumbai/BKC (+₹30-35), Bandra/Lower Parel (+₹20-25), Vashi/Thane (+₹10), Panvel (+₹0).
- **Amenities Premiums**: Covered (+₹10), CCTV (+₹5), 24/7 Security (+₹10), EV Charging (+₹20).
- **Demand Adjustment**: Peak hours (+₹15), Weekends (+₹10).
- Displays full mathematical breakdown with host manual override.

---

## 💬 7. Pre-Booking Contact System

Customers can communicate with the host **BEFORE** booking:
- **Chat with Owner**: In-app live chat interface with quick question chips (*"Is this parking available?", "Can my SUV fit?", "What is the entry gate procedure?"*) and simulated owner auto-responses with localStorage persistence.
- **Call Owner**: Masked phone calling simulator displaying virtual masked lines to safeguard personal numbers.

---

## 💳 8. Transparent Checkout & Digital Gate Pass

- **Breakdown**: Rental amount + 12% PARKIT platform fee = Total payable in ₹ INR.
- **Host Payout**: 88% credited to host upon guest check-in.
- **Payment Sandbox**: Simulated Razorpay test mode (UPI, GPay, PhonePe, Cards, NetBanking, QR).
- **Double-Booking Prevention**: Mathematical slot overlap detection prevents conflicting bookings for the same space.
- **Digital Gate Pass Voucher**: Generated upon confirmation with a 4-digit PIN code, QR pass, vehicle number, and gate instructions.

---

## 📊 9. Owner & Customer Dashboards

- **Customer Dashboard (RENT IT)**: Location search, category filter, vehicle type, price slider, facility pills, map/list views, pre-booking chat, and booking history with cancellation option.
- **Owner Dashboard (GIVE TO RENT)**:
  - **Overview**: Total earnings (₹ INR), total reservations, active listings.
  - **My Parking Spaces**: Enable/disable live toggle, delete, edit.
  - **Add New Space**: Category selection, amenities, location, schedule, recurring days (Mon-Fri 6PM-11PM), AI price suggestions.
  - **Availability Manager**: Block specific dates and custom time slots.
  - **Reservations**: Live table of renter bookings with vehicle plates and gate PINs.
  - **Revenue & Payouts**: Monthly revenue bar chart (₹ INR) and platform fee breakdown.
  - **Messages**: Host inbox for guest inquiries.

---

## 🤖 10. PARKIT AI Assistant

Floating intelligent assistant supporting natural language queries:
- *"Find parking near Vashi station for 3 hours"*
- *"Show affordable parking near Mumbai offices"*
- *"Find covered parking with EV charging"*
- *"Show private parking in Bandra"*
- Real-time keyword and spatial parsing over listings with 1-click *"View on Map"* filtering.

---

## 🔑 External Integrations & API Credentials (Production)

| Feature | Prototype Mode (Current) | Production Service | Environment Variable |
|---|---|---|---|
| **Map Rendering** | Leaflet + OpenStreetMap CartoDB | Google Maps JavaScript API | `VITE_GOOGLE_MAPS_API_KEY` |
| **Authentication** | localStorage demo session | Supabase Auth | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| **Database** | localStorage reactive state | PostgreSQL / Supabase | Server connection string |
| **Payments** | Razorpay Sandbox UI Simulation | Razorpay Payment Gateway | `VITE_RAZORPAY_KEY_ID` |
| **Masked Calls** | Browser WebRTC / Simulated bridge | Twilio / Exotel IVR Masking | Server webhook |
| **AI Assistant** | Local natural language matcher | Google Gemini 2.0 Flash API | `VITE_GEMINI_API_KEY` |
