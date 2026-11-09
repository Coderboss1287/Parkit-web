import json
import datetime
import hashlib
from sqlalchemy.orm import Session
from app.models import ParkitListing, ParkitBooking, ParkitMessage, ParkitUser

SAMPLE_LISTINGS = [
    {
        "id": "pkt-mum-001",
        "title": "BKC G-Block Executive Basement Parking",
        "category": "office",
        "address": "Tower 2, G Block, Bandra Kurla Complex, Mumbai, Maharashtra 400051",
        "locality": "BKC (Bandra Kurla Complex), Mumbai",
        "lat": 19.0657,
        "lng": 72.8687,
        "hourly_price": 75,
        "daily_price": 650,
        "monthly_price": 9500,
        "vehicle_types_json": json.dumps(["four_wheeler", "suv", "ev"]),
        "is_covered": True,
        "has_cctv": True,
        "has_security": True,
        "has_ev_charging": True,
        "has_valet": True,
        "is_available": True,
        "rating": 4.9,
        "review_count": 48,
        "image": "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80",
        "schedule_json": json.dumps({
            "openTime": "08:00",
            "closeTime": "22:00",
            "recurringDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "blockedDates": ["2026-10-15"],
            "blockedSlots": ["13:00-14:00"]
        }),
        "owner_json": json.dumps({
            "id": "own-101",
            "name": "Rajesh Singhania",
            "type": "Commercial Hub Manager",
            "phone": "+91 98201 XXXXX",
            "maskedPhone": "+91 98201 •••••",
            "verified": True,
            "responseRate": "98%",
            "responseTime": "< 5 mins"
        }),
        "description": "Ultra-secure, well-lit executive basement slot directly beneath BKC Financial Centre. Equipped with 22kW Type-2 fast EV charger, boom barriers, and 24/7 security personnel."
    },
    {
        "id": "pkt-mum-002",
        "title": "Sea Breeze Society Reserved Resident Bay",
        "category": "residential",
        "address": "Sea Breeze CHS, Perry Cross Road, Bandra West, Mumbai, Maharashtra 400050",
        "locality": "Bandra West, Mumbai",
        "lat": 19.0596,
        "lng": 72.8295,
        "hourly_price": 50,
        "daily_price": 420,
        "monthly_price": 6200,
        "vehicle_types_json": json.dumps(["four_wheeler", "suv", "two_wheeler"]),
        "is_covered": True,
        "has_cctv": True,
        "has_security": True,
        "has_ev_charging": False,
        "has_valet": False,
        "is_available": True,
        "rating": 4.8,
        "review_count": 34,
        "image": "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80",
        "schedule_json": json.dumps({
            "openTime": "06:00",
            "closeTime": "23:59",
            "recurringDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "blockedDates": [],
            "blockedSlots": []
        }),
        "owner_json": json.dumps({
            "id": "own-102",
            "name": "Pooja Merchant",
            "type": "Society Resident",
            "phone": "+91 98192 XXXXX",
            "maskedPhone": "+91 98192 •••••",
            "verified": True,
            "responseRate": "95%",
            "responseTime": "< 10 mins"
        }),
        "description": "Gated residential parking slot available while owner is at office. 2-minute walk from Carter Road. Society security verified with QR visitor check-in."
    },
    {
        "id": "pkt-mum-003",
        "title": "Vashi Sector 17 Commercial Tower Lot",
        "category": "commercial",
        "address": "Commodity Exchange Building, Sector 17, Vashi, Navi Mumbai, Maharashtra 400703",
        "locality": "Vashi Sector 17, Navi Mumbai",
        "lat": 19.0771,
        "lng": 72.9986,
        "hourly_price": 85,
        "daily_price": 700,
        "monthly_price": 10500,
        "vehicle_types_json": json.dumps(["four_wheeler", "suv", "ev"]),
        "is_covered": True,
        "has_cctv": True,
        "has_security": True,
        "has_ev_charging": True,
        "has_valet": True,
        "is_available": True,
        "rating": 4.8,
        "review_count": 62,
        "image": "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80",
        "schedule_json": json.dumps({
            "openTime": "07:00",
            "closeTime": "23:00",
            "recurringDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "blockedDates": [],
            "blockedSlots": []
        }),
        "owner_json": json.dumps({
            "id": "own-103",
            "name": "Amit Deshmukh",
            "type": "Facility Manager",
            "phone": "+91 98690 XXXXX",
            "maskedPhone": "+91 98690 •••••",
            "verified": True,
            "responseRate": "99%",
            "responseTime": "< 3 mins"
        }),
        "description": "Prime commercial lot located at the commercial nexus of Navi Mumbai. Wide driveways, multi-level ramp access, dedicated security team."
    },
    {
        "id": "pkt-mum-004",
        "title": "Vashi Railway Station North Plaza Parking",
        "category": "commercial",
        "address": "Station Complex, Sector 30A, Vashi, Navi Mumbai, Maharashtra 400703",
        "locality": "Vashi Sector 17, Navi Mumbai",
        "lat": 19.0645,
        "lng": 72.9950,
        "hourly_price": 40,
        "daily_price": 320,
        "monthly_price": 4800,
        "vehicle_types_json": json.dumps(["four_wheeler", "two_wheeler"]),
        "is_covered": False,
        "has_cctv": True,
        "has_security": True,
        "has_ev_charging": False,
        "has_valet": False,
        "is_available": True,
        "rating": 4.5,
        "review_count": 110,
        "image": "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80",
        "schedule_json": json.dumps({
            "openTime": "00:00",
            "closeTime": "23:59",
            "recurringDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "blockedDates": [],
            "blockedSlots": []
        }),
        "owner_json": json.dumps({
            "id": "own-104",
            "name": "Sanjay Gaikwad",
            "type": "Station Plaza Operator",
            "phone": "+91 97690 XXXXX",
            "maskedPhone": "+91 97690 •••••",
            "verified": True,
            "responseRate": "92%",
            "responseTime": "< 15 mins"
        }),
        "description": "High-capacity open plaza parking right adjacent to Vashi suburban train terminus. Ideal for commuters traveling to CSMT or Panvel."
    },
    {
        "id": "pkt-mum-005",
        "title": "Lilavati Hospital Proximity Reserved Bay",
        "category": "hospital",
        "address": "Near Lilavati Hospital, A-Road, Bandra Reclamation, Bandra West, Mumbai, Maharashtra 400050",
        "locality": "Bandra West, Mumbai",
        "lat": 19.0515,
        "lng": 72.8290,
        "hourly_price": 80,
        "daily_price": 680,
        "monthly_price": 9800,
        "vehicle_types_json": json.dumps(["four_wheeler", "suv", "two_wheeler"]),
        "is_covered": True,
        "has_cctv": True,
        "has_security": True,
        "has_ev_charging": False,
        "has_valet": True,
        "is_available": True,
        "rating": 4.9,
        "review_count": 51,
        "image": "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80",
        "schedule_json": json.dumps({
            "openTime": "00:00",
            "closeTime": "23:59",
            "recurringDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "blockedDates": [],
            "blockedSlots": []
        }),
        "owner_json": json.dumps({
            "id": "own-105",
            "name": "Dr. Anirudh Shah",
            "type": "Medical Centre Space Owner",
            "phone": "+91 98205 XXXXX",
            "maskedPhone": "+91 98205 •••••",
            "verified": True,
            "responseRate": "99%",
            "responseTime": "< 2 mins"
        }),
        "description": "Reserved priority bay 120m from hospital main casualty gates. Guaranteed instant slot availability for medical visits and patient attendants."
    },
    {
        "id": "pkt-mum-006",
        "title": "Lower Parel Palladium & Phoenix Mall VIP Bay",
        "category": "mall",
        "address": "Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013",
        "locality": "Lower Parel, Mumbai",
        "lat": 18.9953,
        "lng": 72.8304,
        "hourly_price": 110,
        "daily_price": 900,
        "monthly_price": 14000,
        "vehicle_types_json": json.dumps(["four_wheeler", "suv", "ev"]),
        "is_covered": True,
        "has_cctv": True,
        "has_security": True,
        "has_ev_charging": True,
        "has_valet": True,
        "is_available": True,
        "rating": 4.9,
        "review_count": 95,
        "image": "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80",
        "schedule_json": json.dumps({
            "openTime": "10:00",
            "closeTime": "23:30",
            "recurringDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "blockedDates": [],
            "blockedSlots": []
        }),
        "owner_json": json.dumps({
            "id": "own-106",
            "name": "Karan Mehra",
            "type": "Mall Retail Operator",
            "phone": "+91 99201 XXXXX",
            "maskedPhone": "+91 99201 •••••",
            "verified": True,
            "responseRate": "97%",
            "responseTime": "< 5 mins"
        }),
        "description": "Skip standard 45-minute weekend mall parking queues. Pre-reserved VIP basement slot with fast-tag boom barrier and direct elevator access."
    },
    {
        "id": "pkt-mum-007",
        "title": "Khanda Colony Sector 9 Quiet Residential Driveway",
        "category": "private",
        "address": "Plot 42, Sector 9, Khanda Colony, New Panvel, Navi Mumbai 410206",
        "locality": "Panvel, Navi Mumbai",
        "lat": 18.9984,
        "lng": 73.1115,
        "hourly_price": 30,
        "daily_price": 250,
        "monthly_price": 3800,
        "vehicle_types_json": json.dumps(["four_wheeler", "two_wheeler"]),
        "is_covered": True,
        "has_cctv": True,
        "has_security": False,
        "has_ev_charging": False,
        "has_valet": False,
        "is_available": True,
        "rating": 4.7,
        "review_count": 28,
        "image": "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80",
        "schedule_json": json.dumps({
            "openTime": "06:00",
            "closeTime": "22:00",
            "recurringDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "blockedDates": [],
            "blockedSlots": []
        }),
        "owner_json": json.dumps({
            "id": "own-107",
            "name": "Nitin Patil",
            "type": "Homeowner",
            "phone": "+91 98214 XXXXX",
            "maskedPhone": "+91 98214 •••••",
            "verified": True,
            "responseRate": "94%",
            "responseTime": "< 10 mins"
        }),
        "description": "Covered bungalow porch parking slot in quiet Khanda Colony sector. 5-minute auto ride to Panvel railway junction. Perfect for long commuters."
    },
    {
        "id": "pkt-mum-008",
        "title": "Jio World Convention Centre Event Hub",
        "category": "event",
        "address": "G Block, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400098",
        "locality": "BKC (Bandra Kurla Complex), Mumbai",
        "lat": 19.0620,
        "lng": 72.8650,
        "hourly_price": 120,
        "daily_price": 1100,
        "monthly_price": 16500,
        "vehicle_types_json": json.dumps(["four_wheeler", "suv", "ev"]),
        "is_covered": True,
        "has_cctv": True,
        "has_security": True,
        "has_ev_charging": True,
        "has_valet": True,
        "is_available": True,
        "rating": 4.9,
        "review_count": 142,
        "image": "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80",
        "schedule_json": json.dumps({
            "openTime": "08:00",
            "closeTime": "23:59",
            "recurringDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "blockedDates": [],
            "blockedSlots": []
        }),
        "owner_json": json.dumps({
            "id": "own-108",
            "name": "Vivek Oberoi",
            "type": "Event Parking Coordinator",
            "phone": "+91 98330 XXXXX",
            "maskedPhone": "+91 98330 •••••",
            "verified": True,
            "responseRate": "98%",
            "responseTime": "< 4 mins"
        }),
        "description": "Official event priority parking lot across JWCC. Ideal for concerts, international expos, trade fairs, and celebrity events."
    },
    {
        "id": "pkt-mum-009",
        "title": "Viviana Mall & Cadbury Junction Covered Slot",
        "category": "mall",
        "address": "Eastern Express Highway, Service Rd, Thane West, Maharashtra 400606",
        "locality": "Naupada, Thane West",
        "lat": 19.2065,
        "lng": 72.9723,
        "hourly_price": 90,
        "daily_price": 750,
        "monthly_price": 11000,
        "vehicle_types_json": json.dumps(["four_wheeler", "suv", "ev", "two_wheeler"]),
        "is_covered": True,
        "has_cctv": True,
        "has_security": True,
        "has_ev_charging": True,
        "has_valet": True,
        "is_available": True,
        "rating": 4.8,
        "review_count": 77,
        "image": "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80",
        "schedule_json": json.dumps({
            "openTime": "09:00",
            "closeTime": "23:00",
            "recurringDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "blockedDates": [],
            "blockedSlots": []
        }),
        "owner_json": json.dumps({
            "id": "own-109",
            "name": "Prateek Sawant",
            "type": "Thane Commercial Partner",
            "phone": "+91 98920 XXXXX",
            "maskedPhone": "+91 98920 •••••",
            "verified": True,
            "responseRate": "96%",
            "responseTime": "< 5 mins"
        }),
        "description": "Strategic parking slot directly overlooking Eastern Express Highway junction. Covered bay with 50kW fast DC EV charging and security patrols."
    },
    {
        "id": "pkt-mum-010",
        "title": "Panvel Station & Khanda Colony Gated Bay",
        "category": "residential",
        "address": "Near Panvel Railway Station East, Sector 9, Khanda Colony, New Panvel, Navi Mumbai 410206",
        "locality": "Panvel, Navi Mumbai",
        "lat": 18.9894,
        "lng": 73.1175,
        "hourly_price": 35,
        "daily_price": 280,
        "monthly_price": 4200,
        "vehicle_types_json": json.dumps(["four_wheeler", "two_wheeler"]),
        "is_covered": True,
        "has_cctv": True,
        "has_security": True,
        "has_ev_charging": False,
        "has_valet": False,
        "is_available": True,
        "rating": 4.7,
        "review_count": 42,
        "image": "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=80",
        "schedule_json": json.dumps({
            "openTime": "05:00",
            "closeTime": "23:59",
            "recurringDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "blockedDates": [],
            "blockedSlots": []
        }),
        "owner_json": json.dumps({
            "id": "own-110",
            "name": "Abhishek Joshi",
            "type": "Society Secretary",
            "phone": "+91 98209 XXXXX",
            "maskedPhone": "+91 98209 •••••",
            "verified": True,
            "responseRate": "97%",
            "responseTime": "< 8 mins"
        }),
        "description": "Safe, fenced parking inside gated cooperative society. CCTV monitored, guard on duty 24/7. 400m walking distance to Panvel railway station platform 1."
    },
    {
        "id": "pkt-mum-011",
        "title": "Hiranandani Gardens Tech Hub Covered Bay",
        "category": "office",
        "address": "High Street, Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076",
        "locality": "Powai, Mumbai",
        "lat": 19.1176,
        "lng": 72.9060,
        "hourly_price": 65,
        "daily_price": 540,
        "monthly_price": 8200,
        "vehicle_types_json": json.dumps(["four_wheeler", "suv", "ev"]),
        "is_covered": True,
        "has_cctv": True,
        "has_security": True,
        "has_ev_charging": True,
        "has_valet": False,
        "is_available": True,
        "rating": 4.9,
        "review_count": 56,
        "image": "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80",
        "schedule_json": json.dumps({
            "openTime": "07:30",
            "closeTime": "22:30",
            "recurringDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "blockedDates": [],
            "blockedSlots": []
        }),
        "owner_json": json.dumps({
            "id": "own-111",
            "name": "Gaurav Malhotra",
            "type": "Corporate Tower Admin",
            "phone": "+91 98207 XXXXX",
            "maskedPhone": "+91 98207 •••••",
            "verified": True,
            "responseRate": "99%",
            "responseTime": "< 3 mins"
        }),
        "description": "Executive parking in neoclassical Hiranandani Powai complex. 24/7 manned gate, automated barrier pass, EV charging station on floor B1."
    },
    {
        "id": "pkt-mum-012",
        "title": "Inorbit Mall & Mindspace Corporate Slot",
        "category": "commercial",
        "address": "Link Road, Malad West, Mumbai, Maharashtra 400064",
        "locality": "Malad West, Mumbai",
        "lat": 19.1728,
        "lng": 72.8361,
        "hourly_price": 70,
        "daily_price": 580,
        "monthly_price": 8800,
        "vehicle_types_json": json.dumps(["four_wheeler", "suv", "two_wheeler"]),
        "is_covered": True,
        "has_cctv": True,
        "has_security": True,
        "has_ev_charging": False,
        "has_valet": True,
        "is_available": True,
        "rating": 4.7,
        "review_count": 68,
        "image": "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1000&q=80",
        "schedule_json": json.dumps({
            "openTime": "09:00",
            "closeTime": "23:00",
            "recurringDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "blockedDates": [],
            "blockedSlots": []
        }),
        "owner_json": json.dumps({
            "id": "own-112",
            "name": "Manish Parekh",
            "type": "Mindspace Parking Admin",
            "phone": "+91 98218 XXXXX",
            "maskedPhone": "+91 98218 •••••",
            "verified": True,
            "responseRate": "95%",
            "responseTime": "< 7 mins"
        }),
        "description": "Dedicated parking in Mindspace IT Park sector right next to Inorbit Mall. Clean multi-tier parking, CCTV surveillance, and security patrols."
    }
]

