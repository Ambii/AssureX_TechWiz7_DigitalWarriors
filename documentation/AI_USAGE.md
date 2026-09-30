# AI Tool Usage Declaration

This file declares all AI tool assistance used during development, per the
challenge's AI Tool Usage Declaration requirement.

> **To the team:** every `[FILL IN — ...]` placeholder below must be
> completed truthfully by whoever actually did the work before this file is
> submitted. Claude (the AI tool used to draft this file) has no visibility
> into your team member names or what manual testing you performed — those
> fields must not be left blank, guessed, or fabricated.

---

## Compliance statement: final claim decision

Per the requirement that the final claim decision must not be generated
through an external generative-AI API: **confirmed compliant.** The claim
verdict in this project is produced entirely by:

1. **The team's Python classification model** — `model/xgboost_model.joblib`,
   loaded and run via `joblib`/`xgboost` in `app.py` (Path A / tabular prediction).
2. **The Google Teachable Machine model** — `model/keras_model.h5` +
   `model/labels.txt`, a Teachable Machine export run via TensorFlow/Keras
   in `app.py` (Path B / image prediction).
3. **The team's own warranty rule engine** — `business_rule_engine.py` and
   the arbiter/decision logic in `comparing_ai_brains.py` and
   `final_master_decision.py`.

No call to OpenAI, Anthropic, or any other generative-AI API exists
anywhere in the prediction or decision code path. This was verified by
direct line-by-line review of `app.py` and every module in `assure/`.

---

## AI-generated images

No AI image-generation tool was used to create any asset found in the
reviewed codebase — `claim_summary_card.png` is generated programmatically
via PIL (`ImageDraw`), not by an image-generation model.

`[FILL IN — if the team used an AI image generator (e.g. for the blog post,
video, or any frontend visual asset like hero.png), declare the tool name
and purpose here. If none were used, state "No AI-generated images used."]`

---

## AI tool usage log

### Tool: Claude (Anthropic)

| # | Purpose | Prompt / assistance requested | Files or modules affected | Modifications performed by team | Testing completed by team | Verified by |
|---|---|---|---|---|---|---|
| 1 | Diagnose a "Invalid username/email or password" login bug | Pasted `login.jsx`; asked to identify the cause | `assurex-frontend/src/pages/login.jsx` (reviewed only, no code rewritten by AI) | `[FILL IN — which suggested cause was the real one, and what was changed]` | `[FILL IN]` | `[FILL IN]` |
| 2 | Diagnose a PaddleOCR/PaddlePaddle runtime crash (`ConvertPirAttribute2RuntimeAttribute` / oneDNN error) blocking the OCR feature | Pasted the exact error traceback (occurred on two separate runs); asked for cause and fix | `app.py` (PaddleOCR engine init), OCR dependency setup | `[FILL IN — which fix was applied: enable_mkldnn=False, or pinning paddlepaddle==3.2.2 / paddleocr==3.4.1]` | `[FILL IN — confirm /api/ocr/scan tested with a real receipt after the fix]` | `[FILL IN]` |
| 3 | Fix a Python OCR-extraction function using an outdated PaddleOCR 2.x API against an installed 3.x version | Pasted the team's OCR extraction function; asked "what's the error here, provide a fixed version" | `assure/ocr.py` (or equivalent extraction step) | `[FILL IN — was the AI's suggested fix merged as-is, adapted, or only used as reference?]` | `[FILL IN — run corrected function against a real receipt image, confirm extracted fields are correct]` | `[FILL IN]` |
| 4 | Draft OCR engine installation instructions for setup documentation | "provide installation instruction for [PaddleOCR / Tesseract] to give it in readme file" | `README.md` (setup/prerequisites section), `docs/setup/installation.md` | `[FILL IN — confirm install commands were tested on the team's actual OS/environment]` | `[FILL IN]` | `[FILL IN]` |
| 5 | Verify a claimed technology-stack list (ML libraries, frontend, backend, dev tools) against the project's own README | Pasted the claimed tech-stack list and `README.md`; asked whether the claims were accurate | `README.md` (reviewed only, no changes made by AI) | `[FILL IN — did the team correct the README's tech-stack section based on this review?]` | N/A — documentation review | `[FILL IN]` |
| 6 | Generate project documentation (`docs/` folder) by reading the actual source code | Provided the public GitHub repo URL and requested full documentation | New files only: `docs/README.md`, `docs/architecture/overview.md`, `docs/setup/installation.md`, `docs/modules/backend-api.md`, `docs/modules/demo-pipeline.md`, `docs/modules/frontend.md`, `docs/models/ml-models.md`, `docs/database/schema.md`, `docs/troubleshooting.md`, `docs/SECURITY.md`. No existing source files were modified. | `[FILL IN — team reviewed each doc against the current codebase and corrected any inaccuracies before submission]` | `[FILL IN — each documented endpoint/behavior manually verified against the running app]` | `[FILL IN]` |
---

## Team sign-off

Ambreen Zafar
Urooj Liaquat
Abdul Wahab Mir
Irfan Ali

Date: 29/09/2026
