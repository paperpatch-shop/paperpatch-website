/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#faf8f5',
          100: '#f5f1ea',
          200: '#ebe3d5',
          300: '#dfd4bf',
          400: '#d3c5aa',
          500: '#c7b695',
          600: '#b5a077',
          700: '#8f7d5c',
          800: '#6a5c43',
          900: '#453c2d',
        },
        warm: {
          50: '#fef9f3',
          100: '#fdf3e7',
          200: '#fae7cf',
          300: '#f7dbb7',
          400: '#f4cf9f',
          500: '#f1c387',
          600: '#d9a96c',
          700: '#b38a54',
          800: '#8d6b3d',
          900: '#674c27',
        },
        brown: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'paper-texture': "url('/paper-texture.svg')",
      }
    },
  },
  plugins: [],
}
