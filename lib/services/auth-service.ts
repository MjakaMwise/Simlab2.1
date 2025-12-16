import { supabase } from '../supabase';
import type { UserProfile, UserRole, StudentRegistrationForm } from '../types';

export const authService = {
  // Register new student with parents
  async registerStudent(formData: StudentRegistrationForm) {
    try {
      // 1. Create student auth user
      const { data: studentAuth, error: studentAuthError } = await supabase.auth.signUp({
        email: formData.student.email,
        password: formData.student.password,
        options: {
          data: {
            full_name: formData.student.full_name,
            role: 'student',
          },
        },
      });

      if (studentAuthError) throw studentAuthError;
      if (!studentAuth.user) throw new Error('Failed to create student account');

      // 2. Create student profile with pending approval
      const { error: studentProfileError } = await supabase
        .from('user_profiles')
        .insert({
          id: studentAuth.user.id,
          email: formData.student.email,
          full_name: formData.student.full_name,
          role: 'student',
          account_status: 'pending_approval',
          date_of_birth: formData.student.date_of_birth,
          age: formData.student.age,
        });

      if (studentProfileError) throw studentProfileError;

      // 3. Initialize gamification data
      await supabase.from('student_gamification').insert({
        student_id: studentAuth.user.id,
        total_xp: 0,
        current_level: 1,
        xp_for_next_level: 100,
      });

      // 4. Create parent accounts and relationships
      for (const parent of formData.parents) {
        // Create parent auth (they'll set password later via email)
        const tempPassword = Math.random().toString(36).slice(-12) + 'Aa1!';

        const { data: parentAuth, error: parentAuthError } = await supabase.auth.signUp({
          email: parent.email,
          password: tempPassword,
          options: {
            data: {
              full_name: parent.full_name,
              role: 'parent',
            },
            emailRedirectTo: `${window.location.origin}/auth/set-password`,
          },
        });

        if (parentAuthError) continue; // Skip if parent email already exists

        if (parentAuth.user) {
          // Create parent profile
          await supabase.from('user_profiles').insert({
            id: parentAuth.user.id,
            email: parent.email,
            full_name: parent.full_name,
            phone: parent.phone,
            role: 'parent',
            account_status: 'pending_approval',
          });

          // Create parent-student relationship
          await supabase.from('parent_student_relationships').insert({
            parent_id: parentAuth.user.id,
            student_id: studentAuth.user.id,
            relationship_type: parent.relationship_type,
          });
        }
      }

      return { success: true, studentId: studentAuth.user.id };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  },

  // Sign in
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { success: false, error: error.message };

    // Check account status
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('account_status, role')
      .eq('id', data.user.id)
      .single();

    if (profile?.account_status === 'pending_approval') {
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Your account is pending approval. Please wait for admin confirmation.'
      };
    }

    if (profile?.account_status === 'suspended') {
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Your account has been suspended. Please contact support.'
      };
    }

    // Update last login
    await supabase
      .from('user_profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);

    return { success: true, user: data.user, role: profile?.role };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { success: !error, error: error?.message };
  },

  // Get current user profile
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return profile;
  },

  // Check if user has role
  async hasRole(roles: UserRole[]): Promise<boolean> {
    const profile = await this.getCurrentUserProfile();
    return profile ? roles.includes(profile.role) : false;
  },

  // Request password reset
  async requestPasswordReset(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    return { success: !error, error: error?.message };
  },

  // Update password
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    return { success: !error, error: error?.message };
  },
};
