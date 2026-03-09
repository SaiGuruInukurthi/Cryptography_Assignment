# Deployment Guide (Vercel)

This project has **two separate Vercel deployments** from the **same repository**:
- `backend/` → FastAPI API project
- `frontend/` → React UI project

Use the steps below whenever you want your latest local changes to reflect on public links.

---

## 1) Prerequisites

- Vercel CLI installed:

```bash
npm i -g vercel
```

- Logged in:

```bash
vercel login
```

- Repository opened locally at project root:

```text
Cryptography_Assignment/
  backend/
  frontend/
```

---

## 2) Deploy backend (production)

From project root:

```powershell
cd backend
vercel --prod --yes
```

You should see output like:
- `Production: https://<backend-project>.vercel.app`

Save this URL as your backend base URL.

---

## 3) Deploy frontend (production)

From `backend/` folder:

```powershell
cd ..
cd frontend
vercel --prod --yes
```

You should see output like:
- `Production: https://<frontend-project>.vercel.app`

---

## 4) Ensure frontend points to deployed backend

In the **frontend Vercel project settings**, set environment variable:
- Key: `REACT_APP_API_BASE`
- Value: your deployed backend URL, for example:
  - `https://<backend-project>.vercel.app`

If you update this env var, redeploy frontend:

```powershell
cd frontend
vercel --prod --yes
```

---

## 5) Quick verification

### Backend health check
Open in browser:
- `https://<backend-project>.vercel.app/health`

Expected response:

```json
{"status":"ok"}
```

### Frontend check
Open:
- `https://<frontend-project>.vercel.app`

Run one request in UI (Playfair/Two Columnar/SHA-512) and confirm response is shown.

---

## 6) Typical update workflow

Whenever code changes are made:

```powershell
# Deploy backend changes (if backend changed)
cd backend
vercel --prod --yes

# Deploy frontend changes (if frontend changed)
cd ..
cd frontend
vercel --prod --yes
```

If both changed, deploy both.

---

## 7) Troubleshooting

- **Frontend works but API calls fail**
  - Check `REACT_APP_API_BASE` in frontend Vercel project.
  - Confirm backend URL is correct and `/health` returns `ok`.

- **Changes not visible immediately**
  - Hard refresh browser (`Ctrl+F5`) and wait a minute for CDN propagation.

- **Wrong project got deployed**
  - Ensure command is run inside correct folder (`backend` or `frontend`).

- **CLI asks to link project repeatedly**
  - Complete linking once; then future deploys from that folder are direct.
