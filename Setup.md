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
- **Port 8000 busy**: run backend on another port (e.g. `--port 8001`) and update frontend API URL in `frontend/src/api.ts`.
- **Conda env not found**: run `conda env list` and create `crypto` if missing.
- **Frontend dependency issues**: delete `frontend/node_modules` and run `npm install` again.
