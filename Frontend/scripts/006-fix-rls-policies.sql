-- Fix study_groups RLS policies to use created_by instead of creator_id
DROP POLICY IF EXISTS "Authenticated users can create study groups" ON study_groups;
DROP POLICY IF EXISTS "Creators can update their study groups" ON study_groups;
DROP POLICY IF EXISTS "Creators can delete their study groups" ON study_groups;

-- Using created_by column instead of creator_id
CREATE POLICY "Authenticated users can create study groups" ON study_groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update their study groups" ON study_groups
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Creators can delete their study groups" ON study_groups
  FOR DELETE USING (auth.uid() = created_by);
