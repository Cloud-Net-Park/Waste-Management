-- Migration: Fix training_modules table schema for admin dashboard
-- Drop the table and all dependent objects (CAUTION: this will delete all data and dependent constraints)
DROP TABLE IF EXISTS public.training_modules CASCADE;

-- Create the correct table structure
CREATE TABLE public.training_modules (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    duration text NOT NULL,
    difficulty text NOT NULL,
    description text,
    topics text[],
    target_participants text,
    created_at timestamp with time zone DEFAULT now()
);

-- Optional: Insert a sample module (remove if not needed)
INSERT INTO public.training_modules (title, duration, difficulty, description, topics, target_participants)
VALUES (
  'Waste Segregation Basics', '30 min', 'Beginner', 'Learn the fundamentals of proper waste segregation', ARRAY['Management'], 'Citizen'
);
