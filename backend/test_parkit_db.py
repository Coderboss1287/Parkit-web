import sys
import httpx
import hashlib

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    with httpx.Client(timeout=10.0) as client:
        print("[1] Testing Health...")
        r = client.get(f"{BASE_URL}/health")
        assert r.status_code == 200, f"Health check failed: {r.text}"
        print(" -> Health OK:", r.json())

        print("\n[2] Testing Sign Up with Password Mismatch (expect HTTP 400)...")
        mismatch_payload = {
            "name": "Kavita Roy",
            "email": "kavita.roy@gmail.com",
            "password": "SecretPassword123",
            "confirmPassword": "DifferentPassword456",
            "authMode": "signup"
        }
        r_mismatch = client.post(f"{BASE_URL}/v1/parkit/auth/login", json=mismatch_payload)
        assert r_mismatch.status_code == 400, f"Expected 400, got {r_mismatch.status_code}"
        assert "PASSWORD_MISMATCH" in r_mismatch.json()["detail"]
        print(" -> Caught 400 PASSWORD_MISMATCH as expected:", r_mismatch.json()["detail"])

        print("\n[3] Testing Sign Up with Short Password (<6 chars, expect HTTP 400)...")
        short_payload = {
            "name": "Kavita Roy",
            "email": "kavita.roy@gmail.com",
            "password": "123",
            "confirmPassword": "123",
            "authMode": "signup"
        }
        r_short = client.post(f"{BASE_URL}/v1/parkit/auth/login", json=short_payload)
        assert r_short.status_code == 400
        print(" -> Caught 400 Short Password as expected:", r_short.json()["detail"])

        print("\n[4] Testing Sign Up with Matching Password (expect HTTP 200)...")
        signup_payload = {
            "name": "Kavita Roy",
            "email": "kavita.roy@gmail.com",
            "password": "SecurePassword#2026",
            "confirmPassword": "SecurePassword#2026",
            "authMode": "signup"
        }
        r_signup = client.post(f"{BASE_URL}/v1/parkit/auth/login", json=signup_payload)
        assert r_signup.status_code == 200, f"Signup failed: {r_signup.text}"
        kavita_user = r_signup.json()
        assert kavita_user["email"] == "kavita.roy@gmail.com"
        print(" -> User Signed Up OK:", kavita_user["name"], kavita_user["email"])

        print("\n[5] Testing Login with Wrong Password (expect HTTP 401)...")
        wrong_pwd_payload = {
            "email": "kavita.roy@gmail.com",
            "password": "WrongPassword999",
            "authMode": "login"
        }
        r_wrong = client.post(f"{BASE_URL}/v1/parkit/auth/login", json=wrong_pwd_payload)
        assert r_wrong.status_code == 401, f"Expected 401, got {r_wrong.status_code}"
        assert "INVALID_CREDENTIALS" in r_wrong.json()["detail"]
        print(" -> Caught 401 INVALID_CREDENTIALS as expected:", r_wrong.json()["detail"])

        print("\n[6] Testing Login with Correct Password (expect HTTP 200)...")
        correct_pwd_payload = {
            "email": "kavita.roy@gmail.com",
            "password": "SecurePassword#2026",
            "authMode": "login"
        }
        r_login = client.post(f"{BASE_URL}/v1/parkit/auth/login", json=correct_pwd_payload)
        assert r_login.status_code == 200, f"Login failed: {r_login.text}"
        print(" -> User Logged In OK:", r_login.json()["email"])

        print("\n[7] Testing Get All Users...")
        r = client.get(f"{BASE_URL}/v1/parkit/users")
        assert r.status_code == 200
        users = r.json()
        assert len(users) >= 1
        print(f" -> Found {len(users)} registered users.")

        print("\n[8] Testing Get Listings...")
        r = client.get(f"{BASE_URL}/v1/parkit/listings")
        assert r.status_code == 200
        listings = r.json()
        assert len(listings) >= 12, f"Expected at least 12 sample listings, got {len(listings)}"
        print(f" -> Found {len(listings)} listings in database.")

        print("\n[9] Testing Create Listing...")
        new_spot = {
            "title": "Andheri East Metro Link Park Bay",
            "category": "commercial",
            "locality": "Andheri East, Mumbai",
            "address": "Opposite Metro Station, Andheri East, Mumbai 400069",
            "lat": 19.1197,
            "lng": 72.8464,
            "hourlyPrice": 60,
            "dailyPrice": 500,
            "monthlyPrice": 7500,
            "vehicleTypes": ["four_wheeler", "two_wheeler"],
            "isCovered": True,
            "hasCCTV": True,
            "hasSecurity": True,
            "hasEVCharging": True,
            "isAvailable": True,
            "description": "Covered commercial bay next to Andheri metro station."
        }
        r = client.post(f"{BASE_URL}/v1/parkit/listings", json=new_spot)
        assert r.status_code == 201, f"Create listing failed: {r.text}"
        created_listing = r.json()
        created_id = created_listing["id"]
        print(f" -> Created listing ID: {created_id} ('{created_listing['title']}')")

        print("\n[10] Testing Update Listing...")
        r = client.patch(f"{BASE_URL}/v1/parkit/listings/{created_id}", json={"hourlyPrice": 65, "isAvailable": False})
        assert r.status_code == 200
        updated = r.json()
        assert updated["hourlyPrice"] == 65
        assert updated["isAvailable"] is False
        print(" -> Updated listing price to Rs 65 and availability to False.")

        print("\n[11] Testing Bookings & Conflict Detection...")
        booking_payload = {
            "listingId": created_id,
            "listingTitle": created_listing["title"],
            "userEmail": "kavita.roy@gmail.com",
            "userName": "Kavita Roy",
            "date": "2026-11-20",
            "startTime": "10:00",
            "endTime": "13:00",
            "durationHours": 3,
            "hourlyRate": 65,
            "rentalAmount": 195,
            "platformFee": 23,
            "totalAmount": 218,
            "vehicleType": "four_wheeler",
            "vehicleNumber": "MH 02 EF 9988"
        }
        r = client.post(f"{BASE_URL}/v1/parkit/bookings", json=booking_payload)
        assert r.status_code == 201, f"Create booking failed: {r.text}"
        b1 = r.json()
        print(f" -> Confirmed Booking ID: {b1['id']}, PIN: {b1['pinCode']}, QR: {b1['qrCode']}")

        # Overlapping booking attempt
        print(" -> Testing 409 Conflict check for overlapping time window...")
        conflict_payload = {
            "listingId": created_id,
            "listingTitle": created_listing["title"],
            "userEmail": "other@example.com",
            "userName": "Other User",
            "date": "2026-11-20",
            "startTime": "11:30",  # Overlaps with 10:00 - 13:00
            "endTime": "14:30",
            "durationHours": 3,
            "hourlyRate": 65,
            "totalAmount": 218
        }
        r_conflict = client.post(f"{BASE_URL}/v1/parkit/bookings", json=conflict_payload)
        assert r_conflict.status_code == 409, f"Expected 409 Conflict, got {r_conflict.status_code}: {r_conflict.text}"
        print(f" -> Successfully caught 409 Conflict: {r_conflict.json()['detail']}")

        print("\n[12] Testing Cancel Booking...")
        r = client.patch(f"{BASE_URL}/v1/parkit/bookings/{b1['id']}/cancel")
        assert r.status_code == 200
        cancelled_b = r.json()
        assert cancelled_b["status"] == "cancelled"
        print(f" -> Booking {b1['id']} cancelled successfully.")

        print("\n[13] Testing Chat Messages...")
        msg_payload = {
            "sender": "customer",
            "senderName": "Kavita Roy",
            "text": "Hello, is the EV charger compatible with Tata Nexon EV?",
            "timestamp": "02:30 PM",
            "date": "Today"
        }
        r = client.post(f"{BASE_URL}/v1/parkit/messages/{created_id}", json=msg_payload)
        assert r.status_code == 201
        created_msg = r.json()
        print(f" -> Sent message: '{created_msg['text']}' by {created_msg['senderName']}")

        r = client.get(f"{BASE_URL}/v1/parkit/messages/{created_id}")
        assert r.status_code == 200
        msgs = r.json()
        assert len(msgs) >= 1
        print(f" -> Retrieved {len(msgs)} chat messages for listing {created_id}.")

        print("\n[14] Testing Delete Listing...")
        r = client.delete(f"{BASE_URL}/v1/parkit/listings/{created_id}")
        assert r.status_code == 200
        print(f" -> Deleted listing {created_id} successfully.")

        print("\n==========================================")
        print("ALL PARKIT DATABASE & AUTH TESTS PASSED (100%)!")
        print("==========================================")

if __name__ == "__main__":
    run_tests()
