# 🚀 I Bet U - Supabase Setup Guide

## 📋 Overview
This guide will help you set up Supabase for the I Bet U application, which includes user authentication and a competitive payment system.

## 🔧 Prerequisites
- Supabase account (free tier available)
- Basic knowledge of SQL

## 🗄️ Database Setup

### 1. Create a new Supabase project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Wait for the project to be ready

### 2. Get your credentials
1. Go to Settings → API
2. Copy your `Project URL` and `anon public` key
3. Create a `.env` file in your project root with:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Create the database tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Participants table
CREATE TABLE participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  total_paid NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_participants_email ON participants(email);
CREATE INDEX idx_participants_total_paid ON participants(total_paid DESC);
CREATE INDEX idx_payments_participant_id ON payments(participant_id);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
```

### 4. Set up Row Level Security Policies

```sql
-- Participants policies
CREATE POLICY "Users can view all participants" ON participants
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own participant record" ON participants
  FOR INSERT WITH CHECK (auth.email() = email);

CREATE POLICY "Users can update their own participant record" ON participants
  FOR UPDATE USING (auth.email() = email);

-- Payments policies
CREATE POLICY "Users can view all payments" ON payments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert payments for themselves" ON payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM participants 
      WHERE id = participant_id 
      AND email = auth.email()
    )
  );
```

### 5. Set up authentication

1. Go to Authentication → Settings
2. Enable Email confirmations (recommended for production)
3. Configure your site URL
4. Set up email templates if needed

## 🧪 Testing the Setup

### 1. Insert sample data (optional)

```sql
-- Insert sample participants
INSERT INTO participants (nickname, email, total_paid) VALUES
  ('Champion', 'champion@example.com', 1000.00),
  ('RunnerUp', 'runner@example.com', 750.50),
  ('Newbie', 'newbie@example.com', 250.00);

-- Insert sample payments
INSERT INTO payments (participant_id, amount) VALUES
  ((SELECT id FROM participants WHERE email = 'champion@example.com'), 1000.00),
  ((SELECT id FROM participants WHERE email = 'runner@example.com'), 750.50),
  ((SELECT id FROM participants WHERE email = 'newbie@example.com'), 250.00);
```

### 2. Test the connection
1. Start your application
2. Check the browser console for any errors
3. Try to register a new user
4. Try to make a payment

## 🔍 Troubleshooting

### Common Issues:

1. **"Invalid API key" error**
   - Check your `.env` file
   - Ensure the key is copied correctly
   - Restart your development server

2. **"Table doesn't exist" error**
   - Run the SQL commands in the correct order
   - Check if you're in the right database

3. **Authentication errors**
   - Verify RLS policies are set up correctly
   - Check if email confirmations are configured

4. **Payment errors**
   - Ensure the participant exists before making payments
   - Check foreign key constraints

### Debug Queries:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check participants
SELECT * FROM participants ORDER BY total_paid DESC;

-- Check payments
SELECT p.*, pt.nickname 
FROM payments p 
JOIN participants pt ON p.participant_id = pt.id 
ORDER BY p.created_at DESC;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

## 🚀 Next Steps

1. **Customize the UI**: Modify the form styles and layouts
2. **Add validation**: Implement client-side and server-side validation
3. **Payment processing**: Integrate with a real payment gateway
4. **Analytics**: Add tracking for user engagement
5. **Notifications**: Implement real-time updates when rankings change

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🆘 Support

If you encounter issues:
1. Check the Supabase logs in your dashboard
2. Review the browser console for errors
3. Verify your environment variables
4. Check the RLS policies are correctly applied

---

**Happy coding! 🎉**
