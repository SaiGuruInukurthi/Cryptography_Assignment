@echo off
title Stopper

:: Kill uvicorn (backend)
taskkill /f /im uvicorn.exe 2>nul
taskkill /f /im python.exe /fi "WINDOWTITLE eq CryptoBackend" 2>nul

:: Kill node (frontend)
taskkill /f /im node.exe 2>nul

:: Close the terminal windows by title
for /f "tokens=2" %%i in ('tasklist /v /fi "WINDOWTITLE eq CryptoBackend" /fo list ^| findstr "PID:"') do taskkill /f /pid %%i 2>nul
for /f "tokens=2" %%i in ('tasklist /v /fi "WINDOWTITLE eq CryptoFrontend" /fo list ^| findstr "PID:"') do taskkill /f /pid %%i 2>nul

echo Servers stopped.
pause
