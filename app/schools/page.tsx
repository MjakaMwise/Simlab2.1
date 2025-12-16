import Link from 'next/link';
import { Download, Users, TrendingUp, Award, CheckCircle, School } from 'lucide-react';
import GlassCard from '@/app/components/GlassCard';

export default function SchoolsPage() {
  const benefits = [
    {
      icon: Users,
      title: 'Student Engagement',
      description: 'Keep students engaged during holidays with meaningful STEM activities',
    },
    {
      icon: TrendingUp,
      title: 'Enhanced Curriculum',
      description: 'Complement your science curriculum with practical, hands-on experiences',
    },
    {
      icon: Award,
      title: 'Recognition',
      description: 'Demonstrate commitment to quality STEM education and innovation',
    },
  ];

  const packages = [
    {
      name: 'Bronze Package',
      students: '10-20 students',
      price: 'KSh 120,000',
      features: [
        'Access to SIM Lab facilities',
        'Standard curriculum delivery',
        '6-week program duration',
        'Basic equipment and materials',
        'Certificates for all students',
      ],
    },
    {
      name: 'Silver Package',
      students: '21-40 students',
      price: 'KSh 200,000',
      features: [
        'On-site or SIM Lab delivery',
        'Customized curriculum options',
        '6-week program duration',
        'Full equipment and materials',
        'Certificates for all students',
        'Monthly progress reports',
      ],
      popular: true,
    },
    {
      name: 'Gold Package',
      students: '40+ students',
      price: 'Custom Quote',
      features: [
        'Flexible delivery location',
        'Fully customized curriculum',
        'Extended program options',
        'Premium equipment access',
        'Certificates for all students',
        'Weekly progress reports',
        'Teacher training included',
        'Ongoing support & resources',
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      <section className="relative bg-gradient-hero py-24 overflow-hidden">
        <div className="absolute inset-0 bg-pattern-circuit opacity-30" />
        <div className="relative z-10 container-custom px-4 text-center">
          <School className="w-20 h-20 text-accent-cyan mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Partner with <span className="text-accent-cyan">SIM Lab</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Empower your students with world-class STEM education during the holidays
          </p>
        </div>
      </section>

      <section className="section-padding bg-primary-navy">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Why Partner With Us?
          </h2>
          <p className="text-center text-white/80 text-lg mb-12 max-w-3xl mx-auto">
            Join leading schools across Kenya in providing exceptional holiday enrichment programs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <GlassCard key={index}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-cyan rounded-xl flex items-center justify-center mb-4 shadow-glow-cyan">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
                  <p className="text-white/70">{benefit.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-section">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Partnership Packages
          </h2>
          <p className="text-center text-white/80 text-lg mb-12 max-w-3xl mx-auto">
            Flexible options to suit your school's needs and budget
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <GlassCard
                key={index}
                hover={false}
                className={`relative ${pkg.popular ? 'ring-2 ring-accent-cyan' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-cyan px-4 py-1 rounded-full text-white text-sm font-semibold shadow-glow-cyan">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="text-accent-cyan text-sm mb-4">{pkg.students}</p>
                  <div className="text-3xl font-bold text-accent-cyan">{pkg.price}</div>
                </div>

                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
                      <span className="text-white/80 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/contact" className={`${pkg.popular ? 'btn-primary' : 'btn-secondary'} w-full block text-center`}>
                  Contact Us
                </Link>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary-navy">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            What's Included?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: 'Comprehensive Curriculum',
                description: 'Aligned with CBC and Cambridge frameworks, covering chemistry, physics, biology, and technology',
              },
              {
                title: 'Expert Facilitators',
                description: 'Experienced educators and industry professionals passionate about STEM education',
              },
              {
                title: 'Quality Materials',
                description: 'All lab materials, equipment, and consumables provided for hands-on experiments',
              },
              {
                title: 'Safety First',
                description: 'Comprehensive safety protocols and supervision throughout the program',
              },
              {
                title: 'Progress Tracking',
                description: 'Regular updates and detailed reports on student progress and achievements',
              },
              {
                title: 'Certification',
                description: 'Official certificates of completion and portfolio of student work',
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent-cyan/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-accent-cyan" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-white/70 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-hero">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Partner?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Download our partnership brochure or contact us to discuss your school's needs
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                <Download className="w-5 h-5 mr-2" />
                Download Brochure
              </button>
              <Link href="/contact" className="btn-secondary">
                Contact Us
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-accent-cyan/20">
              <p className="text-white/80 mb-4">Trusted by leading schools across Kenya</p>
              <div className="flex flex-wrap justify-center gap-6 text-white/60 text-sm">
                <span>Nairobi Primary</span>
                <span>Mombasa Academy</span>
                <span>Kisumu International</span>
                <span>Nakuru School of Science</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
