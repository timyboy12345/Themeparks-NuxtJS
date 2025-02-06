<template>
  <div>
    <h1 class="text-2xl text-indigo-800 dark:text-indigo-300 font-bold">Nieuws</h1>

    <LoadingSpinner v-if="!posts" />

    <div v-else-if="posts.length === 0" class="my-16 text-center text-gray-600 dark:text-gray-400">
      Geen blogposts of nieuwsartikelen gevonden voor dit park
    </div>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-4 mt-4 gap-4">
      <BlogPostCard v-for="(item, i) of posts" :key="i" target="_blank" :blog-post="item" />
    </div>
  </div>
</template>

<script>
import { getPostsForPark } from '~/mixins/directus'
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import BlogPostCard from '~/components/cards/BlogPostCard.vue'

export default {
  name: 'PlannerNews',
  components: { BlogPostCard, LoadingSpinner },
  layout: 'planner',
  data() {
    return {
      posts: null,
    }
  },
  head() {
    return {
      title: this.$t('planner.newsTitle'),
    }
  },
  computed: {
    parkId() {
      return this.$store.state.planner.parkId
    },
  },
  watch: {
    parkId() {
      this.fetchParks()
    },
  },
  mounted() {
    this.fetchParks()
  },
  methods: {
    async fetchParks() {
      if (!this.$store.state.planner.parkId) {
        return
      }

      const isoLocale = this.$i18n.locales.find((l) => l.code === this.$i18n.getLocaleCookie()).iso
      this.posts = await getPostsForPark(this.$axios, this.$sentry, isoLocale, this.$store.state.planner.parkId).then((d) => d)
    },
  },
}
</script>
