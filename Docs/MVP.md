# MVP Plan – Cryptography Assignment

## 1) Objective
Build a **Minimum Viable Product (MVP)** that demonstrates the working mechanism of three cryptographic algorithms with a web interface:

1. **Playfair Cipher** (Encrypt + Decrypt)
2. **Two-Columnar Cipher** (Encrypt + Decrypt)
3. **SHA-512** (Hash only; no decryption)

Tech stack:
- **Backend:** FastAPI (Python)
- **Frontend:** React + TypeScript + basic CSS (terminal-style UI, **red & green** theme)
- **Python environment:** Conda env `crypto`

---

## 2) Functional Requirements

### Input/Output Behavior
- User chooses operation mode: **Encryption** or **Decryption**.
- User chooses algorithm from dropdown:
  - Playfair Cipher
  - Two Columnar Cipher
  - SHA-512
- User provides text input:
  - PT (Plaintext) for encryption
  - CT (Ciphertext) for decryption
- **Input is restricted to lowercase alphabets only (a–z). No digits, spaces, uppercase, or special characters allowed.**
- App displays output in terminal-style panel.

### Algorithm Constraints
- **Playfair**:
  - Supports encrypt + decrypt.
  - Requires keyword/key from user (also lowercase alphabets only).
- **Two Columnar**:
  - Supports encrypt + decrypt.
  - Requires key (column order or keyword, lowercase alphabets only).
- **SHA-512**:
  - Supports only hashing (one-way).
  - If user chooses decryption with SHA-512, show a clear validation error message.

---

## 3) Non-Functional Requirements (MVP Level)
- Clean, understandable code organization.
- Each algorithm in a **separate Python file**.
- Fast response for short text inputs.
- Basic input validation and clear error messages.
- Simple but presentable UI with terminal aesthetics (**red & green** color scheme).

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
 └── sha512_algo.py
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
│   ├── sha512_algo.py
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
  "algorithm": "playfair | two_columnar | sha512",
  "text": "string (lowercase a-z only)",
  "key": "optional-string (lowercase a-z only)"
}
```

## 7.2 Backend Input Validation
- `text` must match regex `^[a-z]+$` — reject anything else with a 422 error.
- `key` (when provided) must also match `^[a-z]+$`.
- Use a Pydantic `field_validator` or `@validator` to enforce this on the request model.
- Return a clear error message: `"Input must contain only lowercase alphabets (a-z)"`.

## 7.3 Response Model (Success)
```json
{
  "success": true,
  "algorithm": "playfair",
  "mode": "encrypt",
  "input": "hello",
  "output": "...",
  "message": "Processed successfully"
}
```

## 7.4 Response Model (Validation/Error)
```json
{
  "success": false,
  "error": "SHA-512 does not support decryption"
}
```

## 7.5 API Endpoints
- `POST /process` → core processing endpoint.
- `GET /health` → returns service status.

## 7.6 Routing Logic
- If `algorithm == playfair`:
  - call `playfair.encrypt()` or `playfair.decrypt()`
- If `algorithm == two_columnar`:
  - call `two_columnar.encrypt()` or `two_columnar.decrypt()`
- If `algorithm == sha512`:
  - allow only `encrypt` mode (hash mode)
  - call `sha512_algo.hash_text()`

---

## 8) Algorithm Module Responsibilities

## 8.1 `playfair.py`
- Build 5x5 key matrix (i/j normalization — lowercase).
- Preprocess plaintext digraphs (handle repeated letters, padding e.g., x).
- All internal processing uses **lowercase** characters.
- Implement:
  - `encrypt(plaintext: str, key: str) -> str`
  - `decrypt(ciphertext: str, key: str) -> str`

## 8.2 `two_columnar.py`
- Implement classical two-columnar transposition logic.
- Define consistent key interpretation for both encrypt/decrypt.
- All internal processing uses **lowercase** characters.
- Implement:
  - `encrypt(plaintext: str, key: str) -> str`
  - `decrypt(ciphertext: str, key: str) -> str`

## 8.3 `sha512_algo.py`
- Use Python `hashlib`.
- Implement:
  - `hash_text(text: str) -> str`
- Note: SHA-512 output is a hex digest (will contain 0-9 and a-f).

---

## 9) Frontend MVP Design (React + TS)

## 9.1 UI Elements
- Mode selector: Encrypt / Decrypt
- Algorithm selector (dropdown)
- Text area for PT/CT
- Key input (shown for Playfair and Two Columnar; hidden for SHA-512)
- Submit button (`Run`)
- Output panel (terminal-style)

## 9.2 Input Restriction (Lowercase Alphabets Only)
- **Frontend enforcement (real-time):**
  - Text input and key input fields accept only `a-z`.
  - Use `onKeyDown` / `onChange` handler to strip or reject any character not matching `/^[a-z]*$/`.
  - Optionally show an inline hint: `"only lowercase letters allowed"`.
- **Backend enforcement (safety net):**
  - Pydantic validator rejects non-conforming input with a clear error (see §7.2).

## 9.3 Validation Rules
- Require non-empty input text.
- Require key for Playfair and Two Columnar.
- Block SHA-512 decryption mode in UI (or allow submit and show backend error).

## 9.4 Terminal-Style UX — Red & Green Theme

### Color Palette
| Role              | Color              | Hex       |
|-------------------|--------------------|-----------|
| Background        | Near-black         | `#0a0a0a` |
| Primary text      | Terminal green     | `#00ff41` |
| Accent / errors   | Terminal red       | `#ff0033` |
| Secondary text    | Dimmed green       | `#00cc33` |
| Input borders     | Dark green         | `#00802b` |
| Button bg         | Dark red           | `#990022` |
| Button hover      | Bright red         | `#ff0033` |
| Cursor / caret    | Green blink        | `#00ff41` |

