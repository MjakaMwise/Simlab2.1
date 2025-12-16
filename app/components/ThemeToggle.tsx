'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/contexts/theme-context';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 
                 dark:bg-white/10 dark:hover:bg-white/20
                 flex items-center justify-center
                 transition-all duration-300 group"
            aria-label="Toggle theme"
        >
            <Sun
                className={`w-5 h-5 text-accent-cyan absolute transition-all duration-300 ${theme === 'light'
                        ? 'rotate-0 opacity-100 scale-100'
                        : 'rotate-90 opacity-0 scale-0'
                    }`}
            />
            <Moon
                className={`w-5 h-5 text-accent-cyan absolute transition-all duration-300 ${theme === 'dark'
                        ? 'rotate-0 opacity-100 scale-100'
                        : '-rotate-90 opacity-0 scale-0'
                    }`}
            />
        </button>
    );
}
