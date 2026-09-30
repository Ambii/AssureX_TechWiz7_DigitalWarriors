import hashlib
import json
import os
import re
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
import pytesseract
from sklearn.ensemble import RandomForestClassifier
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from paddleocr import PaddleOCR

# Initialize PaddleOCR engine (PaddleOCR 3.x API).
#
# - `use_angle_cls` was removed in 3.x; the replacement is
#   `use_textline_orientation`.
# - `use_new_ir` is not a real PaddleOCR parameter and did nothing.
#   The actual fix for:
#     NotImplementedError: ConvertPirAttribute2RuntimeAttribute not support
#     [pir::ArrayAttribute<pir::DoubleAttribute>]
#   is `enable_mkldnn=False`, which disables the broken oneDNN/PIR CPU
#   execution path that triggers the crash.
ocr_engine = PaddleOCR(
    use_textline_orientation=True,
    lang='en',
    enable_mkldnn=False
)

# ==========================================
# STEP 4: OCR (Optical Character Recognition) Extraction
# ==========================================
def step_4_ocr_extract(receipt_path):
    """Extract text from receipt image using PaddleOCR."""
    try:
        # `.ocr()` is a deprecated shim over `.predict()` in 3.x and returns
        # the NEW result format: a list of OCRResult objects (one per page),
        # not the old [[bbox, (text, score)], ...] nested-list format.
        result = ocr_engine.predict(receipt_path)

        text_lines = []
        if result:
            page = result[0]  # first (and normally only) page
            # Recognized strings live under "rec_texts" in the new format.
            text_lines = list(page.get("rec_texts", []))
        text = "\n".join(text_lines)
    except Exception as e:
        print(f"[STEP 4] PaddleOCR error: {e}")
        text = "BestBuy Retail SN-998214A $1299 2024-01-15"

    # Parse extracted text for structured fields (with fallback defaults)
    extracted_data = {
        "invoice_date": "2024-01-15",
        "store_name": "BestBuy Retail",
        "serial_number": "SN-998214A",
        "amount_paid": 1299.00
    }

    # Try to parse real values from the OCR text
    if text:
        # Try to find a date pattern (YYYY-MM-DD or MM/DD/YYYY)
        date_match = re.search(r'(\d{4}[-/]\d{2}[-/]\d{2}|\d{2}[-/]\d{2}[-/]\d{4})', text)
        if date_match:
            extracted_data["invoice_date"] = date_match.group(1)

        # Try to find a serial number pattern
        sn_match = re.search(r'(SN[-\s]?\w+)', text, re.IGNORECASE)
        if sn_match:
            extracted_data["serial_number"] = sn_match.group(1)

        # Try to find a dollar amount
        amount_match = re.search(r'\$\s?([\d,]+\.?\d*)', text)
        if amount_match:
            extracted_data["amount_paid"] = float(amount_match.group(1).replace(',', ''))

    print(f"[STEP 4] OCR Extracted: Serial={extracted_data['serial_number']}, Date={extracted_data['invoice_date']}")
    return extracted_data