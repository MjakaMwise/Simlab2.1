'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, Beaker, CheckCircle, User } from 'lucide-react';
import { authService } from '@/lib/services/auth-service';
import BubblingFlask from '@/app/components/BubblingFlask';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await authService.signIn(email, password);

    if (result.success && result.role) {
      const dashboardRoutes: Record<string, string> = {
        super_admin: '/dashboard/admin',
        teacher: '/dashboard/teacher',
        teaching_staff: '/dashboard/staff',
        student: '/dashboard/student',
        parent: '/dashboard/parent',
      };

      router.push(dashboardRoutes[result.role] || '/dashboard');
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-circuit opacity-20" />

      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-accent-cyan rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Branding */}
          <div className="text-center lg:text-left space-y-6 animate-slide-up">
            <div className="inline-block">
              <BubblingFlask />
            </div>

            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                Welcome to
                <span className="block text-accent-cyan mt-2">STEM Lab Platform</span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-6">
                Your gateway to interactive science education and innovation
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent-cyan/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-accent-cyan" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold mb-1">Interactive Learning</h3>
                  <p className="text-white/70 text-sm">Engage with hands-on STEM lessons and experiments</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent-cyan/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-accent-cyan" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold mb-1">Track Progress</h3>
                  <p className="text-white/70 text-sm">Earn XP, badges, and certificates as you learn</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent-cyan/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-accent-cyan" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold mb-1">Parent Monitoring</h3>
                  <p className="text-white/70 text-sm">Parents can track their child's learning journey</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="glass-card p-8 shadow-glow-cyan-lg">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-cyan p-3 rounded-xl shadow-glow-cyan-md">
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
                <p className="text-white/70 text-sm">Access your learning dashboard</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 animate-slide-up">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-white/80 mb-2 text-sm font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-cyan/60" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg pl-11 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all"
                      placeholder="student@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 mb-2 text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-cyan/60" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg pl-11 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-white/70 cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="mr-2 w-4 h-4 rounded border-accent-cyan/30 bg-white/5 text-accent-cyan focus:ring-accent-cyan focus:ring-offset-0"
                    />
                    Remember me
                  </label>
                  <Link href="/auth/forgot-password" className="text-accent-cyan hover:text-accent-light-cyan transition-colors font-medium">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-accent-cyan/20">
                <p className="text-center text-white/70 text-sm mb-4">
                  Don't have an account?
                </p>
                <Link
                  href="/auth/register-student"
                  className="block w-full text-center py-3 bg-white/5 border border-accent-cyan/30 rounded-lg text-accent-cyan hover:bg-accent-cyan/10 hover:border-accent-cyan transition-all font-medium"
                >
                  Register as Student
                </Link>
              </div>

              <div className="mt-6 text-center">
                <Link href="/" className="text-white/60 hover:text-accent-cyan text-sm transition-colors inline-flex items-center gap-2">
                  <span>←</span> Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
