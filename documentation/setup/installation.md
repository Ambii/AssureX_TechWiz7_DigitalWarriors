# Installation & Setup

## 1. Clone

```bash
git clone https://github.com/Ambii/AssureX_TechWiz7_DigitalWarriors.git
cd AssureX_TechWiz7_DigitalWarriors
```

## 2. Backend (Python)

```bash
python -m venv .venv
# Windows: .venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate

pip install -r requirements.txt
```

`requirements.txt` currently lists: `fastapi`, `uvicorn`, `pydantic`,
`scikit-learn`, `pandas`, `numpy`, `python-multipart`, `joblib`,
`SQLAlchemy`, `supabase`, `tensorflow`, `pillow`.

**Missing from `requirements.txt` but required by the code** — install these
explicitly or `app.py` will fail or silently degrade:

```bash


- `psycopg2` — used directly for every DB call in `app.py`. Without it the
  app won't even import.
- `xgboost` — needed to unpickle `model/xgboost_model.joblib` via
  `joblib.load`, even though `app.py` never `import xgboost` directly.
  `try/except`, so the server still boots without it, 

The separate `assure/` console demo uses **Tesseract** instead of PaddleOCR
(`pytesseract`), plus `reportlab` for its PDF output:

```bash
pip install pytesseract reportlab
```
Tesseract itself is a system binary, not just a pip package — install it via
your OS package manager (`brew install tesseract`, `apt install
tesseract-ocr`, or the UB Mannheim Windows installer) before `pytesseract`
will work.

## 3. Frontend (React + Vite)

```bash
cd assurex-frontend
npm install
npm run dev
```

## 4. Environment variables

`app.py` currently has a **hardcoded fallback** database connection string
with a live username and password in source. This is a real credential leak
in the public repo — see `docs/SECURITY.md` before doing anything else with
this database. Going forward, set the real value via environment variable
and remove the fallback default entirely:

```bash
# .env — add this file to .gitignore, never commit it
NEON_DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require&channel_binding=require
```

## 5. Database setup

Run `database/schema.sql` against your Postgres/Supabase instance. This
creates `users`, `products`, and `claims` tables.

**Important:** `POST /api/claims/submit` in `app.py` does not insert into
the `claims` table created by `schema.sql` — it inserts into a *different*
table, `dataset_claims`, with ~40 columns matching `Dataset_Claims.csv`.
You'll need to create that table separately (see `docs/database/schema.md`
for the full column list) or the submit-claim endpoint will fail with a
database error every time (it's currently wrapped in try/except and fails
silently, printing to console only).

## 6. Run everything

```bash
# Terminal 1 — backend
uvicorn app:app --reload --port 8000

# Terminal 2 — frontend
cd assurex-frontend
npm run dev
```

The frontend expects the backend at whatever base URL its `fetch()` calls
use (check each page component — CORS is wide open on the backend via
`allow_origins=["*"]`, so this works from any dev port).

## 7. Running the separate console demo (optional)

Unrelated to the steps above — this runs the standalone simulation pipeline
described in the original README, with no server or database involved:

```bash
cd assure
python app.py
```
