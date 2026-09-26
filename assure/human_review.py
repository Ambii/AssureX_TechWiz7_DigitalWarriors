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
# STEP 10: Human Review & PDF Audit Certificate
# ==========================================
def step_10_generate_pdf_audit(claim_id, user_data, decision, arbiter_badge):
    pdf_filename = f"Audit_Certificate_{claim_id}.pdf"
    c = canvas.Canvas(pdf_filename, pagesize=letter)
    
    c.setFont("Helvetica-Bold", 16)
    c.drawString(100, 750, "OFFICIAL CLAIM AUDIT CERTIFICATE")
    c.setLineWidth(1)
    c.line(100, 740, 500, 740)
    
    c.setFont("Helvetica", 11)
    c.drawString(100, 710, f"Claim ID: {claim_id}")
    c.drawString(100, 690, f"Device: {user_data['selected_device']}")
    c.drawString(100, 670, f"AI Arbiter Status: {arbiter_badge}")
    c.drawString(100, 650, f"Final Decision: {decision}")
    c.drawString(100, 630, f"Audit Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    c.save()
    print(f"[STEP 10] Audit PDF Certificate Generated: '{pdf_filename}'")















