@echo off
echo 🚀 Testing Blood Donation API...
echo.

echo 1️⃣ Testing Health Check...
curl -s http://localhost:8081/api/health
echo.
echo.

echo 2️⃣ Testing User Registration...
curl -s -X POST http://localhost:8081/api/auth/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"firstName\":\"Test\",\"lastName\":\"User\",\"bloodGroup\":\"A+\"}"
echo.
echo.

echo 3️⃣ Testing User Login...
curl -s -X POST http://localhost:8081/api/auth/signin ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
echo.
echo.

echo ✅ API tests completed!
pause
