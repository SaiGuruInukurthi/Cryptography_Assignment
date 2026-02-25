# MVP Plan – Cryptography Assignment

## 1) Objective
Build a **Minimum Viable Product (MVP)** that demonstrates the working mechanism of three cryptographic algorithms with a web interface:

1. **Playfair Cipher** (Encrypt + Decrypt)
2. **Two-Columnar Cipher** (Encrypt + Decrypt)
3. **SHA-256** (Hash only; no decryption)

Tech stack:
- **Backend:** FastAPI (Python)
- **Frontend:** React + TypeScript + basic CSS (terminal-style UI)
- **Python environment:** Conda env `crypto`

---

## 2) Functional Requirements

### Input/Output Behavior
- User chooses operation mode: **Encryption** or **Decryption**.
- User chooses algorithm from dropdown:
  - Playfair Cipher
  - Two Columnar Cipher
  - SHA-256
- User provides text input:
  - PT (Plaintext) for encryption
  - CT (Ciphertext) for decryption
- App displays output in terminal-style panel.

### Algorithm Constraints
- **Playfair**:
  - Supports encrypt + decrypt.
  - Requires keyword/key from user.
- **Two Columnar**:
  - Supports encrypt + decrypt.
  - Requires key (column order or keyword).
- **SHA-256**:
  - Supports only hashing (one-way).
  - If user chooses decryption with SHA-256, show a clear validation error message.

---

## 3) Non-Functional Requirements (MVP Level)
- Clean, understandable code organization.
- Each algorithm in a **separate Python file**.
- Fast response for short text inputs.
- Basic input validation and clear error messages.
- Simple but presentable UI with terminal aesthetics.

---

## 4) Proposed System Architecture

```text
React (TypeScript UI)
    ↓ HTTP (JSON)
FastAPI backend (/process)
    ↓
Algorithm modules (Python)
 ├── playfair.py
 ├── two_columnar.py
 └── sha256_algo.py
```

### Data flow
1. User enters mode, algorithm, key (if required), input text.
2. Frontend sends payload to FastAPI `/process`.
3. FastAPI validates request.
4. FastAPI routes to selected algorithm module.
5. Result is returned as JSON.
6. Frontend prints result in terminal-style output block.

---

## 5) Project Structure

```text
Cryptography_Assignment/
├── backend/
│   ├── main.py
│   ├── playfair.py
│   ├── two_columnar.py
│   ├── sha256_algo.py
│   └── requirements.txt
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── public/
│   └── src/
│       ├── App.tsx
│       ├── api.ts
│       ├── components/
│       │   ├── ControlPanel.tsx
│       │   └── TerminalOutput.tsx
│       ├── types.ts
│       └── App.css
└── MVP.md
```

---

## 6) Environment Setup

## 6.1 Backend (Conda + FastAPI)
```bash
conda create -n crypto python=3.11 -y
conda activate crypto
pip install fastapi uvicorn pydantic
```

Create `backend/requirements.txt`:
```txt
fastapi
uvicorn
pydantic
```

Run backend:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

## 6.2 Frontend (React + TypeScript)
```bash
npx create-react-app frontend --template typescript
cd frontend
npm install axios
npm start
```

Frontend default URL: `http://localhost:3000`
Backend default URL: `http://localhost:8000`

---

## 7) Backend MVP Design (FastAPI)

## 7.1 Request Model
```json
{
  "mode": "encrypt | decrypt",
  "algorithm": "playfair | two_columnar | sha256",
  "text": "string",
  "key": "optional-string"
}
```

## 7.2 Response Model (Success)
```json
{
  "success": true,
  "algorithm": "playfair",
  "mode": "encrypt",
  "input": "HELLO",
  "output": "...",
  "message": "Processed successfully"
}
```

## 7.3 Response Model (Validation/Error)
```json
{
  "success": false,
  "error": "SHA-256 does not support decryption"
}
```

## 7.4 API Endpoints
- `POST /process` → core processing endpoint.
- `GET /health` → returns service status.

## 7.5 Routing Logic
- If `algorithm == playfair`:
  - call `playfair.encrypt()` or `playfair.decrypt()`
- If `algorithm == two_columnar`:
  - call `two_columnar.encrypt()` or `two_columnar.decrypt()`
- If `algorithm == sha256`:
  - allow only `encrypt` mode (hash mode)
  - call `sha256_algo.hash_text()`

---

## 8) Algorithm Module Responsibilities

## 8.1 `playfair.py`
- Build 5x5 key matrix (I/J normalization).
- Preprocess plaintext digraphs (handle repeated letters, padding e.g., X).
- Implement:
  - `encrypt(plaintext: str, key: str) -> str`
  - `decrypt(ciphertext: str, key: str) -> str`

