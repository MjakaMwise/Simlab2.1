'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, BookOpen, Calendar, FileText } from 'lucide-react';
import DashboardLayout from '@/app/components/DashboardLayout';
import GlassCard from '@/app/components/GlassCard';
import { authService } from '@/lib/services/auth-service';
import { supabase } from '@/lib/supabase';

export default function StaffDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalResources: 0,
    attendanceToday: 0,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const profile = await authService.getCurrentUserProfile();
    if (!profile || profile.role !== 'teaching_staff') {
      router.push('/auth/login');
      return;
    }
    loadStats();
  };

  const loadStats = async () => {
    try {
      const [studentsRes, resourcesRes] = await Promise.all([
        supabase
          .from('user_profiles')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'student')
          .eq('account_status', 'active'),

        supabase
          .from('resource_library')
          .select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        totalStudents: studentsRes.count || 0,
        totalResources: resourcesRes.count || 0,
        attendanceToday: 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="teaching_staff">
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="teaching_staff">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Teaching Staff Dashboard</h1>
          <p className="text-white/70">Access teaching resources and manage attendance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Total Students</p>
                <p className="text-4xl font-bold text-white">{stats.totalStudents}</p>
              </div>
              <div className="p-3 rounded-lg bg-cyan-500/20">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Teaching Resources</p>
                <p className="text-4xl font-bold text-white">{stats.totalResources}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/20">
                <BookOpen className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Attendance Today</p>
                <p className="text-4xl font-bold text-white">{stats.attendanceToday}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/20">
                <Calendar className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <GlassCard>
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/staff/students"
              className="p-6 bg-white/5 hover:bg-white/10 rounded-lg border border-accent-cyan/30 hover:border-accent-cyan transition-all group"
            >
              <Users className="w-8 h-8 text-accent-cyan mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-white font-bold mb-1">View Students</div>
              <div className="text-white/70 text-sm">Browse all students by age</div>
            </Link>

            <Link
              href="/dashboard/staff/resources"
              className="p-6 bg-white/5 hover:bg-white/10 rounded-lg border border-accent-cyan/30 hover:border-accent-cyan transition-all group"
            >
              <FileText className="w-8 h-8 text-accent-cyan mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-white font-bold mb-1">Teaching Resources</div>
              <div className="text-white/70 text-sm">Access lesson plans & materials</div>
            </Link>

            <Link
              href="/dashboard/staff/attendance"
              className="p-6 bg-white/5 hover:bg-white/10 rounded-lg border border-accent-cyan/30 hover:border-accent-cyan transition-all group"
            >
              <Calendar className="w-8 h-8 text-accent-cyan mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-white font-bold mb-1">Mark Attendance</div>
              <div className="text-white/70 text-sm">Log student attendance</div>
            </Link>
          </div>
        </GlassCard>

        {/* Info Card */}
        <GlassCard>
          <h3 className="text-lg font-bold text-white mb-4">Your Role</h3>
          <p className="text-white/80 leading-relaxed">
            As teaching staff, you have access to teaching resources and can log student
            attendance. You can view all students and their progress, and conduct teachings using
            existing materials. For content creation or student management, please contact a
            teacher or administrator.
          </p>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
