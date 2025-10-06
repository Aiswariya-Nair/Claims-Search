Write-Host "Starting Claims Backend with PostgreSQL..." -ForegroundColor Green
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Claims Management System - Backend Server" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Database: PostgreSQL (localhost:5432/claims_db)" -ForegroundColor Yellow
Write-Host "Username: postgres" -ForegroundColor Yellow
Write-Host ""
Write-Host "Make sure PostgreSQL is running and database 'claims_db' exists!" -ForegroundColor Red
Write-Host ""

# Set Java environment
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
if (-not (Test-Path $env:JAVA_HOME)) {
    # Try alternative Java paths
    $possibleJavaHomes = @(
        "C:\Program Files\Java\jdk-21",
        "C:\Program Files\Java\jre-21",
        "C:\Program Files (x86)\Java\jdk-21",
        "C:\Program Files (x86)\Java\jre-21"
    )
    
    foreach ($path in $possibleJavaHomes) {
        if (Test-Path $path) {
            $env:JAVA_HOME = $path
            break
        }
    }
    
    if (-not $env:JAVA_HOME -or -not (Test-Path $env:JAVA_HOME)) {
        Write-Host "Warning: JAVA_HOME not found. Using system Java." -ForegroundColor Yellow
        $env:JAVA_HOME = (Get-Command java).Source | Split-Path | Split-Path
    }
}

Write-Host "Using JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Cyan
Write-Host ""

# Set environment variables for PostgreSQL
$env:SPRING_PROFILES_ACTIVE = "postgres"
$env:SPRING_DATASOURCE_URL = "jdbc:postgresql://localhost:5432/claims_db"
$env:SPRING_DATASOURCE_USERNAME = "postgres"
$env:SPRING_DATASOURCE_PASSWORD = "psql"

# Change to backend directory
Set-Location "c:\Users\hp\Desktop\Claims Project\claims-backend"

Write-Host "Starting application..." -ForegroundColor Green
Write-Host ""

# Check if Maven wrapper exists
if (Test-Path ".\mvnw.cmd") {
    Write-Host "Running with Maven wrapper..." -ForegroundColor Green
    & .\mvnw.cmd spring-boot:run
} else {
    Write-Host "Maven wrapper not found. Please install Maven or use the batch file." -ForegroundColor Red
    pause
    exit 1
}