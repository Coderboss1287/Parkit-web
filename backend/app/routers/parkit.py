import json
import random
import datetime
import hashlib
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.database import get_db
from app.models import ParkitUser, ParkitListing, ParkitBooking, ParkitMessage

router = APIRouter(prefix="/v1/parkit", tags=["PARKIT Smart Parking Marketplace Real Database"])

# -----------------------------------------------------------------------------
# PYDANTIC SCHEMAS
# -----------------------------------------------------------------------------

class UserLoginRequest(BaseModel):
    name: Optional[str] = "Demo User"
    email: str = "demo@parkit.in"
    phone: Optional[str] = None
    role: Optional[str] = "all"
    password: Optional[str] = None
    confirmPassword: Optional[str] = None
    authMode: Optional[str] = "login"  # login | signup


class ListingCreateRequest(BaseModel):
    id: Optional[str] = None
    title: str
    category: str
    locality: str
    address: str
    lat: float
    lng: float
    hourlyPrice: float
    dailyPrice: Optional[float] = None
    monthlyPrice: Optional[float] = None
    vehicleTypes: Optional[List[str]] = ["four_wheeler"]
    isCovered: Optional[bool] = False
    hasCCTV: Optional[bool] = False
    hasSecurity: Optional[bool] = False
    hasEVCharging: Optional[bool] = False
    hasValet: Optional[bool] = False
    isAvailable: Optional[bool] = True
    image: Optional[str] = None
    schedule: Optional[Dict[str, Any]] = None
    owner: Optional[Dict[str, Any]] = None
    description: Optional[str] = None


class ListingUpdateRequest(BaseModel):
    isAvailable: Optional[bool] = None
    hourlyPrice: Optional[float] = None
    dailyPrice: Optional[float] = None
    monthlyPrice: Optional[float] = None
    schedule: Optional[Dict[str, Any]] = None
    description: Optional[str] = None


class BookingCreateRequest(BaseModel):
    listingId: str
    listingTitle: str
    userEmail: Optional[str] = "demo@parkit.in"
    userName: Optional[str] = "Demo User"
    category: Optional[str] = None
    address: Optional[str] = None
    date: str
    startTime: str
    endTime: str
    durationHours: Optional[float] = 1.0
    hourlyRate: Optional[float] = 50.0
    rentalAmount: Optional[float] = 50.0
    platformFee: Optional[float] = 0.0
    totalAmount: Optional[float] = 50.0
    ownerEarnings: Optional[float] = 0.0
    vehicleType: Optional[str] = "four_wheeler"
    vehicleNumber: Optional[str] = None
    ownerName: Optional[str] = None
    ownerPhone: Optional[str] = None


class MessageCreateRequest(BaseModel):
    sender: str = "customer"  # customer | owner
    senderName: Optional[str] = "Customer"
    text: str
    timestamp: Optional[str] = None
    date: Optional[str] = "Today"


# -----------------------------------------------------------------------------
# 1. USER AUTH & ACCOUNTS
# -----------------------------------------------------------------------------

@router.post("/auth/login")
def login_or_register_user(req: UserLoginRequest, db: Session = Depends(get_db)):
    email = req.email.strip().lower()
    now = datetime.datetime.now(datetime.timezone.utc)
    user = db.query(ParkitUser).filter(ParkitUser.email == email).first()

    auth_mode = req.authMode or ("signup" if not user else "login")

    if auth_mode == "signup":
        # Validate password & confirmPassword
        if req.password or req.confirmPassword:
            if req.password != req.confirmPassword:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="PASSWORD_MISMATCH: Passwords do not match. Please ensure both fields are identical."
                )
            if len(req.password or "") < 6:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Password must be at least 6 characters long."
                )

        pwd_hash = hashlib.sha256(req.password.encode("utf-8")).hexdigest() if req.password else None

        if user:
            if req.name and req.name.strip():
                user.name = req.name.strip()
            if req.phone:
                user.phone = req.phone
            if pwd_hash:
                user.password_hash = pwd_hash
            user.last_login_at = now
        else:
            user = ParkitUser(
                id="usr-" + str(int(now.timestamp() * 1000)),
                name=req.name.strip() if req.name else "User",
                email=email,
                password_hash=pwd_hash,
                phone=req.phone,
                role=req.role or "all",
                created_at=now,
                last_login_at=now
            )
            db.add(user)
    else:
        # auth_mode == "login"
        if not user:
            if req.password and len(req.password) >= 6:
                pwd_hash = hashlib.sha256(req.password.encode("utf-8")).hexdigest()
                user = ParkitUser(
                    id="usr-" + str(int(now.timestamp() * 1000)),
                    name=req.name or email.split("@")[0].title(),
                    email=email,
                    password_hash=pwd_hash,
                    phone=req.phone,
                    role=req.role or "all",
                    created_at=now,
                    last_login_at=now
                )
                db.add(user)
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="INVALID_CREDENTIALS: User not found. Please sign up first."
                )
        else:
            if req.password:
                entered_hash = hashlib.sha256(req.password.encode("utf-8")).hexdigest()
                if user.password_hash:
                    if entered_hash != user.password_hash:
                        raise HTTPException(
                            status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="INVALID_CREDENTIALS: Incorrect password. Please try again."
                        )
                else:
                    user.password_hash = entered_hash

            if req.name and req.name != "Demo User":
                user.name = req.name
            if req.phone:
                user.phone = req.phone
            user.last_login_at = now

    db.commit()
    db.refresh(user)
    return user.to_dict()


