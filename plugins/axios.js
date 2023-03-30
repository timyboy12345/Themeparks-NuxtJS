export default function ({ app, $axios }) {
  $axios.onRequest((request) => {
    if (request.baseURL.includes('tp.arendz.nl')) {
      const locales = app.store.$i18n.locales
      const localeCookie = app.store.$i18n.getLocaleCookie()

      if (localeCookie) {
        const localeCode = locales.find((l) => l.code === localeCookie)

        if (localeCode) {
          request.params = {
            ...request.params,
            lang: localeCode.iso,
          }
        }
      }

      // Auth token
      if (process.client && localStorage.getItem('jwt_token')) {
        request.headers = {
          ...request.headers,
          Authorization: 'Bearer ' + localStorage.getItem('jwt_token'),
        }
      }
    }
  })
}
