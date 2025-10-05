-- Add verification document fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS verification_document_type text CHECK (verification_document_type IN ('national_id', 'drivers_license', 'voters_card', 'international_passport')),
ADD COLUMN IF NOT EXISTS verification_document_url text,
ADD COLUMN IF NOT EXISTS verification_status text CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending';