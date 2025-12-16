'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, BookOpen, TrendingUp, UserCheck, Activity, Award } from 'lucide-react';
import DashboardLayout from '@/app/components/DashboardLayout';
import GlassCard from '@/app/components/GlassCard';
import { authService } from '@/lib/services/auth-service';
import { supabase } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalContent: 0,
    pendingApprovals: 0,
    activeUsers: 0,
    totalXP: 0,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const profile = await authService.getCurrentUserProfile();
    if (!profile || profile.role !== 'super_admin') {
      router.push('/auth/login');
      return;
    }
    loadStats();
  };

  const loadStats = async () => {
    try {
      const [studentsRes, teachersRes, contentRes, approvalsRes, gamificationRes] =
        await Promise.all([
          supabase
            .from('user_profiles')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'student')
            .eq('account_status', 'active'),
          supabase
            .from('user_profiles')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'teacher')
            .eq('account_status', 'active'),
          supabase
            .from('educational_content')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'published'),
          supabase
            .from('user_profiles')
            .select('id', { count: 'exact', head: true })
            .eq('account_status', 'pending_approval'),
          supabase.from('student_gamification').select('total_xp'),
        ]);

      const totalXP = gamificationRes.data?.reduce((sum, row) => sum + row.total_xp, 0) || 0;

      setStats({
        totalStudents: studentsRes.count || 0,
        totalTeachers: teachersRes.count || 0,
        totalContent: contentRes.count || 0,
        pendingApprovals: approvalsRes.count || 0,
        activeUsers: (studentsRes.count || 0) + (teachersRes.count || 0),
        totalXP,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      icon: Users,
      label: 'Active Students',
      value: stats.totalStudents,
      color: 'cyan',
      href: '/dashboard/admin/users?role=student',
    },
    {
      icon: BookOpen,
      label: 'Published Content',
      value: stats.totalContent,
      color: 'purple',
      href: '/dashboard/admin/content',
    },
    {
      icon: UserCheck,
      label: 'Pending Approvals',
      value: stats.pendingApprovals,
      color: 'orange',
      href: '/dashboard/admin/approvals',
      urgent: stats.pendingApprovals > 0,
    },
    {
      icon: Activity,
      label: 'Active Users',
      value: stats.activeUsers,
      color: 'green',
    },
    {
      icon: Users,
      label: 'Teachers',
      value: stats.totalTeachers,
      color: 'blue',
      href: '/dashboard/admin/users?role=teacher',
    },
    {
      icon: Award,
      label: 'Total XP Earned',
      value: stats.totalXP.toLocaleString(),
      color: 'yellow',
    },
  ];

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
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/70">Welcome back! Here's your platform overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <GlassCard
                key={index}
                hover={!!stat.href}
                className={`cursor-${stat.href ? 'pointer' : 'default'} ${
                  stat.urgent ? 'ring-2 ring-orange-500 animate-pulse-slow' : ''
                }`}
                onClick={() => stat.href && router.push(stat.href)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div
                    className={`p-3 rounded-lg bg-${stat.color}-500/20`}
                    style={{
                      backgroundColor: `rgba(${
                        stat.color === 'cyan'
                          ? '0, 169, 224'
                          : stat.color === 'purple'
                          ? '147, 51, 234'
                          : stat.color === 'orange'
                          ? '249, 115, 22'
                          : stat.color === 'green'
                          ? '34, 197, 94'
                          : stat.color === 'blue'
                          ? '59, 130, 246'
                          : '234, 179, 8'
                      }, 0.2)`,
                    }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                {stat.urgent && (
                  <div className="mt-4 text-orange-400 text-sm font-medium">
                    ⚠ Requires Attention
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>

        {/* Quick Actions */}
        <GlassCard>
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/dashboard/admin/approvals')}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-accent-cyan/30 hover:border-accent-cyan transition-all text-left"
            >
              <UserCheck className="w-6 h-6 text-accent-cyan mb-2" />
              <div className="text-white font-medium">Review Registrations</div>
              <div className="text-white/60 text-sm">
                {stats.pendingApprovals} pending
              </div>
            </button>

            <button
              onClick={() => router.push('/dashboard/admin/users')}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-accent-cyan/30 hover:border-accent-cyan transition-all text-left"
            >
              <Users className="w-6 h-6 text-accent-cyan mb-2" />
              <div className="text-white font-medium">Manage Users</div>
              <div className="text-white/60 text-sm">Create teachers, view all</div>
            </button>

            <button
              onClick={() => router.push('/dashboard/admin/content')}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-accent-cyan/30 hover:border-accent-cyan transition-all text-left"
            >
              <BookOpen className="w-6 h-6 text-accent-cyan mb-2" />
              <div className="text-white font-medium">Content Library</div>
              <div className="text-white/60 text-sm">{stats.totalContent} published</div>
            </button>

            <button
              onClick={() => router.push('/dashboard/admin/analytics')}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-accent-cyan/30 hover:border-accent-cyan transition-all text-left"
            >
              <TrendingUp className="w-6 h-6 text-accent-cyan mb-2" />
              <div className="text-white font-medium">View Analytics</div>
              <div className="text-white/60 text-sm">Platform insights</div>
            </button>
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard>
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-white text-sm">New student registration</p>
                  <p className="text-white/60 text-xs">2 minutes ago</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-white text-sm">Teacher published new content</p>
                  <p className="text-white/60 text-xs">1 hour ago</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-white text-sm">Student earned "STEM Master" badge</p>
                  <p className="text-white/60 text-xs">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
