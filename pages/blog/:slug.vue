<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading-spinner v-if="!blogPost" class="mt-8"></loading-spinner>

    <div v-if="blogPost" class="grid gap-4">
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
        <p v-html="blogPost.content"></p>
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
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import Breadcrumbs from '~/components/Breadcrumbs.vue'

export default {
  name: 'BlogShow',
  components: { Breadcrumbs, LoadingSpinner },
  data() {
    return {
      blogPost: null,
      park: null,
    }
  },
  async fetch() {
    this.blogPost = await this.$axios
      .get('/blog-posts/slug/' + this.$route.params.slug)
      .then(async (blogPost) => {
        if (blogPost.data.parkId) {
          await this.loadPark(blogPost.data.parkId)
        }

        return blogPost.data
      })
      .catch((reason) => {
        this.$emit('fetchError', reason)
        this.$sentry.captureException(reason)
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

      return [
        {
          title: this.$t('general.home'),
          url: '/',
        },
        {
          title: this.$t('general.blog'),
          url: '/blog',
        },
        {
          title: this.blogPost.title,
          url: '#',
        },
      ]
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
