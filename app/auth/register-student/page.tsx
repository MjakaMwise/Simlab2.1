'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Calendar, Users, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '@/lib/services/auth-service';
import type { StudentRegistrationForm, RelationshipType } from '@/lib/types';

export default function RegisterStudentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<StudentRegistrationForm>({
    student: {
      full_name: '',
      email: '',
      password: '',
      date_of_birth: '',
      age: 0,
    },
    parents: [
      {
        full_name: '',
        email: '',
        phone: '',
        relationship_type: 'mother' as RelationshipType,
      },
    ],
  });

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleStudentChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      student: {
        ...prev.student,
        [field]: value,
        ...(field === 'date_of_birth' && { age: calculateAge(value) }),
      },
    }));
  };

  const handleParentChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      parents: prev.parents.map((parent, i) =>
        i === index ? { ...parent, [field]: value } : parent
      ),
    }));
  };

  const addParent = () => {
    setFormData(prev => ({
      ...prev,
      parents: [
        ...prev.parents,
        {
          full_name: '',
          email: '',
          phone: '',
          relationship_type: 'father' as RelationshipType,
        },
      ],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await authService.registerStudent(formData);

    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-12">
        <div className="absolute inset-0 bg-pattern-circuit opacity-20" />
        <div className="relative z-10 w-full max-w-2xl">
          <div className="glass-card p-8 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Registration Submitted!</h1>
            <p className="text-white/80 mb-6 leading-relaxed">
              Thank you for registering! Your account is pending approval from our administrators.
              You and your parents will receive an email once your account is approved.
            </p>
            <p className="text-white/60 text-sm mb-8">
              This usually takes 1-2 business days.
            </p>
            <Link href="/" className="btn-primary inline-block">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero px-4 py-12">
      <div className="absolute inset-0 bg-pattern-circuit opacity-20" />

      <div className="relative z-10 w-full max-w-3xl mx-auto">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Join <span className="text-accent-cyan">STEM Lab</span>
            </h1>
            <p className="text-white/70">Start your learning adventure today!</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8 gap-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= num
                      ? 'bg-accent-cyan text-white'
                      : 'bg-white/10 text-white/40'
                  }`}
                >
                  {num}
                </div>
                {num < 3 && (
                  <div
                    className={`w-12 h-1 mx-2 transition-all ${
                      step > num ? 'bg-accent-cyan' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Student Information */}
            {step === 1 && (
              <div className="space-y-6 animate-slide-up">
                <h2 className="text-xl font-bold text-white mb-4">Student Information</h2>

                <div>
                  <label className="block text-white/80 mb-2 text-sm font-medium">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-cyan/60" />
                    <input
                      type="text"
                      value={formData.student.full_name}
                      onChange={(e) => handleStudentChange('full_name', e.target.value)}
                      required
                      className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg pl-11 pr-4 py-3 text-white"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 mb-2 text-sm font-medium">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-cyan/60" />
                    <input
                      type="email"
                      value={formData.student.email}
                      onChange={(e) => handleStudentChange('email', e.target.value)}
                      required
                      className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg pl-11 pr-4 py-3 text-white"
                      placeholder="student@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 mb-2 text-sm font-medium">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-cyan/60" />
                    <input
                      type="password"
                      value={formData.student.password}
                      onChange={(e) => handleStudentChange('password', e.target.value)}
                      required
                      minLength={8}
                      className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg pl-11 pr-4 py-3 text-white"
                      placeholder="At least 8 characters"
                    />
                  </div>
                  <p className="text-white/50 text-xs mt-1">
                    Must be at least 8 characters long
                  </p>
                </div>

                <div>
                  <label className="block text-white/80 mb-2 text-sm font-medium">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-cyan/60" />
                    <input
                      type="date"
                      value={formData.student.date_of_birth}
                      onChange={(e) => handleStudentChange('date_of_birth', e.target.value)}
                      required
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg pl-11 pr-4 py-3 text-white"
                    />
                  </div>
                  {formData.student.age > 0 && (
                    <p className="text-accent-cyan text-sm mt-1">
                      Age: {formData.student.age} years old
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={
                    !formData.student.full_name ||
                    !formData.student.email ||
                    !formData.student.password ||
                    !formData.student.date_of_birth ||
                    formData.student.age < 5 ||
                    formData.student.age > 18
                  }
                  className="w-full btn-primary disabled:opacity-50"
                >
                  Next: Parent Information
                </button>
              </div>
            )}

            {/* Step 2: Parent Information */}
            {step === 2 && (
              <div className="space-y-6 animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Parent/Guardian Information</h2>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-accent-cyan text-sm hover:text-accent-light-cyan"
                  >
                    ← Back
                  </button>
                </div>

                {formData.parents.map((parent, index) => (
                  <div key={index} className="p-6 bg-white/5 rounded-lg space-y-4 border border-accent-cyan/20">
                    <h3 className="font-semibold text-white mb-4">
                      Parent/Guardian {index + 1}
                    </h3>

                    <div>
                      <label className="block text-white/80 mb-2 text-sm font-medium">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={parent.full_name}
                        onChange={(e) => handleParentChange(index, 'full_name', e.target.value)}
                        required
                        className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg px-4 py-3 text-white"
                        placeholder="Jane Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 mb-2 text-sm font-medium">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={parent.email}
                        onChange={(e) => handleParentChange(index, 'email', e.target.value)}
                        required
                        className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg px-4 py-3 text-white"
                        placeholder="parent@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 mb-2 text-sm font-medium">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={parent.phone}
                        onChange={(e) => handleParentChange(index, 'phone', e.target.value)}
                        required
                        className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg px-4 py-3 text-white"
                        placeholder="+254 712 345 678"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 mb-2 text-sm font-medium">
                        Relationship *
                      </label>
                      <select
                        value={parent.relationship_type}
                        onChange={(e) => handleParentChange(index, 'relationship_type', e.target.value)}
                        required
                        className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg px-4 py-3 text-white"
                      >
                        <option value="mother">Mother</option>
                        <option value="father">Father</option>
                        <option value="guardian">Guardian</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                ))}

                {formData.parents.length < 3 && (
                  <button
                    type="button"
                    onClick={addParent}
                    className="w-full py-3 bg-white/5 border border-accent-cyan/30 rounded-lg text-accent-cyan hover:bg-white/10 transition-all"
                  >
                    + Add Another Parent/Guardian
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full btn-primary"
                >
                  Next: Review & Submit
                </button>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
              <div className="space-y-6 animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Review Your Information</h2>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-accent-cyan text-sm hover:text-accent-light-cyan"
                  >
                    ← Back
                  </button>
                </div>

                <div className="p-6 bg-white/5 rounded-lg border border-accent-cyan/20">
                  <h3 className="font-semibold text-white mb-3">Student</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-white/70">
                      <span className="text-white/50">Name:</span> {formData.student.full_name}
                    </p>
                    <p className="text-white/70">
                      <span className="text-white/50">Email:</span> {formData.student.email}
                    </p>
                    <p className="text-white/70">
                      <span className="text-white/50">Age:</span> {formData.student.age} years old
                    </p>
                  </div>
                </div>

                {formData.parents.map((parent, index) => (
                  <div key={index} className="p-6 bg-white/5 rounded-lg border border-accent-cyan/20">
                    <h3 className="font-semibold text-white mb-3">Parent/Guardian {index + 1}</h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/70">
                        <span className="text-white/50">Name:</span> {parent.full_name}
                      </p>
                      <p className="text-white/70">
                        <span className="text-white/50">Email:</span> {parent.email}
                      </p>
                      <p className="text-white/70">
                        <span className="text-white/50">Phone:</span> {parent.phone}
                      </p>
                      <p className="text-white/70">
                        <span className="text-white/50">Relationship:</span> {parent.relationship_type}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="p-4 bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg">
                  <p className="text-white/90 text-sm leading-relaxed">
                    By submitting this registration, you acknowledge that your account will be reviewed
                    by our administrators. You will receive an email confirmation once approved.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {isLoading ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>
            )}
          </form>

          <div className="mt-6 pt-6 border-t border-accent-cyan/20 text-center">
            <p className="text-white/70 text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-accent-cyan hover:text-accent-light-cyan font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
