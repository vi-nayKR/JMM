/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        ink: {
          bg: 'var(--ink-bg)',
          surface: 'var(--ink-surface)',
          raised: 'var(--ink-surface-raised)',
          border: 'var(--ink-border)',
          text: 'var(--ink-text)',
          muted: 'var(--ink-text-muted)',
          faint: 'var(--ink-text-faint)',
          accent: {
            DEFAULT: 'var(--ink-accent)',
            hover: '#1d4ed8',
            contrast: 'var(--ink-accent-contrast)',
          },
        },
      },
      fontFamily: {
        serif: ['Georgia', '"Times New Roman"', 'Times', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
