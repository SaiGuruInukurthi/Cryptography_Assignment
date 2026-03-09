@echo off
title Launcher

:: Start backend in a new terminal
start "CryptoBackend" cmd /k "cd /d C:\Users\IC1807\Documents\Sem_6\Cryptography\Cryptography_Assignment\backend && conda activate crypto && uvicorn main:app --reload --port 8000"

:: Start frontend in a new terminal
start "CryptoFrontend" cmd /k "cd /d C:\Users\IC1807\Documents\Sem_6\Cryptography\Cryptography_Assignment\frontend && npm start"
