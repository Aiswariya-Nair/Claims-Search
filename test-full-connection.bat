@echo off
echo Testing Frontend-Backend Connection...
echo.
echo ===============================================
echo   Connection Test - Claims Management System
echo ===============================================
echo.

REM Test if backend is running on port 8080
echo Testing backend health endpoint...
curl -s -o nul -w "Backend Status: %%{http_code}\n" http://localhost:8080/api/health
if %errorlevel% neq 0 (
    echo ERROR: Backend not responding on http://localhost:8080
    echo Please start the backend first using: start-backend.ps1
    echo.
) else (
    echo Backend is responding!
    echo.
)

REM Test claims API endpoint
echo Testing claims API endpoint...
curl -s -o nul -w "Claims API Status: %%{http_code}\n" http://localhost:8080/api/claims?pageSize=1
if %errorlevel% neq 0 (
    echo ERROR: Claims API not responding
    echo.
) else (
    echo Claims API is working!
    echo.
)

REM Show CORS configuration
echo CORS Configuration:
echo - Allowed Origins: http://localhost:4200, http://localhost:4201
echo - Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
echo - Proxy Configuration: /api/* -> http://localhost:8080
echo.

echo Connection test complete!
echo.
echo To start the full system:
echo 1. Start backend: cd claims-backend ^&^& start-backend.ps1
echo 2. Start frontend: cd claims-search-ui ^&^& start-frontend.ps1
echo 3. Open browser: http://localhost:4200
echo.

pause