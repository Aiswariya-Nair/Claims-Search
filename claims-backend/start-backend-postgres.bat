@echo off
echo Starting Claims Backend with PostgreSQL...

REM Set environment variables for PostgreSQL
set SPRING_PROFILES_ACTIVE=postgres
set SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/claims_db
set SPRING_DATASOURCE_USERNAME=postgres
set SPRING_DATASOURCE_PASSWORD=password

echo.
echo ================================================
echo   Claims Management System - Backend Server
echo ================================================
echo.
echo Database: PostgreSQL (localhost:5432/claims_db)
echo Username: postgres
echo.
echo Make sure PostgreSQL is running and database 'claims_db' exists!
echo.
echo Starting application...
echo.

REM Run the Spring Boot application
mvn spring-boot:run

pause