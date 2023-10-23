<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading-spinner v-if="!blogPosts" class="mt-8"></loading-spinner>

    <div v-if="blogPosts && blogPosts.length > 0">
      <card class="mb-4" :title="$t('general.blog')" :sub-title="$t('blog.subTitle')"></card>

      <div class="grid gap-4 grid-cols-2 lg:grid-cols-3">
        <card
          v-for="post in blogPosts"
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
import Breadcrumbs from '~/components/Breadcrumbs.vue'
import Card from '~/components/cards/Card.vue'

export default {
  name: 'BlogIndex',
  components: { Card, Breadcrumbs, LoadingSpinner },
  data() {
    return {
      blogPosts: [],
    }
  },
  async fetch() {
    this.blogPosts = await this.$axios
      .get('/blog-posts')
      .then((blogPosts) => {
        return blogPosts.data
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
  },
}
</script>
