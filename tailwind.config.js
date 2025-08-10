/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A0A0A',
        secondary: '#141414',
        accent: '#FFD700',
        'accent-dark': '#E6C200',
        'accent-light': '#FFE44D',
        wedding: {
          primary: '#fff5f5',
          secondary: '#faf1ed',
          accent: '#f9c6c6',
          dark: '#2c1810',
          text: '#4a2c1d',
          muted: '#8e7b74',
          overlay: 'rgba(251, 239, 234, 0.95)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 215, 0, 0.15)',
        'glow-strong': '0 0 30px rgba(255, 215, 0, 0.25)',
      },
      backgroundImage: {
        'gradient-radial-dark': 'radial-gradient(circle at center, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 70%)',
      },
    },
  },
  plugins: [],
} 