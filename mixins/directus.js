export async function getPosts($axios, $sentry, locale, limit) {
  return await $axios
    .get(constructUrl(null, locale, limit, '-date_updated', '*,translations.*,header.*'))
    .then((blogPosts) => {
      return sortPosts(blogPosts.data)
    })
    .catch((reason) => {
      $sentry.captureException(reason)
      throw reason
    })
}

export async function getPostsForPark($axios, $sentry, locale, parkId) {
  return await $axios
    .get(constructUrl(parkId, locale, 3, null, '*,translations.*,header.*,user_created.*'))
    .then((blogPosts) => {
      return sortPosts(blogPosts.data)
    })
    .catch((reason) => {
      $sentry.captureException(reason)
      throw reason
    })
}

export async function getPostBySlug($axios, $sentry, locale, slug) {
  return await $axios
    .get(constructUrl(null, locale, 1, null, '*,translations.*,header.*,user_created.*', slug))
    .then((blogPosts) => {
      if (blogPosts.data.data.length === 0) {
        throw new Error('Blog post not found')
      }

      if (blogPosts.data.data[0].translations.length === 0) {
        throw new Error('Blog post does not contain correct translation')
      }

      return blogPosts.data.data[0]
    })
    .catch((reason) => {
      $sentry.captureException(reason)
      throw reason
    })
}

export async function getPostTranslations($axios, $sentry, postId) {
  return await $axios
    .get(
      constructUrl(
        null,
        null,
        1,
        null,
        '*,translations.title,translations.slug,translations.description,translations.languages_code,header.*',
        null,
        postId
      )
    )
    .then((blogPosts) => {
      return blogPosts.data.data[0].translations
    })
    .catch((reason) => {
      $sentry.captureException(reason)
      throw reason
    })
}

function sortPosts(posts) {
  return posts.data
    .filter((p) => p.translations.length > 0)
    .sort(function (a, b) {
      return new Date(b.translations[0].date_updated) - new Date(a.translations[0].date_updated)
    })
}

function constructUrl(parkId, locale, limit = null, sort, fields, slug, postId) {
  const params = { fields: fields ?? '*' }

  if (postId) {
    params['filter[id][_eq]'] = postId
  }

  if (locale) {
    params['deep[translations][_filter][languages_code][_eq]'] = locale
  }

  if (slug) {
    params['filter[translations][slug][_eq]'] = slug
  }

  if (parkId) {
    params['filter[park_id][_eq]'] = parkId
  }

  if (sort) {
    params.sort = sort
  }

  if (limit) {
    params.limit = limit
  }

  const searchParams = new URLSearchParams(params)
  return `https://data.arendz.nl/items/tp_blogpost?${searchParams.toString()}`
}

/**
 * Return a list of ticket links for a specific park
 * @param $axios
 * @param $sentry
 * @param parkId
 * @returns {Promise<*>}
 */
export async function getTicketDealsForPark($axios, $sentry, parkId) {
  return await $axios
    .get(`https://data.arendz.nl/items/tp_tickets?filter[park_id]=${parkId}`)
    .then((tickets) => {
      return tickets.data.data
    })
    .catch((reason) => {
      $sentry.captureException(reason)
      throw reason
    })
}
