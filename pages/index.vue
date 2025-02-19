<template>
  <div class="grid gap-4">
    <card :title="$t('home.title')" :subtitle="$t('home.subtitle')" :content="$t('home.action')"></card>

    <card-button btn-link="/parks" :btn-title="$t('home.actionButton')" />

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
    }
  },
  async fetch() {
    const isoLocale = this.$i18n.locales.find((l) => l.code === this.$i18n.locale).iso

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
}
</script>
