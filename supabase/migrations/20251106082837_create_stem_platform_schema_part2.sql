/*
  # STEM Education Platform - Database Schema (Part 2)
  
  ## Tables Created
  
  ### 7. Student Progress Tracking
  Individual student interaction with content
  
  ### 8. Student Gamification
  XP, levels, streaks, leaderboard data
  
  ### 9. Badges System
  Available badges and student awards
  
  ### 10. Messaging System
  Parent-teacher-admin communication
  
  ### 11. Audit Logs
  System-wide action tracking
  
  ### 12. Attendance Records
  Session attendance tracking
  
  ### 13. Student Assessments & Feedback
  Teacher feedback on student work
  
  ### 14. Student Goals & Milestones
  Custom goals set by teachers/parents
*/

DO $$ BEGIN
  CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE message_status AS ENUM ('sent', 'read', 'archived');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE conversation_type AS ENUM ('parent_teacher', 'parent_admin', 'support');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE goal_status AS ENUM ('active', 'completed', 'expired');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE badge_category AS ENUM ('achievement', 'milestone', 'streak', 'mastery', 'event');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 7. Student Progress Tracking Table
CREATE TABLE IF NOT EXISTS student_content_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES educational_content(id) ON DELETE CASCADE,
  
  -- Progress data
  status progress_status DEFAULT 'not_started',
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  
  -- Quiz/assessment data
  score_achieved numeric,
  max_possible_score numeric,
  attempts_count integer DEFAULT 0,
  
  -- Time tracking
  time_spent_seconds integer DEFAULT 0,
  
  -- Timestamps
  started_at timestamptz,
  completed_at timestamptz,
  last_accessed timestamptz DEFAULT now(),
  
  -- Offline sync
  sync_status text DEFAULT 'synced',
  last_synced_at timestamptz DEFAULT now(),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(student_id, content_id)
);

-- 8. Student Gamification Table
CREATE TABLE IF NOT EXISTS student_gamification (
  student_id uuid PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- XP and levels
  total_xp integer DEFAULT 0,
  current_level integer DEFAULT 1,
  xp_for_next_level integer DEFAULT 100,
  
  -- Engagement metrics
  total_time_spent_seconds integer DEFAULT 0,
  lessons_completed integer DEFAULT 0,
  quizzes_completed integer DEFAULT 0,
  
  -- Streaks
  current_streak_days integer DEFAULT 0,
  longest_streak_days integer DEFAULT 0,
  last_activity_date date,
  
  -- Leaderboard
  current_rank integer,
  seasonal_rank integer,
  
  -- Virtual currency
  currency_balance integer DEFAULT 0,
  
  -- Daily bonuses
  last_daily_bonus_date date,
  daily_bonus_streak integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 9. Badges Table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  category badge_category NOT NULL,
  
  -- Criteria for earning (JSON: e.g., {"xp_threshold": 1000})
  criteria jsonb NOT NULL DEFAULT '{}',
  
  -- Display
  icon_url text,
  xp_value integer DEFAULT 0,
  rarity_level integer DEFAULT 1 CHECK (rarity_level BETWEEN 1 AND 5),
  
  -- Event badges
  is_limited_time boolean DEFAULT false,
  available_from timestamptz,
  available_until timestamptz,
  is_seasonal boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_rarity CHECK (rarity_level BETWEEN 1 AND 5)
);

-- 10. Student Badge Awards Table
CREATE TABLE IF NOT EXISTS student_badge_awards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_date timestamptz DEFAULT now(),
  is_showcased boolean DEFAULT false,
  
  UNIQUE(student_id, badge_id)
);

-- 11. Conversations Table (for grouping messages)
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Participants
  parent_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  teacher_or_admin_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  student_id uuid REFERENCES user_profiles(id),
  
  -- Metadata
  conversation_type conversation_type NOT NULL,
  last_message_date timestamptz DEFAULT now(),
  unread_count integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(parent_id, teacher_or_admin_id, student_id)
);

-- 12. Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  
  -- Message data
  sender_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  subject text,
  content text NOT NULL,
  
  -- Status
  status message_status DEFAULT 'sent',
  read_at timestamptz,
  
  -- Attachments
  attachments text[] DEFAULT '{}',
  
  -- Metadata
  is_parent_message boolean DEFAULT false,
  scheduled_send_at timestamptz,
  is_template boolean DEFAULT false,
  
  sent_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- 13. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Actor
  user_id uuid REFERENCES user_profiles(id),
  user_role user_role,
  
  -- Action
  action_type text NOT NULL,
  table_affected text,
  record_id uuid,
  
  -- Changes
  old_value jsonb,
  new_value jsonb,
  
  -- Context
  ip_address inet,
  user_agent text,
  
  timestamp timestamptz DEFAULT now(),
  
  -- Metadata
  metadata jsonb DEFAULT '{}'
);

