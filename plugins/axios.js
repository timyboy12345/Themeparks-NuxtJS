export default function ({ app, $axios }) {
  $axios.onRequest((request) => {
    if (request.baseURL.includes('tp.arendz.nl')) {
      const locales = app.store.$i18n.locales
      const localeCookie = app.store.$i18n.getLocaleCookie()

      if (!localeCookie) {
        return
      }

      const localeCode = locales.find((l) => l.code === localeCookie)

      if (!localeCode) {
        return
      }

      request.params = {
        ...request.params,
        lang: localeCode.iso,
      }
    }
  })
}
