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
# STEP 8: Business Rule Engine
# ==========================================
def step_8_rule_engine(user_session, extracted_data, fault_desc):
    rules_passed = True
    rejection_reasons = []
    
    # Rule 1: Warranty Expiry
    remaining_days = 120
    if remaining_days < 0:
        rules_passed = False
        rejection_reasons.append("Warranty Expired")
        
    # Rule 2: Excluded Fault
    excluded_keywords = ["water damage", "hammer", "liquid spill"]
    if any(kw in fault_desc.lower() for kw in excluded_keywords):
        rules_passed = False
        rejection_reasons.append("Excluded Fault Type")
        
    # Rule 3: Date Logic
    purchase_dt = datetime.strptime(extracted_data["invoice_date"], "%Y-%m-%d")
    if purchase_dt > datetime.now():
        rules_passed = False
        rejection_reasons.append("Invalid Future Purchase Date")
        
    print(f"[STEP 8] Rule Engine Check: Passed={rules_passed}, Flags={rejection_reasons}")
    return rules_passed, rejection_reasons
