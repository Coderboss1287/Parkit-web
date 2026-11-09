import datetime
import json
from sqlalchemy import Column, Integer, String, Boolean, Float, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.database import Base

class ApiKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    key_hash = Column(String(64), unique=True, index=True, nullable=False)
    prefix = Column(String(32), nullable=False)
    name = Column(String(100), default="Standard Key")
    is_active = Column(Boolean, default=True)
    rate_limit_per_min = Column(Integer, default=300)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    last_used_at = Column(DateTime, nullable=True)

    logs = relationship("UsageLog", back_populates="api_key", cascade="all, delete-orphan")


class UsageLog(Base):
    __tablename__ = "usage_logs"

    id = Column(Integer, primary_key=True, index=True)
    key_id = Column(Integer, ForeignKey("api_keys.id", ondelete="SET NULL"), nullable=True, index=True)
    endpoint = Column(String(200), nullable=False, index=True)
    method = Column(String(10), nullable=False)
    status_code = Column(Integer, nullable=False)
    latency_ms = Column(Float, nullable=False)
    ip_address = Column(String(50), nullable=True)
    cached = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), index=True)

    api_key = relationship("ApiKey", back_populates="logs")


class GeoCache(Base):
    __tablename__ = "geo_cache"

    id = Column(Integer, primary_key=True, index=True)
    cache_key = Column(String(255), unique=True, index=True, nullable=False)
    cache_type = Column(String(50), nullable=False, index=True)
    response_json = Column(Text, nullable=False)
    expires_at = Column(DateTime, nullable=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

Index("ix_geo_cache_key_type", GeoCache.cache_key, GeoCache.cache_type)


# =============================================================================
# PARKIT REAL-TIME PERSISTENCE MODELS
# =============================================================================

class ParkitUser(Base):
    __tablename__ = "parkit_users"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(128), nullable=True)
    phone = Column(String(50), nullable=True)
    role = Column(String(20), default="all")  # renter, host, all
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    last_login_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "role": self.role,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "lastLoginAt": self.last_login_at.isoformat() if self.last_login_at else None
        }


class ParkitListing(Base):
    __tablename__ = "parkit_listings"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    category = Column(String(50), nullable=False, index=True)
    locality = Column(String(100), nullable=False, index=True)
    address = Column(Text, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    hourly_price = Column(Float, nullable=False)
    daily_price = Column(Float, nullable=True)
    monthly_price = Column(Float, nullable=True)
    vehicle_types_json = Column(Text, default="[]")
    is_covered = Column(Boolean, default=False)
    has_cctv = Column(Boolean, default=False)
    has_security = Column(Boolean, default=False)
    has_ev_charging = Column(Boolean, default=False)
    has_valet = Column(Boolean, default=False)
    is_available = Column(Boolean, default=True)
    rating = Column(Float, default=5.0)
    review_count = Column(Integer, default=0)
    image = Column(Text, nullable=True)
    schedule_json = Column(Text, default="{}")
    owner_json = Column(Text, default="{}")
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    def to_dict(self):
        vehicle_types = []
        try:
            vehicle_types = json.loads(self.vehicle_types_json or "[]")
        except Exception:
            vehicle_types = ["four_wheeler"]

        schedule = {}
        try:
            schedule = json.loads(self.schedule_json or "{}")
        except Exception:
            schedule = {"openTime": "08:00", "closeTime": "22:00", "recurringDays": [], "blockedDates": [], "blockedSlots": []}

        owner = {}
        try:
            owner = json.loads(self.owner_json or "{}")
        except Exception:
            owner = {"name": "Verified Host", "phone": "+91 98200 •••••", "verified": True}

        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "locality": self.locality,
            "address": self.address,
            "lat": self.lat,
            "lng": self.lng,
            "hourlyPrice": self.hourly_price,
            "dailyPrice": self.daily_price,
            "monthlyPrice": self.monthly_price,
            "vehicleTypes": vehicle_types,
            "isCovered": self.is_covered,
            "hasCCTV": self.has_cctv,
            "hasSecurity": self.has_security,
            "hasEVCharging": self.has_ev_charging,
            "hasValet": self.has_valet,
            "isAvailable": self.is_available,
            "rating": self.rating,
            "reviewCount": self.review_count,
            "image": self.image,
            "images": [self.image] if self.image else [],
            "schedule": schedule,
            "owner": owner,
            "description": self.description or "",
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }


class ParkitBooking(Base):
    __tablename__ = "parkit_bookings"

    id = Column(String(50), primary_key=True, index=True)
    user_email = Column(String(150), index=True, nullable=True)
    user_name = Column(String(100), nullable=True)
    listing_id = Column(String(50), ForeignKey("parkit_listings.id", ondelete="CASCADE"), nullable=False, index=True)
    listing_title = Column(String(200), nullable=False)
    category = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    date = Column(String(20), index=True, nullable=False)
    start_time = Column(String(10), nullable=False)
    end_time = Column(String(10), nullable=False)
    duration_hours = Column(Float, default=1.0)
    hourly_rate = Column(Float, default=50.0)
    rental_amount = Column(Float, default=50.0)
    platform_fee = Column(Float, default=0.0)
    total_amount = Column(Float, default=50.0)
    owner_earnings = Column(Float, default=0.0)
    status = Column(String(20), default="confirmed")  # confirmed, completed, cancelled
    vehicle_type = Column(String(50), default="four_wheeler")
    vehicle_number = Column(String(50), nullable=True)
    owner_name = Column(String(100), nullable=True)
    owner_phone = Column(String(50), nullable=True)
    pin_code = Column(String(10), nullable=False)
    qr_code = Column(String(100), nullable=True)
    booking_created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "userEmail": self.user_email,
            "userName": self.user_name,
            "listingId": self.listing_id,
            "listingTitle": self.listing_title,
            "category": self.category,
            "address": self.address,
            "date": self.date,
            "startTime": self.start_time,
            "endTime": self.end_time,
            "durationHours": self.duration_hours,
            "hourlyRate": self.hourly_rate,
            "rentalAmount": self.rental_amount,
            "platformFee": self.platform_fee,
            "totalAmount": self.total_amount,
            "ownerEarnings": self.owner_earnings,
            "status": self.status,
            "vehicleType": self.vehicle_type,
            "vehicleNumber": self.vehicle_number,
            "ownerName": self.owner_name,
            "ownerPhone": self.owner_phone,
            "pinCode": self.pin_code,
            "qrCode": self.qr_code,
            "bookingCreatedAt": self.booking_created_at.isoformat() if self.booking_created_at else None
        }


class ParkitMessage(Base):
    __tablename__ = "parkit_messages"

    id = Column(String(50), primary_key=True, index=True)
    listing_id = Column(String(50), ForeignKey("parkit_listings.id", ondelete="CASCADE"), index=True, nullable=False)
    sender = Column(String(20), nullable=False)  # customer | owner
    sender_name = Column(String(100), default="User")
    text = Column(Text, nullable=False)
    timestamp = Column(String(50), nullable=False)
    date = Column(String(50), default="Today")
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "listingId": self.listing_id,
            "sender": self.sender,
            "senderName": self.sender_name,
            "text": self.text,
            "timestamp": self.timestamp,
            "date": self.date,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }
