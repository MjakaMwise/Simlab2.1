'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Beaker, LogIn, UserPlus, LogOut, LayoutDashboard } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { authService } from '@/lib/services/auth-service';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const profile = await authService.getCurrentUserProfile();
        setUserRole(profile?.role || null);
      } else {
        setUser(null);
        setUserRole(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      const profile = await authService.getCurrentUserProfile();
      setUserRole(profile?.role || null);
    }
  };

  const handleSignOut = async () => {
    await authService.signOut();
    setUser(null);
    setUserRole(null);
    router.push('/');
  };

  const getDashboardLink = () => {
    if (!userRole) return '/dashboard';
    const routes: Record<string, string> = {
      super_admin: '/dashboard/admin',
      teacher: '/dashboard/teacher',
      teaching_staff: '/dashboard/staff',
      student: '/dashboard/student',
      parent: '/dashboard/parent',
    };
    return routes[userRole] || '/dashboard';
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Program', path: '/program' },
    { name: 'Schools', path: '/schools' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-primary-navy/95 backdrop-blur-lg shadow-lg'
        : 'bg-transparent'
        }`}
    >
      <div className="container-custom px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-gradient-cyan p-2 rounded-lg shadow-glow-cyan-md">
              <Beaker className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                <span className="text-white">SIM</span>
                <span className="text-accent-cyan"> Lab</span>
              </div>
              <div className="text-xs text-accent-light-cyan uppercase tracking-wider">
                Science in Motion
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-white hover:text-accent-cyan transition-colors duration-200 font-medium ${pathname === item.path ? 'text-accent-cyan' : ''
                  }`}
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href={getDashboardLink()}
                  className="flex items-center gap-2 text-white hover:text-accent-cyan transition-colors font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 text-white hover:text-accent-cyan transition-colors font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link href="/auth/register-student" className="btn-primary flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              className="text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary-navy/98 backdrop-blur-lg border-t border-accent-cyan/20">
          <div className="container-custom px-4 py-6 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block w-full text-left py-2 text-white hover:text-accent-cyan transition-colors ${pathname === item.path ? 'text-accent-cyan' : ''
                  }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-accent-cyan/20 space-y-3">
              {user ? (
                <>
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 w-full text-left py-2 text-white hover:text-accent-cyan transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full text-left py-2 text-white hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register-student"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
