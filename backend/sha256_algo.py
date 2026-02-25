"""
SHA-256 Hashing
Input: lowercase a-z string.
Output: 64-character lowercase hex digest.
"""

import hashlib


def hash_text(text: str) -> str:
    """Return the SHA-256 hex digest of the given text."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()
