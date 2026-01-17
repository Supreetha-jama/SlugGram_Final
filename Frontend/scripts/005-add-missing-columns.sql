-- Add missing columns to posts table (if they don't exist)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS event_date TIMESTAMPTZ;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS event_location TEXT;

-- Add subject column to study_groups if it doesn't exist
ALTER TABLE study_groups ADD COLUMN IF NOT EXISTS subject TEXT;

-- Add created_by column to study_groups if it doesn't exist  
ALTER TABLE study_groups ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
