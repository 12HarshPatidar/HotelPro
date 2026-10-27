@echo off
title HotelPro Suite Launcher
echo ========================================================
echo          HOTELPRO - LUXURY HOTEL MANAGEMENT SYSTEM
echo ========================================================
echo.
echo Starting MongoDB, Backend API, and Frontend Vite Server...
echo.

:: 1. Start MongoDB
start "HotelPro MongoDB [Port 27017]" cmd /k "mongod --dbpath \"C:\Users\hpati\.gemini\antigravity\scratch\data\db\" --bind_ip 127.0.0.1"
timeout /t 3 /nobreak >nul

:: 2. Start Backend API
start "HotelPro Backend API [Port 5000]" cmd /k "cd /d \"%~dp0backend\" && npm start"
timeout /t 3 /nobreak >nul

:: 3. Start Frontend Dev Server
start "HotelPro Frontend [Port 5173]" cmd /k "cd /d \"%~dp0frontend\" && npm run dev"

echo.
echo All services launched!
echo - Frontend:  http://localhost:5173
echo - Backend:   http://localhost:5000/api/health
echo.
echo Keep those terminal windows open while testing.
pause
