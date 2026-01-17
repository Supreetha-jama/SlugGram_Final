-- Add missing columns to posts table for event functionality
ALTER TABLE posts ADD COLUMN IF NOT EXISTS event_date TIMESTAMPTZ;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS event_location TEXT;

-- Rename study_groups columns to match code expectations
ALTER TABLE study_groups RENAME COLUMN creator_id TO created_by;
ALTER TABLE study_groups RENAME COLUMN course_code TO subject;

-- Change user_calendar to reference posts instead of events (for the unified feed approach)
ALTER TABLE user_calendar DROP CONSTRAINT IF EXISTS user_calendar_event_id_fkey;
ALTER TABLE user_calendar ADD CONSTRAINT user_calendar_event_id_fkey 
  FOREIGN KEY (event_id) REFERENCES posts(id) ON DELETE CASCADE;
