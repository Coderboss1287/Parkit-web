# PARKIT — FastAPI Backend Deployment Guide

## 1. Why Deployment is Required
The PARKIT frontend is deployed on **GitHub Pages**, which is a **static web server**. 
GitHub Pages serves HTML, CSS, JavaScript, and images, but **cannot execute Python, FastAPI, or manage a database**. When browsers send HTTP `POST` requests to a GitHub Pages domain (such as account registration or login), GitHub Pages rejects them with **`HTTP 405 Method Not Allowed`**.

To make account registration, login, parking space listings, and bookings work on the live site, the FastAPI backend must be hosted on a live cloud provider.

---

## 2. Option A: 1-Click Deployment on Render (Recommended, Free)

1. Sign up for a free account at [render.com](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository: `https://github.com/Coderboss1287/Parkit-web`.
4. Render will auto-detect `render.yaml` or you can manually enter:
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Set Environment Variables:
   - `ATLAS_SECRET_KEY`: `<Any random secure string>`
   - `ATLAS_ENV`: `production`
   - `DEFAULT_DEMO_KEY`: `atlas_live_demo_key_9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c`
6. Click **Create Web Service**. Render will assign you a live HTTPS URL (e.g. `https://parkit-atlas-api.onrender.com`).

---

## 3. Option B: Deployment on Railway (Alternative)

1. Sign up at [railway.app](https://railway.app).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select `Parkit-web`.
4. In Settings -> **Root Directory**, set `/backend`.
5. Railway will automatically build using the included `backend/Dockerfile` or `Procfile` and give you a public URL.

---

## 4. Connect Backend to GitHub Pages Frontend

Once your backend is live (e.g. `https://parkit-atlas-api.onrender.com`):

1. Open your GitHub Repository: `https://github.com/Coderboss1287/Parkit-web`.
2. Go to **Settings** -> **Secrets and variables** -> **Actions**.
3. Click **New repository secret**:
   - **Name**: `VITE_ATLAS_API_URL`
   - **Value**: `https://parkit-atlas-api.onrender.com` (your backend URL without trailing slash)
4. Trigger the GitHub Actions deployment workflow (or push a commit).
5. The frontend will now communicate directly with your live cloud FastAPI backend!

