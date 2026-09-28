# AssureX_TechWiz7_DigitalWarriors
This project is part of Techwiz7 for AssureX Warranty Claims
# Assure Warranty Claim Intelligence Suite

Assure is a Python-based demo workflow for reviewing warranty claims using document fingerprinting, OCR extraction, AI model comparison, business rules, manual review handling, and audit reporting. The project simulates a service-center claim pipeline for products such as laptops and consumer electronics.

The application workflow is implemented as a step-by-step claim pipeline in `app.py`, with supporting modules for login, file upload, OCR, AI scoring, rule checks, duplicate detection, manual review, and PDF report generation.

## Table of Contents

- Overview
- Prerequisites
- Installation
- Quick start
- User workflow
  - Register or log in
  - Register a product
  - Add warranty information
  - Create a claim
  - Upload documents
  - Verify extracted information
  - Submit a claim
- AI and validation workflow
  - Generate the Python prediction
  - Interpret Python confidence scores
  - Generate the Claim Summary Card
  - Obtain the Google Teachable Machine-style prediction
  - Compare both model results
  - Review warranty-rule results
  - Check contradictions
  - Identify duplicate claims
- Review and administration
  - Access the manual-review queue
  - Access the administrator dashboard
  - Track claim status
  - Export a claim report
- Automated tests
- Troubleshooting

## Overview

This project models a modern warranty claim screening system with the following stages:

1. User login and product selection
2. Claim file upload
3. Document fingerprinting for duplicate detection
4. OCR extraction of key values from receipts or invoices
5. Human verification of extracted fields
6. Dual AI path evaluation
7. Rule-engine validation for warranty eligibility
8. Final decisioning
9. Audit PDF generation and review queue handling

The pipeline is intentionally demonstration-focused. It is not a full web application or production-grade enterprise system, but it accurately demonstrates the end-to-end claim review flow used in warranty intelligence platforms.

## Prerequisites

Before running the project, install:

- Python 3.10+ or 3.12 recommended
- PaddleOCR OCR engine
- `pip` package manager
- Optional: a virtual environment tool such as `venv`

### Install TessarectOCR

OCR Setup (Tesseract)

pytesseract is a thin Python wrapper around the Tesseract OCR engine. Installing the Python package alone is not enough — the tesseract binary must be installed separately on the system.

1. Install the Tesseract binary

Windows

Download the 64-bit installer from the UB Mannheim build: https://github.com/UB-Mannheim/tesseract/wiki
Run it. Keep "Additional language data" checked if you need languages other than English.
Note the install path (default: C:\Program Files\Tesseract-OCR) — needed in step 3.
Optional: add that folder to your PATH so tesseract works from any terminal.

macOS

bash
brew install tesseract

For additional languages:

bash
brew install tesseract-lang

Linux (Debian / Ubuntu)

bash
sudo apt update
sudo apt install tesseract-ocr

For additional languages, e.g. French:

bash
sudo apt install tesseract-ocr-fra

Linux (Fedora)

bash
sudo dnf install tesseract

Verify the binary installed correctly:

bash
tesseract --version
2. Install the Python wrapper
bash
pip install pytesseract pillow

pillow is required — pytesseract takes PIL Image objects as input.

3. Point pytesseract at the binary (Windows only)

On Windows, pytesseract often can't find tesseract.exe unless it's on PATH. Set the path explicitly at the top of your script:

python
import pytesseract

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

macOS/Linux users installing via brew/apt usually don't need this — the binary is already on PATH.

4. Verify from Python
python
from PIL import Image
import pytesseract

text = pytesseract.image_to_string(Image.open("sample_receipt.jpg"))
print(text)
Usage notes
Default language is English (eng). Combine languages with +:
python
  pytesseract.image_to_string(image, lang="eng+fra")
For messy or low-quality receipt scans, preprocessing the image (grayscale, contrast/threshold, deskew) before OCR usually improves accuracy more than any Tesseract setting.
Need bounding boxes / confidence per word instead of plain text? Use:
python
  pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)
Troubleshooting
Problem	Fix
TesseractNotFoundError: tesseract is not installed or it's not in your PATH	The binary isn't installed or isn't on PATH. Install it (step 1) and, on Windows, set tesseract_cmd (step 3).
TesseractError: (1, 'Error opening data file ...')	Missing language data. Install the language pack — tesseract-ocr-<lang> on apt, tesseract-lang on brew, or the language option in the Windows installer.
Low accuracy on scanned receipts	Preprocess the image first: grayscale, binarize/increase contrast, deskew, then run image_to_string.
Works via tesseract --version in terminal but fails in Python	Python may be using a different environment/PATH than your shell. Set pytesseract.pytesseract.tesseract_cmd to the full binary path explicitly.

## Installation

From the project folder, create and activate a virtual environment:

Windows PowerShell:

```powershell
cd "c:\asure x\assure.py\assure"
python -m venv .ven
.\.ven\Scripts\Activate.ps1
```

macOS/Linux:

