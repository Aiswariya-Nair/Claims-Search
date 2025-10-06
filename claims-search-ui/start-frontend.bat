@echo off
echo Starting Claims Search UI Frontend...

echo.
echo ===============================================
echo   Claims Management System - Frontend UI
echo ===============================================
echo.
echo Frontend: Angular 17+ (http://localhost:4200)
echo Backend Proxy: http://localhost:8080/api
echo.
echo Make sure the backend server is running on port 8080!
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Angular CLI is installed
where ng >nul 2>nul
if %errorlevel% neq 0 (
    echo Angular CLI not found. Installing globally...
    npm install -g @angular/cli
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

echo.
echo Starting Angular development server with proxy...
echo.
echo Navigate to: http://localhost:4200
echo.

REM Start the Angular development server with proxy
ng serve --proxy-config proxy.conf.json --host 0.0.0.0 --port 4200

pause