-- 14. Attendance Records Table
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Session info
  session_id uuid,
  session_date date NOT NULL,
  session_name text,
  content_id uuid REFERENCES educational_content(id),
  
  -- Attendance
  status attendance_status NOT NULL,
  marked_by uuid REFERENCES user_profiles(id),
  marked_at timestamptz DEFAULT now(),
  
  -- Notes
  notes text,
  
  created_at timestamptz DEFAULT now()
);

-- 15. Student Assessments & Feedback Table
CREATE TABLE IF NOT EXISTS student_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content_id uuid REFERENCES educational_content(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES user_profiles(id),
  
  -- Feedback
  feedback_text text NOT NULL,
  rating integer CHECK (rating BETWEEN 1 AND 5),
  emoji_reaction text,
  
  -- Visibility
  visible_to_parent boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 16. Student Goals & Milestones Table
CREATE TABLE IF NOT EXISTS student_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Goal details
  goal_description text NOT NULL,
  target_metric text NOT NULL,
  target_value numeric NOT NULL,
  current_value numeric DEFAULT 0,
  
  -- Status
  status goal_status DEFAULT 'active',
  deadline date,
  
  -- Audit
  created_by uuid REFERENCES user_profiles(id),
  completed_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_progress_student ON student_content_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_content ON student_content_progress(content_id);
CREATE INDEX IF NOT EXISTS idx_progress_status ON student_content_progress(status);
CREATE INDEX IF NOT EXISTS idx_gamification_xp ON student_gamification(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_gamification_level ON student_gamification(current_level DESC);
CREATE INDEX IF NOT EXISTS idx_badge_awards_student ON student_badge_awards(student_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(session_date);
CREATE INDEX IF NOT EXISTS idx_assessments_student ON student_assessments(student_id);
CREATE INDEX IF NOT EXISTS idx_goals_student ON student_goals(student_id);

-- Enable RLS
ALTER TABLE student_content_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_badge_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for student_content_progress
CREATE POLICY "Students can view own progress"
  ON student_content_progress FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can update own progress"
  ON student_content_progress FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can modify own progress"
  ON student_content_progress FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Teachers can view assigned students progress"
  ON student_content_progress FOR SELECT
  TO authenticated
  USING (
    is_teacher_or_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM teacher_student_assignments
      WHERE teacher_id = auth.uid() AND student_id = student_content_progress.student_id
    )
  );

CREATE POLICY "Parents can view their students progress"
  ON student_content_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parent_student_relationships
      WHERE parent_id = auth.uid() AND student_id = student_content_progress.student_id
    )
  );

-- RLS Policies for student_gamification
CREATE POLICY "Students can view own gamification data"
  ON student_gamification FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can update own gamification"
  ON student_gamification FOR ALL
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Teachers and admins can view all gamification"
  ON student_gamification FOR SELECT
  TO authenticated
  USING (is_teacher_or_admin(auth.uid()));

CREATE POLICY "Parents can view their students gamification"
  ON student_gamification FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parent_student_relationships
      WHERE parent_id = auth.uid() AND student_id = student_gamification.student_id
    )
  );

-- RLS Policies for badges
CREATE POLICY "Everyone can view badges"
  ON badges FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage badges"
  ON badges FOR ALL
  TO authenticated
  USING (is_super_admin(auth.uid()))
  WITH CHECK (is_super_admin(auth.uid()));

-- RLS Policies for student_badge_awards
CREATE POLICY "Students can view own badges"
  ON student_badge_awards FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Parents can view their students badges"
  ON student_badge_awards FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parent_student_relationships
      WHERE parent_id = auth.uid() AND student_id = student_badge_awards.student_id
    )
  );

CREATE POLICY "System can award badges"
  ON student_badge_awards FOR INSERT
  TO authenticated
  WITH CHECK (is_teacher_or_admin(auth.uid()) OR student_id = auth.uid());

-- RLS Policies for messages
CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid() OR is_super_admin(auth.uid()));

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid())
  WITH CHECK (sender_id = auth.uid() OR recipient_id = auth.uid());

-- RLS Policies for audit_logs
CREATE POLICY "Super admins can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (is_super_admin(auth.uid()));

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Update triggers
CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON student_content_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gamification_updated_at BEFORE UPDATE ON student_gamification
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON student_assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON student_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();