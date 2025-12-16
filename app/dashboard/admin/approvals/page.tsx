'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Clock, Mail, Phone, Users } from 'lucide-react';
import DashboardLayout from '@/app/components/DashboardLayout';
import GlassCard from '@/app/components/GlassCard';
import { authService } from '@/lib/services/auth-service';
import { supabase } from '@/lib/supabase';
import type { UserProfile, ParentStudentRelationship } from '@/lib/types';

interface PendingRegistration {
  student: UserProfile;
  parents: Array<UserProfile & { relationship_type: string }>;
}

export default function ApprovalsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const profile = await authService.getCurrentUserProfile();
    if (!profile || profile.role !== 'super_admin') {
      router.push('/auth/login');
      return;
    }
    loadPendingRegistrations();
  };

  const loadPendingRegistrations = async () => {
    try {
      // Get all pending students
      const { data: pendingStudents, error: studentsError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', 'student')
        .eq('account_status', 'pending_approval')
        .order('created_at', { ascending: false });

      if (studentsError) throw studentsError;

      // For each student, get their parents
      const registrations: PendingRegistration[] = [];

      for (const student of pendingStudents || []) {
        const { data: relationships } = await supabase
          .from('parent_student_relationships')
          .select('parent_id, relationship_type')
          .eq('student_id', student.id);

        const parents: Array<UserProfile & { relationship_type: string }> = [];

        if (relationships) {
          for (const rel of relationships) {
            const { data: parent } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', rel.parent_id)
              .single();

            if (parent) {
              parents.push({ ...parent, relationship_type: rel.relationship_type });
            }
          }
        }

        registrations.push({ student, parents });
      }

      setPendingRegistrations(registrations);
    } catch (error) {
      console.error('Error loading pending registrations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (studentId: string, parentIds: string[]) => {
    setProcessing(studentId);

    try {
      // Update student status
      const { error: studentError } = await supabase
        .from('user_profiles')
        .update({ account_status: 'active' })
        .eq('id', studentId);

      if (studentError) throw studentError;

      // Update all parent statuses
      for (const parentId of parentIds) {
        await supabase
          .from('user_profiles')
          .update({ account_status: 'active' })
          .eq('id', parentId);
      }

      // Create notification for student
      await supabase.from('notifications').insert({
        user_id: studentId,
        type: 'system',
        title: 'Account Approved!',
        content: 'Welcome to STEM Lab! Your account has been approved. Start learning now!',
        priority: 'high',
      });

      // TODO: Send approval email

      // Reload the list
      loadPendingRegistrations();
    } catch (error) {
      console.error('Error approving registration:', error);
      alert('Failed to approve registration. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (studentId: string, parentIds: string[]) => {
    const reason = prompt('Please enter a reason for rejection:');
    if (!reason) return;

    setProcessing(studentId);

    try {
      // Update student status
      const { error: studentError } = await supabase
        .from('user_profiles')
        .update({ account_status: 'archived' })
        .eq('id', studentId);

      if (studentError) throw studentError;

      // Update all parent statuses
      for (const parentId of parentIds) {
        await supabase
          .from('user_profiles')
          .update({ account_status: 'archived' })
          .eq('id', parentId);
      }

      // Create notification
      await supabase.from('notifications').insert({
        user_id: studentId,
        type: 'system',
        title: 'Registration Update',
        content: `Your registration has been reviewed. Reason: ${reason}`,
        priority: 'high',
      });

      // TODO: Send rejection email

      // Reload the list
      loadPendingRegistrations();
    } catch (error) {
      console.error('Error rejecting registration:', error);
      alert('Failed to reject registration. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="super_admin">
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="super_admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Approval Queue</h1>
          <p className="text-white/70">
            Review and approve student registrations ({pendingRegistrations.length} pending)
          </p>
        </div>

        {pendingRegistrations.length === 0 ? (
          <GlassCard>
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
              <p className="text-white/70">No pending registrations at the moment.</p>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-6">
            {pendingRegistrations.map((registration) => {
              const { student, parents } = registration;
              const parentIds = parents.map((p) => p.id);

              return (
                <GlassCard key={student.id}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-cyan flex items-center justify-center text-white font-bold text-lg">
                        {student.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{student.full_name}</h3>
                        <p className="text-white/60 text-sm flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Registered{' '}
                          {new Date(student.created_at!).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
                      Pending Approval
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Student Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-white mb-3">Student Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white/80">
                          <Mail className="w-4 h-4 text-accent-cyan" />
                          <span className="text-sm">{student.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80">
                          <Users className="w-4 h-4 text-accent-cyan" />
                          <span className="text-sm">Age: {student.age} years old</span>
                        </div>
                      </div>
                    </div>

                    {/* Parent Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-white mb-3">
                        Parent/Guardian Information
                      </h4>
                      {parents.map((parent, idx) => (
                        <div
                          key={parent.id}
                          className="p-3 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="font-medium text-white mb-2">
                            {parent.full_name}{' '}
                            <span className="text-xs text-white/60">
                              ({parent.relationship_type})
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                              <Mail className="w-3 h-3 text-accent-cyan" />
                              {parent.email}
                            </div>
                            {parent.phone && (
                              <div className="flex items-center gap-2 text-white/70 text-sm">
                                <Phone className="w-3 h-3 text-accent-cyan" />
                                {parent.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={() => handleApprove(student.id, parentIds)}
                      disabled={processing === student.id}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing === student.id ? (
                        <>
                          <div className="w-5 h-5 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Approve Registration
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleReject(student.id, parentIds)}
                      disabled={processing === student.id}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
