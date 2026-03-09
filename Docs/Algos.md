# Algorithm Documentation

This document describes the three cryptographic algorithms implemented in the backend, explaining how each one works step-by-step based on the actual Python code.

---

## 1. Playfair Cipher (`playfair.py`)

**Type:** Symmetric substitution cipher (digraph-based)  
**Operations:** Encrypt & Decrypt  
**Inputs:** Plaintext/ciphertext (lowercase a-z), Key (lowercase a-z)

### How It Works

#### Step 1 — Text Normalisation (`_normalize_text`)

All input (both the message and the key) goes through normalisation:

1. Convert to lowercase.
2. Strip every non-alphabetic character.
3. Replace every `j` with `i` (since the 5×5 matrix only has 25 slots for 26 letters, `i` and `j` share a cell).

#### Step 2 — Key Matrix Generation (`_generate_key_matrix`)

A **5×5 matrix** is built from the key:

1. Take the normalised key and iterate through its characters.
2. Append each character to an ordered list **only if it hasn't been seen before** (removes duplicates while preserving order).
3. After the key characters are placed, fill the remaining slots with the rest of the alphabet (`a-z` excluding `j`) in order, again skipping any already-seen character.
4. Reshape the resulting 25-character list into a 5×5 grid (rows of 5).

**Example** — Key: `monarchy`

|   | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| 0 | m | o | n | a | r |
| 1 | c | h | y | b | d |
| 2 | e | f | g | i | k |
| 3 | l | p | q | s | t |
| 4 | u | v | w | x | z |

#### Step 3 — Prepare Digraphs (`_prepare_text`, encryption only)

The plaintext is split into **pairs of two letters (digraphs)**:

1. Walk through the normalised text character by character.
2. Take two letters at a time as a pair.
3. If both letters in a pair are **identical**, insert an `x` between them — the first letter pairs with `x`, and the second letter starts the next pair.
4. If the text has an **odd length** at the end, pad the last letter with `x`.

**Example:** `"balloon"` → normalised `"balloon"` → digraphs: `(b,a)`, `(l,x)`, `(l,o)`, `(o,n)`

#### Step 4 — Encryption Rules

For each digraph `(a, b)`, find their positions `(r1, c1)` and `(r2, c2)` in the key matrix, then apply:

| Condition | Rule | Encrypted Pair |
|---|---|---|
| **Same row** (`r1 == r2`) | Shift each letter **one column right** (wrap around) | `matrix[r1][(c1+1)%5]`, `matrix[r2][(c2+1)%5]` |
| **Same column** (`c1 == c2`) | Shift each letter **one row down** (wrap around) | `matrix[(r1+1)%5][c1]`, `matrix[(r2+1)%5][c2]` |
| **Rectangle** (different row & column) | Swap columns — each letter takes the column of the other | `matrix[r1][c2]`, `matrix[r2][c1]` |

The encrypted digraphs are concatenated to produce the ciphertext.

#### Step 5 — Decryption Rules

Decryption is the **exact reverse**:

- For decryption, the ciphertext is split into sequential pairs of 2 (no duplicate-letter logic needed; if odd length, an `x` is appended).
- **Same row:** shift **one column left** (`(c - 1) % 5`).
- **Same column:** shift **one row up** (`(r - 1) % 5`).
- **Rectangle:** same swap (swap columns) — rectangle rule is its own inverse.

> **Note:** Decryption may leave trailing `x` padding characters that were added during encryption. The code does not strip them automatically.

---

## 2. Double Columnar Transposition Cipher (`two_columnar.py`)

**Type:** Symmetric transposition cipher  
**Operations:** Encrypt & Decrypt  
**Inputs:** Plaintext/ciphertext (lowercase a-z), Key (lowercase a-z keyword)

### How It Works

#### Step 1 — Determine Column Order (`_column_order`)

The key defines how columns are reordered:

1. Take each character of the key along with its index: e.g., key `"hack"` → `[(0,'h'), (1,'a'), (2,'c'), (3,'k')]`.
2. Sort these pairs **alphabetically by the character**.
3. The resulting index sequence is the column read-order.

**Example** — Key: `"hack"`

| Original index | Character | Sorted position |
|---|---|---|
| 1 | a | 0 (read first) |
| 2 | c | 1 (read second) |
| 0 | h | 2 (read third) |
| 3 | k | 3 (read fourth) |

Column order: `[1, 2, 0, 3]`

#### Step 2 — Single Columnar Encryption (`_single_columnar_encrypt`)

