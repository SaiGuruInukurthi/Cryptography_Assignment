"""
Double (Two) Columnar Transposition Cipher – encrypt / decrypt
All input is expected as lowercase a-z only.
The key is a keyword; column order is derived from alphabetical ranking of its characters.
Two passes of columnar transposition are applied for stronger diffusion.
"""

import math


def _column_order(key: str) -> list[int]:
    """Return column indices sorted by the key's alphabetical order."""
    return [i for i, _ in sorted(enumerate(key), key=lambda x: x[1])]


def _single_columnar_encrypt(text: str, key: str) -> str:
    ncols = len(key)
    nrows = math.ceil(len(text) / ncols)
    # pad with 'x' to fill the grid
    padded = text.ljust(nrows * ncols, "x")
    grid = [list(padded[i * ncols : i * ncols + ncols]) for i in range(nrows)]
    order = _column_order(key)
    result: list[str] = []
    for col in order:
        for row in range(nrows):
            result.append(grid[row][col])
    return "".join(result)


def _single_columnar_decrypt(text: str, key: str) -> str:
    ncols = len(key)
    nrows = math.ceil(len(text) / ncols)
    order = _column_order(key)
    # fill columns in key-order
    grid = [[""] * ncols for _ in range(nrows)]
    idx = 0
    for col in order:
        for row in range(nrows):
            grid[row][col] = text[idx]
            idx += 1
    return "".join(grid[row][col] for row in range(nrows) for col in range(ncols))


def encrypt(plaintext: str, key: str) -> str:
    """Two-pass columnar transposition encryption."""
    first_pass = _single_columnar_encrypt(plaintext, key)
    return _single_columnar_encrypt(first_pass, key)


def decrypt(ciphertext: str, key: str) -> str:
    """Two-pass columnar transposition decryption (reverse order)."""
    first_pass = _single_columnar_decrypt(ciphertext, key)
    return _single_columnar_decrypt(first_pass, key)
