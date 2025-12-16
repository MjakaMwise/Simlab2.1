/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          navy: '#003052',
          blue: '#004B7A',
          'light-bg': '#F5F9FC',
          'light-text': '#1A202C',
        },
        accent: {
          cyan: '#00A9E0',
          'light-cyan': '#4FC3F7',
          'dark-cyan': '#0088B8',
        },
        'off-white': '#F5F9FC',
        light: {
          bg: '#FFFFFF',
          'bg-secondary': '#F7FAFC',
          'bg-tertiary': '#EDF2F7',
          text: '#1A202C',
          'text-secondary': '#4A5568',
          'text-tertiary': '#718096',
          border: '#E2E8F0',
        },
        dark: {
          bg: '#003052',
          'bg-secondary': '#004B7A',
          'bg-tertiary': '#00598F',
          text: '#FFFFFF',
          'text-secondary': '#E2E8F0',
          'text-tertiary': '#CBD5E0',
          border: '#2D3748',
        },
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #003052 0%, #0066A1 50%, #00A9E0 100%)',
        'gradient-section': 'linear-gradient(to right, #003052, #004B7A)',
        'gradient-button': 'linear-gradient(90deg, #00A9E0, #4FC3F7)',
        'gradient-cyan': 'linear-gradient(90deg, #00A9E0, #4FC3F7)',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 169, 224, 0.5)',
        'glow-cyan-md': '0 4px 15px rgba(0, 169, 224, 0.3)',
        'glow-cyan-lg': '0 6px 20px rgba(0, 169, 224, 0.4)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bubble': 'bubble 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        bubble: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.6' },
          '50%': { transform: 'translateY(-100px) scale(1.1)', opacity: '0.8' },
          '100%': { transform: 'translateY(-200px) scale(0.8)', opacity: '0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 169, 224, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 169, 224, 0.6)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
