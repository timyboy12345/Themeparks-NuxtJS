<template>
  <image-card
    v-if="event && event.image"
    :content="event.subTitle"
    :description="event.subTitle"
    :image-src="event.image"
    :link="cardLink"
    :subtitle="cardContent"
    :title="event.name"
  />

  <card v-else :content="event.subTitle" :link="cardLink" :sub-title="cardContent" :title="event.name"> </card>
</template>

<script>
import ImageCard from './ImageCard'
import Card from '@/components/cards/Card'

export default {
  name: 'EventCard',
  components: { Card, ImageCard },
  props: {
    event: {
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
      return this.event.id
    },
    cardLink() {
      if (!this.park || !this.event || !this.showMore) {
        return null
      }

      return `/parks/${this.park.id}/events/${this.event.type.toLowerCase()}`
    },
    cardContent() {
      return this.event.dates && this.event.dates.length > 0 ? this.$t('events.dateCount', [this.event.dates.length]) : null
    },
  },
}
</script>
