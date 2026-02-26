"""
Playfair Cipher – encrypt / decrypt
All input is expected as lowercase a-z only.
Uses i/j normalisation (j → i) and 'x' padding.
"""


def _normalize_text(text: str) -> str:
    """Keep letters only, lowercase, and map j -> i."""
    cleaned = "".join(ch for ch in text.lower() if ch.isalpha())
    return cleaned.replace("j", "i")


def _generate_key_matrix(key: str) -> list[list[str]]:
    """Build the 5×5 Playfair key matrix."""
    key = _normalize_text(key)
    seen: set[str] = set()
    ordered: list[str] = []
    for ch in key:
        if ch not in seen:
            seen.add(ch)
            ordered.append(ch)
    for ch in "abcdefghiklmnopqrstuvwxyz":  # no 'j'
        if ch not in seen:
            seen.add(ch)
            ordered.append(ch)
    return [ordered[i * 5 : i * 5 + 5] for i in range(5)]


def _find_position(matrix: list[list[str]], ch: str) -> tuple[int, int]:
    for r in range(5):
        for c in range(5):
            if matrix[r][c] == ch:
                return r, c
    raise ValueError(f"Character '{ch}' not found in matrix")


def _prepare_text(text: str) -> list[tuple[str, str]]:
    """Create digraphs: split doubles with 'x', pad odd length."""
    text = _normalize_text(text)
    digraphs: list[tuple[str, str]] = []
    i = 0
    while i < len(text):
        a = text[i]
        if i + 1 < len(text):
            b = text[i + 1]
            if a == b:
                digraphs.append((a, "x"))
                i += 1
            else:
                digraphs.append((a, b))
                i += 2
        else:
            digraphs.append((a, "x"))
            i += 1
    return digraphs


def encrypt(plaintext: str, key: str) -> str:
    plaintext = _normalize_text(plaintext)
    matrix = _generate_key_matrix(key)
    digraphs = _prepare_text(plaintext)
    result: list[str] = []
    for a, b in digraphs:
        r1, c1 = _find_position(matrix, a)
        r2, c2 = _find_position(matrix, b)
        if r1 == r2:
            result.append(matrix[r1][(c1 + 1) % 5])
            result.append(matrix[r2][(c2 + 1) % 5])
        elif c1 == c2:
            result.append(matrix[(r1 + 1) % 5][c1])
            result.append(matrix[(r2 + 1) % 5][c2])
        else:
            result.append(matrix[r1][c2])
            result.append(matrix[r2][c1])
    return "".join(result)


def decrypt(ciphertext: str, key: str) -> str:
    ciphertext = _normalize_text(ciphertext)
    if len(ciphertext) % 2 != 0:
        raise ValueError("Playfair decryption requires even-length ciphertext")

    matrix = _generate_key_matrix(key)
    digraphs: list[tuple[str, str]] = []
    for i in range(0, len(ciphertext), 2):
        digraphs.append((ciphertext[i], ciphertext[i + 1]))

    result: list[str] = []
    for a, b in digraphs:
        r1, c1 = _find_position(matrix, a)
        r2, c2 = _find_position(matrix, b)
        if r1 == r2:
            result.append(matrix[r1][(c1 - 1) % 5])
            result.append(matrix[r2][(c2 - 1) % 5])
        elif c1 == c2:
            result.append(matrix[(r1 - 1) % 5][c1])
            result.append(matrix[(r2 - 1) % 5][c2])
        else:
            result.append(matrix[r1][c2])
            result.append(matrix[r2][c1])
    return "".join(result)
