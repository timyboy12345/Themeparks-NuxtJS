<template>
  <image-card v-if="show.image_url" :title="show.title" :description="show.subTitle" :image-src="show.image_url" :link="cardLink">
  </image-card>
  <card v-else :title="show.title" :content="show.subTitle" :link="cardLink"></card>
</template>

<script>
import Card from '@/components/cards/Card'
import ImageCard from './ImageCard'
export default {
  name: 'ShowCard',
  components: { Card, ImageCard },
  props: {
    show: {
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
  },
  computed: {
    btnLink() {
      return this.show.id
    },
    cardLink() {
      if (!this.park || !this.show || !this.showMore) {
        return null
      }

      return `/parks/${this.park.id}/shows/${this.show.id}`
    },
  },
}
</script>
