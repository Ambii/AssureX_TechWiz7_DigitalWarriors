# Architecture Overview

## Two separate implementations live in this repo

This is the single most important thing to understand before touching the code:
the repository contains **two independent implementations** of the AssureX
claim workflow, and they do not call each other.

| | `assure/` folder | Root `app.py` + `assurex-frontend/` |
|---|---|---|
| What it is | A standalone console demo (10 sequential steps) | The real full-stack app |
| Entry point | `assure/app.py` | `app.py` (FastAPI) + `assurex-frontend` (React) |
| Data | Hardcoded / simulated | Live: Postgres (Neon), uploaded files |
| OCR engine | Tesseract (`pytesseract`) | PaddleOCR |
| ML models | Trains a throwaway `RandomForestClassifier` in-memory on 3 rows every run | Loads real trained models from `model/` (`xgboost_model.joblib`, `keras_model.h5`) |
| Output | Prints to console + generates a sample PDF/PNG | Returns JSON over HTTP to the React frontend |
| Depends on the other side? | No | No |

The original project README documents the `assure/` console pipeline in detail
(login → upload → fingerprint → OCR → verify → dual AI → arbiter → rules →
decision → PDF). That pipeline is real and runnable, but it is **not** what
the React frontend talks to. Someone onboarding from the README alone could
reasonably think the console pipeline *is* the product — it isn't; it's a
demo/prototype of the decision logic. The deployed product is the FastAPI +
React stack described below.

## Real system architecture (FastAPI + React + Postgres)

```
 React frontend (assurex-frontend)
        |  fetch() calls, JSON over HTTP
        v
 FastAPI backend (app.py)
        |
        |---> psycopg2 ---> Postgres / Neon DB
        |---> joblib.load ---> model/xgboost_model.joblib  (tabular prediction)
        |---> keras.load_model ---> model/keras_model.h5   (image prediction, GTM export)
        \---> PaddleOCR (optional) ---> receipt text extraction
```

## Request flow: submitting a claim

1. User logs in through `POST /api/auth/login` (`assurex-frontend/src/pages/login.jsx`).
2. User fills out the claim form in `SubmitClaim.jsx` and attaches an evidence file.
3. Frontend may call `POST /api/ocr/scan` first, to pre-fill fields from the receipt.
4. Frontend calls `POST /api/claims/submit` with the form fields + evidence file.
5. Backend runs two independent predictions:
   - **Path A (tabular):** `xgboost_model.joblib` on `product_id` / `fault_description` features.
   - **Path B (visual):** `keras_model.h5` on the uploaded evidence image (Teachable Machine export).
6. Backend compares the two predictions' top class and confidence gap and derives
   `final_decision`: `"Likely Valid"`, `"Likely Invalid"`, or `"Manual Review Required"`.
7. The claim is inserted into the `dataset_claims` table (see `docs/database/schema.md`
   for why this is a different table than the `claims` table in `schema.sql`).
8. The `ClaimResponse` JSON is returned to the frontend, which routes the user accordingly.

## Frontend routing and roles

Enforced client-side only, in `App.jsx`'s `ProtectedRoute`:

| Role | Landing route | Reachable routes |
|---|---|---|
| Customer | `/customer` | `/customer`, `/submit-claim`, `/claim/:id` |
| Admin | `/admin` | `/admin`, `/admin/users`, `/evaluator` |
| Reviewer | `/reviewer` | `/reviewer`, `/claim/:id` |
| Evaluator | `/evaluator` | `/evaluator` (shared with Admin) |

**Known gap:** `AuthContext.jsx` stores `userRole` only in React `useState` —
no token, no `localStorage`, no cookie. Refreshing the page logs the user
out. More importantly, the *backend* endpoints (`/api/claims/submit`,
`/api/admin/stats`, etc.) have **no authentication or authorization check at
all** — role gating only exists in the browser. Any client can call any
endpoint directly regardless of role. This is acceptable for a demo but
needs to be fixed before any real deployment (see `docs/SECURITY.md`).
