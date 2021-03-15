<template>
  <image-card :title="restaurant.title" :description="restaurant.subTitle" :image-src="restaurant.image_url" :link="cardLink"> </image-card>
</template>

<script>
import ImageCard from './ImageCard'
export default {
  name: 'RestaurantCard',
  components: { ImageCard },
  props: {
    restaurant: {
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
      return this.restaurant.id
    },
    cardLink() {
      if (!this.park || !this.restaurant || !this.showMore) {
        return null
      }

      return `/parks/${this.park.id}/restaurants/${this.restaurant.id}`
    },
  },
}
</script>
