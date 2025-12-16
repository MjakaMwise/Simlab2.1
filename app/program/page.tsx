'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, CheckCircle, ChevronDown } from 'lucide-react';
import GlassCard from '@/app/components/GlassCard';

export default function ProgramPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'requirements', label: 'Requirements' },
  ];

  const timeline = [
    { phase: 'Registration', date: 'October 1-31, 2025', description: 'Early bird discounts available' },
    { phase: 'Program Starts', date: 'November 4, 2025', description: 'Orientation and team formation' },
    { phase: 'Mid-Program', date: 'November 18-22, 2025', description: 'Project showcase week' },
    { phase: 'Final Week', date: 'December 16-20, 2025', description: 'Final presentations and certification' },
  ];

  const weeklySchedule = [
    {
      week: 1,
      theme: 'Introduction to Scientific Method',
      topics: ['Lab safety and protocols', 'Scientific observation and measurement', 'Data collection and analysis', 'Introduction to lab equipment'],
    },
    {
      week: 2,
      theme: 'Chemistry and Materials Science',
      topics: ['Chemical reactions and solutions', 'Material properties and testing', 'pH and indicators', 'Hands-on experiments'],
    },
    {
      week: 3,
      theme: 'Physics and Engineering',
      topics: ['Forces and motion', 'Simple machines and mechanisms', 'Electricity and circuits', 'Build your own projects'],
    },
    {
      week: 4,
      theme: 'Biology and Environmental Science',
      topics: ['Microscopy and cell biology', 'Ecology and ecosystems', 'Environmental monitoring', 'Sustainability projects'],
    },
    {
      week: 5,
      theme: 'Technology and Innovation',
      topics: ['Introduction to coding', 'Sensors and automation', 'Design thinking process', 'Prototype development'],
    },
    {
      week: 6,
      theme: 'Capstone Project',
      topics: ['Project planning and design', 'Building and testing', 'Final presentations', 'Certification ceremony'],
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      <section className="relative bg-gradient-hero py-24 overflow-hidden">
        <div className="absolute inset-0 bg-pattern-circuit opacity-30" />
        <div className="relative z-10 container-custom px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Holiday Innovation <span className="text-accent-cyan">Program</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            A comprehensive 6-week journey through hands-on science and innovation
          </p>
        </div>
      </section>

      <section className="section-padding bg-primary-navy">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 mb-12 border-b border-accent-cyan/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-accent-cyan border-b-2 border-accent-cyan'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-12 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Calendar, label: 'Duration', value: '6 Weeks' },
                  { icon: Clock, label: 'Daily Time', value: '3-4 Hours' },
                  { icon: Users, label: 'Group Size', value: '8-12 Students' },
                  { icon: MapPin, label: 'Location', value: 'SIM Lab, Nairobi' },
                ].map((item, index) => (
                  <GlassCard key={index}>
                    <div className="flex flex-col items-center text-center">
                      <item.icon className="w-10 h-10 text-accent-cyan mb-3" />
                      <div className="text-sm text-white/60 mb-1">{item.label}</div>
                      <div className="text-lg font-semibold text-white">{item.value}</div>
                    </div>
                  </GlassCard>
                ))}
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-6">What to Expect</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    'Daily hands-on experiments and projects',
                    'Expert mentorship and guidance',
                    'Access to professional lab equipment',
                    'Collaborative team-based learning',
                    'Weekly project milestones',
                    'Final capstone project presentation',
                    'Certificate of completion',
                    'Portfolio of completed work',
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-accent-cyan flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-12 animate-slide-up">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Program Timeline</h2>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-accent-cyan/30" />
                  <div className="space-y-8">
                    {timeline.map((item, index) => (
                      <div key={index} className="relative pl-12">
                        <div className="absolute left-0 w-8 h-8 rounded-full bg-accent-cyan flex items-center justify-center shadow-glow-cyan">
                          <div className="w-3 h-3 rounded-full bg-white" />
                        </div>
                        <GlassCard hover={false}>
                          <h3 className="text-xl font-semibold text-white mb-2">{item.phase}</h3>
                          <p className="text-accent-cyan mb-2">{item.date}</p>
                          <p className="text-white/70">{item.description}</p>
                        </GlassCard>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Daily Schedule</h2>
                <GlassCard hover={false}>
                  <div className="space-y-4">
                    {[
                      { time: '9:00 - 9:30 AM', activity: 'Morning Assembly & Daily Briefing' },
                      { time: '9:30 - 11:30 AM', activity: 'Core Learning Session' },
                      { time: '11:30 - 12:00 PM', activity: 'Break & Snacks' },
                      { time: '12:00 - 1:00 PM', activity: 'Hands-On Lab Work' },
                      { time: '1:00 - 1:30 PM', activity: 'Reflection & Documentation' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-4 pb-4 border-b border-accent-cyan/10 last:border-0">
                        <div className="w-32 flex-shrink-0 text-accent-cyan font-semibold">{item.time}</div>
                        <div className="text-white/80">{item.activity}</div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="space-y-6 animate-slide-up">
              <h2 className="text-3xl font-bold text-white mb-6">Weekly Breakdown</h2>
              {weeklySchedule.map((week, index) => (
                <GlassCard key={index} hover={false}>
                  <button
                    onClick={() => setExpandedWeek(expandedWeek === index ? null : index)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        Week {week.week}: {week.theme}
                      </h3>
                      <p className="text-white/60 text-sm">Click to expand details</p>
                    </div>
                    <ChevronDown
                      className={`w-6 h-6 text-accent-cyan transition-transform ${
                        expandedWeek === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandedWeek === index && (
                    <div className="mt-6 pt-6 border-t border-accent-cyan/20">
                      <h4 className="text-lg font-semibold text-accent-cyan mb-4">Topics Covered:</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {week.topics.map((topic, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-2 flex-shrink-0" />
                            <span className="text-white/80">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-8 animate-slide-up">
              <GlassCard hover={false}>
                <h2 className="text-2xl font-bold text-white mb-4">Eligibility</h2>
                <ul className="space-y-3">
                  {[
                    'Students in Grades 5-8 (Primary Section)',
                    'Students in Forms 1-4 (Secondary Section)',
                    'Interest in science and innovation',
                    'Willingness to work in teams',
                    'Commitment to attend all sessions',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard hover={false}>
                <h2 className="text-2xl font-bold text-white mb-4">What to Bring</h2>
                <ul className="space-y-3">
                  {[
                    'Notebook and writing materials',
                    'Water bottle and snacks',
                    'Comfortable clothes suitable for lab work',
                    'Positive attitude and curiosity!',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent-cyan mt-2 flex-shrink-0" />
                      <span className="text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard hover={false}>
                <h2 className="text-2xl font-bold text-white mb-4">Program Fee</h2>
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-accent-cyan">KSh 15,000</span>
                    <span className="text-white/60">per student</span>
                  </div>
                  <p className="text-white/70">
                    Includes all materials, equipment use, snacks, and certificate
                  </p>
                  <div className="pt-4 border-t border-accent-cyan/20">
                    <p className="text-accent-cyan font-semibold mb-2">Early Bird Discount: 10% off</p>
                    <p className="text-white/60 text-sm">Register before October 15, 2025</p>
                  </div>
                </div>
              </GlassCard>

              <div className="text-center pt-8">
                <Link href="/register" className="btn-primary">
                  Register Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
