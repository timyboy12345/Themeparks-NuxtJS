<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading-spinner v-if="$fetchState.pending" class="mt-8"></loading-spinner>
    <general-error
      v-else-if="$fetchState.error"
      title="Post could not be found"
      sub-title="Check if this blog exists, and if the URL is valid"
    ></general-error>

    <div v-else class="grid gap-4" :class="{ 'lg:grid-cols-3': hasAssociatedPosts }">
      <div class="grid gap-4" :class="{ 'lg:col-span-2': hasAssociatedPosts }">
        <img
          v-if="blogPost.header"
          v-lazy-load
          class="w-full max-h-96 overflow-hidden object-center object-cover rounded bg-white shadow"
          :data-src="blogPost.header ? 'https://data.arendz.nl/assets/' + blogPost.header.filename_disk : null"
          alt="Foto van blogpost"
        />

        <div class="p-4 rounded bg-white dark:bg-gray-700 shadow">
          <h1 class="text-2xl font-bold text-indigo-800 dark:text-indigo-300">{{ blogPost.translations[0].title }}</h1>
          <h2 class="text-gray-600 dark:text-gray-400 my-2">
            {{ (blogPost.translations[0].date_updated || blogPost.translations[0].date_created) | formatDate }}
            <span v-if="blogPost.user_created">| {{ blogPost.user_created.first_name }}</span>
          </h2>

          <!-- eslint-disable-next-line vue/no-v-html -->
          <article
            class="prose dark:prose-invert max-w-none prose-a:text-indigo-700 prose-headings:mb-1 prose-headings:mt-2"
            v-html="$md.render(blogPost.translations[0].content)"
          ></article>
        </div>

        <nuxt-link
          v-if="park"
          :to="localePath('/parks/' + park.id)"
          class="items-center bg-white dark:bg-gray-700 transition duration-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded shadow flex flex-row p-4"
        >
          <img
            v-lazy-load
            class="w-16 h-16 rounded-full overflow-hidden object-center object-cover"
            :data-src="park.image"
            alt="Foto van pretpark"
          />

          <div class="ml-8 flex flex-col">
            <h2 class="text-indigo-800 dark:text-indigo-300 font-bold">{{ park.name }}</h2>
            <p class="text-gray-900 dark:text-gray-400">{{ $t('blog.moreAboutPark') }}</p>
          </div>
        </nuxt-link>

        <a
          v-if="$store.state.auth.user"
          target="_blank"
          :href="`https://data.arendz.nl/admin/content/tp_blogpost/${blogPost.id}`"
          class="shadow text-white p-1 fixed right-10 bottom-10 w-8 h-8 bg-indigo-800 hover:bg-indigo-900 transition duration-100 rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            />
          </svg>
        </a>
      </div>

      <div v-if="hasAssociatedPosts" class="grid gap-4 content-start">
        <Card :title="$t('blog.associatedTitle')">
          <template #content>
            <p>{{ $t('blog.associatedContent', [park.name]) }}</p>
            <nuxt-link class="text-sm mt-4 underline text-indigo-800" :to="localePath(`/blog/?park=${park.id}`)">
              {{ $t('blog.allBlogpostsOfThisPark') }}
            </nuxt-link>
          </template>
        </Card>

        <blog-post-card v-for="post in associatedBlogPosts" :key="post.id" :blog-post="post" />
      </div>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import Breadcrumbs from '~/components/Breadcrumbs.vue'
import GeneralError from '~/components/GeneralError.vue'
import Card from '~/components/cards/Card.vue'
import BlogPostCard from '~/components/cards/BlogPostCard.vue'

export default {
  name: 'BlogShow',
  components: { BlogPostCard, Card, GeneralError, Breadcrumbs, LoadingSpinner },
  data() {
    return {
      blogPost: null,
      associatedBlogPosts: null,
      park: null,
    }
  },
  async fetch() {
    await this.fetchBlogPost()
  },
  head() {
    return {
      title: this.blogPost ? this.blogPost.title : this.$t('blog.seoTitle'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.blogPost ? this.blogPost.description : '',
        },
      ],
    }
  },
  computed: {
    hasAssociatedPosts() {
      return this.park && this.associatedBlogPosts && this.associatedBlogPosts.length > 0
    },
    breadcrumbs() {
      if (!this.blogPost) {
        return []
      }

      let bc = [
        {
          title: this.$t('general.home'),
          url: '/',
        },
        {
          title: this.$t('general.blog'),
          url: '/blog',
        },
      ]

      if (this.blogPost.park_id) {
        if (this.park) {
          bc = bc.concat({ title: this.park.name, url: '/blog?park=' + this.park.id })
        }
      }

      return bc.concat({
        title: this.blogPost.translations[0].title,
        url: '#',
      })
    },
  },
  methods: {
    async loadPark(parkId) {
      this.park = await this.$axios
        .get('/parks/' + parkId)
        .then(({ data: park }) => {
          return park
        })
        .catch((reason) => {
          this.$emit('fetchError', reason)
          this.$sentry.captureException(reason)
          throw reason
        })
    },
    async loadParkBlogPosts(parkId) {
      this.associatedBlogPosts = await this.$axios
        .get(`https://data.arendz.nl/items/tp_blogpost?filter[park_id][_eq]=${parkId}&fields=*,translations.*,header.*`)
        .then(({ data: { data: blogPosts } }) => {
          return blogPosts.filter((p) => p.id !== this.blogPost.id).slice(0, 5)
        })
        .catch((reason) => {
          this.$emit('fetchError', reason)
          this.$sentry.captureException(reason)
          throw reason
        })
    },
    async fetchBlogPost() {
      await this.$axios
        .get(
          `https://data.arendz.nl/items/tp_blogpost?filter[translations][slug][_eq]=${this.$route.params.slug}&fields=*,translations.*,header.*,user_created.*`
        )
        .then(async (blogPosts) => {
          const isoLocale = this.$i18n.locales.find((l) => l.code === this.$i18n.getLocaleCookie()).iso

          if (blogPosts.data.data[0].translations[0].languages_code !== isoLocale) {
            throw new Error('Not the right locale')
          }

          this.blogPost = blogPosts.data.data[0]

          if (blogPosts.data.data[0].park_id) {
            await this.loadPark(blogPosts.data.data[0].park_id)
            await this.loadParkBlogPosts(blogPosts.data.data[0].park_id)
          }
        })
        .catch((reason) => {
          this.$emit('fetchError', reason)
          this.$sentry.captureException(reason)
          throw reason
        })
    },
  },
}
</script>
