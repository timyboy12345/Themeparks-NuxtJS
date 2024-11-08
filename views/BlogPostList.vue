<template>
  <div>
    <loading-spinner v-if="!blogPosts" class="py-4"></loading-spinner>

    <general-message v-if="blogPosts && blogPosts.length === 0" class="m-4" />

    <div v-if="blogPosts && blogPosts.length > 0" class="mt-2 flex flex-col bg-white divide-y divide-gray-200 dark:divide-gray-600">
      <NuxtLink
        v-for="post of blogPosts"
        :key="post.id"
        :to="localePath('/blog/' + post.translations[0].slug)"
        class="py-2 px-4 flex hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-800 transition duration-100 flex-row justify-between items-center"
      >
        <div class="flex flex-row items-center">
          <div class="shrink-0 rounded-full bg-gray-500 w-6 h-6 lg:w-8 lg:h-8 mr-2 overflow-hidden">
            <img
              v-if="post.header"
              :alt="`Image of ${post.translations[0].title}`"
              :title="`Image of ${post.translations[0].title}`"
              :src="'https://data.arendz.nl/assets/' + post.header.filename_disk"
              class="object-cover object-center w-full h-full"
            />
            <div v-else class="object-cover object-center w-full h-full" />
          </div>

          <div class="flex flex-col">
            <div class="text-indigo-700 dark:text-indigo-300">{{ post.translations[0].title }}</div>
            <div class="text-gray-600 dark:text-gray-400 text-sm">
              {{ (post.translations[0].date_updated || post.translations[0].date_created) | formatDate }}
              <span v-if="post.user_created">| {{ post.user_created.first_name }}</span>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner'
import GeneralMessage from '@/components/GeneralMessage'

export default {
  name: 'BlogPostList',
  components: { GeneralMessage, LoadingSpinner },
  props: {
    blogPosts: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      error: null,
    }
  },
}
</script>

<style scoped></style>
