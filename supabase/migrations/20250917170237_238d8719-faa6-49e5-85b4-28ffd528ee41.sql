-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create enums
CREATE TYPE public.waste_type AS ENUM ('organic', 'recyclable', 'hazardous', 'e-waste', 'general');
CREATE TYPE public.issue_type AS ENUM ('illegal-dump', 'overflowing-bin', 'missed-collection', 'hazardous-waste', 'other');
CREATE TYPE public.priority_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE public.report_status AS ENUM ('pending', 'in-progress', 'resolved', 'rejected');
CREATE TYPE public.facility_type AS ENUM ('recycling', 'composting', 'biogas', 'waste-to-energy', 'collection-center');
CREATE TYPE public.user_role AS ENUM ('citizen', 'worker', 'admin', 'green-champion');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    ward TEXT,
    role user_role DEFAULT 'citizen',
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create waste reports table
CREATE TABLE public.waste_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    issue_type issue_type NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    ward TEXT,
    priority_level priority_level DEFAULT 'medium',
    status report_status DEFAULT 'pending',
    photo_urls TEXT[],
    location_coordinates GEOGRAPHY(POINT, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create facilities table
CREATE TABLE public.facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type facility_type NOT NULL,
    address TEXT NOT NULL,
    ward TEXT,
    phone TEXT,
    email TEXT,
    capacity INTEGER,
    current_load INTEGER DEFAULT 0,
    location_coordinates GEOGRAPHY(POINT, 4326),
    operating_hours TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create training modules table
CREATE TABLE public.training_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    video_url TEXT,
    duration_minutes INTEGER,
    category TEXT,
    order_index INTEGER DEFAULT 0,
    is_mandatory BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user training progress table
CREATE TABLE public.user_training_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    module_id UUID REFERENCES public.training_modules(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE,
    score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, module_id)
);

-- Create waste collections table
CREATE TABLE public.waste_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID REFERENCES public.profiles(id),
    route TEXT,
    scheduled_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_collections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for waste reports
CREATE POLICY "Users can view all waste reports" ON public.waste_reports
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own waste reports" ON public.waste_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own waste reports" ON public.waste_reports
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for facilities (public read access)
CREATE POLICY "Anyone can view facilities" ON public.facilities
    FOR SELECT USING (true);

-- Create RLS policies for training modules (public read access)
CREATE POLICY "Anyone can view training modules" ON public.training_modules
    FOR SELECT USING (true);

-- Create RLS policies for user training progress
CREATE POLICY "Users can view their own progress" ON public.user_training_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.user_training_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_training_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for waste collections
CREATE POLICY "Workers can view their collections" ON public.waste_collections
    FOR SELECT USING (auth.uid() = worker_id);

CREATE POLICY "Workers can update their collections" ON public.waste_collections
    FOR UPDATE USING (auth.uid() = worker_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('waste-reports', 'waste-reports', true),
    ('profile-avatars', 'profile-avatars', true),
    ('training-materials', 'training-materials', true);

-- Create storage policies for waste reports
CREATE POLICY "Authenticated users can upload waste report photos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'waste-reports' AND 
        auth.role() = 'authenticated'
    );

CREATE POLICY "Anyone can view waste report photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'waste-reports');

-- Create storage policies for profile avatars
CREATE POLICY "Users can upload their own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'profile-avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Anyone can view profile avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'profile-avatars');

-- Create storage policies for training materials
CREATE POLICY "Anyone can view training materials" ON storage.objects
    FOR SELECT USING (bucket_id = 'training-materials');

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
        'citizen'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_waste_reports_updated_at BEFORE UPDATE ON public.waste_reports
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_facilities_updated_at BEFORE UPDATE ON public.facilities
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_modules_updated_at BEFORE UPDATE ON public.training_modules
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample training modules
INSERT INTO public.training_modules (title, description, content, duration_minutes, category, order_index, is_mandatory) VALUES
    ('Waste Segregation Basics', 'Learn the fundamentals of proper waste segregation', 'Comprehensive guide on segregating organic, recyclable, and hazardous waste materials.', 15, 'Basic Training', 1, true),
    ('Composting at Home', 'Create nutrient-rich compost from kitchen waste', 'Step-by-step process to set up home composting systems and maintain them effectively.', 20, 'Advanced Training', 2, false),
    ('Recycling Best Practices', 'Maximize recycling efficiency in your community', 'Learn about different recycling processes and how to prepare materials for recycling.', 18, 'Basic Training', 3, true),
    ('Hazardous Waste Management', 'Safe handling and disposal of dangerous materials', 'Identify and safely manage electronic waste, chemicals, and other hazardous materials.', 25, 'Safety Training', 4, true);

-- Insert sample facilities
INSERT INTO public.facilities (name, type, address, ward, phone, capacity, location_coordinates, operating_hours) VALUES
    ('Central Recycling Hub', 'recycling', '123 Green Street, Central District', 'Ward 1', '+91-9876543210', 1000, ST_GeogFromText('POINT(77.2090 28.6139)'), '6 AM - 8 PM'),
    ('Community Composting Center', 'composting', '456 Eco Lane, North Block', 'Ward 2', '+91-9876543211', 500, ST_GeogFromText('POINT(77.2100 28.6150)'), '7 AM - 7 PM'),
    ('Biogas Plant East', 'biogas', '789 Renewable Road, East Side', 'Ward 3', '+91-9876543212', 2000, ST_GeogFromText('POINT(77.2200 28.6200)'), '24/7'),
    ('Waste to Energy Facility', 'waste-to-energy', '321 Power Avenue, Industrial Area', 'Ward 4', '+91-9876543213', 5000, ST_GeogFromText('POINT(77.1900 28.6000)'), '24/7');

-- Create indexes for better performance
CREATE INDEX idx_waste_reports_user_id ON public.waste_reports(user_id);
CREATE INDEX idx_waste_reports_status ON public.waste_reports(status);
CREATE INDEX idx_waste_reports_location ON public.waste_reports USING GIST(location_coordinates);
CREATE INDEX idx_facilities_type ON public.facilities(type);
CREATE INDEX idx_facilities_location ON public.facilities USING GIST(location_coordinates);
CREATE INDEX idx_user_training_progress_user_id ON public.user_training_progress(user_id);