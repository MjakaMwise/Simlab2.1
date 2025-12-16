/*
  # SIM Lab Kenya Database Schema

  ## Overview
  This migration creates the core database structure for the SIM Lab Kenya Holiday Innovation Program website.

  ## New Tables
  
  ### 1. `student_registrations`
  Stores individual student registration data for the Holiday Innovation Program.
  - `id` (uuid, primary key) - Unique registration identifier
  - `first_name` (text) - Student's first name
  - `last_name` (text) - Student's last name
  - `email` (text) - Student's email address
  - `phone` (text) - Student's phone number
  - `school` (text) - Student's school name
  - `grade` (text) - Current grade/form level
  - `parent_name` (text) - Parent/guardian full name
  - `parent_phone` (text) - Parent/guardian phone number
  - `parent_email` (text) - Parent/guardian email address
  - `registration_type` (text) - Either 'individual' or 'school'
  - `payment_status` (text) - Status: 'pending', 'confirmed', 'failed'
  - `amount_paid` (numeric) - Amount paid in KSh
  - `created_at` (timestamptz) - Registration timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `school_partnerships`
  Tracks school partnership inquiries and agreements.
  - `id` (uuid, primary key) - Unique partnership identifier
  - `school_name` (text) - Name of the school
  - `contact_person` (text) - Primary contact person
  - `email` (text) - School contact email
  - `phone` (text) - School contact phone
  - `student_count` (integer) - Estimated number of students
  - `package_type` (text) - 'bronze', 'silver', or 'gold'
  - `message` (text) - Additional information or requirements
  - `status` (text) - Status: 'inquiry', 'negotiating', 'confirmed', 'declined'
  - `created_at` (timestamptz) - Inquiry timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `contact_submissions`
  Stores messages submitted through the contact form.
  - `id` (uuid, primary key) - Unique submission identifier
  - `name` (text) - Sender's name
  - `email` (text) - Sender's email address
  - `subject` (text) - Message subject
  - `message` (text) - Full message content
  - `status` (text) - Status: 'new', 'read', 'responded', 'archived'
  - `created_at` (timestamptz) - Submission timestamp

  ### 4. `gallery_images`
  Manages gallery image metadata and organization.
  - `id` (uuid, primary key) - Unique image identifier
  - `title` (text) - Image title/caption
  - `category` (text) - Category: 'experiments', 'workshops', 'projects', 'events'
  - `url` (text) - Image URL
  - `description` (text) - Detailed description
  - `display_order` (integer) - Order for display
  - `is_active` (boolean) - Whether image is visible
  - `created_at` (timestamptz) - Upload timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Public read access for gallery_images (active only)
  - Authenticated admin access for management operations
  - Public insert access for registrations and contact submissions
*/

-- Create student_registrations table
CREATE TABLE IF NOT EXISTS student_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  school text NOT NULL,
  grade text NOT NULL,
  parent_name text NOT NULL,
  parent_phone text NOT NULL,
  parent_email text NOT NULL,
  registration_type text NOT NULL DEFAULT 'individual',
  payment_status text NOT NULL DEFAULT 'pending',
  amount_paid numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create school_partnerships table
CREATE TABLE IF NOT EXISTS school_partnerships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name text NOT NULL,
  contact_person text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  student_count integer NOT NULL DEFAULT 0,
  package_type text NOT NULL DEFAULT 'bronze',
  message text,
  status text NOT NULL DEFAULT 'inquiry',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  url text NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE student_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for student_registrations
CREATE POLICY "Anyone can submit student registrations"
  ON student_registrations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view registrations"
  ON student_registrations FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for school_partnerships
CREATE POLICY "Anyone can submit school partnership inquiries"
  ON school_partnerships FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view partnerships"
  ON school_partnerships FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for contact_submissions
CREATE POLICY "Anyone can submit contact messages"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view contact submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for gallery_images
CREATE POLICY "Anyone can view active gallery images"
  ON gallery_images FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Only authenticated users can manage gallery images"
  ON gallery_images FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_student_registrations_email ON student_registrations(email);
CREATE INDEX IF NOT EXISTS idx_student_registrations_status ON student_registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_student_registrations_created ON student_registrations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_school_partnerships_email ON school_partnerships(email);
CREATE INDEX IF NOT EXISTS idx_school_partnerships_status ON school_partnerships(status);
CREATE INDEX IF NOT EXISTS idx_school_partnerships_created ON school_partnerships(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON contact_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_active ON gallery_images(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_images_order ON gallery_images(display_order);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_student_registrations_updated_at'
  ) THEN
    CREATE TRIGGER update_student_registrations_updated_at
      BEFORE UPDATE ON student_registrations
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_school_partnerships_updated_at'
  ) THEN
    CREATE TRIGGER update_school_partnerships_updated_at
      BEFORE UPDATE ON school_partnerships
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_gallery_images_updated_at'
  ) THEN
    CREATE TRIGGER update_gallery_images_updated_at
      BEFORE UPDATE ON gallery_images
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;