## 8.2 `two_columnar.py`
- Implement classical two-columnar transposition logic.
- Define consistent key interpretation for both encrypt/decrypt.
- Implement:
  - `encrypt(plaintext: str, key: str) -> str`
  - `decrypt(ciphertext: str, key: str) -> str`

## 8.3 `sha256_algo.py`
- Use Python `hashlib`.
- Implement:
  - `hash_text(text: str) -> str`

---

## 9) Frontend MVP Design (React + TS)

## 9.1 UI Elements
- Mode selector: Encrypt / Decrypt
- Algorithm selector (dropdown)
- Text area for PT/CT
- Key input (shown for Playfair and Two Columnar; optional/hidden for SHA-256)
- Submit button (`Run`)
- Output panel (terminal-style)

## 9.2 Validation Rules
- Require non-empty input text.
- Require key for Playfair and Two Columnar.
- Block SHA-256 decryption mode in UI (or allow submit and show backend error).

## 9.3 Terminal-Style UX
- Dark background
- Monospace font
- Green/amber text accents
- Prompt-like labels:
  - `> mode: encrypt`
  - `> algorithm: playfair`
  - `> output: ...`

---

## 10) Suggested API Contract Types (Frontend)

```ts
export type Mode = 'encrypt' | 'decrypt';
export type Algorithm = 'playfair' | 'two_columnar' | 'sha256';

export interface ProcessRequest {
  mode: Mode;
  algorithm: Algorithm;
  text: string;
  key?: string;
}

export interface ProcessResponse {
  success: boolean;
  algorithm?: Algorithm;
  mode?: Mode;
  input?: string;
  output?: string;
  message?: string;
  error?: string;
}
```

---

## 11) Implementation Phases

### Phase 1 – Backend Foundation
1. Create backend folder and virtual setup.
2. Build `main.py` with `/health` and `/process`.
3. Add request/response validation via Pydantic.

### Phase 2 – Algorithms
4. Implement Playfair cipher module.
5. Implement Two Columnar cipher module.
6. Implement SHA-256 module with `hashlib`.
7. Wire modules into `/process` dispatcher.

### Phase 3 – Frontend
8. Generate React TypeScript app.
9. Build form controls + dropdown + text areas.
10. Connect frontend to backend via Axios.
11. Build terminal-style output panel.

### Phase 4 – QA + Demo Readiness
12. Manual tests for all algorithms and both modes.
13. Verify invalid flows (missing key, invalid mode for SHA-256).
14. Prepare short demo script.

---

## 12) Test Cases (Minimum)

1. **Playfair Encrypt**: valid key + plaintext returns ciphertext.
2. **Playfair Decrypt**: same key + ciphertext restores normalized plaintext.
3. **Two Columnar Encrypt/Decrypt**: round trip check.
4. **SHA-256 Hash**: known input gives deterministic 64-hex output.
5. **Validation**: empty text rejected.
6. **Validation**: missing key rejected for Playfair/Two Columnar.
7. **Validation**: SHA-256 with decryption returns error.

---

## 13) Demo Script (for presentation)

1. Open frontend terminal-style UI.
2. Show Playfair encryption and decryption.
3. Show Two Columnar encryption and decryption.
4. Show SHA-256 hashing and explain one-way property.
5. Trigger one invalid input to demonstrate error handling.

---

## 14) MVP Acceptance Criteria
- All 3 algorithms integrated and selectable from dropdown.
- Encrypt/decrypt works where mathematically applicable.
- SHA-256 hashing works and decryption is blocked gracefully.
- Backend and frontend run locally without extra tooling.
- UI clearly displays inputs, selected config, and output in terminal style.
- Codebase follows required separation (algorithm files independent).

---

## 15) Stretch Goals (Optional, only if time remains)
- Add copy-to-clipboard for output.
- Add small history log in terminal pane.
- Add unit tests for algorithm functions.
- Deploy backend/frontend locally with one command script.

---

## 16) Notes / Assumptions
- For SHA-256, "encrypt" in UI is interpreted as "hash" for user simplicity.
- Playfair output may include normalization effects (I/J merge, padding letters).
- Two Columnar implementation should define and document the exact key interpretation to avoid ambiguity in grading.

---

## 17) Quick Start Checklist
- [ ] Conda env `crypto` created and activated
- [ ] Backend runs on port 8000
- [ ] Frontend runs on port 3000
- [ ] `/process` endpoint tested via frontend
- [ ] All three algorithms demonstrated end-to-end
- [ ] MVP ready for assignment demo
