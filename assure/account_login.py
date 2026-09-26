# ==========================================
# STEP 1: Account Login & Product Selection
# ==========================================
def step_1_login_and_select():
    user_session = {
        "user_id": "TECH_9942",
        "role": "Service Center Tech",
        "selected_device": "Lenovo ThinkBook Laptop",
        "purchase_date": "2024-01-15",
        "months_owned": 8
    }
    print(f"[STEP 1] Logged in as: {user_session['role']} ({user_session['user_id']})")
    print(f"[STEP 1] Selected Device: {user_session['selected_device']}")
    return user_session