'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Award,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Beaker,
  FileText,
  TrendingUp,
  UserCheck,
  Calendar,
  Bell,
} from 'lucide-react';
import { authService } from '@/lib/services/auth-service';
import type { UserRole } from '@/lib/types';

interface DashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const profile = await authService.getCurrentUserProfile();
    if (profile) {
      setUserName(profile.full_name);
    }
  };

  const handleSignOut = async () => {
    await authService.signOut();
    router.push('/');
  };

  const navItems: Record<UserRole, Array<{ icon: any; label: string; href: string }>> = {
    super_admin: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/admin' },
      { icon: UserCheck, label: 'Approval Queue', href: '/dashboard/admin/approvals' },
      { icon: Users, label: 'User Management', href: '/dashboard/admin/users' },
      { icon: BookOpen, label: 'Content Library', href: '/dashboard/admin/content' },
      { icon: TrendingUp, label: 'Analytics', href: '/dashboard/admin/analytics' },
      { icon: MessageSquare, label: 'Messages', href: '/dashboard/admin/messages' },
      { icon: Settings, label: 'Settings', href: '/dashboard/admin/settings' },
    ],
    teacher: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/teacher' },
      { icon: Users, label: 'My Students', href: '/dashboard/teacher/students' },
      { icon: BookOpen, label: 'Content', href: '/dashboard/teacher/content' },
      { icon: FileText, label: 'Assessments', href: '/dashboard/teacher/assessments' },
      { icon: MessageSquare, label: 'Messages', href: '/dashboard/teacher/messages' },
      { icon: Calendar, label: 'Attendance', href: '/dashboard/teacher/attendance' },
    ],
    teaching_staff: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/staff' },
      { icon: Users, label: 'Students', href: '/dashboard/staff/students' },
      { icon: BookOpen, label: 'Resources', href: '/dashboard/staff/resources' },
      { icon: Calendar, label: 'Attendance', href: '/dashboard/staff/attendance' },
    ],
    student: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/student' },
      { icon: BookOpen, label: 'My Lessons', href: '/dashboard/student/lessons' },
      { icon: Award, label: 'Achievements', href: '/dashboard/student/achievements' },
      { icon: TrendingUp, label: 'Progress', href: '/dashboard/student/progress' },
      { icon: FileText, label: 'Portfolio', href: '/dashboard/student/portfolio' },
    ],
    parent: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/parent' },
      { icon: Users, label: 'My Children', href: '/dashboard/parent/children' },
      { icon: TrendingUp, label: 'Progress Reports', href: '/dashboard/parent/reports' },
      { icon: MessageSquare, label: 'Messages', href: '/dashboard/parent/messages' },
      { icon: Award, label: 'Certificates', href: '/dashboard/parent/certificates' },
    ],
  };

  const roleLabels: Record<UserRole, string> = {
    super_admin: 'Super Admin',
    teacher: 'Teacher',
    teaching_staff: 'Teaching Staff',
    student: 'Student',
    parent: 'Parent',
  };

  const currentNavItems = navItems[role] || [];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Top Navigation Bar */}
      <nav className="fixed w-full top-0 z-50 bg-primary-navy/95 backdrop-blur-lg border-b border-accent-cyan/20">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-white hover:text-accent-cyan transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/" className="flex items-center gap-3">
              <div className="bg-gradient-cyan p-2 rounded-lg shadow-glow-cyan-md">
                <Beaker className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold text-white">
                  <span className="text-white">STEM</span>
                  <span className="text-accent-cyan"> Lab</span>
                </div>
                <div className="text-xs text-accent-light-cyan uppercase tracking-wider">
                  {roleLabels[role]}
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative text-white hover:text-accent-cyan transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                3
              </span>
            </button>

            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-white">{userName}</div>
                <div className="text-xs text-white/60">{roleLabels[role]}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-cyan flex items-center justify-center text-white font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-primary-navy/95 backdrop-blur-lg border-r border-accent-cyan/20 transition-transform duration-300 z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-cyan text-white shadow-glow-cyan-md'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-accent-cyan/20">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
