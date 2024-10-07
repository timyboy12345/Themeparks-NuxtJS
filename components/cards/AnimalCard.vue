<template>
  <image-card
    v-if="animal.image_url"
    :h1="h1"
    :title="animal.title"
    :description="animal.subTitle"
    :image-src="animal.image_url"
    :link="cardLink"
  >
  </image-card>

  <card v-else :title="animal.title" :content="animal.subTitle" :link="cardLink"></card>
</template>

<script>
import ImageCard from './ImageCard'
import Card from '@/components/cards/Card'

export default {
  name: 'AnimalCard',
  components: { Card, ImageCard },
  props: {
    animal: {
      type: Object,
      required: true,
    },
    showMore: {
      type: Boolean,
      default: false,
    },
    park: {
      type: Object,
      required: false,
      default: null,
    },
    h1: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  computed: {
    btnLink() {
      return this.animal.id
    },
    cardLink() {
      if (!this.park || !this.animal || !this.showMore) {
        return null
      }

      return `/parks/${this.park.id}/animals/${this.animal.id}`
    },
  },
}
</script>
