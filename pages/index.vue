<template>
  <div class="grid gap-4">
    <card :title="$t('home.title')" :sub-title="$t('home.subtitle')" :content="$t('home.action')"></card>

    <card-button btn-link="/parks" :btn-title="$t('home.actionButton')" />

    <card :title="$t('home.infoTitle')">
      <template #content>
        <h3 class="text-indigo-700 dark:text-indigo-500 mt-4">{{ $t('home.infoWaitTimes') }}</h3>
        <p class="text-gray-800 dark:text-gray-300">{{ $t('home.infoWaitTimesContent') }}</p>

        <h3 class="text-indigo-700 dark:text-indigo-500 mt-2">{{ $t('home.infoData') }}</h3>
        <p class="text-gray-800 dark:text-gray-300">
          {{ $t('home.infoDataContent') }}
        </p>

        <h3 class="text-indigo-700 dark:text-indigo-500 mt-2">{{ $t('home.apiInfo') }}</h3>
        <p class="text-gray-800 dark:text-gray-300">
          {{ $t('home.apiInfoContent') }}
        </p>
      </template>
    </card>

    <AdCard />

    <loading-spinner v-if="$fetchState.pending" />
    <general-error v-if="$fetchState.error" />
    <div class="grid gap-4 grid-cols-2 xl:grid-cols-4">
      <blog-post-card v-for="blogPost of blogPosts" :key="blogPost.id" :blog-post="blogPost" />
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

export default {
  name: 'Index',
  components: { BlogPostCard, LoadingSpinner, GeneralError, AdCard, CardButton, Card },
  data() {
    return {
      blogPosts: null,
    }
  },
  async fetch() {
    await this.$axios
      .get('/blog-posts')
      .then(({ data: blogPosts }) => {
        this.blogPosts = blogPosts.slice(0, 4)
      })
      .catch((reason) => {
        throw reason
      })
  },
  created() {
    // this.$store.commit('CHANGE_BREADCRUMBS', [])
  },
}
</script>
