<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading-spinner v-if="$fetchState.pending" class="mt-8"></loading-spinner>
    <general-error
      v-else-if="$fetchState.error"
      title="Post could not be found"
      sub-title="Check if this blog exists, and if the URL is valid"
    ></general-error>

    <div v-else class="grid gap-4">
      <img
        v-lazy-load
        class="w-full max-h-96 overflow-hidden object-center object-cover rounded bg-white shadow"
        :data-src="blogPost.imageUrl"
        alt="Foto van blogpost"
      />

      <div class="p-4 rounded bg-white shadow">
        <h1 class="text-2xl font-bold text-indigo-800">{{ blogPost.title }}</h1>
        <h2 class="text-gray-600">
          {{ blogPost.createdAt | formatDate }}
          <span v-if="blogPost.author">| {{ blogPost.author.firstName }}</span>
        </h2>
        <article class="prose lg:prose-lg max-w-none" v-html="$md.render(blogPost.content)"></article>
      </div>

      <NuxtLink
        v-if="park"
        :to="localePath('/parks/' + park.id)"
        class="items-center bg-white transition duration-100 hover:bg-gray-100 rounded shadow flex flex-row p-4"
      >
        <img
          v-lazy-load
          class="w-16 h-16 rounded-full overflow-hidden object-center object-cover"
          :data-src="park.image"
          alt="Foto van pretpark"
        />

        <div class="ml-8 flex flex-col">
          <h2 class="text-indigo-800 font-bold">{{ park.name }}</h2>
          <p>{{ $t('blog.moreAboutPark') }}</p>
        </div>
      </NuxtLink>

      <router-link
        v-if="$store.state.auth.user"
        :to="localePath('/blog/' + blogPost.slug + '/edit')"
        class="shadow text-white p-1 fixed right-10 bottom-10 w-8 h-8 bg-indigo-800 hover:bg-indigo-900 transition duration-100 rounded"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
          />
        </svg>
      </router-link>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import Breadcrumbs from '~/components/Breadcrumbs.vue'
import GeneralError from '~/components/GeneralError.vue'

export default {
  name: 'BlogShow',
  components: { GeneralError, Breadcrumbs, LoadingSpinner },
  data() {
    return {
      blogPost: null,
      park: null,
    }
  },
  async fetch() {
    await this.$axios
      .get('/blog-posts/slug/' + this.$route.params.slug)
      .then(async (blogPost) => {
        if (blogPost.data.parkId) {
          await this.loadPark(blogPost.data.parkId)
        }

        this.blogPost = blogPost.data
      })
      .catch((reason) => {
        this.$emit('fetchError', reason)
        this.$sentry.captureException(reason)
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
          content: this.blogPost ? this.blogPost.description : '',
        },
      ],
    }
  },
  computed: {
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

      if (this.blogPost.parkId) {
        if (this.park) {
          bc = bc.concat({ title: this.park.name, url: '/blog?park=' + this.park.id })
        }
      }

      return bc.concat({
        title: this.blogPost.title,
        url: '#',
      })
    },
  },
  methods: {
    async loadPark(parkId) {
      this.park = await this.$axios
        .get('/parks/' + parkId)
        .then(async (blogPost) => {
          if (blogPost.data.park) {
            await this.loadPark(blogPost.data.park)
          }

          return blogPost.data
        })
        .catch((reason) => {
          this.$emit('fetchError', reason)
          this.$sentry.captureException(reason)
        })
    },
  },
}
</script>
