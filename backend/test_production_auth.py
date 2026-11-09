import time
import json
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_tests():
    print("=== TESTING PARKIT REAL AUTHENTICATION ===")

    # Test 1: Unregistered account login
    unregistered_email = f"unregistered_{int(time.time())}@gmail.com"
    resp = client.post("/v1/parkit/auth/login", json={
        "email": unregistered_email,
        "password": "mypassword123"
    })
    code = resp.status_code
    res = resp.json()
    print(f"Test 1 [Unregistered Login]: Status {code} -> {res}")
    assert code == 401, f"Expected 401, got {code}"
    assert "Account not found. Please sign up first." in res.get("detail", ""), f"Unexpected detail: {res}"
    print("PASS: Unregistered login properly rejected!")

    # Test 2: Valid Signup with new email
    test_email = f"verified_driver_{int(time.time())}@gmail.com"
    resp = client.post("/v1/parkit/auth/signup", json={
        "name": "Rohan Deshmukh",
        "email": test_email,
        "phone": "+91 98200 99887",
        "password": "SecurePassword123!",
        "confirmPassword": "SecurePassword123!"
    })
    code = resp.status_code
    res = resp.json()
    print(f"Test 2 [Signup New Account]: Status {code} -> User: {res.get('name')}, Email: {res.get('email')}")
    assert code == 200, f"Expected 200, got {code}"
    assert res.get("email") == test_email
    print("PASS: Account created successfully in SQLite database!")

    # Test 3: Duplicate Signup prevention
    resp = client.post("/v1/parkit/auth/signup", json={
        "name": "Rohan Duplicate",
        "email": test_email,
        "password": "SecurePassword123!",
        "confirmPassword": "SecurePassword123!"
    })
    code = resp.status_code
    res = resp.json()
    print(f"Test 3 [Duplicate Signup]: Status {code} -> {res}")
    assert code == 400, f"Expected 400, got {code}"
    assert "Email is already registered" in res.get("detail", "")
    print("PASS: Duplicate registration blocked!")

    # Test 4: Login with incorrect password
    resp = client.post("/v1/parkit/auth/login", json={
        "email": test_email,
        "password": "WrongPassword999"
    })
    code = resp.status_code
    res = resp.json()
    print(f"Test 4 [Incorrect Password]: Status {code} -> {res}")
    assert code == 401, f"Expected 401, got {code}"
    assert "Incorrect password. Please try again." in res.get("detail", "")
    print("PASS: Incorrect password rejected!")

    # Test 5: Login with correct password
    resp = client.post("/v1/parkit/auth/login", json={
        "email": test_email,
        "password": "SecurePassword123!"
    })
    code = resp.status_code
    res = resp.json()
    print(f"Test 5 [Correct Login]: Status {code} -> Logged in as: {res.get('name')}")
    assert code == 200, f"Expected 200, got {code}"
    assert res.get("email") == test_email
    print("PASS: Registered user authenticated successfully!")

    print("\nALL AUTHENTICATION INTEGRATION TESTS PASSED 100%!")

if __name__ == "__main__":
    run_tests()
