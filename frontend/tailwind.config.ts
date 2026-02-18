import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif']
      },
      colors: {
        ink: '#0f172a',
        slate: '#64748b',
        surface: '#f8fafc',
        panel: '#ffffff',
        accent: '#2563eb',
        accentSoft: '#dbeafe',
        warning: '#f97316',
        success: '#16a34a'
      },
      boxShadow: {
        soft: '0 14px 40px rgba(15, 23, 42, 0.12)',
        card: '0 6px 20px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
} satisfies Config;
