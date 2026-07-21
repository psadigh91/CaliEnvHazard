import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'calej-green': '#2D5F3F',
        'calej-blue': '#1E3A8A',
        'calej-orange': '#EA580C',
      },
    },
  },
  plugins: [],
}
export default config