@router.get("/users")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(ParkitUser).order_by(ParkitUser.created_at.desc()).all()
    return [u.to_dict() for u in users]


# -----------------------------------------------------------------------------
# 2. LISTINGS (SPACES)
# -----------------------------------------------------------------------------

@router.get("/listings")
def get_all_listings(category: Optional[str] = None, locality: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(ParkitListing)
    if category and category != "all":
        query = query.filter(ParkitListing.category == category)
    if locality and locality != "all" and locality != "All Localities":
        query = query.filter(ParkitListing.locality == locality)

    listings = query.order_by(ParkitListing.created_at.desc()).all()
    return [l.to_dict() for l in listings]


@router.post("/listings", status_code=status.HTTP_201_CREATED)
def create_listing(req: ListingCreateRequest, db: Session = Depends(get_db)):
    now = datetime.datetime.now(datetime.timezone.utc)
    listing_id = req.id or ("pkt-" + hex(int(now.timestamp() * 1000))[2:])

    new_listing = ParkitListing(
        id=listing_id,
        title=req.title,
        category=req.category,
        locality=req.locality,
        address=req.address,
        lat=req.lat,
        lng=req.lng,
        hourly_price=req.hourlyPrice,
        daily_price=req.dailyPrice or (req.hourlyPrice * 8),
        monthly_price=req.monthlyPrice or (req.hourlyPrice * 120),
        vehicle_types_json=json.dumps(req.vehicleTypes or ["four_wheeler"]),
        is_covered=bool(req.isCovered),
        has_cctv=bool(req.hasCCTV),
        has_security=bool(req.hasSecurity),
        has_ev_charging=bool(req.hasEVCharging),
        has_valet=bool(req.hasValet),
        is_available=True if req.isAvailable is None else req.isAvailable,
        rating=5.0,
        review_count=1,
        image=req.image or "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=80",
        schedule_json=json.dumps(req.schedule or {
            "openTime": "08:00",
            "closeTime": "22:00",
            "recurringDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "blockedDates": [],
            "blockedSlots": []
        }),
        owner_json=json.dumps(req.owner or {
            "name": "Verified Host",
            "phone": "+91 98200 •••••",
            "verified": True
        }),
        description=req.description or "Verified parking bay listed by owner on PARKIT.",
        created_at=now
    )

    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    return new_listing.to_dict()


@router.patch("/listings/{listing_id}")
def update_listing(listing_id: str, req: ListingUpdateRequest, db: Session = Depends(get_db)):
    listing = db.query(ParkitListing).filter(ParkitListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Parking space not found")

    if req.isAvailable is not None:
        listing.is_available = req.isAvailable
    if req.hourlyPrice is not None:
        listing.hourly_price = req.hourlyPrice
    if req.dailyPrice is not None:
        listing.daily_price = req.dailyPrice
    if req.monthlyPrice is not None:
        listing.monthly_price = req.monthlyPrice
    if req.schedule is not None:
        listing.schedule_json = json.dumps(req.schedule)
    if req.description is not None:
        listing.description = req.description

    db.commit()
    db.refresh(listing)
    return listing.to_dict()


@router.delete("/listings/{listing_id}")
def delete_listing(listing_id: str, db: Session = Depends(get_db)):
    listing = db.query(ParkitListing).filter(ParkitListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Parking space not found")

    db.delete(listing)
    db.commit()
    return {"message": "Listing deleted successfully", "id": listing_id}


# -----------------------------------------------------------------------------
# 3. BOOKINGS & RESERVATIONS (WITH SLOT CONFLICT CHECK)
# -----------------------------------------------------------------------------

@router.get("/bookings")
def get_all_bookings(user_email: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(ParkitBooking)
    if user_email:
        query = query.filter(ParkitBooking.user_email == user_email.strip().lower())

    bookings = query.order_by(ParkitBooking.booking_created_at.desc()).all()
    return [b.to_dict() for b in bookings]


@router.post("/bookings", status_code=status.HTTP_201_CREATED)
def create_booking(req: BookingCreateRequest, db: Session = Depends(get_db)):
    # DATABASE-LEVEL SLOT CONFLICT CHECK:
    # An active confirmed booking conflicts if:
    # start_time < existing.end_time AND end_time > existing.start_time
    conflicting = db.query(ParkitBooking).filter(
        ParkitBooking.listing_id == req.listingId,
        ParkitBooking.date == req.date,
        ParkitBooking.status == "confirmed",
        ParkitBooking.start_time < req.endTime,
        ParkitBooking.end_time > req.startTime
    ).first()

    if conflicting:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"This parking space is already booked from {conflicting.start_time} to {conflicting.end_time} on {req.date}. Please select another time window."
        )

    # Generate 4-digit Entry PIN & QR Code
    pin_code = str(random.randint(1000, 9999))
    now = datetime.datetime.now(datetime.timezone.utc)
    booking_id = f"PKT-{pin_code}"
    qr_code = f"PKT-{pin_code}-GATE-VERIFIED"

    # Pull listing details if not provided
    listing = db.query(ParkitListing).filter(ParkitListing.id == req.listingId).first()
    listing_title = req.listingTitle or (listing.title if listing else "Parking Spot")
    category = req.category or (listing.category if listing else "general")
    address = req.address or (listing.address if listing else "")

    new_booking = ParkitBooking(
        id=booking_id,
        user_email=(req.userEmail or "demo@parkit.in").strip().lower(),
        user_name=req.userName or "Customer",
        listing_id=req.listingId,
        listing_title=listing_title,
        category=category,
        address=address,
        date=req.date,
        start_time=req.startTime,
        end_time=req.endTime,
        duration_hours=req.durationHours or 1.0,
        hourly_rate=req.hourlyRate or 50.0,
        rental_amount=req.rentalAmount or 50.0,
        platform_fee=req.platformFee or 0.0,
        total_amount=req.totalAmount or 50.0,
        owner_earnings=req.ownerEarnings or 0.0,
        status="confirmed",
        vehicle_type=req.vehicleType or "four_wheeler",
        vehicle_number=req.vehicleNumber or "MH 01 AB 1234",
        owner_name=req.ownerName or "Verified Host",
        owner_phone=req.ownerPhone or "+91 98200 •••••",
        pin_code=pin_code,
        qr_code=qr_code,
        booking_created_at=now
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking.to_dict()


@router.patch("/bookings/{booking_id}/cancel")
def cancel_booking(booking_id: str, db: Session = Depends(get_db)):
    booking = db.query(ParkitBooking).filter(ParkitBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.status = "cancelled"
    db.commit()
    db.refresh(booking)
    return booking.to_dict()


# -----------------------------------------------------------------------------
# 4. CHAT MESSAGES
# -----------------------------------------------------------------------------

@router.get("/messages/{listing_id}")
def get_listing_messages(listing_id: str, db: Session = Depends(get_db)):
    msgs = db.query(ParkitMessage).filter(ParkitMessage.listing_id == listing_id).order_by(ParkitMessage.created_at.asc()).all()
    return [m.to_dict() for m in msgs]


@router.post("/messages/{listing_id}", status_code=status.HTTP_201_CREATED)
def post_listing_message(listing_id: str, req: MessageCreateRequest, db: Session = Depends(get_db)):
    now = datetime.datetime.now(datetime.timezone.utc)
    msg_id = "msg-" + str(int(now.timestamp() * 1000))
    time_str = req.timestamp or now.strftime("%I:%M %p")

    new_msg = ParkitMessage(
        id=msg_id,
        listing_id=listing_id,
        sender=req.sender,
        sender_name=req.senderName or "User",
        text=req.text,
        timestamp=time_str,
        date=req.date or "Today",
        created_at=now
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)

    return new_msg.to_dict()

