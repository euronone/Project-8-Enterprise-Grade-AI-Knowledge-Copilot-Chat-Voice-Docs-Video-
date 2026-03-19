@echo off
echo ========================================
echo   KnowledgeForge - Stopping
echo ========================================

echo.
echo Stopping backend containers...
cd /d "%~dp0backend"
docker compose stop

echo.
echo Closing frontend window...
taskkill /FI "WINDOWTITLE eq KnowledgeForge Frontend" /F >nul 2>&1

echo.
echo All services stopped.
echo (Run start.bat to restart quickly without rebuilding)
echo.
pause
