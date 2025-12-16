import Link from 'next/link';
import { Beaker, Lightbulb, Users, Rocket, Calendar, Award, Target } from 'lucide-react';
import BubblingFlask from './components/BubblingFlask';
import GlassCard from './components/GlassCard';

export default function HomePage() {
  const highlights = [
    {
      icon: Beaker,
      title: 'Hands-On Science',
      description: 'Engage in real experiments and practical applications of scientific principles',
    },
    {
      icon: Lightbulb,
      title: 'Innovation Labs',
      description: 'Transform ideas into prototypes with cutting-edge tools and technologies',
    },
    {
      icon: Users,
      title: 'Collaborative Learning',
      description: 'Work in teams, share knowledge, and build lasting connections',
    },
    {
      icon: Rocket,
      title: 'Future Skills',
      description: 'Develop critical thinking, creativity, and problem-solving abilities',
    },
  ];

  const stats = [
    { value: '500+', label: 'Students Trained', icon: Users },
    { value: '50+', label: 'Projects Completed', icon: Target },
    { value: '20+', label: 'Partner Schools', icon: Award },
    { value: '3 Weeks', label: 'Program Duration', icon: Calendar },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero dark:bg-gradient-hero bg-gradient-to-br from-blue-50 to-cyan-50 overflow-hidden">
        <div className="absolute inset-0 bg-pattern-circuit opacity-30 dark:opacity-30 opacity-10" />

        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
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

       

          <h1 className="text-5xl md:text-7xl font-bold text-white dark:text-white text-gray-900 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Transform Your Holiday into an
            <span className="block text-accent-cyan mt-2">Innovation Adventure</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 dark:text-white/90 text-gray-700 mb-4 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Science in Motion - Where Curiosity Meets Creation
          </p>

          <p className="text-lg text-white/80 dark:text-white/80 text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
            Join SIM Lab Kenya's Holiday Innovation Program this November-December 2025 and discover the scientist within you
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/auth/register-student" className="btn-primary">
              Register as Student
            </Link>
            <Link href="/auth/login" className="btn-secondary">
              Sign In
            </Link>
            <Link href="/program" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-accent-cyan rounded-full p-1">
            <div className="w-1 h-3 bg-accent-cyan rounded-full mx-auto animate-pulse" />
          </div>
        </div>
      </section >

      <section className="section-padding bg-white dark:bg-primary-navy">
        <div className="container-custom">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white dark:text-white text-gray-900 mb-4">
            Program Highlights
          </h2>
          <p className="text-center text-white/80 dark:text-white/80 text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            Discover what makes our Holiday Innovation Program unique
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, index) => (
              <GlassCard key={index}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-cyan rounded-xl flex items-center justify-center mb-4 shadow-glow-cyan">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white dark:text-white text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-white/70 dark:text-white/70 text-gray-600 text-sm">{item.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-section dark:bg-gradient-section bg-blue-100">
        <div className="container-custom">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white dark:text-white text-gray-900 mb-4">
            Our Impact
          </h2>
          <p className="text-center text-white/80 dark:text-white/80 text-gray-700 text-lg mb-12 max-w-2xl mx-auto">
            Making a difference in STEM education across Kenya
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <div className="absolute inset-0 border-4 border-accent-cyan/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-accent-cyan rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 75%)' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <stat.icon className="w-12 h-12 text-accent-cyan" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-accent-cyan mb-2">{stat.value}</div>
                <div className="text-white/80 dark:text-white/80 text-gray-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white dark:bg-primary-navy">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Ready to Start Your
                <span className="block text-accent-cyan">Innovation Journey?</span>
              </h2>
              <p className="text-gray-600 dark:text-white/80 text-lg mb-8 leading-relaxed">
                Don't miss this opportunity to spend your November-December 2025 holidays learning, creating, and innovating. Limited spots available!
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Expert facilitators with industry experience',
                  'State-of-the-art laboratory equipment',
                  'Certificate of completion',
                  'Portfolio of completed projects',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent-cyan/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-accent-cyan" />
                    </div>
                    <span className="text-gray-600 dark:text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/register-student" className="btn-primary">
                Register as Student
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-cyan/10 border-2 border-accent-cyan/30 p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern-circuit opacity-20" />
                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="text-center">
                    <BubblingFlask />
                    <p className="text-white/80 mt-6 text-lg">Science Awaits!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div >
  );
}
