import hashlib
import json
import os
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
import pytesseract
from sklearn.ensemble import RandomForestClassifier
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

# ==========================================
# STEP 3: Instant Document Fingerprinting (SHA-256)
# ==========================================
def step_3_check_fingerprint(receipt_path, known_hashes_db):
    # Dummy file create kar rahe hain testing ke liye
    if not os.path.exists(receipt_path):
        with open(receipt_path, "wb") as f:
            f.write(b"SAMPLE RECEIPT DATA: BestBuy Retail - SN-998214A - $1299 - 2024-01-15")

    with open(receipt_path, "rb") as f:
        bytes_data = f.read()
        file_hash = hashlib.sha256(bytes_data).hexdigest()

    print(f"[STEP 3] Document SHA-256 Hash: {file_hash[:16]}...")
    
    if file_hash in known_hashes_db:
        print("[STEP 3] FRAUD ALERT: Duplicate receipt hash detected!")
        return file_hash, True
    
    known_hashes_db.append(file_hash)
    return file_hash, False
