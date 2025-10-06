@echo off
echo ========================================
echo   Claims Management System - Connection Test
echo ========================================
echo.

echo Testing Backend Connection...
echo.

REM Test backend health endpoint
curl -s -o nul -w "Backend Health Check: %%{http_code}\n" http://localhost:8080/api/health

if %errorlevel% neq 0 (
    echo.
    echo ❌ Backend is NOT running or not accessible
    echo.
    echo Please ensure:
    echo 1. PostgreSQL is running
    echo 2. Backend server is started: cd claims-backend && mvn spring-boot:run
    echo 3. Backend is accessible at http://localhost:8080
    echo.
) else (
    echo ✅ Backend is running and accessible
    echo.
)

echo Testing Frontend Connection...
echo.

REM Check if Angular dev server is running
curl -s -o nul -w "Frontend Server: %%{http_code}\n" http://localhost:4200

if %errorlevel% neq 0 (
    echo.
    echo ❌ Frontend is NOT running or not accessible
    echo.
    echo Please ensure:
    echo 1. Node.js is installed
    echo 2. Dependencies are installed: cd claims-search-ui && npm install
    echo 3. Frontend server is started: ng serve --proxy-config proxy.conf.json
    echo 4. Frontend is accessible at http://localhost:4200
    echo.
) else (
    echo ✅ Frontend is running and accessible
    echo.
)

echo Testing API Integration...
echo.

REM Test claims API
curl -s -w "Claims API Response: %%{http_code}\n" -o test-response.json http://localhost:8080/api/claims?pageSize=1

if %errorlevel% neq 0 (
    echo ❌ Claims API is not responding
) else (
    echo ✅ Claims API is responding
    if exist test-response.json (
        echo Response saved to test-response.json
        del test-response.json
    )
)

echo.
echo ========================================
echo   Test Complete
echo ========================================
echo.
echo If all tests pass, your application should work correctly.
echo Navigate to: http://localhost:4200
echo.

pause