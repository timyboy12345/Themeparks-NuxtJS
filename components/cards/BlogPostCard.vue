<template>
  <card
    :image-alt="blogPost.header ? blogPost.header.description : null"
    :image-src="
      blogPost.header && blogPost.header.filename_disk
        ? 'https://data.arendz.nl/assets/' + blogPost.header.filename_disk + '?width=500&heigth=250&format=webp&quality=90'
        : null
    "
    :link="'/blog/' + blogPost.translations[0].slug"
    :subtitle="(blogPost.translations[0].date_updated || blogPost.translations[0].date_created) | formatDate"
    :target="target"
    :title="blogPost.translations[0].title"
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
    target: {
      type: String,
      required: false,
      default: '_self',
      validator(value) {
        return ['_self', '_blank'].includes(value)
      },
    },
  },
}
</script>
