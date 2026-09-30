# AI Tool Usage Declaration

This file declares all AI tool assistance used during development, per the
challenge's AI Tool Usage Declaration requirement.
---

## Compliance statement: final claim decision

Per the requirement that the final claim decision must not be generated
through an external generative-AI API: **confirmed compliant.** The claim
verdict in this project is produced entirely by: Team

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

---

## AI tool usage log

PaddleOCR did not work as intended and created some version compatibility issues. Therefore, we did thorough reasearch using Claude and switched to Tessarect OCR.

Solved database issues while trying to register the product to the databse which is setup at NEON DB paltform. 

## Team sign-off

Ambreen Zafar
Urooj Liaquat
Abdul Wahab Mir
Irfan Ali

Date: 29/09/2026
