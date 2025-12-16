'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  TrendingUp,
  Award,
  Clock,
  BookOpen,
  MessageSquare,
  Activity,
  Flame,
  Star,
} from 'lucide-react';
import DashboardLayout from '@/app/components/DashboardLayout';
import GlassCard from '@/app/components/GlassCard';
import { authService } from '@/lib/services/auth-service';
import { supabase } from '@/lib/supabase';
import type { UserProfile, StudentGamification } from '@/lib/types';

interface ChildData {
  profile: UserProfile;
  gamification: StudentGamification | null;
  badgeCount: number;
}

export default function ParentDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [children, setChildren] = useState<ChildData[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const profile = await authService.getCurrentUserProfile();
    if (!profile || profile.role !== 'parent') {
      router.push('/auth/login');
      return;
    }
    loadChildren(profile.id);
  };

  const loadChildren = async (parentId: string) => {
    try {
      // Get all linked students
      const { data: relationships } = await supabase
        .from('parent_student_relationships')
        .select('student_id')
        .eq('parent_id', parentId);

      if (!relationships || relationships.length === 0) {
        setIsLoading(false);
        return;
      }

      const childrenData: ChildData[] = [];

      for (const rel of relationships) {
        // Get student profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', rel.student_id)
          .single();

        if (!profile) continue;

        // Get gamification data
        const { data: gamification } = await supabase
          .from('student_gamification')
          .select('*')
          .eq('student_id', rel.student_id)
          .single();

        // Get badge count
        const { count: badgeCount } = await supabase
          .from('student_badge_awards')
          .select('id', { count: 'exact', head: true })
          .eq('student_id', rel.student_id);

        childrenData.push({
          profile,
          gamification: gamification || null,
          badgeCount: badgeCount || 0,
        });
      }

      setChildren(childrenData);
      if (childrenData.length > 0) {
        setSelectedChildId(childrenData[0].profile.id);
      }
    } catch (error) {
      console.error('Error loading children:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedChild = children.find((c) => c.profile.id === selectedChildId);

  if (isLoading) {
    return (
      <DashboardLayout role="parent">
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (children.length === 0) {
    return (
      <DashboardLayout role="parent">
        <GlassCard>
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-accent-cyan mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Children Linked</h3>
            <p className="text-white/70 mb-4">
              It looks like you don't have any children linked to your account yet.
            </p>
            <p className="text-white/60 text-sm">
              Children are linked when they register with your email address.
            </p>
          </div>
        </GlassCard>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="parent">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Parent Dashboard</h1>
          <p className="text-white/70">Monitor your children's learning progress</p>
        </div>

        {/* Child Selector */}
        {children.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {children.map((child) => (
              <button
                key={child.profile.id}
                onClick={() => setSelectedChildId(child.profile.id)}
                className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedChildId === child.profile.id
                    ? 'bg-gradient-cyan text-white shadow-glow-cyan-md'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-accent-cyan/30'
                }`}
              >
                {child.profile.full_name}
              </button>
            ))}
          </div>
        )}

        {selectedChild && (
          <>
            {/* Child Overview */}
            <GlassCard className="bg-gradient-cyan">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-3xl">
                  {selectedChild.profile.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {selectedChild.profile.full_name}'s Progress
                  </h2>
                  <p className="text-white/90">
                    Age {selectedChild.profile.age} • Level{' '}
                    {selectedChild.gamification?.current_level || 1}
                  </p>
                </div>
                <Link
                  href="/dashboard/parent/messages"
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium flex items-center gap-2 transition-all"
                >
                  <MessageSquare className="w-5 h-5" />
                  Message Teacher
                </Link>
              </div>
            </GlassCard>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlassCard>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white/70 text-sm font-medium">Total XP</div>
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {selectedChild.gamification?.total_xp.toLocaleString() || 0}
                </div>
                <div className="text-sm text-white/70">
                  Level {selectedChild.gamification?.current_level || 1}
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white/70 text-sm font-medium">Lessons Completed</div>
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {selectedChild.gamification?.lessons_completed || 0}
                </div>
                <div className="text-sm text-white/70">Keep learning!</div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white/70 text-sm font-medium">Current Streak</div>
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {selectedChild.gamification?.current_streak_days || 0}
                </div>
                <div className="text-sm text-white/70">
                  Best: {selectedChild.gamification?.longest_streak_days || 0} days
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white/70 text-sm font-medium">Badges Earned</div>
                  <Award className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {selectedChild.badgeCount}
                </div>
                <Link
                  href="/dashboard/parent/certificates"
                  className="text-sm text-accent-cyan hover:text-accent-light-cyan transition-colors"
                >
                  View certificates →
                </Link>
              </GlassCard>
            </div>

            {/* Weekly Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Weekly Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Time Spent Learning</span>
                    <span className="text-white font-semibold">
                      {Math.floor(
                        (selectedChild.gamification?.total_time_spent_seconds || 0) / 3600
                      )}
                      h{' '}
                      {Math.floor(
                        ((selectedChild.gamification?.total_time_spent_seconds || 0) % 3600) / 60
                      )}
                      m
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Quizzes Completed</span>
                    <span className="text-white font-semibold">
                      {selectedChild.gamification?.quizzes_completed || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Average Quiz Score</span>
                    <span className="text-white font-semibold">N/A</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Days Active</span>
                    <span className="text-white font-semibold">
                      {selectedChild.gamification?.current_streak_days || 0} / 7
                    </span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-white text-sm">Completed "Introduction to Physics"</p>
                        <p className="text-white/60 text-xs">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-white text-sm">Earned "Quick Learner" badge</p>
                        <p className="text-white/60 text-xs">1 day ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-white text-sm">Started "Math Fundamentals" course</p>
                        <p className="text-white/60 text-xs">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Quick Actions */}
            <GlassCard>
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/dashboard/parent/reports"
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-accent-cyan/30 hover:border-accent-cyan transition-all group"
                >
                  <TrendingUp className="w-6 h-6 text-accent-cyan mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-white font-medium mb-1">View Full Report</div>
                  <div className="text-white/60 text-sm">Detailed progress analysis</div>
                </Link>

                <Link
                  href="/dashboard/parent/messages"
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-accent-cyan/30 hover:border-accent-cyan transition-all group"
                >
                  <MessageSquare className="w-6 h-6 text-accent-cyan mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-white font-medium mb-1">Message Teacher</div>
                  <div className="text-white/60 text-sm">Ask questions or share feedback</div>
                </Link>

                <Link
                  href="/dashboard/parent/certificates"
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-accent-cyan/30 hover:border-accent-cyan transition-all group"
                >
                  <Award className="w-6 h-6 text-accent-cyan mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-white font-medium mb-1">View Certificates</div>
                  <div className="text-white/60 text-sm">Download achievements</div>
                </Link>
              </div>
            </GlassCard>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