```bash
cd /path/to/assure
python3 -m venv .ven
source .ven/bin/activate
```

Install dependencies:

```bash
pip install --upgrade pip

```

If the project is running in the included local environment, you can also use the repository's existing `.ven` folder.

## Quick Start

Run the complete pipeline:

```bash
python app.py
```

This executes the full claim-processing demonstration from login through OCR, AI comparison, rules validation, final decision, and PDF audit certificate generation.

The repo also creates sample artifacts such as:

- `receipt_sample.png`
- `claim_summary_card.png`
- `Audit_Certificate_CLM-2024-8831.pdf`

## User Workflow

### 1. Register or Log In

The login workflow is represented in `account_login.py` and simulates a technician login to the warranty system.

Example behavior:

- User role: `Service Center Tech`
- User ID: `TECH_9942`
- Selected device: `Lenovo ThinkBook Laptop`
- Purchase date: `2024-01-15`
- Months owned: `8`

In a production implementation, this step would connect to a user database, authentication service, and role-based access controls. In the demo, the application prints the selected user and device and proceeds to the claim workflow.

### 2. Register a Product

A product is registered through the session context when the technician selects a device and purchase details. The sample session includes:

- Selected device
- Purchase date
- Warranty start or ownership timeline

The project is designed to model a product being attached to a claim process, not a full e-commerce inventory system.

### 3. Add Warranty Information

Warranty information is implicitly included in the session and claim logic. The system checks:

- device ownership period
- remaining warranty coverage
- purchase date validity
- fault type restrictions

Business rules are enforced in `business_rule_engine.py`.

### 4. Create a Claim

Claims are created as part of the pipeline after user login and product registration. In the demo, the system creates a claim with an ID such as:

- `CLM-2024-8831`

Claim creation is represented by the master pipeline sequence rather than a dedicated web form.

### 5. Upload Documents

The upload step is simulated in `file_upload_stimulation.py`.

Typical inputs in the demo are:

- `receipt`: `receipt_sample.png`
- `warranty_card`: `warranty.pdf`
- `fault_photo`: `screen_damage.jpg`
- `fault_description`: `Screen has vertical lines`

This reflects the typical evidence package for a warranty claim.

### 6. Verify Extracted Information

After document upload, OCR extracts key invoice and claim values. `ocr.py` extracts fields such as:

- `invoice_date`: `2024-01-15`
- `store_name`: `BestBuy Retail`
- `serial_number`: `SN-998214A`
- `amount_paid`: `1299.00`

The verification screen in `verification_screen.py` simulates a human-in-the-loop review where the technician confirms the extracted data before evaluation continues.

### 7. Submit a Claim

Once the user confirms the extracted values and the system validates the evidence, the pipeline proceeds to AI analysis and rule checks. A claim is effectively "submitted" when the final decision is generated and the audit certificate is created.

The final result is printed in the console and used to trigger the next step in the review process.

## AI and Validation Workflow

### 8. Generate the Python Prediction

The tabular prediction path is implemented in `dual_path_execution.py` and uses a `RandomForestClassifier` to estimate claim validity.

The model uses a simple feature set including:

- months owned
- remaining days
- serial match flag
- amount paid

The output is a probability distribution across classes:

- `Valid`
- `Invalid`
- `Review`

Example output:

```python
{'Valid': 0.72, 'Invalid': 0.24, 'Review': 0.04}
```

This is the Python/ML model decision shown in the terminal when the pipeline runs.

### 9. Interpret Python Confidence Scores

The confidence scores are probabilities, not direct pass/fail labels.

Interpretation:

- `Valid` close to `1.0` = strong support for an eligible claim
- `Invalid` close to `1.0` = strong support for a rejected claim
- `Review` elevated value = uncertain case requiring human intervention

Example:

- `Valid: 0.72`, `Invalid: 0.24`, `Review: 0.04`
- The system leans toward `Valid`, but the result still needs to be merged with the second model and business rules.

A rule engine and arbiter evaluate the final decision before approval.

### 10. Generate the Claim Summary Card

The visual model path creates a summary image file named `claim_summary_card.png`.

This is generated in `dual_path_execution.py` using PIL and a sample card that contains:

- serial number
- fault description
- visual inspection layout

The generated image acts as the visual/inspection artifact that a Google Teachable Machine-style classifier would analyze.

### 11. Obtain the Google Teachable Machine Prediction

This repository does not include a live Google Teachable Machine deployment or API integration. Instead, it simulates a visual inspection model using a generated summary card and a representative probability dictionary.

The equivalent demo output looks like:

```python
{'Valid': 0.84, 'Invalid': 0.05, 'Review': 0.11}
```

In a real GTM implementation, you would export a model, run inference on the fault image, and feed the model probabilities into the same comparison pipeline.

### 12. Compare Both Model Results

The `step_7_arbiter` function in `comparing_ai_brains.py` compares the two model outputs.

The logic:

