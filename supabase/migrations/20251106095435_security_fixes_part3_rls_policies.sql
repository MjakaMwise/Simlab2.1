/*
  # Security Fixes Part 3: Optimize RLS Policies
  
  Replace auth.uid() with (select auth.uid()) for better performance
*/

-- user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Parents can view their students' profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Teachers can view assigned students" ON public.user_profiles;
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON public.user_profiles;

CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT TO authenticated USING ((select auth.uid()) = id);
CREATE POLICY "Parents can view their students' profiles" ON public.user_profiles FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM parent_student_relationships WHERE parent_id = (select auth.uid()) AND student_id = user_profiles.id));
CREATE POLICY "Teachers can view assigned students" ON public.user_profiles FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM teacher_student_assignments WHERE teacher_id = (select auth.uid()) AND student_id = user_profiles.id));
CREATE POLICY "Super admins can manage all profiles" ON public.user_profiles FOR ALL TO authenticated USING (get_user_role((select auth.uid())) = 'super_admin') WITH CHECK (get_user_role((select auth.uid())) = 'super_admin');

-- parent_student_relationships
DROP POLICY IF EXISTS "Parents can view own relationships" ON public.parent_student_relationships;
DROP POLICY IF EXISTS "Admins can manage relationships" ON public.parent_student_relationships;

CREATE POLICY "Parents can view own relationships" ON public.parent_student_relationships FOR SELECT TO authenticated USING (parent_id = (select auth.uid()));
CREATE POLICY "Admins can manage relationships" ON public.parent_student_relationships FOR ALL TO authenticated USING (is_super_admin((select auth.uid()))) WITH CHECK (is_super_admin((select auth.uid())));

-- educational_content
DROP POLICY IF EXISTS "Students can view published age-appropriate content" ON public.educational_content;
DROP POLICY IF EXISTS "Teachers can manage own content" ON public.educational_content;
DROP POLICY IF EXISTS "Teaching staff can view all content" ON public.educational_content;

CREATE POLICY "Students can view published age-appropriate content" ON public.educational_content FOR SELECT TO authenticated USING (status = 'published' AND get_user_role((select auth.uid())) = 'student');
CREATE POLICY "Teachers can manage own content" ON public.educational_content FOR ALL TO authenticated USING (created_by = (select auth.uid())) WITH CHECK (created_by = (select auth.uid()));
CREATE POLICY "Teaching staff can view all content" ON public.educational_content FOR SELECT TO authenticated USING (get_user_role((select auth.uid())) IN ('teaching_staff', 'teacher', 'super_admin'));

-- student_content_progress
DROP POLICY IF EXISTS "Students can view own progress" ON public.student_content_progress;
DROP POLICY IF EXISTS "Students can update own progress" ON public.student_content_progress;
DROP POLICY IF EXISTS "Students can modify own progress" ON public.student_content_progress;
DROP POLICY IF EXISTS "Students can insert own progress" ON public.student_content_progress;
DROP POLICY IF EXISTS "Parents can view their students progress" ON public.student_content_progress;
DROP POLICY IF EXISTS "Teachers can view assigned students progress" ON public.student_content_progress;

CREATE POLICY "Students can view own progress" ON public.student_content_progress FOR SELECT TO authenticated USING (student_id = (select auth.uid()));
CREATE POLICY "Students can update own progress" ON public.student_content_progress FOR UPDATE TO authenticated USING (student_id = (select auth.uid())) WITH CHECK (student_id = (select auth.uid()));
CREATE POLICY "Students can insert own progress" ON public.student_content_progress FOR INSERT TO authenticated WITH CHECK (student_id = (select auth.uid()));
CREATE POLICY "Parents can view their students progress" ON public.student_content_progress FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM parent_student_relationships WHERE parent_id = (select auth.uid()) AND student_id = student_content_progress.student_id));
CREATE POLICY "Teachers can view assigned students progress" ON public.student_content_progress FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM teacher_student_assignments WHERE teacher_id = (select auth.uid()) AND student_id = student_content_progress.student_id));

-- student_gamification
DROP POLICY IF EXISTS "Students can view own gamification data" ON public.student_gamification;
DROP POLICY IF EXISTS "Students can update own gamification" ON public.student_gamification;
DROP POLICY IF EXISTS "Parents can view their students gamification" ON public.student_gamification;
DROP POLICY IF EXISTS "Teachers and admins can view all gamification" ON public.student_gamification;

CREATE POLICY "Students can view own gamification data" ON public.student_gamification FOR SELECT TO authenticated USING (student_id = (select auth.uid()));
CREATE POLICY "Students can update own gamification" ON public.student_gamification FOR UPDATE TO authenticated USING (student_id = (select auth.uid())) WITH CHECK (student_id = (select auth.uid()));
CREATE POLICY "Parents can view their students gamification" ON public.student_gamification FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM parent_student_relationships WHERE parent_id = (select auth.uid()) AND student_id = student_gamification.student_id));
CREATE POLICY "Teachers and admins can view all gamification" ON public.student_gamification FOR SELECT TO authenticated USING (is_teacher_or_admin((select auth.uid())));

