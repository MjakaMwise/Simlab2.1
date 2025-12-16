import type { Metadata } from 'next';
import './globals.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { ThemeProvider } from '@/lib/contexts/theme-context';

export const metadata: Metadata = {
  title: 'SIM Lab Kenya - Holiday Innovation Program 2025',
  description: 'SIM Lab Kenya - Holiday Innovation Program 2025. Empowering students through hands-on science, innovation, and creativity for a sustainable future.',
  keywords: ['SIM Lab', 'Kenya', 'STEM education', 'science program', 'innovation', 'holiday program', 'students', 'learning'],
  themeColor: '#003052',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-primary-navy transition-colors duration-300">
        <ThemeProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
