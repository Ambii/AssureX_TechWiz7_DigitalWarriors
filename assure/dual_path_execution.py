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
# STEP 6: Dual AI Paths Execution
# ==========================================
def step_6_run_dual_ai_paths(user_session, extracted_data, fault_desc):
    # --- Path A: Tabular Model (Random Forest Simulation) ---
    # Features: [Months Owned, Remaining Days, Serial Match Flag, Amount]
    X_train = [
        [8, 120, 1, 1299],  # Valid
        [26, -50, 1, 1299], # Invalid
        [2, 300, 0, 500]    # Review
    ]
    y_train = [0, 1, 2] # 0: Valid, 1: Invalid, 2: Review
    
    clf = RandomForestClassifier(random_state=42)
    clf.fit(X_train, y_train)
    
    sample_features = [[user_session["months_owned"], 120, 1, extracted_data["amount_paid"]]]
    path_a_probs = clf.predict_proba(sample_features)[0] # e.g. [0.89, 0.03, 0.08]
    
    # Format Probs -> Valid, Invalid, Review
    path_a_res = {"Valid": round(path_a_probs[0], 2), "Invalid": round(path_a_probs[1], 2), "Review": round(path_a_probs[2], 2)}
    
    # --- Path B: Visual Inspector AI (Summary Card Image Generator) ---
    img = Image.new('RGB', (800, 600), color=(240, 240, 240))
    d = ImageDraw.Draw(img)
    d.text((50, 50), f"Serial: {extracted_data['serial_number']}", fill=(0,0,0))
    d.text((50, 100), f"Fault: {fault_desc}", fill=(0,0,0))
    img.save("claim_summary_card.png")
    
    # Model Output Simulation for Card Image Processing
    path_b_res = {"Valid": 0.84, "Invalid": 0.05, "Review": 0.11}
    
    print(f"[STEP 6] Path A (Tabular AI): {path_a_res}")
    print(f"[STEP 6] Path B (Visual Inspector AI): {path_b_res}")
    
    return path_a_res, path_b_res