import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Beaker } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-primary-navy text-white border-t border-gray-700 dark:border-accent-cyan/20">
      <div className="border-t border-accent-cyan/20 dark:border-accent-cyan/20 border-gray-700">
        <div className="container-custom section-padding">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-cyan p-2 rounded-lg shadow-glow-cyan-md">
                  <Beaker className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold">
                    <span className="text-white">SIM</span>
                    <span className="text-accent-cyan"> Lab Kenya</span>
                  </div>
                  <div className="text-xs text-accent-light-cyan">Science in Motion</div>
                </div>
              </div>
              <p className="text-white/80 dark:text-white/80 text-gray-300 text-sm leading-relaxed">
                Empowering students through science, innovation, and creativity for a sustainable future.
              </p>
              <div className="flex gap-4 mt-6">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-gradient-cyan flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-accent-cyan">Quick Links</h3>
              <ul className="space-y-3">
                {['Home', 'About', 'Program', 'Schools', 'Gallery', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link
                      href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                      className="text-white/80 dark:text-white/80 text-gray-300 hover:text-accent-cyan transition-colors text-sm"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-accent-cyan">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
                  <span className="text-white/80 dark:text-white/80 text-gray-300 text-sm">+254 712 345 678</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
                  <span className="text-white/80 dark:text-white/80 text-gray-300 text-sm">info@simlabkenya.org</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
                  <span className="text-white/80 dark:text-white/80 text-gray-300 text-sm">I.O.Me001 FabLab, Nairobi, Kenya</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-accent-cyan/20 dark:border-accent-cyan/20 border-gray-700 bg-primary-navy/50 dark:bg-primary-navy/50 bg-gray-800">
          <div className="container-custom px-4 py-6">
            <p className="text-center text-white/60 dark:text-white/60 text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} SIM Lab Kenya. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
