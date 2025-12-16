/*
  # Security Fixes Part 4: Add Missing RLS Policies
  
  Add policies for tables that have RLS enabled but no policies
*/

-- age_groups
CREATE POLICY "Everyone can view age groups" ON public.age_groups FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage age groups" ON public.age_groups FOR ALL TO authenticated USING (is_super_admin((select auth.uid()))) WITH CHECK (is_super_admin((select auth.uid())));

-- analytics_cache
CREATE POLICY "Admins can view analytics" ON public.analytics_cache FOR SELECT TO authenticated USING (is_super_admin((select auth.uid())));
CREATE POLICY "System can update analytics" ON public.analytics_cache FOR ALL TO authenticated USING (is_super_admin((select auth.uid()))) WITH CHECK (is_super_admin((select auth.uid())));

-- attendance_records
CREATE POLICY "Teachers can manage attendance" ON public.attendance_records FOR ALL TO authenticated USING (is_teacher_or_admin((select auth.uid()))) WITH CHECK (is_teacher_or_admin((select auth.uid())));
CREATE POLICY "Students can view own attendance" ON public.attendance_records FOR SELECT TO authenticated USING (student_id = (select auth.uid()));
CREATE POLICY "Parents can view children attendance" ON public.attendance_records FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM parent_student_relationships WHERE parent_id = (select auth.uid()) AND student_id = attendance_records.student_id));

-- content_ratings
CREATE POLICY "Students can rate content" ON public.content_ratings FOR INSERT TO authenticated WITH CHECK (student_id = (select auth.uid()) AND get_user_role((select auth.uid())) = 'student');
CREATE POLICY "Students can view all ratings" ON public.content_ratings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Students can update own ratings" ON public.content_ratings FOR UPDATE TO authenticated USING (student_id = (select auth.uid())) WITH CHECK (student_id = (select auth.uid()));

-- content_version_history
CREATE POLICY "Teachers can view content history" ON public.content_version_history FOR SELECT TO authenticated USING (is_teacher_or_admin((select auth.uid())));

-- conversations
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT TO authenticated USING (student_id = (select auth.uid()) OR teacher_or_admin_id = (select auth.uid()) OR EXISTS (SELECT 1 FROM parent_student_relationships WHERE parent_id = (select auth.uid()) AND student_id = conversations.student_id));
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT TO authenticated WITH CHECK (student_id = (select auth.uid()) OR teacher_or_admin_id = (select auth.uid()));

-- parent_consents
CREATE POLICY "Parents can view own consents" ON public.parent_consents FOR SELECT TO authenticated USING (parent_id = (select auth.uid()));
CREATE POLICY "Parents can manage own consents" ON public.parent_consents FOR ALL TO authenticated USING (parent_id = (select auth.uid())) WITH CHECK (parent_id = (select auth.uid()));
CREATE POLICY "Admins can view all consents" ON public.parent_consents FOR SELECT TO authenticated USING (is_super_admin((select auth.uid())));

-- parental_controls
CREATE POLICY "Parents can manage own controls" ON public.parental_controls FOR ALL TO authenticated USING (parent_id = (select auth.uid())) WITH CHECK (parent_id = (select auth.uid()));

-- student_assessments
CREATE POLICY "Students can view own assessments" ON public.student_assessments FOR SELECT TO authenticated USING (student_id = (select auth.uid()));
CREATE POLICY "Teachers can manage assessments" ON public.student_assessments FOR ALL TO authenticated USING (is_teacher_or_admin((select auth.uid()))) WITH CHECK (is_teacher_or_admin((select auth.uid())));
CREATE POLICY "Parents can view children assessments" ON public.student_assessments FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM parent_student_relationships WHERE parent_id = (select auth.uid()) AND student_id = student_assessments.student_id));

-- student_goals
CREATE POLICY "Students can manage own goals" ON public.student_goals FOR ALL TO authenticated USING (student_id = (select auth.uid())) WITH CHECK (student_id = (select auth.uid()));
CREATE POLICY "Teachers can view student goals" ON public.student_goals FOR SELECT TO authenticated USING (is_teacher_or_admin((select auth.uid())));
CREATE POLICY "Parents can view children goals" ON public.student_goals FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM parent_student_relationships WHERE parent_id = (select auth.uid()) AND student_id = student_goals.student_id));

-- student_learning_path_progress
CREATE POLICY "Students can manage own learning path progress" ON public.student_learning_path_progress FOR ALL TO authenticated USING (student_id = (select auth.uid())) WITH CHECK (student_id = (select auth.uid()));
CREATE POLICY "Teachers can view learning path progress" ON public.student_learning_path_progress FOR SELECT TO authenticated USING (is_teacher_or_admin((select auth.uid())));
CREATE POLICY "Parents can view children learning paths" ON public.student_learning_path_progress FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM parent_student_relationships WHERE parent_id = (select auth.uid()) AND student_id = student_learning_path_progress.student_id));

-- study_groups
CREATE POLICY "Teachers can manage study groups" ON public.study_groups FOR ALL TO authenticated USING (is_teacher_or_admin((select auth.uid()))) WITH CHECK (is_teacher_or_admin((select auth.uid())));
CREATE POLICY "Moderators can view groups" ON public.study_groups FOR SELECT TO authenticated USING (moderator_id = (select auth.uid()));

-- teacher_student_assignments
CREATE POLICY "Teachers can view own assignments" ON public.teacher_student_assignments FOR SELECT TO authenticated USING (teacher_id = (select auth.uid()));
CREATE POLICY "Admins can manage assignments" ON public.teacher_student_assignments FOR ALL TO authenticated USING (is_super_admin((select auth.uid()))) WITH CHECK (is_super_admin((select auth.uid())));
CREATE POLICY "Students can view own teacher" ON public.teacher_student_assignments FOR SELECT TO authenticated USING (student_id = (select auth.uid()));
