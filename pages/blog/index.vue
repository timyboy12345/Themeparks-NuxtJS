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
        <card
          v-for="post in filteredBlogPosts"
          :key="post.id"
          :sub-title="post.createdAt | formatDate"
          :link="'/blog/' + post.slug"
          :image-src="post.imageUrl"
          :title="post.title"
        >
          <template #content>{{ post.description }}</template>
        </card>
      </div>

      <card class="mt-4" :title="$t('blog.bottomSeoBlockTitle')" :content="$t('blog.bottomSeoBlockContent')"></card>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import Card from '~/components/cards/Card.vue'
import GeneralError from '~/components/GeneralError.vue'
import PageSearch from '~/components/PageSearch.vue'

export default {
  name: 'BlogIndex',
  components: { PageSearch, GeneralError, Card, LoadingSpinner },
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
