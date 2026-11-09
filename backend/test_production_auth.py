import time
import json
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import ParkitUser

client = TestClient(app)

def run_tests():
    print("=== TESTING PARKIT REAL AUTHENTICATION & SIGNUP API ===")

    # Test 1: Unregistered account login -> 401
    unregistered_email = f"unregistered_{int(time.time())}@gmail.com"
    resp = client.post("/v1/parkit/auth/login", json={
        "email": unregistered_email,
        "password": "mypassword123"
    })
    assert resp.status_code == 401, f"Expected 401, got {resp.status_code}"
    assert "Account not found. Please sign up first." in resp.json().get("detail", "")
    print("PASS 1: Unregistered login properly rejected (401)")

    # Test 2: Invalid email format -> 400
    resp = client.post("/v1/parkit/auth/signup", json={
        "name": "Invalid User",
        "email": "not-an-email-address",
        "password": "ValidPassword123!",
        "confirmPassword": "ValidPassword123!"
    })
    assert resp.status_code == 400, f"Expected 400, got {resp.status_code}"
    assert "valid email" in resp.json().get("detail", "").lower()
    print("PASS 2: Invalid email format rejected (400)")

    # Test 3: Weak password (< 6 chars) -> 400
    resp = client.post("/v1/parkit/auth/signup", json={
        "name": "Weak User",
        "email": "weak_pwd@gmail.com",
        "password": "123",
        "confirmPassword": "123"
    })
    assert resp.status_code == 400, f"Expected 400, got {resp.status_code}"
    assert "at least 6 characters" in resp.json().get("detail", "").lower()
    print("PASS 3: Weak password rejected (400)")

    # Test 4: New user registration -> 200
    test_email = f"driver_{int(time.time())}@gmail.com"
    resp = client.post("/v1/parkit/auth/signup", json={
        "name": "Rohan Deshmukh",
        "email": test_email,
        "phone": "+91 98200 99887",
        "password": "SecurePassword123!",
        "confirmPassword": "SecurePassword123!"
    })
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
    user_data = resp.json()
    assert user_data.get("email") == test_email
    print(f"PASS 4: New user registration succeeded (200) -> {user_data.get('name')}")

    # Test 5: Verify genuine database record creation in SQLite
    db = SessionLocal()
    try:
        db_user = db.query(ParkitUser).filter(ParkitUser.email == test_email).first()
        assert db_user is not None, "User record was not created in SQLite database!"
        assert ":" in db_user.password_hash, "Password hash must be salted PBKDF2!"
        assert db_user.password_hash != "SecurePassword123!", "Plaintext password must NEVER be stored!"
        print(f"PASS 5: Database record verified in SQLite (ID: {db_user.id}, Hash: {db_user.password_hash[:20]}...)")
    finally:
        db.close()

    # Test 6: Duplicate email registration prevention -> 400
    resp = client.post("/v1/parkit/auth/signup", json={
        "name": "Rohan Duplicate",
        "email": test_email,
        "password": "SecurePassword123!",
        "confirmPassword": "SecurePassword123!"
    })
    assert resp.status_code == 400, f"Expected 400, got {resp.status_code}"
    assert "already registered" in resp.json().get("detail", "").lower()
    print("PASS 6: Duplicate email registration blocked (400)")

    # Test 7: Login using the newly registered account -> 200
    resp = client.post("/v1/parkit/auth/login", json={
        "email": test_email,
        "password": "SecurePassword123!"
    })
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    assert resp.json().get("email") == test_email
    print("PASS 7: Login using newly registered account succeeded (200)")

    # Test 8: Trailing slash resilience -> verify 200 and never 405
    resp = client.post("/v1/parkit/auth/login/", json={
        "email": test_email,
        "password": "SecurePassword123!"
    })
    assert resp.status_code == 200, f"Trailing slash test failed: {resp.status_code}"
    print("PASS 8: Trailing slash route aliases return 200 OK (no 405)")

    print("\nALL 8 REGISTRATION & AUTHENTICATION TESTS PASSED 100%!")

    # Cleanup test user from database
    db = SessionLocal()
    try:
        db.query(ParkitUser).filter(ParkitUser.email == test_email).delete(synchronize_session=False)
        db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    run_tests()
