"""
SHA-512 Hashing
Input: lowercase a-z string.
Output: 128-character lowercase hex digest.
"""

import hashlib


def hash_text(text: str) -> str:
    """Return the SHA-512 hex digest of the given text."""
    return hashlib.sha512(text.encode("utf-8")).hexdigest()
