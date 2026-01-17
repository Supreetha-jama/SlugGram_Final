-- Add display_name column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Copy existing full_name values to display_name
UPDATE profiles SET display_name = full_name WHERE display_name IS NULL AND full_name IS NOT NULL;
