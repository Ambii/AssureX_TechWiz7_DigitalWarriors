import psycopg2
import os

url = os.environ.get('NEON_DATABASE_URL', 'postgresql://neondb_owner:npg_nUwVWGmj1D6h@ep-royal-flower-b4j6zqpk-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require')
try:
    conn = psycopg2.connect(url)
    conn.autocommit = True
    cursor = conn.cursor()
    cols = [
        "product_id VARCHAR(100)",
        "product_name VARCHAR(255)",
        "sale_date DATE",
        "invoice_path VARCHAR(500)"
    ]
    for col in cols:
        try:
            cursor.execute(f"ALTER TABLE products ADD COLUMN IF NOT EXISTS {col};")
            print(f"Added/Ensured {col}")
        except Exception as e:
            print(f"Error adding {col}: {e}")
    conn.close()
    print("DB fix complete.")
except Exception as e:
    print("Connection error:", e)
