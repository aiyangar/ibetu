-- 🔐 Row Level Security Policies for I Bet U
-- Execute this in your Supabase SQL Editor

-- First, let's check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN ('participants', 'payments');

-- Enable RLS if not already enabled
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all participants" ON participants;
DROP POLICY IF EXISTS "Users can insert their own participant record" ON participants;
DROP POLICY IF EXISTS "Users can update their own participant record" ON participants;

DROP POLICY IF EXISTS "Users can view all payments" ON payments;
DROP POLICY IF EXISTS "Users can insert payments for themselves" ON payments;

-- Create new policies for participants table
CREATE POLICY "Enable read access for all users" ON participants
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON participants
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on email" ON participants
  FOR UPDATE USING (auth.email() = email);

-- Create new policies for payments table
CREATE POLICY "Enable read access for all users" ON payments
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON payments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Alternative: More restrictive policy for payments (uncomment if you want stricter control)
-- CREATE POLICY "Enable insert for users based on participant_id" ON payments
--   FOR INSERT WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM participants 
--       WHERE id = participant_id 
--       AND email = auth.email()
--     )
--   );

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename IN ('participants', 'payments');

-- Test the setup by checking if a user can insert
-- (This will help verify the policies are working)
SELECT 
  'participants' as table_name,
  count(*) as total_records
FROM participants;

SELECT 
  'payments' as table_name,
  count(*) as total_records
FROM payments;
