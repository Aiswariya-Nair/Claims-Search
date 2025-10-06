@echo off
echo Starting Claims Backend with PostgreSQL (Low Memory Version)...
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

REM Set environment variables for PostgreSQL
set SPRING_PROFILES_ACTIVE=postgres
set SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/claims_db
set SPRING_DATASOURCE_USERNAME=postgres
set SPRING_DATASOURCE_PASSWORD=psql

REM Set Java environment
set JAVA_HOME=C:\Program Files\Java\jdk-21

echo Using JAVA_HOME: %JAVA_HOME%
echo.
echo Starting application with reduced memory...
echo.

REM Run the Spring Boot application using Maven wrapper with memory settings
set MAVEN_OPTS=-Xms256m -Xmx512m
mvnw.cmd spring-boot:run

pause