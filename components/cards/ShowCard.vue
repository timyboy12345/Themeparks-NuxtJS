<template>
  <image-card v-if="show.image_url" :h1="h1" :title="show.title" :description="show.subTitle" :image-src="show.image_url" :link="cardLink">
    <template #content>
      <div v-if="nextShow" class="mt-1 text-indigo-700">
        {{ $t('general.nextShow', [$options.filters.time(nextShow.fromTime)]) }}
      </div>
    </template>
  </image-card>
  <card v-else :title="show.title" :content="show.subTitle" :link="cardLink"></card>
</template>

<script>
import ImageCard from './ImageCard'
import Card from '@/components/cards/Card'

export default {
  name: 'ShowCard',
  components: { Card, ImageCard },
  filters: {
    time(value) {
      const times = value.split(':')
      return `${times[0]}:${times[1]}`
    },
  },
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
    h1: {
      required: false,
      type: Boolean,
      default: false,
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
    nextShow() {
      if (this.show.showTimes && this.show.showTimes.futureShowTimes && this.show.showTimes.futureShowTimes.length > 0) {
        return this.show.showTimes.futureShowTimes[0]
      }

      return undefined
    },
  },
}
</script>
