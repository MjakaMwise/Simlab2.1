import { Target, Eye, Heart, ArrowRight, Users, School } from 'lucide-react';
import GlassCard from '@/app/components/GlassCard';
import BubblingFlask from '@/app/components/BubblingFlask';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      <section className="relative bg-gradient-hero py-24 overflow-hidden">
        <div className="absolute inset-0 bg-pattern-circuit opacity-30" />
        <div className="relative z-10 container-custom px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About <span className="text-accent-cyan">SIM Lab Kenya</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Empowering Students through Science, Innovation, and Creativity for a Sustainable Future
          </p>
        </div>
      </section>

      <section className="section-padding bg-primary-navy">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Who We Are
              </h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  SIM Lab Kenya (Science in Motion) is a pioneering STEM education initiative hosted under I.O.Me001 FabLab. We are dedicated to transforming how students engage with science, technology, engineering, and mathematics.
                </p>
                <p>
                  Our Holiday Innovation Program bridges the gap between theoretical classroom learning and practical, hands-on experience. We believe that every student has the potential to be an innovator, and we provide the tools, mentorship, and environment to unlock that potential.
                </p>
                <p>
                  Through our programs, students don't just learn about science—they live it, breathe it, and create with it.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-cyan/10 border-2 border-accent-cyan/30 p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern-circuit opacity-20" />
                <div className="relative z-10 h-full flex items-center justify-center">
                  <BubblingFlask />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-section">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'Innovation',
                description: 'Fostering creative thinking and problem-solving through hands-on experimentation',
              },
              {
                icon: Eye,
                title: 'Excellence',
                description: 'Maintaining high standards in education delivery and student outcomes',
              },
              {
                icon: Heart,
                title: 'Empowerment',
                description: 'Building confidence and capability in every student we serve',
              },
            ].map((value, index) => (
              <GlassCard key={index}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-cyan rounded-xl flex items-center justify-center mb-4 shadow-glow-cyan">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                  <p className="text-white/70">{value.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary-navy">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Why This Program?
          </h2>
          <p className="text-center text-white/80 text-lg mb-12 max-w-3xl mx-auto">
            Bridging the gap between classroom theory and real-world application
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Hands-On Learning',
                description: 'Move beyond textbooks with practical experiments and real-world applications of scientific principles.',
              },
              {
                title: 'Industry-Standard Tools',
                description: 'Access to modern laboratory equipment and technology used by professionals in the field.',
              },
              {
                title: 'Expert Mentorship',
                description: 'Learn from experienced scientists, engineers, and innovators who are passionate about education.',
              },
              {
                title: 'Project Portfolio',
                description: 'Build a collection of completed projects that showcase your skills and creativity.',
              },
              {
                title: 'Collaborative Environment',
                description: 'Work with peers from different schools, sharing ideas and learning from diverse perspectives.',
              },
              {
                title: 'Career Preparation',
                description: 'Gain insights into STEM careers and develop skills that universities and employers value.',
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-4 group">
                <div className="w-12 h-12 rounded-lg bg-accent-cyan/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-cyan transition-colors">
                  <ArrowRight className="w-6 h-6 text-accent-cyan group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-white/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-section">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Two-Tier Model
          </h2>
          <p className="text-center text-white/80 text-lg mb-12 max-w-3xl mx-auto">
            Flexible pathways designed for different learning needs and goals
          </p>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GlassCard hover={false} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-accent-cyan/20 rounded-bl-full" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-cyan flex items-center justify-center shadow-glow-cyan">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Tier 1</h3>
                  </div>
                  <h4 className="text-xl font-semibold text-accent-cyan mb-4">
                    Individual Students
                  </h4>
                  <p className="text-white/80 mb-6">
                    Perfect for students who want to explore STEM during the holidays at their own pace.
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Direct enrollment at SIM Lab facilities',
                      'Flexible scheduling options',
                      'Small group sessions (8-12 students)',
                      'Access to all lab resources',
                      'Certificate upon completion',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-2 flex-shrink-0" />
                        <span className="text-white/70 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>

              <GlassCard hover={false} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-accent-cyan/20 rounded-bl-full" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-cyan flex items-center justify-center shadow-glow-cyan">
                      <School className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Tier 2</h3>
                  </div>
                  <h4 className="text-xl font-semibold text-accent-cyan mb-4">
                    School Partnerships
                  </h4>
                  <p className="text-white/80 mb-6">
                    For schools wanting to provide enrichment programs for their students during the holidays.
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Customized curriculum for your school',
                      'On-site or at SIM Lab delivery options',
                      'Group rates and packages',
                      'Teacher training included',
                      'Ongoing support and resources',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-2 flex-shrink-0" />
                        <span className="text-white/70 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-4 px-6 py-4 bg-accent-cyan/10 rounded-xl border border-accent-cyan/30">
                <div className="w-3 h-3 rounded-full bg-accent-cyan animate-pulse" />
                <p className="text-white/90">
                  Both tiers follow the same high-quality curriculum and standards
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
