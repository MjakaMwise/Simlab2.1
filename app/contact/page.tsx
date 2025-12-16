'use client';

import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';
import GlassCard from '@/app/components/GlassCard';
import Button from '@/app/components/Button';
import Notification from '@/app/components/Notification';
import { contactSubmissionService } from '@/lib/database';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await contactSubmissionService.create({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      setNotification({
        type: 'success',
        message: 'Thank you for contacting us! We will respond to your message within 24 hours.',
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Contact submission error:', error);
      setNotification({
        type: 'error',
        message: 'Failed to send message. Please try again or contact us directly via phone or email.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      content: '+254 712 345 678',
      subContent: 'Mon-Fri, 8AM-5PM',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@simlabkenya.org',
      subContent: 'We reply within 24 hours',
    },
    {
      icon: MapPin,
      title: 'Location',
      content: 'I.O.Me001 FabLab',
      subContent: 'Nairobi, Kenya',
    },
    {
      icon: Clock,
      title: 'Office Hours',
      content: 'Mon - Fri: 8AM - 5PM',
      subContent: 'Sat: 9AM - 1PM',
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      <section className="relative bg-gradient-hero py-24 overflow-hidden">
        <div className="absolute inset-0 bg-pattern-circuit opacity-30" />
        <div className="relative z-10 container-custom px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Get in <span className="text-accent-cyan">Touch</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Have questions? We're here to help you learn more about our programs
          </p>
        </div>
      </section>

      <section className="section-padding bg-primary-navy">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <GlassCard key={index}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-gradient-cyan rounded-xl flex items-center justify-center mb-4 shadow-glow-cyan">
                    <info.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{info.title}</h3>
                  <p className="text-white/90 font-medium">{info.content}</p>
                  <p className="text-white/60 text-sm mt-1">{info.subContent}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Send Us a Message</h2>
              <p className="text-white/70 mb-8">
                Fill out the form below and our team will get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white/80 mb-2">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full bg-white/5 border border-accent-cyan/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <Send className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Visit Our Lab</h2>
              <p className="text-white/70 mb-8">
                Come see our state-of-the-art facilities and meet our team in person.
              </p>

              <GlassCard hover={false} className="mb-6">
                <div className="aspect-video bg-gradient-section rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255281.19034123717!2d36.7073!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="SIM Lab Location"
                  />
                </div>
              </GlassCard>

              <GlassCard hover={false}>
                <h3 className="text-xl font-semibold text-white mb-4">Operating Hours</h3>
                <div className="space-y-3">
                  {[
                    { day: 'Monday - Friday', hours: '8:00 AM - 5:00 PM' },
                    { day: 'Saturday', hours: '9:00 AM - 1:00 PM' },
                    { day: 'Sunday', hours: 'Closed' },
                  ].map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center pb-3 border-b border-accent-cyan/10 last:border-0">
                      <span className="text-white/80">{schedule.day}</span>
                      <span className="text-accent-cyan font-medium">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <div className="mt-6 p-6 bg-accent-cyan/10 border border-accent-cyan/30 rounded-xl">
                <h4 className="text-lg font-semibold text-white mb-2">Quick Response</h4>
                <p className="text-white/70 text-sm">
                  For urgent inquiries, call us directly at <span className="text-accent-cyan font-semibold">+254 712 345 678</span> during business hours.
                </p>
              </div>
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
