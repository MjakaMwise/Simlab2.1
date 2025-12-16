// STEM Education Platform - Type Definitions

export type UserRole = 'super_admin' | 'teacher' | 'teaching_staff' | 'student' | 'parent';
export type AccountStatus = 'pending_approval' | 'active' | 'suspended' | 'archived';
export type ContentType = 'lesson' | 'quiz' | 'game' | 'video' | 'interactive';
export type ContentStatus = 'draft' | 'published' | 'archived';
export type RelationshipType = 'mother' | 'father' | 'guardian' | 'other';
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';
export type BadgeCategory = 'achievement' | 'milestone' | 'streak' | 'mastery' | 'event';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  account_status: AccountStatus;
  phone?: string;
  avatar_url?: string;

  // Student-specific
  date_of_birth?: string;
  age?: number;
  theme_color?: string;
  banner_url?: string;
  bio?: string;
  display_name?: string;
  profile_visibility?: string;

  // Settings
  accessibility_settings?: Record<string, any>;
  notification_settings?: Record<string, any>;
  preferred_language?: string;
  subscription_tier?: string;

  // Security
  two_factor_enabled?: boolean;
  two_factor_method?: string;
  google_oauth_id?: string;

  // Audit
  created_by?: string;
  created_at?: string;
  last_login?: string;
  updated_at?: string;
}

export interface ParentStudentRelationship {
  id: string;
  parent_id: string;
  student_id: string;
  relationship_type: RelationshipType;
  created_at: string;
}

export interface TeacherStudentAssignment {
  id: string;
  teacher_id: string;
  student_id: string;
  assigned_by?: string;
  assigned_date: string;
}

export interface AgeGroup {
  id: string;
  name: string;
  min_age: number;
  max_age: number;
  description?: string;
  created_at: string;
}

export interface EducationalContent {
  id: string;
  title: string;
  description?: string;
  content_type: ContentType;
  content_url?: string;
  content_data?: Record<string, any>;
  thumbnail_url?: string;

  // Age targeting
  min_age: number;
  max_age: number;
  age_group_id?: string;

  // Gamification
  xp_reward: number;
  estimated_duration: number;
  difficulty_level: number;

  // Metadata
  tags: string[];
  subject?: string;
  language: string;
  language_variants?: Record<string, any>;

  // Versioning
  version_number: number;
  is_current_version: boolean;
  parent_content_id?: string;

  // Status
  status: ContentStatus;
  publish_date?: string;
  expire_date?: string;
  unlock_conditions?: Record<string, any>;

  // Analytics
  view_count: number;
  completion_rate: number;
  average_rating: number;
  rating_count: number;

  // Audit
  created_by?: string;
  created_at: string;
  published_date?: string;
  last_modified_by?: string;
  updated_at: string;
}

export interface StudentContentProgress {
  id: string;
  student_id: string;
  content_id: string;
  status: ProgressStatus;
  progress_percentage: number;
  score_achieved?: number;
  max_possible_score?: number;
  attempts_count: number;
  time_spent_seconds: number;
  started_at?: string;
  completed_at?: string;
  last_accessed: string;
  sync_status: string;
  last_synced_at: string;
  created_at: string;
  updated_at: string;
}

export interface StudentGamification {
  student_id: string;
  total_xp: number;
  current_level: number;
  xp_for_next_level: number;
  total_time_spent_seconds: number;
  lessons_completed: number;
  quizzes_completed: number;
  current_streak_days: number;
  longest_streak_days: number;
  last_activity_date?: string;
  current_rank?: number;
  seasonal_rank?: number;
  currency_balance: number;
  last_daily_bonus_date?: string;
  daily_bonus_streak: number;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  criteria: Record<string, any>;
  icon_url?: string;
  xp_value: number;
  rarity_level: number;
  is_limited_time: boolean;
  available_from?: string;
  available_until?: string;
  is_seasonal: boolean;
  created_at: string;
}

export interface StudentBadgeAward {
  id: string;
  student_id: string;
  badge_id: string;
  earned_date: string;
  is_showcased: boolean;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  subject?: string;
  content: string;
  status: 'sent' | 'read' | 'archived';
  read_at?: string;
  attachments: string[];
  is_parent_message: boolean;
  scheduled_send_at?: string;
  is_template: boolean;
  sent_date: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'message' | 'achievement' | 'reminder' | 'announcement' | 'system';
  title: string;
  content: string;
  action_url?: string;
  action_label?: string;
  is_read: boolean;
  read_at?: string;
  delivery_method: string[];
  email_sent: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  metadata: Record<string, any>;
  created_at: string;
  expires_at?: string;
}

export interface Certificate {
  id: string;
  student_id: string;
  content_id?: string;
  course_name: string;
  issue_date: string;
  certificate_template: string;
  verification_code: string;
  pdf_url?: string;
  achievement_description?: string;
  instructor_name?: string;
  created_at: string;
}

export interface LearningPath {
  id: string;
  name: string;
  description?: string;
  difficulty_level: number;
  age_group_id?: string;
  subject?: string;
  content_sequence: string[];
  estimated_duration_hours?: number;
  prerequisite_paths: string[];
  total_xp_reward: number;
  completion_badge_id?: string;
  is_published: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// Registration form interfaces
export interface StudentRegistrationForm {
  student: {
    full_name: string;
    email: string;
    password: string;
    date_of_birth: string;
    age: number;
  };
  parents: Array<{
    full_name: string;
    email: string;
    phone: string;
    relationship_type: RelationshipType;
  }>;
}

export interface DashboardStats {
  totalStudents?: number;
  totalContent?: number;
  totalXP?: number;
  currentStreak?: number;
  completedLessons?: number;
  averageScore?: number;
  badges?: number;
  rank?: number;
}
