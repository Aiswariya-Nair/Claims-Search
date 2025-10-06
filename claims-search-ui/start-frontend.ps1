Write-Host "Starting Claims Search UI Frontend..." -ForegroundColor Green
Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Claims Management System - Frontend UI" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend: Angular 17+ (http://localhost:4200)" -ForegroundColor Yellow
Write-Host "Backend Proxy: http://localhost:8080/api" -ForegroundColor Yellow
Write-Host ""
Write-Host "Make sure the backend server is running on port 8080!" -ForegroundColor Red
Write-Host ""

# Check if we're in the correct directory
$currentPath = Get-Location
Write-Host "Current directory: $currentPath" -ForegroundColor Gray

# Change to the frontend directory
Set-Location "c:\Users\hp\Desktop\Claims Project\claims-search-ui"

# Verify we're in the right directory by checking for package.json
if (Test-Path "package.json") {
    Write-Host "Found package.json - proceeding with startup..." -ForegroundColor Green
} else {
    Write-Host "ERROR: package.json not found. Are we in the right directory?" -ForegroundColor Red
    exit 1
}

# Install dependencies if needed
if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "Starting Angular development server with proxy..." -ForegroundColor Green
Write-Host ""
Write-Host "Navigate to: http://localhost:4200" -ForegroundColor Cyan
Write-Host ""

# Start the Angular development server
ng serve --proxy-config proxy.conf.json --host 0.0.0.0 --port 4200