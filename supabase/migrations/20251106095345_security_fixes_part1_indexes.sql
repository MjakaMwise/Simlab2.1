/*
  # Security Fixes Part 1: Foreign Key Indexes
  
  Add 25 missing foreign key indexes for optimal query performance
*/

CREATE INDEX IF NOT EXISTS idx_announcements_created_by ON public.announcements(created_by);
CREATE INDEX IF NOT EXISTS idx_attendance_content_id ON public.attendance_records(content_id);
CREATE INDEX IF NOT EXISTS idx_attendance_marked_by ON public.attendance_records(marked_by);
CREATE INDEX IF NOT EXISTS idx_certificates_content_id ON public.certificates(content_id);
CREATE INDEX IF NOT EXISTS idx_content_version_modified_by ON public.content_version_history(modified_by);
CREATE INDEX IF NOT EXISTS idx_conversations_student_id ON public.conversations(student_id);
CREATE INDEX IF NOT EXISTS idx_conversations_teacher_admin_id ON public.conversations(teacher_or_admin_id);
CREATE INDEX IF NOT EXISTS idx_educational_content_age_group ON public.educational_content(age_group_id);
CREATE INDEX IF NOT EXISTS idx_educational_content_created_by ON public.educational_content(created_by);
CREATE INDEX IF NOT EXISTS idx_educational_content_modified_by ON public.educational_content(last_modified_by);
CREATE INDEX IF NOT EXISTS idx_educational_content_parent_id ON public.educational_content(parent_content_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_badge_id ON public.learning_paths(completion_badge_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_created_by ON public.learning_paths(created_by);
CREATE INDEX IF NOT EXISTS idx_parental_controls_parent_id ON public.parental_controls(parent_id);
CREATE INDEX IF NOT EXISTS idx_resource_library_age_group ON public.resource_library(age_group_id);
CREATE INDEX IF NOT EXISTS idx_resource_library_uploaded_by ON public.resource_library(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_student_assessments_content_id ON public.student_assessments(content_id);
CREATE INDEX IF NOT EXISTS idx_student_assessments_teacher_id ON public.student_assessments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_student_badge_awards_badge_id ON public.student_badge_awards(badge_id);
CREATE INDEX IF NOT EXISTS idx_student_goals_created_by ON public.student_goals(created_by);
CREATE INDEX IF NOT EXISTS idx_student_lp_progress_path_id ON public.student_learning_path_progress(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_student_portfolio_content_id ON public.student_portfolio(content_id);
CREATE INDEX IF NOT EXISTS idx_study_groups_moderator_id ON public.study_groups(moderator_id);
CREATE INDEX IF NOT EXISTS idx_teacher_student_assigned_by ON public.teacher_student_assignments(assigned_by);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_by ON public.user_profiles(created_by);
