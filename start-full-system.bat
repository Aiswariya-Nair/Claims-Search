@echo off
echo Starting Complete Claims Management System...
echo.
echo ================================================
echo   Claims Management System - Full Stack Setup
echo ================================================
echo.

echo Step 1: Starting Backend Server...
cd "c:\Users\hp\Desktop\Claims Project\claims-backend"
start "Claims Backend" cmd /k "start-backend.ps1"

echo Step 2: Waiting for backend to initialize...
timeout /t 15 /nobreak

echo Step 3: Starting Frontend Server...
cd "c:\Users\hp\Desktop\Claims Project\claims-search-ui"
echo.
echo Application URLs:
echo   Frontend: http://localhost:4200
echo   Backend:  http://localhost:8080
echo   API:      http://localhost:8080/api
echo.
echo The browser will open automatically when ready!
echo.

ng serve --proxy-config proxy.conf.json --host 0.0.0.0 --port 4200 --open