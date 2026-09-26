import hashlib
import json
import os
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
import pytesseract
from sklearn.ensemble import RandomForestClassifier
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


import os
import sys

# Current folder ka path set karne ke liye
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# ----------------------------------------------------
# Acknowledging steps from source files
# ----------------------------------------------------
from account_login import step_1_login_and_select
from file_upload_stimulation import step_2_upload_files
from document_fingerprinting import step_3_check_fingerprint
from ocr import step_4_ocr_extract
from verification_screen import step_5_human_verification
from dual_path_execution import step_6_run_dual_ai_paths
from comparing_ai_brains import step_7_arbiter
from business_rule_engine import step_8_rule_engine
from final_master_decision import step_9_master_decision
from human_review import step_10_generate_pdf_audit



# ==========================================
# MAIN EXECUTION PIPELINE
# ==========================================
if __name__ == "__main__":
    print("--- STARTING CLAIM PROCESSING PIPELINE ---\n")
    known_hashes = [] # Database simulation
    
    # Run Steps Sequential
    session = step_1_login_and_select()
    files = step_2_upload_files()
    hash_val, is_fraud = step_3_check_fingerprint(files["receipt"], known_hashes)
    ocr_res = step_4_ocr_extract(files["receipt"])
    verified_ocr = step_5_human_verification(ocr_res)
    
    path_a_out, path_b_out = step_6_run_dual_ai_paths(session, verified_ocr, files["fault_description"])
    arb_badge, ai_class = step_7_arbiter(path_a_out, path_b_out)
    rules_ok, flags = step_8_rule_engine(session, verified_ocr, files["fault_description"])
    
    final_decision = step_9_master_decision(arb_badge, ai_class, rules_ok, is_fraud)
    step_10_generate_pdf_audit("CLM-2024-8831", session, final_decision, arb_badge)
    
    print("\n--- PIPELINE EXECUTION COMPLETED ---")