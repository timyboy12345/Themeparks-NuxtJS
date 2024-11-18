<template>
  <div>
    <loading-spinner v-if="$fetchState.pending" class="mt-8"></loading-spinner>
    <general-error
      v-else-if="$fetchState.error"
      title="Blog posts could not be loaded"
      sub-title="The blog posts could not be loaded at this time, try again later"
    />

    <div v-else>
      <page-search v-model="searchQuery" :park="parkQuery" :parks="parks" @selectPark="selectPark"></page-search>

      <card class="mb-4 mt-4" :title="$t('general.blog')" :sub-title="$t('blog.subTitle')"></card>

      <div v-if="filteredBlogPosts.length > 0" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <blog-post-card v-for="post in filteredBlogPosts" :key="post.id" :blog-post="post" />
      </div>

      <div v-if="filteredBlogPosts.length === 0" class="text-center md:col-span-3 lg:col-span-4 flex flex-col my-4">
        <h2 class="font-bold text-red-700">{{ $t('blog.noBlogsFoundTitle') }}</h2>
        <p class="text-gray-600">{{ $t('blog.noBlogsFoundContent') }}</p>
      </div>

      <card class="mt-4" :title="$t('blog.bottomSeoBlockTitle')" :content="$t('blog.bottomSeoBlockContent')"></card>
    </div>

    <a
      v-if="$store.state.auth.user"
      href="https://data.arendz.nl/admin/content/tp_blogpost/+"
      target="_blank"
      class="shadow text-white p-1 fixed right-10 bottom-10 w-8 h-8 bg-indigo-800 hover:bg-indigo-900 transition duration-100 rounded"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </a>
  </div>
</template>

<script>
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import Card from '~/components/cards/Card.vue'
import GeneralError from '~/components/GeneralError.vue'
import PageSearch from '~/components/PageSearch.vue'
import BlogPostCard from '~/components/cards/BlogPostCard.vue'

export default {
  name: 'BlogIndex',
  components: { BlogPostCard, PageSearch, GeneralError, Card, LoadingSpinner },
  data() {
    return {
      blogPosts: [],
      parks: [],
      searchQuery: '',
      parkQuery: this.$route.query.park,
    }
  },
  async fetch() {
    const isoLocale = this.$i18n.locales.find((l) => l.code === this.$i18n.getLocaleCookie()).iso

    // Fetch all blog posts with the right locale
    await this.$axios
      .get(
        `https://data.arendz.nl/items/tp_blogpost?deep[translations][_filter][languages_code][_eq]=${isoLocale}&fields=*,translations.*,header.*&sort=-date_updated`
      )
      .then((blogPosts) => {
        this.blogPosts = blogPosts.data.data.filter((p) => p.translations.length > 0)
      })
      .catch((reason) => {
        this.$emit('fetchError', reason)
        this.$sentry.captureException(reason)
        throw reason
      })

    // Fetch a list of all parks for the filters
    await this.$axios
      .get('/parks')
      .then((parks) => {
        this.parks = parks.data.sort((a, b) => a.name.localeCompare(b.name))
      })
      .catch((reason) => {
        throw reason
      })
  },
  head() {
    return {
      title: this.$t('blog.seoTitle'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Here you will find all the different theme parks that we support',
        },
      ],
    }
  },
  computed: {
    filteredBlogPosts() {
      let posts = this.blogPosts

      if (this.searchQuery) {
        posts = posts.filter((p) => p.translations[0].title.toLowerCase().includes(this.searchQuery.toLowerCase()))
      }

      if (this.parkQuery) {
        posts = posts.filter((p) => p.park_id === this.parkQuery)
      }

      return posts
      // return posts.sort((a, b) => a.translations[0].date_updated > b.translations[0].date_updated)
      // return posts.sort((a, b) => a.createdAt < b.createdAt)
    },
  },
  watch: {
    $route(to, _) {
      if (to.query.park) {
        this.parkQuery = to.query.park
      } else {
        this.parkQuery = null
      }
    },
  },
  methods: {
    selectPark(id) {
      this.parkQuery = id

      this.$router.push({ query: { park: id } })
    },
  },
}
</script>
