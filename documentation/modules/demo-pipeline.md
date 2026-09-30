# Console Demo Pipeline (`assure/` folder)

A standalone, sequential script that simulates the full claim workflow with
no server, no database, and mostly hardcoded/simulated data. Run it with:

```bash
cd assure
python app.py
```

It imports and calls each step in order:

| Step | File | Function | What it actually does |
|---|---|---|---|
| 1 | `account_login.py` | `step_1_login_and_select` | Returns a hardcoded session dict (`TECH_9942`, Lenovo ThinkBook, etc.) — no real login. |
| 2 | `file_upload_stimulation.py` | `step_2_upload_files` | Returns hardcoded filenames — no real file handling. |
| 3 | `document_fingerprinting.py` | `step_3_check_fingerprint` | **Real logic.** Creates a dummy receipt file if missing, computes its SHA-256, and checks it against an in-memory list (`known_hashes_db`, reset every run — not persisted). |
| 4 | `ocr.py` | `step_4_ocr_extract` | Runs real Tesseract OCR (`pytesseract.image_to_string`) on the receipt image, but **the extracted text is never parsed or used** — `extracted_data` is always the same hardcoded dict regardless of what OCR returns. If you're expecting this to actually populate fields from a real receipt, it currently doesn't; that logic needs to be added. |
| 5 | `verification_screen.py` | `step_5_human_verification` | Just copies the dict and adds `verified_by_user: True` — no real UI or human input. |
| 6 | `dual_path_execution.py` | `step_6_run_dual_ai_paths` | **Real logic, but trivial.** Trains a brand-new `RandomForestClassifier` from scratch on 3 hardcoded training rows *every single run*, then predicts on the current session. Path B ("Visual Inspector AI") generates a real PNG summary card via PIL but returns a **hardcoded** probability dict (`{"Valid": 0.84, ...}`) — it does not run any actual image model. This is a simulation of what the GTM path would look like, not a call to `keras_model.h5` (that only happens in the root `app.py` backend, a separate codebase). |
| 7 | `comparing_ai_brains.py` | `step_7_arbiter` | **Real logic.** Compares top class + probability gap between Path A/B, returns `"Strong Match"` (gap < 0.15), `"Acceptable Match"` (gap < 0.30), or `"Model Disagreement"`. |
| 8 | `business_rule_engine.py` | `step_8_rule_engine` | Checks 3 rules, but `remaining_days` is **hardcoded to `120`** — warranty expiry is never actually computed from real dates. The excluded-fault-keyword check (`water damage`, `hammer`, `liquid spill`) and the future-purchase-date check are real. |
| 9 | `final_master_decision.py` | `step_9_master_decision` | **Real logic.** Combines fraud flag, rules result, and arbiter badge into a final decision string. |
| 10 | `human_review.py` | `step_10_generate_pdf_audit` | **Real logic.** Generates an actual PDF certificate via `reportlab` (`Audit_Certificate_<claim_id>.pdf`). |

## Purpose of this pipeline

This is best understood as an **executable spec / proof of concept** for the
decision logic (arbiter thresholds, rule engine, fraud check via hashing) —
useful for demonstrating and testing that logic in isolation, and it's what
the original project README documents step-by-step. It is not wired to the
FastAPI backend or the React frontend at all; changes here won't affect the
deployed app, and vice versa. If the intent is for this to become the real
backend logic, each step's hardcoded/simulated pieces (steps 1, 2, 4's
parsing, 6's Path B, 8's `remaining_days`) will need to be replaced with the
real equivalents already partially built in the root `app.py`.
