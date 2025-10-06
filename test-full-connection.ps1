Write-Host "Testing Frontend-Backend Connection..." -ForegroundColor Green
Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Connection Test - Claims Management System" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Test backend health endpoint
Write-Host "1. Testing backend health endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method Get -TimeoutSec 5
    Write-Host "✅ Backend Health Check: SUCCESS" -ForegroundColor Green
    Write-Host "   Status: $($healthResponse.status)" -ForegroundColor Gray
    Write-Host "   Service: $($healthResponse.service)" -ForegroundColor Gray
    Write-Host "   Database: $($healthResponse.database)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend Health Check: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Please start the backend using: start-backend.ps1" -ForegroundColor Yellow
}

Write-Host ""

# Test claims API endpoint
Write-Host "2. Testing claims API endpoint..." -ForegroundColor Yellow
try {
    $claimsResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/claims?pageSize=1" -Method Get -TimeoutSec 5
    Write-Host "✅ Claims API: SUCCESS" -ForegroundColor Green
    Write-Host "   Total Records: $($claimsResponse.total)" -ForegroundColor Gray
    Write-Host "   Page Size: $($claimsResponse.pageSize)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Claims API: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test frontend proxy configuration
Write-Host "3. Checking frontend proxy configuration..." -ForegroundColor Yellow
$proxyConfigPath = "c:\Users\hp\Desktop\Claims Project\claims-search-ui\proxy.conf.json"
if (Test-Path $proxyConfigPath) {
    $proxyConfig = Get-Content $proxyConfigPath | ConvertFrom-Json
    Write-Host "✅ Proxy Configuration: FOUND" -ForegroundColor Green
    Write-Host "   Target: $($proxyConfig.'/api/*'.target)" -ForegroundColor Gray
    Write-Host "   Change Origin: $($proxyConfig.'/api/*'.changeOrigin)" -ForegroundColor Gray
} else {
    Write-Host "❌ Proxy Configuration: NOT FOUND" -ForegroundColor Red
}

Write-Host ""

# Display connection summary
Write-Host "📋 Connection Summary:" -ForegroundColor Cyan
Write-Host "   Frontend URL: http://localhost:4200" -ForegroundColor White
Write-Host "   Backend URL: http://localhost:8080" -ForegroundColor White
Write-Host "   API Endpoints: http://localhost:8080/api/*" -ForegroundColor White
Write-Host "   Proxy Config: /api/* -> http://localhost:8080" -ForegroundColor White
Write-Host ""

Write-Host "🚀 To start the full system:" -ForegroundColor Cyan
Write-Host "   1. Backend: " -NoNewline -ForegroundColor White
Write-Host "cd 'c:\Users\hp\Desktop\Claims Project\claims-backend'; .\start-backend.ps1" -ForegroundColor Yellow
Write-Host "   2. Frontend: " -NoNewline -ForegroundColor White
Write-Host "cd 'c:\Users\hp\Desktop\Claims Project\claims-search-ui'; .\start-frontend.ps1" -ForegroundColor Yellow
Write-Host "   3. Browser: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:4200" -ForegroundColor Yellow
Write-Host ""

# Check if services are running
Write-Host "🔍 Current Service Status:" -ForegroundColor Cyan
$backendRunning = $false
$frontendRunning = $false

try {
    $null = Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method Get -TimeoutSec 2
    $backendRunning = $true
} catch {}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:4200" -Method Get -TimeoutSec 2
    if ($response.StatusCode -eq 200) {
        $frontendRunning = $true
    }
} catch {}

if ($backendRunning) {
    Write-Host "   ✅ Backend: RUNNING (Port 8080)" -ForegroundColor Green
} else {
    Write-Host "   ❌ Backend: NOT RUNNING (Port 8080)" -ForegroundColor Red
}

if ($frontendRunning) {
    Write-Host "   ✅ Frontend: RUNNING (Port 4200)" -ForegroundColor Green
} else {
    Write-Host "   ❌ Frontend: NOT RUNNING (Port 4200)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Connection test complete!" -ForegroundColor Green