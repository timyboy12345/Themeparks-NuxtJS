<template>
  <card
    :sub-title="blogPost.createdAt | formatDate"
    :link="'/blog/' + blogPost.slug"
    :image-src="blogPost.imageUrl"
    :title="blogPost.title"
  >
    <template #content>{{ blogPost.description }}</template>
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
