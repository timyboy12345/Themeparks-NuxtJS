<template>
  <div class="grid gap-4">
    <card :title="$t('home.title')" :subtitle="$t('home.subtitle')" :content="$t('home.action')"></card>

    <card-button btn-link="/parks" :btn-title="$t('home.actionButton')" />

    <div class="shadow rounded overflow-hidden bg-white divide-y divide-gray-200">
      <input
        v-model="query"
        type="text"
        class="focus:outline-none w-full py-2 px-4"
        :placeholder="$t('home.searchPlaceholder')"
        @keyup.enter="search"
      />

      <div v-if="searching" class="py-4">
        <loading-spinner />
      </div>

      <div v-if="searchResults" class="divide-y divide-gray-200 flex flex-col">
        <div v-if="searchResults.length === 0" class="text-center my-4">
          {{ $t('home.noSearchResults') }}
        </div>

        <NuxtLink
          v-for="result of searchResults"
          :key="result.id"
          :to="localePath(result.type === 'park' ? '/parks/' + result.id : result.fullSlug.replace('https://themeparkplanner.com', ''))"
          class="flex flex-row items-center gap-x-2 hover:bg-gray-100 transition duration-100 py-2 px-4"
        >
          <div class="rounded-full w-6 h-6 bg-gray-200 overflow-hidden">
            <img v-if="result.image" v-lazy-load class="w-full h-full object-center object-cover" :data-src="result.image" />
          </div>
          <span class="text-indigo-800">{{ result.parkName ?? result.name }}</span>
          <span v-if="result.type === 'poi'">{{ result.title }}</span>
          <span v-if="result.category" class="opacity-60">{{ result.category }}</span>
        </NuxtLink>
      </div>
    </div>

    <card :title="$t('home.infoTitle')">
      <template #content>
        <h3 class="text-indigo-700 dark:text-indigo-300 mt-4">{{ $t('home.infoWaitTimes') }}</h3>
        <p class="text-gray-800 dark:text-gray-300">{{ $t('home.infoWaitTimesContent') }}</p>

        <h3 class="text-indigo-700 dark:text-indigo-300 mt-2">{{ $t('home.infoData') }}</h3>
        <p class="text-gray-800 dark:text-gray-300">
          {{ $t('home.infoDataContent') }}
        </p>

        <h3 class="text-indigo-700 dark:text-indigo-300 mt-2">{{ $t('home.apiInfo') }}</h3>
        <p class="text-gray-800 dark:text-gray-300">
          {{ $t('home.apiInfoContent') }}
        </p>
      </template>
    </card>

    <AdCard />

    <loading-spinner v-if="$fetchState.pending" />
    <general-error v-if="$fetchState.error" />
    <div v-if="blogPosts && blogPosts.length > 0" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <blog-post-card v-for="blogPost of blogPosts" :key="blogPost.id" :blog-post="blogPost" />

      <card :title="$t('blog.seeMore')" :subtitle="$t('blog.seeMoreDescription')" :content="$t('blog.seeMoreContent')" link="/blog"></card>
    </div>
  </div>
</template>

<script>
import Card from '~/components/cards/Card.vue'
import CardButton from '~/components/cards/actions/CardButton.vue'
import AdCard from '~/components/cards/AdCard.vue'
import GeneralError from '~/components/GeneralError.vue'
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import BlogPostCard from '~/components/cards/BlogPostCard.vue'
import { getPosts } from '~/mixins/directus'

export default {
  name: 'Index',
  components: { BlogPostCard, LoadingSpinner, GeneralError, AdCard, CardButton, Card },
  data() {
    return {
      blogPosts: null,
      query: '',
      parks: null,
      searching: false,
      searchResults: null,
    }
  },
  async fetch() {
    const isoLocale = this.$i18n.locales.find((l) => l.code === this.$i18n.locale).iso

    this.parks = await this.$axios
      .get(`https://tp.arendz.nl/parks/`)
      .then((r) => r.data)
      .catch(() => [])

    this.blogPosts = await getPosts(this.$axios, this.$sentry, isoLocale, 7)
      .then((p) => p)
      .catch(() => [])
  },
  head() {
    return {
      title: this.$t('home.seoTitle'),
      titleTemplate: '%s',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('home.seoDescription'),
        },
      ],
    }
  },
  created() {
    // this.$store.commit('CHANGE_BREADCRUMBS', [])
  },
  methods: {
    async search() {
      this.searchResults = null

      if (this.query.length > 4) {
        this.searching = true

        const pois = await this.getPois()
        const mapped = pois.map((p) => {
          return { ...p, type: 'poi' }
        })

        const parks = this.parks
          .filter((p) => p.name.toLowerCase().includes(this.query))
          .map((p) => {
            return { ...p, type: 'park', title: p.name }
          })

        this.searchResults = parks.concat(mapped)

        this.searching = false
      }
    },
    async getPois() {
      const response = await this.$axios
        .get(`https://search.themeparkplanner.com/indexes/pois/search?q=${this.query}`, {
          headers: {
            Authorization: 'Bearer 40de3130dd38f80288f0bed376a0817a04792f5d2906714cd80a356bbbd122ef',
          },
        })
        .then((res) => res.data)

      return response.hits.filter((r) => r.fullSlug)
    },
  },
}
</script>
