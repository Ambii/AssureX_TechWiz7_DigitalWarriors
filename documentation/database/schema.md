# Database

Postgres, currently pointed at a Neon-hosted instance (see
`docs/SECURITY.md` regarding the exposed connection string). `supabase` is
in `requirements.txt` and referenced in comments, but the actual backend
code (`app.py`) connects directly via `psycopg2`, not the Supabase client —
`database/schema.sql`'s own comments describe it as written for "Supabase
SQL Editor," so the schema and the runtime backend currently target two
different original setups that have since diverged.

## Tables defined in `database/schema.sql`

**`users`** — `id` (UUID), `email`, `password_hash`, `role` (default
`'customer'`), `full_name`, timestamps. Matches what `/api/auth/register`
and `/api/auth/login` actually read/write.

**`products`** — `id`, `product_id`, `name`, `brand`, `category`,
`warranty_duration_months`. Not currently written to by any backend
endpoint — no `/api/products` route exists yet.

**`claims`** — `id`, `claim_id`, `product_id` (FK → `products.product_id`),
`fault_description`, `purchase_date`, `evidence_url`, `ai_decision`,
`status`, `confidence_diff`, `reviewer_comments`, timestamps.

Also documented: a Supabase Storage bucket named `evidence` (must be
created manually, set to Public) — not currently used, since
`/api/claims/submit` mocks the file URL instead of actually uploading
anywhere (see `docs/modules/backend-api.md`).

## The table actually used at runtime: `dataset_claims`

`POST /api/claims/submit` does **not** insert into the `claims` table above.
It inserts into a table called `dataset_claims`, which is not created
anywhere in `schema.sql`. Its ~40 columns match `Dataset_Claims.csv`
exactly:

```
Claim_ID, Product_ID, Product_Category, Brand, Model_Number, Serial_Number,
Purchase_Date, Purchase_Price, Retailer, Warranty_Duration_Months,
Warranty_Start_Date, Warranty_Expiry_Date, Claim_Submission_Date,
Product_Age_Months, Fault_Occurrence_Date, Fault_Type, Fault_Description,
Damage_Type, Warranty_Status, Fault_Coverage, Purchase_Proof,
Warranty_Card, Product_Image, Serial_Number_Evidence, Fault_Evidence,
Repair_Report, Missing_Document_Count, Previous_Repair_Count,
Last_Repair_Date, Repair_Center, Repair_Authorization, Replaced_Parts,
Serial_Number_Match, Model_Match, Duplicate_Claim_Indicator,
Contradiction_Indicator, Claim_Reporting_Within_Period, Extended_Warranty,
Excluded_Damage, Claimant_Details_Complete, Supporting_Evidence_Complete,
Claim_Complexity, Risk_Level, Scenario_Type, Class_Label
```

This looks like `Dataset_Claims.csv` (likely the original training-data CSV
for the XGBoost model) was auto-imported into Postgres as a `dataset_claims`
table at some point, and the live endpoint was pointed at that table instead
of the purpose-built `claims` table from `schema.sql`. Most of the columns
in the insert are hardcoded placeholders in `app.py` rather than real values
(e.g. `"Brand": "AssureX Default"`, `"Model_Number": "Unknown"`,
`"Warranty_Expiry_Date": "2030-01-01"`) — this table is effectively being
used as a loosely-typed logging sink for demo submissions rather than a
real normalized claims table.

## Recommendation

Pick one of two paths and reconcile the schema:
1. **Use `schema.sql`'s `claims` table as intended** — update
   `submit_claim()` in `app.py` to insert into `claims` with its actual
   columns, and create a real `products` row per submission (or look one
   up) to satisfy the foreign key.
2. **Formalize `dataset_claims` as the real table** — add a
   `CREATE TABLE dataset_claims (...)` statement to `schema.sql` matching
   the CSV/insert columns, so a fresh database setup actually has
   everywhere the running code expects.

Right now, following `schema.sql` alone will not produce a database that
`/api/claims/submit` can write to.
