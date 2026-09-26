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
# STEP 9: Final Master Decision
# ==========================================
def step_9_master_decision(arbiter_badge, ai_prediction, rules_passed, fraud_flag):
    if fraud_flag or not rules_passed:
        decision = "Likely Invalid"
    elif arbiter_badge in ["Strong Match", "Acceptable Match"] and ai_prediction == "Valid" and rules_passed:
        decision = "Likely Valid"
    else:
        decision = "Manual Review Required"
        
    print(f"[STEP 9] Master System Decision: === {decision} ===")
    return decision