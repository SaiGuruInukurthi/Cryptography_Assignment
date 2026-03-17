# Crypto Terminal: Internship Case Study

A full-stack cryptography demo application with a terminal-style interface, presented as an internship case study.

This project showcases three classical/modern cryptographic workflows through a single web UI:
- Playfair Cipher (encrypt/decrypt)
- Double Columnar Transposition (encrypt/decrypt)
- SHA-512 (hash only)

The system is split into:
- A Python FastAPI backend for validation and algorithm processing
- A React + TypeScript frontend for interactive usage

## Why This Case Study

This repository is designed as an internship-focused case study for understanding how different crypto techniques behave in practice:
- Substitution cipher behavior (Playfair)
- Transposition cipher behavior (Double Columnar)
- One-way cryptographic hashing (SHA-512)

It focuses on clarity, predictable input/output, and deployment-ready structure.

## Key Features

- Single API endpoint (`/process`) that dispatches to algorithm modules
- Input validation for strict lowercase alphabetic input (`a-z`)
- Clear error handling (for example, SHA-512 decryption is blocked)
- Health endpoint (`/health`) for monitoring/deployment checks
- Terminal-inspired frontend with routing and animated visual background
- Local helper scripts for start/stop/deploy on Windows

## Tech Stack

### Frontend Stack
- Runtime and framework:
  - React `18.2.0`
  - React DOM `18.2.0`
  - TypeScript `5.9.3`
- Routing and API:
  - React Router DOM `6.30.3`
  - Axios `1.6.0`
- Visualization and UI effects:
  - Three.js `0.183.1`
  - `@types/three` `0.183.1`
- Build toolchain:
  - react-scripts `5.0.1` (Create React App)
  - web-vitals `2.1.4`
  - `@types/react` `18.2.0`
  - `@types/react-dom` `18.2.0`
- Package manager and scripts:
  - npm
  - `npm start` for development
  - `npm run build` for production build

### Backend Stack
- Runtime:
  - Python `3.11`
  - Conda environment: `crypto` (recommended)
- Web API framework:
  - FastAPI
- ASGI server:
  - Uvicorn
- Data validation and request modeling:
  - Pydantic
- Standard library usage:
  - `hashlib` for SHA-512 hashing
  - `re` for input validation patterns

### Deployment and DevOps Stack
- Platform:
  - Vercel (separate frontend and backend projects)
- CLI and automation:
  - Vercel CLI (`vercel --prod --yes`)
  - Windows batch automation:
    - `start.bat` (run local backend + frontend)
    - `stop.bat` (stop local processes)
    - `deploy.local.bat` (deploy backend then frontend)
- Environment configuration:
  - Frontend environment variable: `REACT_APP_API_BASE`
  - Backend health probe endpoint: `/health`
- Deployment model:
  - Backend deployed from `backend/`
  - Frontend deployed from `frontend/`

## Project Structure

```text
Cryptography_Assignment/
|-- README.md
|-- start.bat
|-- stop.bat
|-- deploy.local.bat
|-- Docs/
|   |-- Comprehensive_Documentation.md
|   |-- Algos.md
|   |-- Deployment.md
|   |-- MVP.md
|   `-- Setup.md
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
    |   `-- index.html
    `-- src/
        |-- App.tsx
        |-- App.css
        |-- api.ts
        |-- index.tsx
        |-- types.ts
        |-- components/
        |   |-- ControlPanel.tsx
        |   |-- PixelSnow.tsx
        |   |-- PixelSnow.css
        |   `-- TerminalOutput.tsx
        `-- pages/
            |-- LandingPage.tsx
            `-- TerminalPage.tsx
```

## System Architecture

```text
Frontend (React + TypeScript)
        |
        | HTTP JSON requests
        v
Backend API (FastAPI)
        |
        | Dispatch by algorithm + mode
        v
Algorithm Modules
- playfair.py
- two_columnar.py
- sha512_algo.py
```

## API Contract

### Health Check
- Method: `GET`
- Endpoint: `/health`
- Example response:

```json
{"status":"ok"}
```

### Process Request
- Method: `POST`
- Endpoint: `/process`

Request body:

```json
{
  "mode": "encrypt",
  "algorithm": "playfair",
  "text": "helloworld",
  "key": "keyword"
}
```

Rules:
- `mode`: `encrypt` or `decrypt`
- `algorithm`: `playfair`, `two_columnar`, or `sha512`
- `text`: lowercase letters only (`a-z`)
- `key`: required for `playfair` and `two_columnar`
- `sha512` supports hashing only (decryption is not allowed)

## Local Setup

## 1) Backend

```bash
cd backend
conda create -n crypto python=3.11 -y
conda activate crypto
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend URL:
- http://127.0.0.1:8000

## 2) Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend URL:
- http://localhost:3000

## 3) Optional Windows Shortcuts

From project root:
- `start.bat` -> starts backend + frontend in separate terminals
- `stop.bat` -> stops backend/frontend processes
- `deploy.local.bat` -> deploys backend then frontend to Vercel production

## Deployment Strategy

This repository uses a split deployment strategy with two independent Vercel projects:

1. Backend deploy from `backend/`.
2. Frontend deploy from `frontend/`.
3. Frontend environment variable `REACT_APP_API_BASE` points to backend public URL.

Typical production deployment commands:

```powershell
cd backend
vercel --prod --yes

cd ..\frontend
vercel --prod --yes
```

After backend URL changes, update frontend env:
- Key: `REACT_APP_API_BASE`
- Value: `https://<your-backend-project>.vercel.app`

Then redeploy frontend.

## Typical Workflow

1. Start backend and frontend locally.
2. Open frontend and choose mode + algorithm.
3. Submit text/key and inspect terminal output.
4. Validate backend with `/health` during deployment or debugging.

## Input and Validation Notes

- Only lowercase alphabetic input is accepted for text and key.
- Playfair and Two Columnar require a non-empty key.
- SHA-512 is one-way and cannot be decrypted.
- Some ciphers may include padding characters (`x`) after decryption.

## Documentation

Detailed guides are available in the `Docs/` folder:
- `Docs/Comprehensive_Documentation.md` for end-to-end technical and operational documentation
- `Docs/Setup.md` for local run instructions and ngrok/mobile testing
- `Docs/Deployment.md` for Vercel production deploy workflow
- `Docs/Algos.md` for algorithm-level implementation details
- `Docs/MVP.md` for original scope and architecture plan

## Team

- Inukurthi Sri Venkata Sai Guru - 2023003611
- B Vishwajanani - 2023001493
- K Akhila Varma - 2023003717
- Varsha Sathya Narayana - 202001431

Course: Internship course  
Semester: 6

## Future Improvements

- Unit and integration tests for all cipher modules and API behavior
- Better key validation and optional key-strength hints
- UI enhancements for step-by-step cipher visualization
- CI pipeline for automated lint/build/deploy validation

## License

This project is intended for educational and internship case-study use.
