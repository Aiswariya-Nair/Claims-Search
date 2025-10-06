@echo off
echo Starting Claims Backend...
cd "c:\Users\hp\Desktop\Claims Project\claims-backend"

echo Compiling Java files...
javac -cp "src/main/java" -d "target/classes" src/main/java/com/claims/*.java src/main/java/com/claims/*/*.java

if %ERRORLEVEL% NEQ 0 (
    echo Compilation failed!
    pause
    exit /b 1
)

echo Creating JAR file...
if not exist "target" mkdir target
if not exist "target\classes" mkdir "target\classes"

echo Starting application...
java -cp "target/classes" com.claims.ClaimsBackendApplication

pause