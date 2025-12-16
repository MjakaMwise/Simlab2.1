/*
  # STEM Education Platform - Complete Database Schema (Part 1)
  
  ## Overview
  Creates comprehensive database structure for a gamified STEM education platform
  with role-based access control supporting Super Admins, Teachers, Teaching Staff,
  Students, and Parents across three implementation phases.
  
  ## Phase 1 - Core Tables
  
  ### 1. User Profiles (extends auth.users)
  Extended profile information for all user types
  - Role-based permissions (super_admin, teacher, teaching_staff, student, parent)
  - Account status tracking (pending_approval, active, suspended, archived)
  - Audit trail (created_by, last_login)
  - Student-specific: age, date of birth, profile customization
  
  ### 2. Relationships
  - parent_student_relationships: Many-to-many parent-student links
  - teacher_student_assignments: Teacher-student associations
  
  ### 3. Age Groups
  Define age ranges for content targeting
  
  ### 4. Educational Content
  All learning materials with versioning, gamification, and scheduling
  
  ### 5. Content Version History
  Track all content changes for rollback capability
  
  ### 6. Student Progress
  Individual student interaction with content
  
  ### 7. Gamification
  XP, levels, streaks, rankings per student
  
  ### 8. Badges System
  Achievement badges and awards
  
  ### 9. Messaging System
  Parent-teacher-admin communication
  
  ### 10. Audit Logs
  System-wide action tracking
  
  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Role-based policies for data access
  - Audit logging for compliance
*/

-- Create enum types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('super_admin', 'teacher', 'teaching_staff', 'student', 'parent');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE account_status AS ENUM ('pending_approval', 'active', 'suspended', 'archived');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE content_type AS ENUM ('lesson', 'quiz', 'game', 'video', 'interactive');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE relationship_type AS ENUM ('mother', 'father', 'guardian', 'other');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 1. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role user_role NOT NULL,
  account_status account_status DEFAULT 'pending_approval',
  
  -- Contact info
  phone text,
  avatar_url text,
  
  -- Student-specific fields
  date_of_birth date,
  age integer,
  theme_color text DEFAULT 'blue',
  banner_url text,
  bio text,
  display_name text,
  profile_visibility text DEFAULT 'age_group',
  
  -- Customization and accessibility
  accessibility_settings jsonb DEFAULT '{}',
  notification_settings jsonb DEFAULT '{"email": true, "in_app": true}',
  preferred_language text DEFAULT 'en',
  
  -- Subscription (if applicable)
  subscription_tier text DEFAULT 'free',
  
  -- Security
  two_factor_enabled boolean DEFAULT false,
  two_factor_method text,
  google_oauth_id text,
  
  -- Audit
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  last_login timestamptz,
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_age CHECK (age IS NULL OR (age >= 5 AND age <= 18))
);

-- 2. Parent-Student Relationships Table
CREATE TABLE IF NOT EXISTS parent_student_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  relationship_type relationship_type NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(parent_id, student_id)
);

-- 3. Teacher-Student Assignments Table
CREATE TABLE IF NOT EXISTS teacher_student_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES user_profiles(id),
  assigned_date timestamptz DEFAULT now(),
  
  UNIQUE(teacher_id, student_id)
);

-- 4. Age Groups Table
CREATE TABLE IF NOT EXISTS age_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  min_age integer NOT NULL,
  max_age integer NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_age_range CHECK (min_age <= max_age)
);

-- Insert default age groups
INSERT INTO age_groups (name, min_age, max_age, description) VALUES
  ('Early Elementary (5-7)', 5, 7, 'Kindergarten through 2nd grade'),
  ('Upper Elementary (8-10)', 8, 10, '3rd through 5th grade'),
  ('Middle School (11-13)', 11, 13, '6th through 8th grade'),
  ('High School (14-18)', 14, 18, '9th through 12th grade')
ON CONFLICT (name) DO NOTHING;

