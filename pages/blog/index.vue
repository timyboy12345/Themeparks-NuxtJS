<template>
  <div>
    <!--    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>-->

    <loading-spinner v-if="$fetchState.pending" class="mt-8"></loading-spinner>
    <general-error
      v-else-if="$fetchState.error"
      title="Blog posts could not be loaded"
      sub-title="The blog posts could not be loaded at this time, try again later"
    />

    <div v-else>
      <page-search v-model="searchQuery" :park="parkQuery" :parks="parks" @selectPark="selectPark"></page-search>

      <card class="mb-4 mt-4" :title="$t('general.blog')" :sub-title="$t('blog.subTitle')"></card>

      <div class="grid gap-4 grid-cols-2 lg:grid-cols-3">
        <blog-post-card v-for="post in filteredBlogPosts" :key="post.id" :blog-post="post" />
      </div>

      <card class="mt-4" :title="$t('blog.bottomSeoBlockTitle')" :content="$t('blog.bottomSeoBlockContent')"></card>
    </div>

    <router-link
      v-if="$store.state.auth.user"
      :to="localePath('/blog/create')"
      class="shadow text-white p-1 fixed right-10 bottom-10 w-8 h-8 bg-indigo-800 hover:bg-indigo-900 transition duration-100 rounded"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </router-link>
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
    await this.$axios
      .get('/blog-posts')
      .then((blogPosts) => {
        this.blogPosts = blogPosts.data
      })
      .catch((reason) => {
        throw reason
      })
    await this.$axios
      .get('/parks')
      .then((parks) => {
        this.parks = parks.data
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
    breadcrumbs() {
      if (!this.blogPosts) {
        return []
      }

      return [
        {
          title: this.$t('general.home'),
          url: '/',
        },
        {
          title: this.$t('general.blog'),
          url: '#',
        },
      ]
    },
    filteredBlogPosts() {
      let posts = this.blogPosts

      if (this.searchQuery) {
        posts = posts.filter((p) => p.title.toLowerCase().includes(this.searchQuery.toLowerCase()))
      }

      if (this.parkQuery) {
        posts = posts.filter((p) => p.parkId === this.parkQuery)
      }

      return posts
      // return posts.sort((a, b) => a.createdAt < b.createdAt)
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
