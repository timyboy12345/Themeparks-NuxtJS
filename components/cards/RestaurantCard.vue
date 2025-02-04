<template>
  <image-card
    v-if="restaurant.image_url"
    :h1="h1"
    :title="restaurant.title"
    :description="restaurant.subTitle"
    :image-src="restaurant.image_url"
    :link="cardLink"
  >
    <template #content>
      <!--      <div v-if="restaurant.openingTimes !== undefined && restaurant.openingTimes.length > 0" class="text-sm text-gray-600">-->
      <!--        Open van {{ restaurant.openingTimes[0].openTime | time }} tot {{ restaurant.openingTimes[0].closeTime | time }}-->
      <!--      </div>-->
    </template>
  </image-card>
  <card v-else :title="restaurant.title" :subtitle="restaurant.subTitle" />
</template>

<script>
import ImageCard from './ImageCard'
import Card from '@/components/cards/Card'

export default {
  name: 'RestaurantCard',
  components: { Card, ImageCard },
  filters: {
    time(value) {
      const times = value.split(':')
      return `${times[0]}:${times[1]}`
    },
  },
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
    h1: {
      required: false,
      type: Boolean,
      default: false,
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
