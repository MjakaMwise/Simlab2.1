'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  BookOpen,
  MessageSquare,
  TrendingUp,
  FileText,
  PlusCircle,
  Calendar,
  Award,
} from 'lucide-react';
import DashboardLayout from '@/app/components/DashboardLayout';
import GlassCard from '@/app/components/GlassCard';
import { authService } from '@/lib/services/auth-service';
import { supabase } from '@/lib/supabase';

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    contentCreated: 0,
    unreadMessages: 0,
    pendingFeedback: 0,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const profile = await authService.getCurrentUserProfile();
    if (!profile || profile.role !== 'teacher') {
      router.push('/auth/login');
      return;
    }
    loadStats(profile.id);
  };

  const loadStats = async (teacherId: string) => {
    try {
      const [studentsRes, contentRes, messagesRes] = await Promise.all([
        supabase
          .from('teacher_student_assignments')
          .select('id', { count: 'exact', head: true })
          .eq('teacher_id', teacherId),

        supabase
          .from('educational_content')
          .select('id', { count: 'exact', head: true })
          .eq('created_by', teacherId),

        supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('recipient_id', teacherId)
          .eq('status', 'sent'),
      ]);

      setStats({
        totalStudents: studentsRes.count || 0,
        contentCreated: contentRes.count || 0,
        unreadMessages: messagesRes.count || 0,
        pendingFeedback: 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="teacher">
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Teacher Dashboard</h1>
          <p className="text-white/70">Manage your students and create engaging content</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard hover onClick={() => router.push('/dashboard/teacher/students')}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">My Students</p>
                <p className="text-4xl font-bold text-white">{stats.totalStudents}</p>
              </div>
              <div className="p-3 rounded-lg bg-cyan-500/20">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </GlassCard>

          <GlassCard hover onClick={() => router.push('/dashboard/teacher/content')}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Content Created</p>
                <p className="text-4xl font-bold text-white">{stats.contentCreated}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/20">
                <BookOpen className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </GlassCard>

          <GlassCard
            hover
            onClick={() => router.push('/dashboard/teacher/messages')}
            className={stats.unreadMessages > 0 ? 'ring-2 ring-orange-500 animate-pulse-slow' : ''}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Unread Messages</p>
                <p className="text-4xl font-bold text-white">{stats.unreadMessages}</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-500/20">
                <MessageSquare className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            {stats.unreadMessages > 0 && (
              <div className="mt-2 text-orange-400 text-sm font-medium">⚠ Requires Attention</div>
            )}
          </GlassCard>

          <GlassCard hover onClick={() => router.push('/dashboard/teacher/assessments')}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Pending Feedback</p>
                <p className="text-4xl font-bold text-white">{stats.pendingFeedback}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/20">
                <FileText className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <GlassCard>
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/dashboard/teacher/content/new')}
              className="p-6 bg-gradient-cyan hover:shadow-glow-cyan-md rounded-lg transition-all text-left group"
            >
              <PlusCircle className="w-8 h-8 text-white mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-white font-bold mb-1">Create Content</div>
              <div className="text-white/80 text-sm">Add new lesson or quiz</div>
            </button>

            <button
              onClick={() => router.push('/dashboard/teacher/students')}
              className="p-6 bg-white/5 hover:bg-white/10 rounded-lg border border-accent-cyan/30 hover:border-accent-cyan transition-all text-left group"
            >
              <Users className="w-8 h-8 text-accent-cyan mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-white font-bold mb-1">View Students</div>
              <div className="text-white/70 text-sm">{stats.totalStudents} assigned to you</div>
            </button>

            <button
              onClick={() => router.push('/dashboard/teacher/assessments')}
              className="p-6 bg-white/5 hover:bg-white/10 rounded-lg border border-accent-cyan/30 hover:border-accent-cyan transition-all text-left group"
            >
              <FileText className="w-8 h-8 text-accent-cyan mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-white font-bold mb-1">Grade & Feedback</div>
              <div className="text-white/70 text-sm">Review student work</div>
            </button>

            <button
              onClick={() => router.push('/dashboard/teacher/attendance')}
              className="p-6 bg-white/5 hover:bg-white/10 rounded-lg border border-accent-cyan/30 hover:border-accent-cyan transition-all text-left group"
            >
              <Calendar className="w-8 h-8 text-accent-cyan mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-white font-bold mb-1">Attendance</div>
              <div className="text-white/70 text-sm">Track student attendance</div>
            </button>
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Student Performance Overview
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm">Average Completion Rate</span>
                  <span className="text-green-400 font-bold">78%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-cyan-400 w-[78%]" />
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm">Average Quiz Score</span>
                  <span className="text-cyan-400 font-bold">85%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 w-[85%]" />
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm">Active Students This Week</span>
                  <span className="text-purple-400 font-bold">
                    {Math.floor(stats.totalStudents * 0.6)}/{stats.totalStudents}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 w-[60%]" />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Recent Student Achievements
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-white text-sm">John Doe earned "STEM Master" badge</p>
                    <p className="text-white/60 text-xs">1 hour ago</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-white text-sm">Jane Smith completed "Physics 101"</p>
                    <p className="text-white/60 text-xs">3 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-white text-sm">Mike Johnson scored 100% on quiz</p>
                    <p className="text-white/60 text-xs">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
