module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  darkMode: false,
  purge: {
    content: [
      './components/**/*.{vue,js}',
      './layouts/**/*.vue',
      './views/**/*.{vue,js}',
      './pages/**/*.vue',
      './plugins/**/*.{js,ts}',
      './nuxt.config.{js,ts}',
    ],
    options: {
      whitelist: ['bg-gray-500', 'space-x-2'],
    },
  },
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      height: {
        72: '18rem',
        80: '20rem',
        96: '24rem',
        128: '32rem',
      },
      minHeight: {
        64: '16rem',
      },
    },
  },
  variants: {},
  plugins: [],
}
