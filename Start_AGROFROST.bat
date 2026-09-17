@echo off
title AGROFROST Smart Cold Storage System
color 0A
echo ====================================================================
echo      AGROFROST: Solar-Powered Smart Cold Storage System (SIH 2026)
echo ====================================================================
echo.
echo  Starting local server...
echo  Opening http://localhost:5173 in your browser...
echo.

cd /d "C:\Users\user\Documents\New project\agrofrost"

:: Wait 3 seconds for server to start, then launch browser
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:5173"

:: Start Vite Dev Server
call npm run dev
