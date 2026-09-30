# Backend API Reference (`app.py`)

FastAPI app, title "AssureX Claim Engine API", CORS open to all origins.
Run with `uvicorn app:app --reload --port 8000`.

## `GET /`
Health/welcome message. Returns `{"message": "Welcome to the AssureX Claim Engine API"}`.

## `GET /api/health`
Returns `{"status": "healthy", "database": "neon", "timestamp": <ISO datetime>}`.
Does not actually ping the database — the status is hardcoded to `"healthy"`.

## `POST /api/auth/register`
**Body** (`UserRegister`): `username`, `email`, `password`, `role`.

Hashes the password with `hashlib.sha256` (unsalted — see `docs/SECURITY.md`)
and inserts into the `users` table. Returns `{"message": "User created successfully"}`
or a 400 with the raw exception string on failure (including raw DB errors —
worth sanitizing before production).

## `POST /api/auth/login`
**Body** (`UserLogin`): `username`, `password`.

Looks up `users` by `full_name` or `email` matching `username`, plus the
SHA-256 password hash. If no DB match is found, it falls back to **hardcoded
credentials**:

| Username | Password | Role granted |
|---|---|---|
| `admin` | `admin123` | Admin |
| `reviewer` | `review123` | Reviewer |
| `customer` | `customer123` | Customer |

This fallback is a real backdoor into every role and must be removed before
any real deployment — see `docs/SECURITY.md`.

Returns `{"role": ..., "username": ...}` on success, `401` on failure.

## `POST /api/ocr/scan`
**Body:** multipart file upload, field name `receipt_image`.

Saves the file to `ocr_receipts/<timestamp>_<filename>`, then runs
`ocr_engine.ocr(file_path, cls=True)` (PaddleOCR) and joins recognized lines
into one string. Returns:
```json
{"message": "OCR scan successful", "extracted_text": "...", "file_path": "..."}
```
If PaddleOCR failed to initialize at startup, returns the string
`"PaddleOCR engine not available. Is it installed?"` as `extracted_text`
instead of an error status — callers should check the text content, not
just the HTTP status, to detect this case.

Note: this endpoint's result parsing (`result[0]`, `line[1][0]`) matches the
**old PaddleOCR 2.x result format**. If the installed PaddleOCR is 3.x, see
the note on the OCR result-format change in `docs/troubleshooting.md` —
this endpoint may silently return empty/wrong text on newer installs.

## `POST /api/claims/submit`
**Body:** multipart form — `product_id`, `fault_description`, `purchase_date`
(all `Form` fields) + `evidence_file` (file upload).

Pipeline:
1. Reads the uploaded file into memory. **Does not actually upload to
   Supabase Storage** — `file_url` is a hardcoded mock string
   (`local_mock_url/<filename>`), despite the code comment referencing
   Supabase. The file bytes are only used in-memory for the image model.
2. Builds a minimal feature DataFrame (`product_id`, `fault_length`) via
   `preprocess_claim_data()` — this is a placeholder; the comment in the
   code notes real feature engineering (product age, encoding, scaling)
   still needs to be added to match how `xgboost_model.joblib` was trained.
3. Runs the XGBoost model's `.predict()` / `.predict_proba()`. On any
   exception (including a feature mismatch, which is likely given point 2),
   falls back to a hardcoded `PredictionResult(predicted_class="Valid",
   confidence_valid=0.88, ...)`.
4. Runs the Keras/GTM model on the evidence image (resized to 224×224,
   normalized to [-1, 1], standard Teachable Machine preprocessing). Falls
   back to a hardcoded result if `keras_model` didn't load or image
   processing fails.
5. Compares both predictions: if the classes disagree or the confidence
   values differ by more than `0.20`, the decision is `"Manual Review
   Required"`; otherwise `"Likely Valid"` or `"Likely Invalid"` based on
   Path A's class.
6. Inserts a row into `dataset_claims` (see `docs/database/schema.md`).
   Insert errors are caught and only printed to console — the endpoint
   still returns success to the client even if the DB write failed.

**Response** (`ClaimResponse`):
```json
{
  "claim_id": "CLM-<unix-timestamp>",
  "status": "Approved | Rejected | Manual Review",
  "python_prediction": {"predicted_class": "...", "confidence_valid": 0.0, "confidence_invalid": 0.0, "confidence_manual": 0.0},
  "gtm_prediction": {...same shape...},
  "final_decision": "Likely Valid | Likely Invalid | Manual Review Required",
  "message": "..."
}
```

## `GET /api/admin/stats`
Returns a **hardcoded** stats object (`total_claims: 12458`, etc.) — the
real Postgres `COUNT(*)` query is written in a comment but commented out,
not executed. Treat this endpoint as a UI placeholder, not live data, until
that's implemented.
