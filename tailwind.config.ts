import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      background: '#FFFFFF',
      surface: '#F5F5F7',
      foreground: '#1D1D1F',
      muted: '#86868B',
      border: '#D2D2D7',
      primary: '#0071E3',
      'primary-hover': '#0077ED',
      success: '#34C759',
      warning: '#FF9500',
      error: '#FF3B30',
      white: '#FFFFFF',
      transparent: 'transparent',
    },
    fontFamily: {
      sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Arial', 'sans-serif'],
    },
    fontSize: {
      tiny: ['12px', { lineHeight: '1.3', fontWeight: '500' }],
      small: ['14px', { lineHeight: '1.4' }],
      base: ['17px', { lineHeight: '1.5' }],
      lg: ['20px', { lineHeight: '1.3', fontWeight: '600' }],
      xl: ['24px', { lineHeight: '1.25', fontWeight: '600' }],
      '2xl': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
      '3xl': ['48px', { lineHeight: '1.1', fontWeight: '600' }],
    },
    borderRadius: {
      none: '0',
      sm: '4px',
      DEFAULT: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px',
    },
    spacing: {
      0: '0',
      px: '1px',
      0.5: '2px',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '24px',
      6: '32px',
      8: '48px',
      10: '64px',
      12: '96px',
    },
    extend: {
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;
