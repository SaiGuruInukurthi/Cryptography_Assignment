import os
import sys

# Ensure backend root is importable when running as a Vercel function
CURRENT_DIR = os.path.dirname(__file__)
BACKEND_ROOT = os.path.dirname(CURRENT_DIR)
if BACKEND_ROOT not in sys.path:
    sys.path.append(BACKEND_ROOT)

from main import app  # noqa: E402
