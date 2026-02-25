# Setup Guide

This document explains how to run the Cryptography Assignment MVP locally.

## Prerequisites
- Windows with terminal access (PowerShell/CMD)
- Conda installed
- Node.js + npm installed

---

## 1) Clone / open project
Open the folder:

```bash
c:\Cryptography_Assignment
```

---

## 2) Backend setup (FastAPI + Python)
From project root:

```bash
cd backend
```

Create and activate the conda environment (`crypto`) if needed:

```bash
conda create -n crypto python=3.11 -y
conda activate crypto
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Start backend server:

```bash
uvicorn main:app --reload --port 8000
```

Backend runs at:
- `http://127.0.0.1:8000`
- Health check: `http://127.0.0.1:8000/health`

---

## 3) Frontend setup (React + TypeScript)
Open a **new terminal** from project root:

```bash
cd frontend
npm install
npm start
```

Frontend runs at:
- `http://localhost:3000`

---

## 4) How to use the app
1. Select mode: `encrypt` or `decrypt`
2. Select algorithm: `playfair`, `two columnar`, or `sha256`
3. Enter input text
4. Enter key (required for Playfair and Two Columnar)
5. Click `run`

Input rules:
- Only lowercase alphabets (`a-z`) are accepted for text/key inputs.
- SHA-256 supports only hash mode (decryption is blocked).

---

## 5) Quick API test (optional)
Example health check in PowerShell:

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8000/health
```

Example process request:

```powershell
$body = @{mode="encrypt"; algorithm="sha256"; text="hello"} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/process -Body $body -ContentType "application/json"
```

---

## 6) Troubleshooting
- **Port 8000 busy**: run backend on another port (e.g. `--port 8001`) and set `REACT_APP_API_BASE` in `frontend/.env.development`.
- **Conda env not found**: run `conda env list` and create `crypto` if missing.
- **Frontend dependency issues**: delete `frontend/node_modules` and run `npm install` again.

---

## 7) Test on mobile using ngrok

### 7.1 Install ngrok (Windows)
Use one of the following:

```powershell
winget install --id Ngrok.Ngrok -e
```

or

```powershell
choco install ngrok
```

Then connect your account once:

```powershell
ngrok config add-authtoken <YOUR_AUTHTOKEN>
```

Get token from: `https://dashboard.ngrok.com/get-started/your-authtoken`

### 7.2 Start local servers
Terminal 1 (backend):

```powershell
cd c:\Cryptography_Assignment\backend
conda activate crypto
uvicorn main:app --reload --port 8000
```

Terminal 2 (frontend):

```powershell
cd c:\Cryptography_Assignment\frontend
npm start
```

### 7.3 Expose both ports with a **single ngrok agent** (free-plan friendly)
Do **not** run `ngrok http 8000` and `ngrok http 3000` in separate terminals.

Create/edit ngrok config at:
`C:\Users\<YOUR_USER>\AppData\Local\ngrok\ngrok.yml`

Add tunnels:

```yaml
tunnels:
	backend:
		proto: http
		addr: 8000
	frontend:
		proto: http
		addr: 3000
```

Then start both from one terminal:

```powershell
ngrok start --all
```

This opens both public URLs under a single agent session and avoids `ERR_NGROK_108`.

### 7.4 Point frontend to tunneled backend
In `frontend/.env.development`, set:

```env
REACT_APP_API_BASE=<YOUR_BACKEND_NGROK_HTTPS_URL>
```

Example:

```env
REACT_APP_API_BASE=https://abcd-1234.ngrok-free.app
```

Restart `npm start` after changing `.env.development`.

### 7.5 Open on your mobile
- Make sure phone and laptop both have internet.
- Open the **frontend ngrok URL** on your phone.
- Submit encryption/decryption requests; frontend will call backend through `REACT_APP_API_BASE`.

---

## 8) Deploy on Vercel

Deploy as **two Vercel projects**:
- Project A: `backend/` (FastAPI API)
- Project B: `frontend/` (React UI)

### 8.1 Install and login
```bash
npm i -g vercel
vercel login
```

### 8.2 Deploy backend (FastAPI)
From backend folder:

```bash
cd c:\Cryptography_Assignment\backend
vercel
```

When prompted:
- Link to existing project? `No` (first time)
- Set project name: e.g. `crypto-backend`
- Root directory: `.`

After deploy, note backend URL (example):
`https://crypto-backend.vercel.app`

Health check:
`https://crypto-backend.vercel.app/health`

### 8.3 Deploy frontend (React)
From frontend folder:

```bash
cd c:\Cryptography_Assignment\frontend
vercel
```

Set environment variable in Vercel project:
- Key: `REACT_APP_API_BASE`
- Value: `https://<your-backend-vercel-domain>`

You can set it using CLI:

```bash
vercel env add REACT_APP_API_BASE production
```

Then redeploy frontend:

```bash
vercel --prod
```

### 8.4 Verify deployment
- Open frontend Vercel URL in browser/mobile.
- Run one encrypt/decrypt request.
- If request fails, confirm `REACT_APP_API_BASE` points to backend Vercel URL.
