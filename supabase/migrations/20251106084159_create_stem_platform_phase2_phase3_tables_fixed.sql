/*
  # STEM Platform - Phase 2 & 3 Essential Tables (Fixed)
  
  ## Tables Created
  
  ### Phase 2
  - Certificates
  - Content Ratings & Reviews
  - Parent Consent Forms
  - Resource Library
  - Student Portfolio
  - Learning Paths
  - Parental Controls
  - Notifications
  
  ### Phase 3 (Selected for MVP)
  - Study Groups
  - Events & Announcements
  - Analytics Cache
*/

DO $$ BEGIN
  CREATE TYPE consent_type AS ENUM ('data_usage', 'photo_video', 'external_links', 'communications');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM ('message', 'achievement', 'reminder', 'announcement', 'system');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE priority_level AS ENUM ('low', 'normal', 'high', 'urgent');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content_id uuid REFERENCES educational_content(id),
  course_name text NOT NULL,
  
  -- Certificate data
  issue_date date DEFAULT CURRENT_DATE,
  certificate_template text DEFAULT 'default',
  verification_code text UNIQUE NOT NULL,
  pdf_url text,
  
  -- Metadata
  achievement_description text,
  instructor_name text,
  
  created_at timestamptz DEFAULT now()
);

-- Content Ratings & Reviews Table
CREATE TABLE IF NOT EXISTS content_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES educational_content(id) ON DELETE CASCADE,
  
  -- Rating
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  was_helpful boolean,
  comment text,
  
  -- Moderation
  is_flagged boolean DEFAULT false,
  flag_reason text,
  helpful_count integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(student_id, content_id)
);

-- Parent Consent Forms Table
CREATE TABLE IF NOT EXISTS parent_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Consent details
  consent_type consent_type NOT NULL,
  is_signed boolean DEFAULT false,
  signature_timestamp timestamptz,
  digital_signature text,
  
  -- Document
  consent_text text NOT NULL,
  pdf_url text,
  
  -- Status
  is_required boolean DEFAULT true,
  can_revoke boolean DEFAULT true,
  revoked_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Resource Library Table
CREATE TABLE IF NOT EXISTS resource_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Resource info
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size_kb integer,
  
  -- Categorization
  resource_type text NOT NULL,
  subject text,
  age_group_id uuid REFERENCES age_groups(id),
  tags text[] DEFAULT '{}',
  
  -- Engagement
  download_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  average_rating numeric DEFAULT 0,
  
  -- Audit
  uploaded_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Student Portfolio Table
CREATE TABLE IF NOT EXISTS student_portfolio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content_id uuid REFERENCES educational_content(id) ON DELETE CASCADE,
  
  -- Portfolio item
  title text NOT NULL,
  description text,
  completion_score numeric,
  personal_note text,
  
  -- Display
  is_showcased boolean DEFAULT false,
  display_order integer DEFAULT 0,
  
  -- Attachments
  attachments text[] DEFAULT '{}',
  
  saved_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Learning Paths Table
CREATE TABLE IF NOT EXISTS learning_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Path info
  name text NOT NULL,
  description text,
  difficulty_level integer DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  
  -- Target audience
  age_group_id uuid REFERENCES age_groups(id),
  subject text,
  
  -- Content sequence (ordered array of content IDs)
  content_sequence uuid[] DEFAULT '{}',
  estimated_duration_hours integer,
  
  -- Prerequisites
  prerequisite_paths uuid[] DEFAULT '{}',
  
  -- Gamification
  total_xp_reward integer DEFAULT 0,
  completion_badge_id uuid REFERENCES badges(id),
  
  -- Status
  is_published boolean DEFAULT false,
  
  -- Audit
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Student Learning Path Progress
CREATE TABLE IF NOT EXISTS student_learning_path_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  learning_path_id uuid NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  
  -- Progress
  current_content_index integer DEFAULT 0,
  completed_content_ids uuid[] DEFAULT '{}',
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  
  -- Status
  is_completed boolean DEFAULT false,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  last_accessed timestamptz DEFAULT now(),
  
  UNIQUE(student_id, learning_path_id)
);

