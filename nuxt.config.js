import webpack from 'webpack'

// eslint-disable-next-line nuxt/no-cjs-in-config
const axios = require('axios')

export default {
  server: {
    port: 3001,
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Themeparkplanner',
    titleTemplate: '%s - Themeparkplanner',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      {
        hid: 'description',
        name: 'description',
        content:
          'See current and past waiting times and opening times from theme parks all over the world. Straight from official data sources.',
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content:
          'See current and past waiting times and opening times from theme parks all over the world. Straight from official data sources.',
      },
      { name: 'msapplication-TileColor', href: '#2b5797' },
      { name: 'theme-color', href: '#3730a3' },
    ],
    link: [
      { rel: 'shortcut icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'apple-mobile-web-app-title', content: 'Themeparks' },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        href: '/loading-screens/iPhone_16_Pro_Max_landscape.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        href: '/loading-screens/iPhone_16_Pro_landscape.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        href: '/loading-screens/iPhone_16_Pro_Max_portrait.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        href: '/loading-screens/iPhone_16_Plus__iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_portrait.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        href: '/loading-screens/iPhone_16__iPhone_15_Pro__iPhone_15__iPhone_14_Pro_landscape.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
        href: '/loading-screens/iPhone_16_Plus__iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_landscape.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        href: '/loading-screens/iPhone_16__iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png',
      },
      {
        rel: 'apple-touch-startup-image',
        media:
          'screen and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        href: '/loading-screens/iPhone_16_Pro_portrait.png',
      },
    ],
    script: [
      {
        hid: 'envsetter',
        innerHTML: `window.oneSignalAppId = '${
          process.env.NODE_ENV === 'production' ? '6011d2bb-3bfa-40cc-adca-3f1b8f1954ee' : 'ce881398-7ed0-4376-bb3b-6a20d63835f3'
        }'`,
      },
      {
        src: 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js',
        defer: true,
      },
      {
        src: '/onesignal.client.js',
      },
    ],
    __dangerouslyDisableSanitizersByTagID: {
      envsetter: ['innerHTML'],
    },
  },

  loading: {
    height: '5px',
    color: '#141243',
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios',
    // Weather data from open-meteo.com
    '~/plugins/open-meteo',
    // https://kuroco.app/docs/faq/how-do-i-set-up-google-analytics-4-in-nuxtjs/
    '~/plugins/gtag',
    { src: '~plugins/markdown', ssr: false },
    // https://vinodugale219.medium.com/add-date-filter-in-nuxtjs-7dead1373d7c
    '~plugins/filters.js',
    // https://stackoverflow.com/questions/67718493/nuxtjs-manage-several-axios-instances
    '~plugins/rcdb',
  ],

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
    // https://pwa.nuxtjs.org/setup
    // '@nuxtjs/pwa',
    // https://www.npmjs.com/package/nuxt-leaflet
    'nuxt-leaflet',
    // https://i18n.nuxtjs.org/setup
    'nuxt-i18n',
    // https://sentry.nuxtjs.org/guide/setup
    '@nuxtjs/sentry',
    // https://www.npmjs.com/package/nuxt-highcharts
    'nuxt-highcharts',
    // https://www.npmjs.com/package/nuxt-lazy-load,
    '@nuxtjs/markdownit',
    [
      'nuxt-lazy-load',
      {
        directiveOnly: true,
      },
    ],
    // https://www.npmjs.com/package/@nuxtjs/sitemap
    '@nuxtjs/sitemap',
    // https://www.npmjs.com/package/@nuxtjs/google-adsense
    [
      '@nuxtjs/google-adsense',
      {
        id: 'ca-pub-3611207014341558',
      },
    ],
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'https://tp.arendz.nl',
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  // pwa: {
  //   mobileApp: true,
  //   mobileAppIOS: true,
  //   name: 'Themeparkplanner',
  //   author: 'Tim Arendsen',
  //   ogHost: 'https://themeparkplanner.com',
  //   twitterCard: 'summary',
  //   appleStatusBarStyle: 'black-translucent',
  //   icon: {
  //     iconSrc: './static/icon.png',
  //   },
  //   manifest: {
  //     lang: 'en',
  //     short_name: 'Themeparkplanner',
  //     name: 'Themeparkplanner',
  //     start_url: '/',
  //     display: 'standalone',
  //     theme_color: '#3730a3',
  //   },
  //   workbox: {
  //     /* workbox options */
  //     dev: false,
  //     offlineStrategy: 'StaleWhileRevalidate',
  //     runtimeCaching: [
  //       {
  //         urlPattern: 'https://themeparkplanner.com/parks/*',
  //         handler: 'cacheFirst',
  //         method: 'GET',
  //         strategyOptions: {
  //           cacheName: 'giphy',
  //           cacheExpiration: {
  //             maxEntries: 100,
  //             maxAgeSeconds: 60 * 60 * 24 * 10,
  //           },
  //         },
  //       },
  //     ],
  //   },
  // },

  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en-US.js',
        countryFlag: 'gb',
      },
      {
        code: 'nl',
        iso: 'nl-NL',
        file: 'nl-NL.js',
        countryFlag: 'nl',
      },
      {
        code: 'es',
        iso: 'es-ES',
        file: 'es-ES.js',
        countryFlag: 'es',
      },
      {
        code: 'de',
        iso: 'de-DE',
        file: 'de-DE.js',
        countryFlag: 'de',
      },
    ],
    defaultLocale: 'en',
    strategy: 'prefix',
    langDir: 'locales',
    seo: true,
    vueI18n: {
      fallbackLocale: 'en',
    },
  },

  sitemap: {
    hostname: 'https://themeparkplanner.com',
    cacheTime: 6000,
    gzip: true,
    exclude: ['/planner/**'],
    routes: async () => {
      const routes = []
      const langs = ['en', 'nl', 'es', 'de']

      // TODO: Implement blog pages
      const { data } = await axios.get('https://tp.arendz.nl/parks')
      data.forEach((park) => {
        langs.forEach((lang) => {
          routes.push({
            url: `/${lang}/parks/${park.id}`,
            priority: 0.8,
            changefreq: 'weekly',
          })
        })
      })

      return routes
    },
    i18n: true,
  },

  sentry: {
    dsn: process.env.NODE_ENV === 'production' ? 'https://6fbc631100c440b9b28e9818d51a14b2@o324258.ingest.sentry.io/5668768' : '', // Enter your project's DSN here
    // Additional Module Options go here
    // https://sentry.nuxtjs.org/sentry/options
    config: {
      tracing: true,
      tracesSampleRate: 1.0,
      // Add native Sentry config here
      // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/
    },
  },

  markdownit: {
    runtime: true, // Support `$md()`
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, { isClient }) {
      // Extend only webpack config for client-bundle
      if (isClient) {
        config.devtool = 'source-map'
      }
    },
    plugins: [
      new webpack.IgnorePlugin({
        resourceRegExp: /@highcharts\/map-collection/,
      }),
      // // Put the Sentry Webpack plugin after all other plugins
      // sentryWebpackPlugin({
      //   authToken: process.env.SENTRY_AUTH_TOKEN,
      //   org: 'wordquest-0n',
      //   project: 'themeparks-vue',
      // }),
    ],
  },
}
