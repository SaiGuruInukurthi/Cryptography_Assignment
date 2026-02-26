"""
FastAPI backend for Cryptography Assignment MVP.
Single /process endpoint dispatches to algorithm modules.
"""

from __future__ import annotations

import re
from enum import Enum
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator

import playfair
import two_columnar
import sha256_algo

app = FastAPI(title="Crypto Assignment API")

# Allow the React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALPHA_RE = re.compile(r"^[a-z]+$")


# ── Models ──────────────────────────────────────────────────────────

class Mode(str, Enum):
    encrypt = "encrypt"
    decrypt = "decrypt"


class Algorithm(str, Enum):
    playfair = "playfair"
    two_columnar = "two_columnar"
    sha256 = "sha256"


class ProcessRequest(BaseModel):
    mode: Mode
    algorithm: Algorithm
    text: str
    key: Optional[str] = None

    @field_validator("text")
    @classmethod
    def text_must_be_lowercase_alpha(cls, v: str) -> str:
        v = v.lower()
        if not ALPHA_RE.match(v):
            raise ValueError("text must contain only lowercase alphabets (a-z)")
        return v

    @field_validator("key")
    @classmethod
    def key_must_be_lowercase_alpha(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v

        v = v.lower()
        if not ALPHA_RE.match(v):
            raise ValueError("key must contain only lowercase alphabets (a-z)")
        return v


class ProcessResponse(BaseModel):
    success: bool
    algorithm: Optional[str] = None
    mode: Optional[str] = None
    input: Optional[str] = None
    output: Optional[str] = None
    message: Optional[str] = None
    error: Optional[str] = None


# ── Endpoints ───────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/process", response_model=ProcessResponse)
def process(req: ProcessRequest):
    try:
        # SHA-256 — no decryption
        if req.algorithm == Algorithm.sha256:
            if req.mode == Mode.decrypt:
                return ProcessResponse(
                    success=False,
                    error="SHA-256 is a one-way hash and does not support decryption",
                )
            output = sha256_algo.hash_text(req.text)
            return ProcessResponse(
                success=True,
                algorithm=req.algorithm.value,
                mode=req.mode.value,
                input=req.text,
                output=output,
                message="Hashed successfully",
            )

        # Playfair / Two-Columnar — key required
        if req.key is None or req.key == "":
            return ProcessResponse(
                success=False,
                error=f"A key is required for {req.algorithm.value}",
            )

        if req.algorithm == Algorithm.playfair:
            fn = playfair.encrypt if req.mode == Mode.encrypt else playfair.decrypt
        else:
            fn = two_columnar.encrypt if req.mode == Mode.encrypt else two_columnar.decrypt

        output = fn(req.text, req.key)
        return ProcessResponse(
            success=True,
            algorithm=req.algorithm.value,
            mode=req.mode.value,
            input=req.text,
            output=output,
            message="Processed successfully",
        )

    except Exception as exc:
        return ProcessResponse(success=False, error=str(exc))
