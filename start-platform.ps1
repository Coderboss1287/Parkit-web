Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host "Starting PARKIT + ATLAS MAPS API Platform" -ForegroundColor Green
Write-Host "===============================================================" -ForegroundColor Cyan

# Start FastAPI Backend in background job or new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; & '$PSScriptRoot\backend\venv\Scripts\python.exe' -m uvicorn app.main:app --reload --port 8000"

Start-Sleep -Seconds 2

# Start Vite Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm.cmd run dev"

Write-Host "ATLAS MAPS API Swagger Docs: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "PARKIT Frontend Web App:     http://localhost:5173" -ForegroundColor Yellow

