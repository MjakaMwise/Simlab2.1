import { supabase } from '../supabase';
import type { EducationalContent, StudentContentProgress } from '../types';

export const contentService = {
  // Get age-appropriate published content for student
  async getContentForStudent(studentId: string) {
    try {
      // Get student's age
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('age')
        .eq('id', studentId)
        .single();

      if (!profile) throw new Error('Student not found');

      const { data, error } = await supabase
        .from('educational_content')
        .select('*')
        .eq('status', 'published')
        .eq('is_current_version', true)
        .lte('min_age', profile.age)
        .gte('max_age', profile.age)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Get single content with progress
  async getContentWithProgress(contentId: string, studentId: string) {
    try {
      const { data: content, error: contentError } = await supabase
        .from('educational_content')
        .select('*')
        .eq('id', contentId)
        .single();

      if (contentError) throw contentError;

      const { data: progress } = await supabase
        .from('student_content_progress')
        .select('*')
        .eq('content_id', contentId)
        .eq('student_id', studentId)
        .maybeSingle();

      return { data: { content, progress }, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Start content (create progress record)
  async startContent(contentId: string, studentId: string) {
    try {
      const { data, error } = await supabase
        .from('student_content_progress')
        .insert({
          student_id: studentId,
          content_id: contentId,
          status: 'in_progress',
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Update progress
  async updateProgress(
    contentId: string,
    studentId: string,
    updates: Partial<StudentContentProgress>
  ) {
    try {
      const { data, error } = await supabase
        .from('student_content_progress')
        .update({
          ...updates,
          last_accessed: new Date().toISOString(),
        })
        .eq('content_id', contentId)
        .eq('student_id', studentId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Complete content and award XP
  async completeContent(
    contentId: string,
    studentId: string,
    score?: number,
    maxScore?: number
  ) {
    try {
      // Get content XP reward
      const { data: content } = await supabase
        .from('educational_content')
        .select('xp_reward')
        .eq('id', contentId)
        .single();

      // Update progress to completed
      await supabase
        .from('student_content_progress')
        .update({
          status: 'completed',
          progress_percentage: 100,
          completed_at: new Date().toISOString(),
          score_achieved: score,
          max_possible_score: maxScore,
        })
        .eq('content_id', contentId)
        .eq('student_id', studentId);

      // Award XP
      if (content?.xp_reward) {
        const { data: gamification } = await supabase
          .from('student_gamification')
          .select('*')
          .eq('student_id', studentId)
          .single();

        if (gamification) {
          const newTotalXP = gamification.total_xp + content.xp_reward;
          const newLevel = Math.floor(newTotalXP / 100) + 1;
          const xpForNextLevel = newLevel * 100;

          await supabase
            .from('student_gamification')
            .update({
              total_xp: newTotalXP,
              current_level: newLevel,
              xp_for_next_level: xpForNextLevel,
              lessons_completed: gamification.lessons_completed + 1,
              last_activity_date: new Date().toISOString().split('T')[0],
            })
            .eq('student_id', studentId);

          // Check for badge eligibility
          await this.checkBadgeEligibility(studentId, newTotalXP, gamification.lessons_completed + 1);
        }
      }

      return { success: true, xpAwarded: content?.xp_reward || 0 };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Check and award badges
  async checkBadgeEligibility(studentId: string, totalXP: number, lessonsCompleted: number) {
    try {
      const { data: badges } = await supabase
        .from('badges')
        .select('*');

      if (!badges) return;

      for (const badge of badges) {
        // Check if student already has this badge
        const { data: existingAward } = await supabase
          .from('student_badge_awards')
          .select('id')
          .eq('student_id', studentId)
          .eq('badge_id', badge.id)
          .maybeSingle();

        if (existingAward) continue;

        // Check criteria
        let eligible = false;
        if (badge.criteria.xp_threshold && totalXP >= badge.criteria.xp_threshold) {
          eligible = true;
        }
        if (badge.criteria.lessons_completed && lessonsCompleted >= badge.criteria.lessons_completed) {
          eligible = true;
        }

        // Award badge
        if (eligible) {
          await supabase.from('student_badge_awards').insert({
            student_id: studentId,
            badge_id: badge.id,
          });

          // Create notification
          await supabase.from('notifications').insert({
            user_id: studentId,
            type: 'achievement',
            title: 'New Badge Earned!',
            content: `Congratulations! You've earned the "${badge.name}" badge!`,
            priority: 'high',
          });
        }
      }
    } catch (error) {
      console.error('Error checking badge eligibility:', error);
    }
  },

  // Create new content (teachers/admins only)
  async createContent(content: Partial<EducationalContent>, creatorId: string) {
    try {
      const { data, error } = await supabase
        .from('educational_content')
        .insert({
          ...content,
          created_by: creatorId,
          status: content.status || 'draft',
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Update content
  async updateContent(contentId: string, updates: Partial<EducationalContent>) {
    try {
      const { data, error } = await supabase
        .from('educational_content')
        .update(updates)
        .eq('id', contentId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Publish content
  async publishContent(contentId: string) {
    try {
      const { data, error } = await supabase
        .from('educational_content')
        .update({
          status: 'published',
          published_date: new Date().toISOString(),
        })
        .eq('id', contentId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};
