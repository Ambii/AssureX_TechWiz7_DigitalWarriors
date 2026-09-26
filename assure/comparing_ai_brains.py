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
# STEP 7: The Arbiter (Comparing AI Brains)
# ==========================================
def step_7_arbiter(path_a, path_b):
    top_a_class = max(path_a, key=path_a.get)
    top_b_class = max(path_b, key=path_b.get)
    
    diff = abs(path_a[top_a_class] - path_b[top_b_class])
    
    if top_a_class == top_b_class and diff < 0.15:
        badge = "Strong Match"
    elif top_a_class == top_b_class and diff < 0.30:
        badge = "Acceptable Match"
    else:
        badge = "Model Disagreement"
        
    print(f"[STEP 7] Arbiter Result: Badge='{badge}', Difference={diff:.2f}")
    return badge, top_a_class
