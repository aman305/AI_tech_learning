/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        'primary-dark': '#1d4ed8',
        'primary-light': '#dbeafe',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        bg: '#f4f6fb',
        surface: '#ffffff',
        sidebar: '#202123',
        'code-bg': '#0d1117',
        'code-text': '#e6edf3',
        'text-main': '#1f2937',
        'text-muted': '#6b7280',
      },
    },
  },
  plugins: [],
};