SAMPLE_BOOKINGS = [
    {
        "id": "PKT-MUM-8924",
        "user_email": "demo@parkit.in",
        "user_name": "Demo User",
        "listing_id": "pkt-mum-001",
        "listing_title": "BKC G-Block Executive Basement Parking",
        "category": "office",
        "address": "Tower 2, G Block, Bandra Kurla Complex, Mumbai",
        "date": "2026-10-03",
        "start_time": "11:00",
        "end_time": "14:00",
        "duration_hours": 3.0,
        "hourly_rate": 75.0,
        "rental_amount": 225.0,
        "platform_fee": 27.0,
        "total_amount": 252.0,
        "owner_earnings": 198.0,
        "status": "confirmed",
        "vehicle_type": "four_wheeler",
        "vehicle_number": "MH 02 CZ 4421",
        "owner_name": "Rajesh Singhania",
        "owner_phone": "+91 98201 •••••",
        "pin_code": "8924",
        "qr_code": "PKT-MUM-8924-GATE-VERIFIED",
        "booking_created_at": datetime.datetime.now(datetime.timezone.utc)
    },
    {
        "id": "PKT-NAV-3109",
        "user_email": "demo@parkit.in",
        "user_name": "Demo User",
        "listing_id": "pkt-mum-003",
        "listing_title": "Vashi Sector 17 Commercial Tower Lot",
        "category": "commercial",
        "address": "Commodity Exchange Building, Sector 17, Vashi, Navi Mumbai",
        "date": "2026-09-28",
        "start_time": "14:00",
        "end_time": "17:00",
        "duration_hours": 3.0,
        "hourly_rate": 85.0,
        "rental_amount": 255.0,
        "platform_fee": 31.0,
        "total_amount": 286.0,
        "owner_earnings": 224.0,
        "status": "completed",
        "vehicle_type": "four_wheeler",
        "vehicle_number": "MH 43 AB 8912",
        "owner_name": "Amit Deshmukh",
        "owner_phone": "+91 98690 •••••",
        "pin_code": "3109",
        "qr_code": "PKT-NAV-3109-GATE-VERIFIED",
        "booking_created_at": datetime.datetime.now(datetime.timezone.utc)
    }
]

