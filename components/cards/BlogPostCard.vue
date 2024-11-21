<template>
  <card
    :sub-title="(blogPost.translations[0].date_updated || blogPost.translations[0].date_created) | formatDate"
    :link="'/blog/' + blogPost.translations[0].slug"
    :image-src="
      blogPost.header && blogPost.header.filename_disk
        ? 'https://data.arendz.nl/assets/' + blogPost.header.filename_disk + '?width=500&heigth=250&format=webp&quality=90'
        : null
    "
    :title="blogPost.translations[0].title"
    :image-alt="blogPost.header ? blogPost.header.description : null"
  >
    <template #content>
      <div class="mt-2">{{ blogPost.translations[0].description }}</div>
    </template>
  </card>
</template>

<script>
import Card from '~/components/cards/Card.vue'

export default {
  name: 'BlogPostCard',
  components: { Card },
  props: {
    blogPost: {
      required: true,
      type: Object,
    },
  },
}
</script>
