-- AssureX Claim Engine Database Schema
-- Run these SQL commands in your Supabase SQL Editor

-- 1. Create the Users Table for Customers and Reviewers
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'customer', -- 'customer', 'reviewer', 'admin'
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    category VARCHAR(100),
    warranty_duration_months INT DEFAULT 12,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the Claims Table
CREATE TABLE IF NOT EXISTS public.claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id VARCHAR(50) UNIQUE NOT NULL,
    product_id VARCHAR(100) NOT NULL REFERENCES public.products(product_id) ON DELETE CASCADE,
    fault_description TEXT NOT NULL,
    purchase_date DATE NOT NULL,
    evidence_url TEXT,
    ai_decision VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Pending',
    confidence_diff DECIMAL(5,2),
    reviewer_comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Configure Storage Bucket
-- You also need to create a Storage Bucket manually in the Supabase Dashboard.
-- Bucket Name: "evidence"
-- Ensure the bucket is set to "Public" so the application can read the uploaded images.

-- 4. Enable Row Level Security (Optional but recommended)
-- ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
