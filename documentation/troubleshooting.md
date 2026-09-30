# Troubleshooting

## Backend won't start / import errors

| Symptom | Cause | Fix |
|---|---|---|
| `ModuleNotFoundError: No module named 'psycopg2'` | Not in `requirements.txt` despite being required | `pip install psycopg2-binary` |
| Error unpickling `xgboost_model.joblib` | `xgboost` package not installed | `pip install xgboost` |
| `Warning: PaddleOCR not installed or failed to initialize` printed at startup | Expected if `paddleocr` isn't installed — the app still boots (try/except), but `/api/ocr/scan` will return an "engine not available" message instead of OCR text | `pip install paddleocr` + see PaddleOCR section below |
| `Warning: TensorFlow or Pillow not installed. Image model will fallback to mock.` | `tensorflow` or `pillow` missing | Both are in `requirements.txt` — re-run `pip install -r requirements.txt` |

## Database

| Symptom | Cause | Fix |
|---|---|---|
| Login/register endpoints return 500 or raw psycopg2 errors | `NEON_DATABASE_URL` not set, or database unreachable | Set the env var (see `docs/setup/installation.md`); don't rely on the hardcoded fallback — see `docs/SECURITY.md` |
| `/api/claims/submit` returns success but nothing shows up in your database | It inserts into `dataset_claims`, not the `claims` table from `schema.sql` — and that table likely doesn't exist yet in a fresh DB, so the insert silently fails (caught and only printed to console) | See `docs/database/schema.md`; create the `dataset_claims` table or repoint the endpoint at `claims` |
| Login works with `admin`/`admin123` even without a real user in the DB | This is a hardcoded fallback in the code, not a bug in your setup | See `docs/SECURITY.md` #2 — remove before deploying anywhere real |

## OCR (PaddleOCR — used by the real backend `app.py`)

| Symptom | Cause | Fix |
|---|---|---|
| `NotImplementedError: ConvertPirAttribute2RuntimeAttribute not support [pir::ArrayAttribute<pir::DoubleAttribute>]` | PaddlePaddle 3.3.0+ regression on CPU/oneDNN | Pin `paddlepaddle==3.2.2 paddleocr==3.4.1` (macOS: `paddlepaddle==3.0.0`). As a fallback only, `enable_mkldnn=False` avoids the crash but loses CPU acceleration. |
| `TypeError: ... unexpected keyword argument 'use_angle_cls'` | Old 2.x-style argument on a 3.x install | Use `use_textline_orientation=True` instead |
| OCR always returns empty/garbage text on PaddleOCR 3.x | `app.py`'s result parsing (`result[0]`, `line[1][0]`) assumes the old 2.x result format | Switch to `.predict()` and read `page["rec_texts"]` — see `docs/modules/backend-api.md` |

## OCR (Tesseract — used only by the `assure/` console demo)

| Symptom | Cause | Fix |
|---|---|---|
| `TesseractNotFoundError: tesseract is not installed or it's not in your PATH` | Binary not installed or not on PATH | Install via `brew`/`apt`/UB Mannheim installer; on Windows, set `pytesseract.pytesseract.tesseract_cmd` explicitly |
| `TesseractError: (1, 'Error opening data file ...')` | Missing language data | Install the relevant language pack |
| `assure/ocr.py` output fields never change even with a different receipt image | By design in the current code — OCR text is extracted but never parsed into `extracted_data`, which is always the same hardcoded dict | See `docs/modules/demo-pipeline.md`; this needs real parsing logic added (regex or similar) to actually use the OCR output |

## Frontend

| Symptom | Cause | Fix |
|---|---|---|
| `AdminDashboard` or `SubmitClaim` pages get 404s calling the API | Those pages use relative paths (`/api/...`) with no dev proxy configured, while other pages hardcode `http://localhost:8000` | See `docs/modules/frontend.md`; either add a Vite proxy or make all pages use the full backend URL consistently |
| Login "succeeds" then immediately bounces back to `/` | `userRole` isn't persisted — check if something re-rendered/reset `AuthProvider`, or if the page was refreshed | This is a known limitation, not a typical bug — see `docs/architecture/overview.md` |
| Build fails on Linux/CI but works locally on Windows/macOS | `App.jsx` imports `./pages/login` (lowercase) — case-sensitive filesystems will fail to resolve `Login.jsx` if that's the actual filename on disk | Rename the file/import to match exactly, in the same case |

## Model predictions look wrong / always the same

| Symptom | Cause | Fix |
|---|---|---|
| `python_prediction` is always `Valid` at 0.88 confidence | `xgboost_model.joblib`'s `.predict()` is likely throwing internally (feature mismatch between `preprocess_claim_data()` and training data) and silently falling back | See `docs/models/ml-models.md`; check server console for the printed `Model prediction error` |
| `gtm_prediction`'s confidence values seem swapped between Valid/Invalid | Likely index-to-label mismatch — `keras_probs[0]` is assumed to be "valid" but `labels.txt` has index 0 as `"invalid"` | See `docs/models/ml-models.md` for the fix |
