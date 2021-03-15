export default {
  server: {
    port: 3001,
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Themeparks',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'See current and past waiting times and opening times from theme parks all over the world.',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  loading: {
    height: '5px',
    color: '#141243',
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://www.npmjs.com/package/nuxt-leaflet
    'nuxt-leaflet',
    // https://pwa.nuxtjs.org/setup
    '@nuxtjs/pwa',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'https://tp.arendz.nl',
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    mobileApp: true,
    mobileAppIOS: true,
    name: 'Themeparks',
    author: 'Tim Arendsen',
    ogHost: 'https://tpvue.arendz.nl',
    twitterCard: 'summary',
    appleStatusBarStyle: 'black-translucent',
    icon: {
      iconSrc: './static/icon.png',
    },
    manifest: {
      lang: 'en',
      short_name: 'Themeparks',
      name: 'Themeparks',
      start_url: '/',
      display: 'standalone',
      theme_color: '#00b5ad',
    },
    workbox: {
      /* workbox options */
      dev: false,
      offlineStrategy: 'StaleWhileRevalidate',
      runtimeCaching: [
        {
          urlPattern: 'https://tpvue.arendz.om/parks/*',
          handler: 'cacheFirst',
          method: 'GET',
          strategyOptions: {
            cacheName: 'giphy',
            cacheExpiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 10,
            },
          },
        },
      ],
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
