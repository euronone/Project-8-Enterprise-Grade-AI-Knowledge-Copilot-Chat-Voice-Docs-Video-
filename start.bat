@echo off
echo ========================================
echo   KnowledgeForge - Quick Start
echo ========================================

echo.
echo [1/2] Starting backend (Docker)...
cd /d "%~dp0backend"

REM Start DB + Redis first, wait for them to be healthy, then start API
docker compose up -d db redis
echo Waiting for database to be ready...
timeout /t 8 /nobreak >nul
docker compose up -d api

echo.
echo [2/2] Starting frontend...
cd /d "%~dp0frontend"
start "KnowledgeForge Frontend" cmd /k "npm run dev -- --port 3001"

echo.
echo ========================================
echo   App is starting!
echo   Frontend: http://localhost:3001
echo   Backend:  http://localhost:8000/docs
echo ========================================
echo.
echo To check backend logs: cd backend ^&^& docker compose logs -f api
echo To stop everything:    run stop.bat
echo.
pause