SAMPLE_MESSAGES = [
    {
        "id": "msg-1",
        "listing_id": "pkt-mum-001",
        "sender": "customer",
        "sender_name": "Demo User",
        "text": "Hi Rajesh, is this parking covered and does it fit a Kia Seltos SUV?",
        "timestamp": "10:15 AM",
        "date": "Today"
    },
    {
        "id": "msg-2",
        "listing_id": "pkt-mum-001",
        "sender": "owner",
        "sender_name": "Rajesh Singhania",
        "text": "Hello! Yes, the basement ceiling clearance is 2.8m, easily accommodates full-size SUVs with roof carriers. Security guard will assist your bay entry.",
        "timestamp": "10:17 AM",
        "date": "Today"
    }
]

def seed_parkit_database(db: Session):
    # 1. Seed Listings if empty
    if db.query(ParkitListing).count() == 0:
        for item in SAMPLE_LISTINGS:
            listing = ParkitListing(**item)
            db.add(listing)
        db.commit()

    # 2. Seed Bookings if empty
    if db.query(ParkitBooking).count() == 0:
        for b in SAMPLE_BOOKINGS:
            booking = ParkitBooking(**b)
            db.add(booking)
        db.commit()

    # 3. Seed Messages if empty
    if db.query(ParkitMessage).count() == 0:
        for m in SAMPLE_MESSAGES:
            msg = ParkitMessage(**m)
            db.add(msg)
        db.commit()

    # 4. Ensure verified seed users exist for testing
    demo_users = [
        {
            "id": "usr-demo-vikram",
            "name": "Vikram Malhotra",
            "email": "vikram.malhotra@gmail.com",
            "phone": "+91 98200 12345",
            "password_hash": hashlib.sha256("password123".encode("utf-8")).hexdigest(),
            "role": "all"
        },
        {
            "id": "usr-demo-rajesh",
            "name": "Rajesh Singhania",
            "email": "rajesh.singhania@bkcspaces.com",
            "phone": "+91 98201 54321",
            "password_hash": hashlib.sha256("password123".encode("utf-8")).hexdigest(),
            "role": "all"
        }
    ]
    for du in demo_users:
        existing = db.query(ParkitUser).filter(ParkitUser.email == du["email"]).first()
        if not existing:
            u = ParkitUser(
                id=du["id"],
                name=du["name"],
                email=du["email"],
                phone=du["phone"],
                password_hash=du["password_hash"],
                role=du["role"],
                created_at=datetime.datetime.now(datetime.timezone.utc),
                last_login_at=datetime.datetime.now(datetime.timezone.utc)
            )
            db.add(u)
        elif not existing.password_hash:
            existing.password_hash = du["password_hash"]
    db.commit()

