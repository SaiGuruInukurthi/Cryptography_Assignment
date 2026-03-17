# Comprehensive Documentation

## 1. Project Overview

This project is a full-stack cryptography web application presented as an internship case study. It demonstrates how classical ciphers and modern hashing can be exposed through a clean API and an interactive terminal-style frontend.

Core capabilities:
- Playfair cipher encryption and decryption
- Double columnar transposition encryption and decryption
- SHA-512 hashing (one-way)

The application is designed for educational clarity, fast iteration, and straightforward deployment.

## 2. Objectives

- Provide a single UI to test multiple cryptographic workflows
- Enforce strict input validation for predictable results
- Keep algorithm implementations modular and independently maintainable
- Offer production-style deployment with separate frontend and backend services

## 3. Technology Stack

### Backend
- Python 3.11
- FastAPI
- Uvicorn
- Pydantic

### Frontend
- React 18
- TypeScript
- React Router
- Axios
- Three.js (visual background effect)
- react-scripts (Create React App toolchain)

### Deployment and Operations
- Vercel CLI for production deployment
- Windows helper scripts for local orchestration

## 4. High-Level Architecture

```text
React Frontend (Landing + Terminal)
        |
        | HTTP JSON
        v
FastAPI Backend (/health, /process)
        |
        | Algorithm dispatch
        v
playfair.py | two_columnar.py | sha512_algo.py
```

## 5. Repository Structure

```text
Cryptography_Assignment/
|-- README.md
|-- start.bat
|-- stop.bat
|-- deploy.local.bat
|-- Docs/
|   |-- Comprehensive_Documentation.md
|   |-- Setup.md
|   |-- Deployment.md
|   |-- Algos.md
|   `-- MVP.md
|-- backend/
|   |-- main.py
|   |-- playfair.py
|   |-- two_columnar.py
|   |-- sha512_algo.py
|   |-- requirements.txt
|   |-- vercel.json
|   `-- api/
|       `-- index.py
`-- frontend/
    |-- package.json
    |-- tsconfig.json
    |-- public/
    `-- src/
        |-- App.tsx
        |-- App.css
        |-- api.ts
        |-- index.tsx
        |-- types.ts
        |-- components/
        |   |-- ControlPanel.tsx
        |   |-- TerminalOutput.tsx
        |   |-- PixelSnow.tsx
        |   `-- PixelSnow.css
        `-- pages/
            |-- LandingPage.tsx
            `-- TerminalPage.tsx
```

## 6. Backend Design

### 6.1 API Endpoints

- `GET /health`
- `POST /process`

`GET /health` response:

```json
{"status":"ok"}
```

### 6.2 Process API Contract

Request body:

```json
{
  "mode": "encrypt",
  "algorithm": "playfair",
  "text": "helloworld",
  "key": "keyword"
}
```

Field rules:
- `mode`: `encrypt` or `decrypt`
- `algorithm`: `playfair`, `two_columnar`, or `sha512`
- `text`: lowercase alphabets only (`a-z`)
- `key`: required for `playfair` and `two_columnar`

Behavior rules:
- `sha512` rejects `decrypt` mode with a clear error message
- Playfair and two-columnar require a non-empty key

Example success response:

```json
{
  "success": true,
  "algorithm": "playfair",
  "mode": "encrypt",
  "input": "helloworld",
  "output": "...",
  "message": "Processed successfully"
}
```

Example error response:

```json
{
  "success": false,
  "error": "SHA-512 is a one-way hash and does not support decryption"
}
```

### 6.3 Validation and Security Notes

- Input validation is enforced by Pydantic validators in the request model
- Text and key are normalized to lowercase before validation checks
- CORS is configured to allow frontend access

## 7. Algorithm Notes

### 7.1 Playfair Cipher
- 5x5 key matrix with i/j normalization
- Digraph preprocessing with `x` insertion for duplicate letters
- Supports encryption and decryption

### 7.2 Double Columnar Transposition
- Key defines sorted column read order
- Two sequential transposition passes are applied
- Supports encryption and decryption

### 7.3 SHA-512
- Uses Python `hashlib.sha512`
- Returns a fixed 128-character hex digest
- One-way operation only

## 8. Frontend Design

### 8.1 Page Flow

- Landing page:
  - Internship case study branding
  - Algorithm summaries
  - Team contributors section with independent member cards
- Terminal page:
  - Input controls (mode, algorithm, text, key)
  - Visual helpers (Playfair matrix, transposition grids)
  - Terminal-style output history
  - Preserved GitHub repository button

### 8.2 API Integration

Frontend API layer uses:
- `REACT_APP_API_BASE` when defined
- fallback to `http://localhost:8000`

This allows local and deployed environments to use the same frontend build logic.

## 9. Local Development

### 9.1 Backend

```bash
cd backend
conda create -n crypto python=3.11 -y
conda activate crypto
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 9.2 Frontend

```bash
cd frontend
npm install
npm start
```

Default URLs:
- Frontend: `http://localhost:3000`
- Backend: `http://127.0.0.1:8000`

### 9.3 Windows Helper Scripts

- `start.bat`: starts backend and frontend in separate terminals
- `stop.bat`: stops backend and frontend processes
- `deploy.local.bat`: deploys backend then frontend to Vercel production

## 10. Deployment Strategy

This project uses two separate Vercel deployments from one repository.

- Backend project root: `backend/`
- Frontend project root: `frontend/`

Production deploy sequence:

```powershell
cd backend
vercel --prod --yes

cd ..\frontend
vercel --prod --yes
```

Frontend environment variable in Vercel:
- Key: `REACT_APP_API_BASE`
- Value: backend production URL (for example `https://<backend>.vercel.app`)

After changing frontend env vars, redeploy frontend.

## 11. Team Information

- Inukurthi Sri Venkata Sai Guru - 2023003611
- B Vishwajanani - 2023001493
- K Akhila Varma - 2023003717
- Varsha Sathya Narayana - 202001431

Course: Internship course  
Semester: 6

## 12. Troubleshooting

- API requests fail in frontend:
  - verify backend is running
  - verify `REACT_APP_API_BASE` points to active backend URL
- Validation errors for input:
  - only lowercase `a-z` is accepted for text/key
- SHA-512 decrypt selected:
  - expected failure; SHA-512 supports hashing only
- Frontend build issues:
  - remove `node_modules`, run `npm install`, build again
- Port conflicts:
  - run backend on another port and update frontend base URL

## 13. Known Limitations

- No automated test suite is currently configured
- Cipher outputs can include padding `x` characters
- Input domain is intentionally restricted to lowercase alphabets

## 14. Suggested Next Improvements

- Add backend unit tests for all algorithm modules
- Add frontend component tests for control flows and error states
- Add CI pipeline for lint, build, and tests
- Add richer API docs (OpenAPI examples and error catalogs)
- Add observability logs/metrics for deployed API
