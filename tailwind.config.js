import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
      },
      colors: {
        city: {
          bg: '#EEF3F8',
          bgSecondary: '#F5F7FA',
          primary: '#3B82F6',
          secondary: '#60A5FA',
          glow: '#00D8FF',
          success: '#34D399',
          warning: '#F59E0B',
          danger: '#EF4444',
          textPrimary: '#111827',
          textSecondary: '#6B7280',
        },
      },
      boxShadow: {
        glass: '0 20px 60px rgba(15, 23, 42, 0.12)',
        'glass-hover': '0 25px 70px rgba(15, 23, 42, 0.18)',
        glow: '0 0 25px rgba(0, 216, 255, 0.6)',
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
  ],
};
