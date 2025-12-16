-- Migration: Fix dashboard_stats table schema for admin dashboard
-- Drop the table if it exists (CAUTION: this will delete all data)
DROP TABLE IF EXISTS public.dashboard_stats;

-- Create the correct table structure
CREATE TABLE public.dashboard_stats (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    value text NOT NULL,
    unit text
);

-- Optional: Insert some initial stats (remove if not needed)
INSERT INTO public.dashboard_stats (title, value, unit) VALUES
('Total Waste Collected', '2,450', 'tons'),
('Recycling Rate', '78', '%'),
('Active Facilities', '24', ''),
('Carbon Saved', '1,200', 'kg CO₂');
