'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Award,
  TrendingUp,
  Flame,
  Star,
  BookOpen,
  Clock,
  Target,
  Zap,
  Trophy,
  Play,
} from 'lucide-react';
import DashboardLayout from '@/app/components/DashboardLayout';
import GlassCard from '@/app/components/GlassCard';
import { authService } from '@/lib/services/auth-service';
import { supabase } from '@/lib/supabase';
import type { StudentGamification, Badge, EducationalContent } from '@/lib/types';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [studentId, setStudentId] = useState('');
  const [gamification, setGamification] = useState<StudentGamification | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [recentContent, setRecentContent] = useState<EducationalContent[]>([]);
  const [recommendedContent, setRecommendedContent] = useState<EducationalContent[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const profile = await authService.getCurrentUserProfile();
    if (!profile || profile.role !== 'student') {
      router.push('/auth/login');
      return;
    }
    setStudentId(profile.id);
    loadDashboardData(profile.id);
  };

  const loadDashboardData = async (studentId: string) => {
    try {
      const [gamificationRes, badgesRes, contentRes] = await Promise.all([
        // Gamification data
        supabase.from('student_gamification').select('*').eq('student_id', studentId).single(),

        // Earned badges
        supabase
          .from('student_badge_awards')
          .select('badge_id, badges(*)')
          .eq('student_id', studentId)
          .limit(5),

        // Recent content
        supabase
          .from('educational_content')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(6),
      ]);

      if (gamificationRes.data) {
        setGamification(gamificationRes.data as StudentGamification);
      }

      if (badgesRes.data) {
        setBadges(badgesRes.data.map((award: any) => award.badges).filter(Boolean));
      }

      if (contentRes.data) {
        setRecentContent(contentRes.data);
        setRecommendedContent(contentRes.data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressToNextLevel = () => {
    if (!gamification) return 0;
    const xpInCurrentLevel = gamification.total_xp % 100;
    return (xpInCurrentLevel / 100) * 100;
  };

  if (isLoading) {
    return (
      <DashboardLayout role="student">
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden">
          <GlassCard className="bg-gradient-cyan">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, Explorer! 🚀
              </h1>
              <p className="text-white/90 text-lg">
                Ready to continue your learning journey?
              </p>
            </div>
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          </GlassCard>
        </div>

        {/* Gamification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <div className="text-white/70 text-sm font-medium">Level</div>
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {gamification?.current_level || 1}
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                style={{ width: `${getProgressToNextLevel()}%` }}
              />
            </div>
            <div className="text-xs text-white/60 mt-2">
              {gamification?.total_xp || 0} / {gamification?.xp_for_next_level || 100} XP
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <div className="text-white/70 text-sm font-medium">Current Streak</div>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {gamification?.current_streak_days || 0}
            </div>
            <div className="text-sm text-white/70">
              Longest: {gamification?.longest_streak_days || 0} days 🏆
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <div className="text-white/70 text-sm font-medium">Lessons Completed</div>
              <BookOpen className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {gamification?.lessons_completed || 0}
            </div>
            <div className="text-sm text-white/70">
              Keep learning! 📚
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <div className="text-white/70 text-sm font-medium">Badges Earned</div>
              <Trophy className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">{badges.length}</div>
            <Link
              href="/dashboard/student/achievements"
              className="text-sm text-accent-cyan hover:text-accent-light-cyan transition-colors"
            >
              View all achievements →
            </Link>
          </GlassCard>
        </div>

        {/* Recent Badges */}
        {badges.length > 0 && (
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-6 h-6 text-accent-cyan" />
                Recent Badges
              </h2>
              <Link
                href="/dashboard/student/achievements"
                className="text-accent-cyan hover:text-accent-light-cyan text-sm font-medium transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {badges.slice(0, 5).map((badge) => (
                <div
                  key={badge.id}
                  className="p-4 bg-white/5 rounded-lg border border-accent-cyan/30 hover:border-accent-cyan transition-all text-center"
                >
                  <div className="w-16 h-16 bg-gradient-cyan rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white font-semibold text-sm mb-1">{badge.name}</div>
                  <div className="text-white/60 text-xs">{badge.xp_value} XP</div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Recommended Lessons */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" />
              Recommended for You
            </h2>
            <Link
              href="/dashboard/student/lessons"
              className="text-accent-cyan hover:text-accent-light-cyan text-sm font-medium transition-colors"
            >
              Browse All Lessons
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedContent.map((content) => (
              <div
                key={content.id}
                className="group p-6 bg-white/5 rounded-lg border border-accent-cyan/30 hover:border-accent-cyan hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      content.content_type === 'lesson'
                        ? 'bg-blue-500/20 text-blue-400'
                        : content.content_type === 'quiz'
                        ? 'bg-purple-500/20 text-purple-400'
                        : content.content_type === 'game'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-cyan-500/20 text-cyan-400'
                    }`}
                  >
                    {content.content_type}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs font-medium">{content.average_rating.toFixed(1)}</span>
                  </div>
                </div>

                <h3 className="text-white font-bold mb-2 group-hover:text-accent-cyan transition-colors">
                  {content.title}
                </h3>
                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                  {content.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-white/60">
                    <Clock className="w-4 h-4" />
                    {content.estimated_duration} min
                  </div>
                  <div className="flex items-center gap-2 text-accent-cyan font-medium">
                    <Zap className="w-4 h-4" />
                    +{content.xp_reward} XP
                  </div>
                </div>

                <button className="mt-4 w-full py-2 bg-gradient-cyan text-white rounded-lg font-medium flex items-center justify-center gap-2 group-hover:shadow-glow-cyan-md transition-all">
                  <Play className="w-4 h-4" />
                  Start Learning
                </button>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-accent-cyan" />
              Today's Goals
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm">Complete 1 lesson</span>
                  <span className="text-accent-cyan text-sm font-medium">0/1</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-cyan w-0 transition-all duration-500" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm">Earn 50 XP</span>
                  <span className="text-accent-cyan text-sm font-medium">
                    {gamification?.total_xp || 0}/50
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-cyan transition-all duration-500"
                    style={{
                      width: `${Math.min(((gamification?.total_xp || 0) / 50) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Your Progress
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Total Time Spent</span>
                <span className="text-white font-semibold">
                  {Math.floor((gamification?.total_time_spent_seconds || 0) / 3600)}h{' '}
                  {Math.floor(((gamification?.total_time_spent_seconds || 0) % 3600) / 60)}m
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Quizzes Completed</span>
                <span className="text-white font-semibold">
                  {gamification?.quizzes_completed || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Current Rank</span>
                <span className="text-white font-semibold">
                  #{gamification?.current_rank || 'N/A'}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
