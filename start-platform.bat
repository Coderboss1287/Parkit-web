@echo off
echo ===============================================================
echo Starting PARKIT + ATLAS MAPS API Platform
echo ===============================================================

echo Starting ATLAS MAPS API Backend (FastAPI on Port 8000)...
start "ATLAS MAPS API - FastAPI Gateway" cmd /k "cd backend && venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"

timeout /t 2 /nobreak >nul

echo Starting PARKIT React + Vite Frontend (Port 5173)...
start "PARKIT Frontend - Vite" cmd /k "npm.cmd run dev"

echo.
echo ===============================================================
echo ATLAS MAPS API Swagger Docs: http://localhost:8000/docs
echo PARKIT Frontend Web App:     http://localhost:5173
echo ===============================================================

