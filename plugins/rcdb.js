export default function ({ $axios }, inject) {
  // Create a custom axios instance
  const rcdb = $axios.create({
    headers: {
      common: {
        Accept: 'application/json, */*',
      },
    },
  })

  // Set baseURL to something different
  rcdb.setBaseURL('https://rcdb-api.vercel.app')

  // Inject to context as $api
  inject('rcdb', rcdb)
}