-- badges
DROP POLICY IF EXISTS "Admins can manage badges" ON public.badges;
CREATE POLICY "Admins can manage badges" ON public.badges FOR ALL TO authenticated USING (is_super_admin((select auth.uid()))) WITH CHECK (is_super_admin((select auth.uid())));

-- student_badge_awards
DROP POLICY IF EXISTS "Students can view own badges" ON public.student_badge_awards;
DROP POLICY IF EXISTS "Parents can view their students badges" ON public.student_badge_awards;
DROP POLICY IF EXISTS "System can award badges" ON public.student_badge_awards;

CREATE POLICY "Students can view own badges" ON public.student_badge_awards FOR SELECT TO authenticated USING (student_id = (select auth.uid()));
CREATE POLICY "Parents can view their students badges" ON public.student_badge_awards FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM parent_student_relationships WHERE parent_id = (select auth.uid()) AND student_id = student_badge_awards.student_id));
CREATE POLICY "System can award badges" ON public.student_badge_awards FOR INSERT TO authenticated WITH CHECK (is_teacher_or_admin((select auth.uid())));

-- messages
DROP POLICY IF EXISTS "Users can view their messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update own messages" ON public.messages;

CREATE POLICY "Users can view their messages" ON public.messages FOR SELECT TO authenticated USING (sender_id = (select auth.uid()) OR recipient_id = (select auth.uid()));
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (sender_id = (select auth.uid()));
CREATE POLICY "Users can update own messages" ON public.messages FOR UPDATE TO authenticated USING (sender_id = (select auth.uid()) OR recipient_id = (select auth.uid())) WITH CHECK (sender_id = (select auth.uid()) OR recipient_id = (select auth.uid()));

-- audit_logs
DROP POLICY IF EXISTS "Super admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Super admins can view audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (is_super_admin((select auth.uid())));

-- certificates
DROP POLICY IF EXISTS "Students can view own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Parents can view their students certificates" ON public.certificates;
DROP POLICY IF EXISTS "Teachers can issue certificates" ON public.certificates;

CREATE POLICY "Students can view own certificates" ON public.certificates FOR SELECT TO authenticated USING (student_id = (select auth.uid()));
CREATE POLICY "Parents can view their students certificates" ON public.certificates FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM parent_student_relationships WHERE parent_id = (select auth.uid()) AND student_id = certificates.student_id));
CREATE POLICY "Teachers can issue certificates" ON public.certificates FOR INSERT TO authenticated WITH CHECK (is_teacher_or_admin((select auth.uid())));

-- resource_library
DROP POLICY IF EXISTS "Teachers can view all resources" ON public.resource_library;
DROP POLICY IF EXISTS "Teachers can upload resources" ON public.resource_library;

CREATE POLICY "Teachers can view all resources" ON public.resource_library FOR SELECT TO authenticated USING (is_teacher_or_admin((select auth.uid())));
CREATE POLICY "Teachers can upload resources" ON public.resource_library FOR INSERT TO authenticated WITH CHECK (is_teacher_or_admin((select auth.uid())));

-- student_portfolio
DROP POLICY IF EXISTS "Students can manage own portfolio" ON public.student_portfolio;
DROP POLICY IF EXISTS "Parents can view their students portfolio" ON public.student_portfolio;

CREATE POLICY "Students can manage own portfolio" ON public.student_portfolio FOR ALL TO authenticated USING (student_id = (select auth.uid())) WITH CHECK (student_id = (select auth.uid()));
CREATE POLICY "Parents can view their students portfolio" ON public.student_portfolio FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM parent_student_relationships WHERE parent_id = (select auth.uid()) AND student_id = student_portfolio.student_id));

-- learning_paths
DROP POLICY IF EXISTS "Everyone can view published learning paths" ON public.learning_paths;
DROP POLICY IF EXISTS "Teachers can manage learning paths" ON public.learning_paths;

CREATE POLICY "Everyone can view published learning paths" ON public.learning_paths FOR SELECT TO authenticated USING (is_published = true OR is_teacher_or_admin((select auth.uid())));
CREATE POLICY "Teachers can manage learning paths" ON public.learning_paths FOR ALL TO authenticated USING (is_teacher_or_admin((select auth.uid()))) WITH CHECK (is_teacher_or_admin((select auth.uid())));

-- notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = (select auth.uid()));
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

-- announcements
DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;
CREATE POLICY "Admins can manage announcements" ON public.announcements FOR ALL TO authenticated USING (is_super_admin((select auth.uid()))) WITH CHECK (is_super_admin((select auth.uid())));