### Typography
- Font family: `'Fira Code', 'Courier New', monospace`
- Font size: 14–16px body, 12px labels

### Layout
- Dark full-page background (`#0a0a0a`).
- Left panel / top section: controls (mode, algo, key, input) — bordered in dark green.
- Right panel / bottom section: output — terminal-style box with green text.
- Error messages displayed in **red** (`#ff0033`).
- Success output displayed in **green** (`#00ff41`).
- Prompt-like labels:
  - `> mode: encrypt`
  - `> algorithm: playfair`
  - `> key: monarchy`
  - `> output: kfcpua...`
- Optional blinking cursor `█` at end of output line.

### CSS Strategy
- Use CSS custom properties (variables) for the palette above.
- Keep it in `App.css` — no CSS framework needed.
- Dropdown and inputs styled to match terminal look (dark bg, green border, green text).

---

## 10) Suggested API Contract Types (Frontend)

```ts
export type Mode = 'encrypt' | 'decrypt';
export type Algorithm = 'playfair' | 'two_columnar' | 'sha512';

export interface ProcessRequest {
  mode: Mode;
  algorithm: Algorithm;
  text: string;       // lowercase a-z only
  key?: string;       // lowercase a-z only
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
3. Add request/response validation via Pydantic, including `^[a-z]+$` regex check on `text` and `key`.

### Phase 2 – Algorithms
4. Implement Playfair cipher module (lowercase throughout).
5. Implement Two Columnar cipher module (lowercase throughout).
6. Implement SHA-512 module with `hashlib`.
7. Wire modules into `/process` dispatcher.

### Phase 3 – Frontend
8. Generate React TypeScript app.
9. Build form controls + dropdown + text areas with **lowercase-only input restriction**.
10. Apply **red & green terminal theme** via CSS variables.
11. Connect frontend to backend via Axios.
12. Build terminal-style output panel (green success text, red error text).

### Phase 4 – QA + Demo Readiness
13. Manual tests for all algorithms and both modes.
14. Verify invalid flows (missing key, invalid mode for SHA-512, non-alphabetic input rejected).
15. Prepare short demo script.

---

## 12) Test Cases (Minimum)

1. **Playfair Encrypt**: valid key + plaintext returns ciphertext.
2. **Playfair Decrypt**: same key + ciphertext restores normalized plaintext.
3. **Two Columnar Encrypt/Decrypt**: round trip check.
4. **SHA-512 Hash**: known input gives deterministic 128-hex output.
5. **Validation**: empty text rejected.
6. **Validation**: missing key rejected for Playfair/Two Columnar.
7. **Validation**: SHA-512 with decryption returns error.
8. **Input restriction**: uppercase letters rejected on frontend (filtered) and backend (422).
9. **Input restriction**: digits / special chars rejected on frontend and backend.

---

## 13) Demo Script (for presentation)

1. Open frontend terminal-style UI (show red & green theme).
2. Type invalid characters — show that input field only accepts lowercase letters.
3. Show Playfair encryption and decryption.
4. Show Two Columnar encryption and decryption.
5. Show SHA-512 hashing and explain one-way property.
6. Trigger one invalid input to demonstrate error handling (e.g., SHA-512 decrypt).

---

## 14) MVP Acceptance Criteria
- All 3 algorithms integrated and selectable from dropdown.
- Encrypt/decrypt works where mathematically applicable.
- SHA-512 hashing works and decryption is blocked gracefully.
- **All text inputs (text + key) restricted to lowercase alphabets (a–z) on both frontend and backend.**
- **UI uses a red & green terminal color scheme on a dark background.**
- Backend and frontend run locally without extra tooling.
- UI clearly displays inputs, selected config, and output in terminal style.
- Codebase follows required separation (algorithm files independent).

---

## 15) Stretch Goals (Optional, only if time remains)
- Add copy-to-clipboard for output.
- Add small history log in terminal pane.
- Add unit tests for algorithm functions.
- Deploy backend/frontend locally with one command script.
- Add a CRT scanline overlay effect for extra terminal authenticity.

---

## 16) Notes / Assumptions
- For SHA-512, "encrypt" in UI is interpreted as "hash" for user simplicity.
- Playfair output may include normalization effects (i/j merge, padding letters) — all lowercase.
- Two Columnar implementation should define and document the exact key interpretation to avoid ambiguity in grading.
- SHA-512 output is hex (0-9, a-f) — this is the only output that isn't purely a-z.
- Input restriction simplifies algorithm logic (no need to handle mixed-case, numbers, or punctuation).

---

## 17) Quick Start Checklist
- [ ] Conda env `crypto` created and activated
- [ ] Backend runs on port 8000
- [ ] Frontend runs on port 3000
- [ ] Red & green terminal theme visible
- [ ] Input fields reject non-lowercase characters
- [ ] `/process` endpoint tested via frontend
- [ ] All three algorithms demonstrated end-to-end
- [ ] MVP ready for assignment demo