1. **Grid dimensions:** Number of columns = length of the key. Number of rows = `ceil(len(text) / ncols)`.
2. **Padding:** The text is right-padded with `x` characters until it fills the entire grid (`nrows × ncols`).
3. **Fill the grid row-by-row:** Write the padded text left-to-right, top-to-bottom into the grid.
4. **Read columns in key order:** Using the column order from Step 1, read each column top-to-bottom and concatenate the results.

**Example** — Text: `"attackatdawn"`, Key: `"hack"` (order `[1,2,0,3]`)

Grid (4 columns, 3 rows):

|   | Col 0 | Col 1 | Col 2 | Col 3 |
|---|---|---|---|---|
| Row 0 | a | t | t | a |
| Row 1 | c | k | a | t |
| Row 2 | d | a | w | n |

Read in order `[1, 2, 0, 3]`: columns 1→2→0→3 = `"tka"` + `"taw"` + `"acd"` + `"atn"` = `"tkatawACDatn"`

#### Step 3 — Double Encryption (`encrypt`)

The cipher applies **two passes** of single columnar transposition using the **same key**:

```
first_pass  = single_columnar_encrypt(plaintext, key)
ciphertext  = single_columnar_encrypt(first_pass, key)
```

This double application significantly increases diffusion — letter positions are scrambled twice, making the cipher much harder to break than a single transposition.

#### Step 4 — Single Columnar Decryption (`_single_columnar_decrypt`)

Decryption reverses the process:

1. Calculate the same grid dimensions (`nrows`, `ncols`).
2. Determine the column order from the key.
3. **Fill columns in key order:** The ciphertext was produced by reading columns in key order, so we reverse this — read from the ciphertext sequentially and write into the grid column-by-column in the same key order.
4. **Read the grid row-by-row** (left-to-right, top-to-bottom) to recover the original text.

#### Step 5 — Double Decryption (`decrypt`)

Two passes of single columnar decryption, reversing the two encryption passes:

```
first_pass = single_columnar_decrypt(ciphertext, key)
plaintext  = single_columnar_decrypt(first_pass, key)
```

> **Note:** Decrypted output may contain trailing `x` padding characters that were added to fill the grid.

---

## 3. SHA-512 Hashing (`sha512_algo.py`)

**Type:** Cryptographic hash function (one-way)  
**Operations:** Hash only (no decryption possible)  
**Inputs:** Text string (lowercase a-z)

### How It Works

#### Step 1 — Encode the Input

The input text string is encoded into **UTF-8 bytes** using Python's `str.encode("utf-8")`.

#### Step 2 — Compute the SHA-512 Digest

The implementation uses Python's built-in `hashlib.sha512()`:

1. The UTF-8 byte string is fed into the SHA-512 algorithm.
2. Internally, SHA-512:
   - **Pads** the message to a multiple of 1024 bits (appending a `1` bit, then zeros, then the original message length as a 128-bit integer).
   - **Splits** the padded message into 1024-bit blocks.
   - **Processes** each block through 80 rounds of compression using bitwise operations (shifts, rotations, XOR, AND, OR), addition modulo $2^{64}$, and eight 64-bit working variables initialised from fixed constants.
   - **Produces** a final 512-bit (64-byte) hash value.

#### Step 3 — Output as Hex String

The 512-bit binary digest is converted to a **128-character lowercase hexadecimal string** via `.hexdigest()`.

### Key Properties

| Property | Description |
|---|---|
| **Deterministic** | Same input always produces the same hash |
| **One-way** | Cannot reverse the hash to recover the original text |
| **Avalanche effect** | A tiny change in input drastically changes the output |
| **Fixed output size** | Always 128 hex characters (512 bits) regardless of input length |
| **Collision resistant** | Computationally infeasible to find two different inputs with the same hash |

> **Note:** The backend blocks decryption requests for SHA-512, returning an error message: *"SHA-512 is a one-way hash and does not support decryption."*

---

## API Integration Summary

All three algorithms are exposed through a **single POST `/process` endpoint** in `main.py`. The request body contains:

| Field | Type | Description |
|---|---|---|
| `algorithm` | `"playfair"` \| `"two_columnar"` \| `"sha512"` | Which algorithm to use |
| `mode` | `"encrypt"` \| `"decrypt"` | Operation mode |
| `text` | `string` | Input text (lowercase a-z only, validated by the API) |
| `key` | `string` (optional) | Required for Playfair and Two Columnar; ignored for SHA-512 |

- Input validation enforces **lowercase alphabetic characters only** (`a-z`) for both `text` and `key`.
- SHA-512 does not accept a `decrypt` mode.
- Playfair and Two Columnar require a non-empty `key`.