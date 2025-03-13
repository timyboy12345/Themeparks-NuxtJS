export default function ({ app, $axios }) {
  $axios.onRequest((request) => {
    if (!request.url.includes('data.arendz.nl') && !request.url.includes('search.themeparkplanner.com')) {
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

      // Auth token, only if request is to tp.arendz.nl
      if (process.client && localStorage.getItem('jwt_token')) {
        request.headers = {
          ...request.headers,
          Authorization: 'Bearer ' + localStorage.getItem('jwt_token'),
        }
      }
    }
  })
}
