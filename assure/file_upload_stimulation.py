# ==========================================
# STEP 2: File Upload Simulation
# ==========================================
def step_2_upload_files():
    uploaded_files = {
        "receipt": "receipt_sample.png",
        "warranty_card": "warranty.pdf",
        "fault_photo": "screen_damage.jpg",
        "fault_description": "Screen has vertical lines"
    }
    print(f"[STEP 2] Files uploaded for claim. Fault: '{uploaded_files['fault_description']}'")
    return uploaded_files