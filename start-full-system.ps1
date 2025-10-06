Write-Host "Starting Complete Claims Management System..." -ForegroundColor Green
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Claims Management System - Full Stack Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Check prerequisites
Write-Host "🔍 Checking Prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Check Java
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✅ Java: Found" -ForegroundColor Green
    Write-Host "   $($javaVersion.Line.Trim())" -ForegroundColor Gray
} catch {
    Write-Host "❌ Java: Not found" -ForegroundColor Red
    Write-Host "   Please install Java 17+ and add to PATH" -ForegroundColor Yellow
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js: Not found" -ForegroundColor Red
    Write-Host "   Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check Angular CLI
try {
    $ngVersion = ng version --skip-git 2>$null | Select-String "Angular CLI"
    Write-Host "✅ Angular CLI: Found" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Angular CLI: Not found, installing..." -ForegroundColor Yellow
    npm install -g @angular/cli
}

Write-Host ""

# Check if ports are available
Write-Host "🔌 Checking Port Availability..." -ForegroundColor Yellow
if (Test-Port 8080) {
    Write-Host "⚠️  Port 8080: Already in use (Backend may already be running)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Port 8080: Available" -ForegroundColor Green
}

if (Test-Port 4200) {
    Write-Host "⚠️  Port 4200: Already in use (Frontend may already be running)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Port 4200: Available" -ForegroundColor Green
}

Write-Host ""

# Start Backend
Write-Host "🚀 Starting Backend Server..." -ForegroundColor Yellow
Set-Location "c:\Users\hp\Desktop\Claims Project\claims-backend"

# Start backend in a new PowerShell window
$backendJob = Start-Process powershell -ArgumentList "-File", "start-backend.ps1" -PassThru
Write-Host "✅ Backend starting in separate window (PID: $($backendJob.Id))" -ForegroundColor Green

# Wait for backend to be ready
Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
$maxWaitTime = 60 # seconds
$waitTime = 0
$backendReady = $false

while ($waitTime -lt $maxWaitTime -and -not $backendReady) {
    Start-Sleep -Seconds 2
    $waitTime += 2
    try {
        $healthResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method Get -TimeoutSec 3
        if ($healthResponse.status -eq "UP") {
            $backendReady = $true
            Write-Host "✅ Backend is ready!" -ForegroundColor Green
        }
    } catch {
        Write-Host "." -NoNewline -ForegroundColor Gray
    }
}

if (-not $backendReady) {
    Write-Host ""
    Write-Host "❌ Backend failed to start within $maxWaitTime seconds" -ForegroundColor Red
    Write-Host "   Check the backend console for errors" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Start Frontend
Write-Host "🚀 Starting Frontend Server..." -ForegroundColor Yellow
Set-Location "c:\Users\hp\Desktop\Claims Project\claims-search-ui"

# Install frontend dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "✅ Starting Angular development server..." -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Application URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:4200" -ForegroundColor White
Write-Host "   Backend:  http://localhost:8080" -ForegroundColor White
Write-Host "   API:      http://localhost:8080/api" -ForegroundColor White
Write-Host ""
Write-Host "✨ The browser will automatically open when ready!" -ForegroundColor Green
Write-Host ""

# Start frontend with proxy
ng serve --proxy-config proxy.conf.json --host 0.0.0.0 --port 4200 --open