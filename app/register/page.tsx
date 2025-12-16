'use client';

import { useState } from 'react';
import { CheckCircle, User, Mail, Phone, School as SchoolIcon, Calendar } from 'lucide-react';
import GlassCard from '@/app/components/GlassCard';
import Button from '@/app/components/Button';
import Notification from '@/app/components/Notification';
import { studentRegistrationService } from '@/lib/database';
import type { StudentRegistration } from '@/lib/supabase';

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    school: '',
    grade: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    tier: 'individual',
  });

  const steps = [
    { number: 1, title: 'Personal Info' },
    { number: 2, title: 'School Details' },
    { number: 3, title: 'Parent/Guardian' },
    { number: 4, title: 'Payment' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      await submitRegistration();
    }
  };

  const submitRegistration = async () => {
    setIsSubmitting(true);

    try {
      const registrationData: StudentRegistration = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        school: formData.school,
        grade: formData.grade,
        parent_name: formData.parentName,
        parent_phone: formData.parentPhone,
        parent_email: formData.parentEmail,
        registration_type: formData.tier as 'individual' | 'school',
        payment_status: 'pending',
        amount_paid: 13500,
      };

      const result = await studentRegistrationService.create(registrationData);

      if (result) {
        setRegistrationId(result.id || null);
        setNotification({
          type: 'success',
          message: 'Registration submitted successfully! We will contact you within 24 hours to confirm your payment.',
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setNotification({
        type: 'error',
        message: 'Failed to submit registration. Please try again or contact us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <section className="relative bg-gradient-hero py-24 overflow-hidden">
        <div className="absolute inset-0 bg-pattern-circuit opacity-30" />
        <div className="relative z-10 container-custom px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Register for <span className="text-accent-cyan">Holiday 2025</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Secure your spot in the most exciting science program this holiday season
          </p>
        </div>
      </section>

      <section className="section-padding bg-primary-navy">
        <div className="container-custom max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <GlassCard hover={false}>
                <h3 className="text-xl font-bold text-white mb-6">Registration Steps</h3>
                <div className="space-y-4">
                  {steps.map((step) => (
                    <div
                      key={step.number}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                        currentStep === step.number
                          ? 'bg-accent-cyan/20'
                          : currentStep > step.number
                          ? 'bg-accent-cyan/10'
                          : 'bg-white/5'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                          currentStep > step.number
                            ? 'bg-accent-cyan text-white'
                            : currentStep === step.number
                            ? 'bg-gradient-cyan text-white'
                            : 'bg-white/10 text-white/50'
                        }`}
                      >
                        {currentStep > step.number ? <CheckCircle size={16} /> : step.number}
                      </div>
                      <span
                        className={`font-medium ${
                          currentStep >= step.number ? 'text-white' : 'text-white/50'
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-accent-cyan/20">
                  <h4 className="text-lg font-semibold text-white mb-4">Program Fee</h4>
                  <div className="text-3xl font-bold text-accent-cyan mb-2">KSh 15,000</div>
                  <p className="text-white/60 text-sm mb-4">Per student for 6 weeks</p>
                  <div className="bg-accent-cyan/10 rounded-lg p-3">
                    <p className="text-accent-cyan font-semibold text-sm">Early Bird: KSh 13,500</p>
                    <p className="text-white/60 text-xs">Save 10% until Oct 15</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="lg:col-span-2">
              <GlassCard hover={false}>
                <div className="mb-6">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-cyan transition-all duration-300"
                      style={{ width: `${(currentStep / 4) * 100}%` }}
                    />
                  </div>
                  <p className="text-white/60 text-sm mt-2">
                    Step {currentStep} of {steps.length}
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {currentStep === 1 && (
                    <div className="space-y-6 animate-slide-up">
                      <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-white/80 mb-2">First Name *</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-cyan" />
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                              className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all"
                              placeholder="Enter first name"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-white/80 mb-2">Last Name *</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-cyan" />
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                              className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all"
                              placeholder="Enter last name"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/80 mb-2">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-cyan" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all"
                            placeholder="student@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/80 mb-2">Phone Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-cyan" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all"
                            placeholder="+254 712 345 678"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6 animate-slide-up">
                      <h2 className="text-2xl font-bold text-white mb-6">School Details</h2>

                      <div>
                        <label className="block text-white/80 mb-2">School Name *</label>
                        <div className="relative">
                          <SchoolIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-cyan" />
                          <input
                            type="text"
                            name="school"
                            value={formData.school}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all"
                            placeholder="Enter school name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/80 mb-2">Current Grade/Form *</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-cyan" />
                          <select
                            name="grade"
                            value={formData.grade}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all appearance-none"
                          >
                            <option value="">Select grade</option>
                            <optgroup label="Primary">
                              <option value="grade5">Grade 5</option>
                              <option value="grade6">Grade 6</option>
                              <option value="grade7">Grade 7</option>
                              <option value="grade8">Grade 8</option>
                            </optgroup>
                            <optgroup label="Secondary">
                              <option value="form1">Form 1</option>
                              <option value="form2">Form 2</option>
                              <option value="form3">Form 3</option>
                              <option value="form4">Form 4</option>
                            </optgroup>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/80 mb-4">Registration Type *</label>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-accent-cyan/30 cursor-pointer hover:bg-white/10 transition-all">
                            <input
                              type="radio"
                              name="tier"
                              value="individual"
                              checked={formData.tier === 'individual'}
                              onChange={handleInputChange}
                              className="w-5 h-5 text-accent-cyan"
                            />
                            <div>
                              <div className="text-white font-semibold">Individual Student</div>
                              <div className="text-white/60 text-sm">Register as an individual learner</div>
                            </div>
                          </label>
                          <label className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-accent-cyan/30 cursor-pointer hover:bg-white/10 transition-all">
                            <input
                              type="radio"
                              name="tier"
                              value="school"
                              checked={formData.tier === 'school'}
                              onChange={handleInputChange}
                              className="w-5 h-5 text-accent-cyan"
                            />
                            <div>
                              <div className="text-white font-semibold">School Partnership</div>
                              <div className="text-white/60 text-sm">Register through your school</div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6 animate-slide-up">
                      <h2 className="text-2xl font-bold text-white mb-6">Parent/Guardian Information</h2>

                      <div>
                        <label className="block text-white/80 mb-2">Parent/Guardian Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-cyan" />
                          <input
                            type="text"
                            name="parentName"
                            value={formData.parentName}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all"
                            placeholder="Enter parent/guardian name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/80 mb-2">Parent/Guardian Phone *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-cyan" />
                          <input
                            type="tel"
                            name="parentPhone"
                            value={formData.parentPhone}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all"
                            placeholder="+254 712 345 678"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/80 mb-2">Parent/Guardian Email *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-cyan" />
                          <input
                            type="email"
                            name="parentEmail"
                            value={formData.parentEmail}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all"
                            placeholder="parent@example.com"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-6 animate-slide-up">
                      <h2 className="text-2xl font-bold text-white mb-6">Payment Information</h2>

                      <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-white/80">Program Fee:</span>
                          <span className="text-2xl font-bold text-white">KSh 15,000</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-white/60">
                          <span>Early Bird Discount (10%):</span>
                          <span>- KSh 1,500</span>
                        </div>
                        <div className="border-t border-accent-cyan/20 my-4" />
                        <div className="flex items-center justify-between">
                          <span className="text-lg text-white font-semibold">Total Due:</span>
                          <span className="text-3xl font-bold text-accent-cyan">KSh 13,500</span>
                        </div>
                      </div>

                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">M-Pesa Payment</h3>
                        <ol className="space-y-3 text-white/80">
                          <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white text-sm flex items-center justify-center">1</span>
                            <span>Go to M-Pesa menu on your phone</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white text-sm flex items-center justify-center">2</span>
                            <span>Select Lipa na M-Pesa, then Paybill</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white text-sm flex items-center justify-center">3</span>
                            <span>Business Number: <strong className="text-white">523400</strong></span>
                          </li>
                          <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white text-sm flex items-center justify-center">4</span>
                            <span>Account Number: <strong className="text-white">SIMLAB2025</strong></span>
                          </li>
                          <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white text-sm flex items-center justify-center">5</span>
                            <span>Amount: <strong className="text-white">13500</strong></span>
                          </li>
                        </ol>

                        <div className="mt-6 pt-4 border-t border-green-500/20">
                          <p className="text-white/60 text-sm">
                            After payment, you will receive a confirmation SMS. Our team will contact you within 24 hours.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-8 pt-6 border-t border-accent-cyan/20">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="flex-1"
                      >
                        Previous
                      </Button>
                    )}
                    <Button type="submit" className="flex-1" disabled={isSubmitting || registrationId !== null}>
                      {isSubmitting ? 'Submitting...' : currentStep === 4 ? (registrationId ? 'Registration Complete!' : 'Complete Registration') : 'Next Step'}
                    </Button>
                  </div>
                </form>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