- Determine the top prediction from each model
- Calculate the probability gap between the top class scores
- Assign a badge:
  - `Strong Match` if both models agree and the gap is small
  - `Acceptable Match` if they agree with a moderate gap
  - `Model Disagreement` if they disagree or drift too much

Example in the demo:

- Path A: `Valid = 0.72`
- Path B: `Valid = 0.84`
- Arbiter result: `Strong Match`

This is how the system decides whether the AI signals are consistent enough to proceed automatically.

### 13. Review Warranty-Rule Results

The rule engine is implemented in `business_rule_engine.py`.

It validates:

- warranty expiry
- excluded fault types
- future date logic

Example rules checked:

- `remaining_days < 0` => warranty expired
- `fault_desc` contains excluded keywords such as `water damage`, `liquid spill`, `hammer`
- purchase date cannot be in the future

A claim passes rules only when all checks succeed.

### 14. Check Contradictions

Contradictions are surfaced when the AI models disagree or when the decision pipeline identifies inconsistency between the parsed data, rule output, and model prediction.

The repo checks for:

- model disagreement (`Model Disagreement` badge)
- invalid rule outcomes
- fraud or duplicate detection
- mismatched claim reasoning

A contradiction typically triggers either:

- a rejected claim, or
- a manual review decision

### 15. Identify Duplicate Claims

Duplicate detection is handled with SHA-256 hash comparison in `document_fingerprinting.py`.

The process:

1. Read the uploaded document bytes
2. Compute the SHA-256 hash
3. Compare it with a stored list of known hashes
4. Mark claim as fraudulent or duplicate if a match is found

When a duplicate is detected, the app prints:

```text
[FRAUD ALERT: Duplicate receipt hash detected!]
```

This is the mechanism used to detect repeated receipt uploads or manipulated evidence.

## Review and Administration

### 16. Access the Manual-Review Queue

A claim enters the manual-review queue when:

- the AI models disagree
- the claim requires a human decision
- business rules fail
- the system flags contradictions that should be investigated

The flow is represented by `human_review.py`, which generates an audit certificate and is the conceptual manual review layer for the workflow.

In a production deployment, this would be the queue operators use to inspect claim evidence and decide whether to approve or reject the claim.

### 17. Access the Administrator Dashboard

The demo does not contain a full HTML/React admin panel. Instead, the admin view is represented by the console logs and generated audit artifacts.

The administrator can review:

- AI arbiter output
- rule engine flags
- final decision
- PDF claim certificate
- claim ID and claim context

The project is best understood as a backend decision engine and audit trail rather than a browser-based dashboard.

### 18. Track Claim Status

Claim status is determined throughout the pipeline. The final status is printed at the decision stage and can be interpreted as:

- `Likely Valid`
- `Likely Invalid`
- `Manual Review Required`

The final decision logic appears in `final_master_decision.py`.

### 19. Export a Claim Report

The project generates a PDF audit certificate using `reportlab` in `human_review.py`.

The output file is created as:

```bash
Audit_Certificate_CLM-2024-8831.pdf
```

This report contains:

- claim ID
- selected device
- AI arbiter status
- final decision
- audit timestamp

This is the repository's report export mechanism.

## Automated Tests

This project is organized as a functional demo pipeline rather than a formal test suite. To run automated validation, use Pytest if tests are added to the repo.

Example:

```bash
pytest
```

If the repository uses a local virtual environment, run:

```bash
.\.ven\Scripts\Activate.ps1
pytest
```

For a smoke test of the demo workflow, the current project can also be run directly:

```bash
python app.py
```

This verifies that the end-to-end pipeline executes successfully and produces the expected artifacts.

## Example Typical Run

```bash
cd "c:\asure x\assure.py\assure"
python -m venv .ven
.\.ven\Scripts\Activate.ps1
pip install --upgrade pip
pip install pillow pytesseract scikit-learn reportlab
python app.py
```

Expected result:

- A service center user logs in
- A claim package is uploaded
- OCR reads the receipt fields
- The user verifies the extracted values
- Python AI model estimates a validity score
- Visual model provides a second verdict
- Rule engine validates the claim
- Final decision is printed to the console
- Audit PDF is created in the project folder

## Troubleshooting

### OCR not working

- Ensure Tesseract is installed and added to your system PATH.
- Confirm `pytesseract` is installed in the active virtual environment.
- Test with `tesseract --version`.

### PDF export fails

- Confirm `reportlab` is installed.
- Ensure the script has write permission in the working directory.

### Model output issues

- Reinstall `scikit-learn` in the active environment.
- Verify `numpy` and `scipy` are available.

### Duplicate detection is not firing

- Make sure the same file is being processed repeatedly with the same contents.
- Check that the file is not being altered between runs.

## Summary

Assure demonstrates how an AI-assisted warranty claims workflow can combine:

- user authentication
- document upload and OCR
- product and warranty metadata
- duplicate prevention
- rule validation
- AI model comparison
- human review routing
- audit reporting

## License

This project is provided as a demonstration repository for educational and operational workflow review purposes. 
