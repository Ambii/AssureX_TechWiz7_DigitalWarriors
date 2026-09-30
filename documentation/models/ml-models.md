# ML Models (`model/` folder)

## Files present vs. files actually used

```
model/
├── xgboost_model.joblib             LOADED — used by app.py for tabular prediction
├── keras_model.h5                   LOADED — used by app.py for image prediction (GTM export)
├── labels.txt                       LOADED — class names for keras_model.h5
├── script.txt                       Reference only — Teachable Machine's exported inference snippet, not imported/run by anything
├── decision_tree_model.joblib       NOT referenced anywhere in the codebase
└── logistic_regression_model.joblib NOT referenced anywhere in the codebase
```

`decision_tree_model.joblib` and `logistic_regression_model.joblib` appear
to be leftover artifacts from model experimentation (likely candidates
compared against XGBoost before it was chosen). They're currently dead
weight in the repo — either wire one in as a fallback/ensemble member, or
remove them to avoid confusing future contributors about which model is
actually live.

## Path A — tabular model (`xgboost_model.joblib`)

- Loaded once at startup via `joblib.load("model/xgboost_model.joblib")`.
- **Requires the `xgboost` package to be installed** to unpickle, even
  though `app.py` never writes `import xgboost` — `joblib`/`pickle` needs
  the class definition available at load time. This is not in
  `requirements.txt` (see `docs/troubleshooting.md`).
- At inference time, `app.py`'s `preprocess_claim_data()` builds a
  two-column DataFrame: `product_id` (raw string) and `fault_length` (the
  character length of the fault description). This is explicitly flagged
  in the code's own comments as a placeholder — it almost certainly does
  not match the feature set/shape the model was actually trained on, which
  means `.predict()` is likely to throw in practice and fall through to the
  hardcoded fallback prediction (`Valid`, 0.88 confidence). Before relying
  on real predictions from this endpoint, the real training feature set
  needs to be reconstructed and matched here.
- Expected output classes, per the code's `class_map` lookup: `"Valid
  Claim"` / `"Valid"`, `"Invalid Claim"` / `"Invalid"`, `"Manual Review"`
  (both naming conventions are handled defensively).

## Path B — image model (`keras_model.h5` + `labels.txt`)

This is a **Google Teachable Machine** export — `model/script.txt` is
literally Teachable Machine's standard generated inference snippet
(load model → load labels → resize to 224×224 → normalize to [-1, 1] →
predict → argmax), confirming the model was trained via Teachable Machine's
web tool and exported as Keras/TensorFlow, not built from scratch.

`labels.txt`:
```
0 invalid
1 valid
2 manual
```

`app.py` reproduces the same preprocessing (resize 224×224, `ImageOps.fit`,
normalize to `[-1, 1]`) and runs `keras_model.predict()` on the uploaded
evidence image. Class order from `labels.txt` is `invalid, valid, manual`,
but `app.py`'s `PredictionResult` maps `keras_probs[0]` to
`confidence_valid` — **this is off by one relative to the label file**
(index 0 is `invalid`, not `valid`). Worth verifying and likely fixing:
either remap using the actual label strings from `keras_class_names`
instead of positional indices, or confirm the training label order matches
what the code assumes.

## Retraining / updating models

If retraining `xgboost_model.joblib`, keep `preprocess_claim_data()` in
`app.py` in sync with whatever feature set the new model expects — there is
currently no shared feature-engineering code between training and
inference, so this is a manual, easy-to-desync step.

If retraining the image model via Teachable Machine, re-export and replace
`keras_model.h5` + `labels.txt` together (a mismatched pair will silently
predict garbage), and double-check the label-index mapping above.