-- 5. Educational Content Table
CREATE TABLE IF NOT EXISTS educational_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic info
  title text NOT NULL,
  description text,
  content_type content_type NOT NULL,
  content_url text,
  content_data jsonb,
  thumbnail_url text,
  
  -- Age targeting
  min_age integer NOT NULL,
  max_age integer NOT NULL,
  age_group_id uuid REFERENCES age_groups(id),
  
  -- Gamification
  xp_reward integer DEFAULT 50,
  estimated_duration integer DEFAULT 30,
  difficulty_level integer DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  
  -- Metadata
  tags text[] DEFAULT '{}',
  subject text,
  language text DEFAULT 'en',
  language_variants jsonb DEFAULT '{}',
  
  -- Versioning
  version_number integer DEFAULT 1,
  is_current_version boolean DEFAULT true,
  parent_content_id uuid REFERENCES educational_content(id),
  
  -- Status and scheduling
  status content_status DEFAULT 'draft',
  publish_date timestamptz,
  expire_date timestamptz,
  unlock_conditions jsonb DEFAULT '{}',
  
  -- Analytics
  view_count integer DEFAULT 0,
  completion_rate numeric DEFAULT 0,
  average_rating numeric DEFAULT 0,
  rating_count integer DEFAULT 0,
  
  -- Audit
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  published_date timestamptz,
  last_modified_by uuid REFERENCES user_profiles(id),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_age_range CHECK (min_age <= max_age),
  CONSTRAINT valid_difficulty CHECK (difficulty_level BETWEEN 1 AND 5)
);

-- 6. Content Version History Table
CREATE TABLE IF NOT EXISTS content_version_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES educational_content(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  modified_by uuid REFERENCES user_profiles(id),
  modified_date timestamptz DEFAULT now(),
  change_description text,
  content_snapshot jsonb,
  
  UNIQUE(content_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_content_version_history_content ON content_version_history(content_id);
CREATE INDEX IF NOT EXISTS idx_content_published ON educational_content(status, publish_date) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_content_age_range ON educational_content(min_age, max_age);
CREATE INDEX IF NOT EXISTS idx_content_tags ON educational_content USING gin(tags);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_student_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_student_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE age_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_version_history ENABLE ROW LEVEL SECURITY;

-- Create function to check user role
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS user_role AS $$
  SELECT role FROM user_profiles WHERE id = user_id;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS(SELECT 1 FROM user_profiles WHERE id = user_id AND role = 'super_admin');
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Create function to check if user is teacher or admin
CREATE OR REPLACE FUNCTION is_teacher_or_admin(user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS(SELECT 1 FROM user_profiles WHERE id = user_id AND role IN ('super_admin', 'teacher'));
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage all profiles"
  ON user_profiles FOR ALL
  TO authenticated
  USING (is_super_admin(auth.uid()))
  WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Parents can view their students' profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parent_student_relationships
      WHERE parent_id = auth.uid() AND student_id = user_profiles.id
    )
  );

CREATE POLICY "Teachers can view assigned students"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    is_teacher_or_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM teacher_student_assignments
      WHERE teacher_id = auth.uid() AND student_id = user_profiles.id
    )
  );

-- RLS Policies for relationships
CREATE POLICY "Parents can view own relationships"
  ON parent_student_relationships FOR SELECT
  TO authenticated
  USING (parent_id = auth.uid() OR student_id = auth.uid() OR is_super_admin(auth.uid()));

CREATE POLICY "Admins can manage relationships"
  ON parent_student_relationships FOR ALL
  TO authenticated
  USING (is_super_admin(auth.uid()))
  WITH CHECK (is_super_admin(auth.uid()));

-- RLS Policies for content
CREATE POLICY "Students can view published age-appropriate content"
  ON educational_content FOR SELECT
  TO authenticated
  USING (
    status = 'published' AND
    (SELECT age FROM user_profiles WHERE id = auth.uid()) BETWEEN min_age AND max_age AND
    (publish_date IS NULL OR publish_date <= now()) AND
    (expire_date IS NULL OR expire_date > now())
  );

CREATE POLICY "Teachers can manage own content"
  ON educational_content FOR ALL
  TO authenticated
  USING (created_by = auth.uid() OR is_super_admin(auth.uid()))
  WITH CHECK (created_by = auth.uid() OR is_super_admin(auth.uid()));

CREATE POLICY "Teaching staff can view all content"
  ON educational_content FOR SELECT
  TO authenticated
  USING (get_user_role(auth.uid()) IN ('teaching_staff', 'teacher', 'super_admin'));

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON educational_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(account_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_parent_student_parent ON parent_student_relationships(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_student ON parent_student_relationships(student_id);
CREATE INDEX IF NOT EXISTS idx_teacher_student_teacher ON teacher_student_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_student_student ON teacher_student_assignments(student_id);