-- Parental Controls Table
CREATE TABLE IF NOT EXISTS parental_controls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,
  parent_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Time limits
  daily_time_limit_minutes integer DEFAULT 120,
  allowed_access_schedule jsonb DEFAULT '{"monday": {"start": "08:00", "end": "20:00"}}',
  
  -- Content restrictions
  restricted_content_types text[] DEFAULT '{}',
  max_difficulty_level integer DEFAULT 5,
  
  -- Emergency override
  emergency_override_enabled boolean DEFAULT false,
  emergency_override_until timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Notification content
  type notification_type NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  
  -- Links and actions
  action_url text,
  action_label text,
  
  -- Status
  is_read boolean DEFAULT false,
  read_at timestamptz,
  
  -- Delivery
  delivery_method text[] DEFAULT ARRAY['in_app'],
  email_sent boolean DEFAULT false,
  
  -- Priority
  priority priority_level DEFAULT 'normal',
  
  -- Metadata
  metadata jsonb DEFAULT '{}',
  
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Study Groups Table (Phase 3)
CREATE TABLE IF NOT EXISTS study_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Group info
  name text NOT NULL,
  description text,
  age_group_id uuid REFERENCES age_groups(id),
  
  -- Members
  member_ids uuid[] DEFAULT '{}',
  moderator_id uuid REFERENCES user_profiles(id),
  max_members integer DEFAULT 15,
  
  -- Settings
  is_chat_enabled boolean DEFAULT true,
  is_public boolean DEFAULT false,
  
  -- Status
  is_active boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Events & Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Announcement content
  title text NOT NULL,
  content text NOT NULL,
  announcement_type text DEFAULT 'general',
  
  -- Targeting
  target_audience text DEFAULT 'all',
  target_roles user_role[] DEFAULT '{}',
  target_age_group_ids uuid[] DEFAULT '{}',
  
  -- Priority
  priority priority_level DEFAULT 'normal',
  
  -- Scheduling
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  
  -- Tracking
  read_by uuid[] DEFAULT '{}',
  
  -- Audit
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Analytics Cache Table
CREATE TABLE IF NOT EXISTS analytics_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Metric info
  metric_name text NOT NULL,
  metric_scope text DEFAULT 'platform',
  scope_id uuid,
  
  -- Value
  metric_value jsonb NOT NULL,
  
  -- Timestamps
  calculated_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  
  UNIQUE(metric_name, metric_scope, scope_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_certificates_student ON certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_verification ON certificates(verification_code);
CREATE INDEX IF NOT EXISTS idx_content_ratings_content ON content_ratings(content_id);
CREATE INDEX IF NOT EXISTS idx_content_ratings_student ON content_ratings(student_id);
CREATE INDEX IF NOT EXISTS idx_parent_consents_parent ON parent_consents(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_consents_student ON parent_consents(student_id);
CREATE INDEX IF NOT EXISTS idx_resource_library_tags ON resource_library USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_student_portfolio_student ON student_portfolio(student_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_age_group ON learning_paths(age_group_id);
CREATE INDEX IF NOT EXISTS idx_student_lp_progress_student ON student_learning_path_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_parental_controls_student ON parental_controls(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_study_groups_age_group ON study_groups(age_group_id);
CREATE INDEX IF NOT EXISTS idx_announcements_dates ON announcements(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_analytics_cache_metric ON analytics_cache(metric_name, metric_scope);

-- Enable RLS
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_learning_path_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE parental_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies for certificates
CREATE POLICY "Students can view own certificates"
  ON certificates FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Parents can view their students certificates"
  ON certificates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parent_student_relationships
      WHERE parent_id = auth.uid() AND student_id = certificates.student_id
    )
  );

CREATE POLICY "Teachers can issue certificates"
  ON certificates FOR INSERT
  TO authenticated
  WITH CHECK (is_teacher_or_admin(auth.uid()));

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (is_teacher_or_admin(auth.uid()));

-- RLS Policies for resource library
CREATE POLICY "Teachers can view all resources"
  ON resource_library FOR SELECT
  TO authenticated
  USING (get_user_role(auth.uid()) IN ('teacher', 'teaching_staff', 'super_admin'));

CREATE POLICY "Teachers can upload resources"
  ON resource_library FOR INSERT
  TO authenticated
  WITH CHECK (get_user_role(auth.uid()) IN ('teacher', 'super_admin'));

-- RLS Policies for portfolio
CREATE POLICY "Students can manage own portfolio"
  ON student_portfolio FOR ALL
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Parents can view their students portfolio"
  ON student_portfolio FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parent_student_relationships
      WHERE parent_id = auth.uid() AND student_id = student_portfolio.student_id
    )
  );

-- RLS Policies for learning paths
CREATE POLICY "Everyone can view published learning paths"
  ON learning_paths FOR SELECT
  TO authenticated
  USING (is_published = true OR is_teacher_or_admin(auth.uid()));

CREATE POLICY "Teachers can manage learning paths"
  ON learning_paths FOR ALL
  TO authenticated
  USING (is_teacher_or_admin(auth.uid()))
  WITH CHECK (is_teacher_or_admin(auth.uid()));

-- RLS Policies for announcements
CREATE POLICY "Users can view active announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (
    now() BETWEEN start_date AND COALESCE(end_date, now() + interval '100 years')
  );

CREATE POLICY "Admins can manage announcements"
  ON announcements FOR ALL
  TO authenticated
  USING (is_super_admin(auth.uid()))
  WITH CHECK (is_super_admin(auth.uid()));

-- Insert sample badges
INSERT INTO badges (name, description, category, criteria, xp_value, rarity_level) VALUES
  ('First Steps', 'Complete your first lesson', 'milestone', '{"lessons_completed": 1}', 50, 1),
  ('Quick Learner', 'Complete 10 lessons', 'achievement', '{"lessons_completed": 10}', 100, 2),
  ('STEM Master', 'Complete 50 lessons', 'achievement', '{"lessons_completed": 50}', 500, 4),
  ('Perfect Score', 'Get 100% on a quiz', 'mastery', '{"perfect_quiz": true}', 100, 3),
  ('7-Day Streak', 'Login 7 days in a row', 'streak', '{"streak_days": 7}', 150, 2),
  ('XP Champion', 'Earn 1000 XP', 'achievement', '{"total_xp": 1000}', 200, 3),
  ('Early Bird', 'Complete a lesson before 9 AM', 'achievement', '{"early_completion": true}', 75, 2)
ON CONFLICT (name) DO NOTHING;

-- Update triggers
CREATE TRIGGER update_resource_library_updated_at BEFORE UPDATE ON resource_library
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON learning_paths
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parent_consents_updated_at BEFORE UPDATE ON parent_consents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();