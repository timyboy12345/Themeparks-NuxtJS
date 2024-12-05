<template>
  <component
    :is="poi.image_url ? 'image-card' : 'card'"
    :h1="h1"
    :title="poi.title"
    :description="poi.subTitle"
    :image-src="poi.image_url"
    :link="cardLink"
  >
    <template #content>
      <div v-if="nextShow" class="mt-1 text-indigo-700">
        {{ $t('general.nextShow', [$options.filters.formatTime(nextShow.localFromTime)]) }}
      </div>

      <div
        v-if="poi.minAgeWithoutEscort || poi.maxAge || poi.minSizeWithEscort || poi.minSizeWithoutEscort || poi.maxSize"
        class="mt-2 grid text-sm text-gray-600 dark:text-gray-400"
      >
        <div v-if="poi.minAgeWithoutEscort">{{ $t('general.minAge', [poi.minAgeWithoutEscort]) }}</div>
        <div v-if="poi.minSizeWithEscort">{{ $t('general.minSizeWithEscort', [poi.minSizeWithEscort]) }}</div>
        <div v-if="poi.minSizeWithoutEscort && typeof poi.minSizeWithEscort === 'undefined'">
          {{ $t('general.minSize', [poi.minSizeWithoutEscort]) }}
        </div>
        <div v-else-if="poi.minSizeWithoutEscort">
          {{ $t('general.minSizeWithoutEscort', [poi.minSizeWithoutEscort]) }}
        </div>
        <div v-if="poi.maxAge">{{ $t('general.maxAge', [poi.maxAge]) }}</div>
        <div v-if="poi.maxSize">{{ $t('general.maxSize', [poi.maxSize]) }}</div>
      </div>

      <div v-if="poi.currentWaitTime !== undefined" class="font-bold text-indigo-700 mt-2">
        {{ $t('general.currentWaitTime', [poi.currentWaitTime]) }}
      </div>
    </template>
  </component>
</template>

<script>
import ImageCard from './ImageCard'
import Card from '@/components/cards/Card'

export default {
  name: 'PoiCard',
  components: { Card, ImageCard },
  props: {
    poi: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator(value) {
        return ['ride', 'restaurant', 'show', 'animal', 'shop'].includes(value)
      },
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
    cardLink() {
      if (!this.park || !this.poi || !this.showMore) {
        return null
      }

      switch (this.type) {
        case 'ride':
          return `/parks/${this.park.id}/rides/${this.poi.id}`
        case 'show':
          return `/parks/${this.park.id}/shows/${this.poi.id}`
        case 'shop':
          return `/parks/${this.park.id}/shops/${this.poi.id}`
        case 'animal':
          return `/parks/${this.park.id}/animals/${this.poi.id}`
        case 'restaurant':
          return `/parks/${this.park.id}/restaurants/${this.poi.id}`
        default:
          return `/parks/${this.park.id}/rides/${this.poi.id}`
      }
    },
    nextShows() {
      if (this.poi.showTimes && this.poi.showTimes.showTimes) {
        return this.poi.showTimes.showTimes.filter((st) => !st.isPassed)
      }

      return []
    },
    nextShow() {
      return this.nextShows.length > 0 ? this.nextShows[0] : undefined
    },
  },
}
</script>
