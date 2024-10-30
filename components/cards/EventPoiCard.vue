<template>
  <image-card
    v-if="poi.image_url"
    :subtitle="eventType"
    :h1="h1"
    :title="poi.title"
    :description="poi.subTitle"
    :image-src="poi.image_url"
    :link="cardLink"
  >
    <template #content>
      <div
        v-if="poi.minAgeWithoutEscort || poi.maxAge || poi.minSizeWithEscort || poi.minSizeWithoutEscort || poi.maxSize"
        class="mt-2 grid text-sm text-gray-600"
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
  </image-card>

  <card v-else :title="poi.title" :content="poi.subTitle" :link="cardLink">
    <template #content>
      <div
        v-if="poi.minAgeWithoutEscort || poi.maxAge || poi.minSizeWithEscort || poi.maxSize || poi.minSizeWithoutEscort"
        class="mt-2 grid text-sm text-gray-600"
      >
        <div v-if="poi.minAgeWithoutEscort">{{ $t('general.minAge', [poi.minAgeWithoutEscort]) }}</div>
        <div v-if="poi.minSizeWithEscort">{{ $t('general.minSizeWithEscort', [poi.minSizeWithEscort]) }}</div>
        <div v-if="poi.minSizeWithoutEscort && !poi.minSizeWithEscort">{{ $t('general.minSize', [poi.minSizeWithoutEscort]) }}</div>
        <div v-else-if="poi.minSizeWithoutEscort && poi.minSizeWithEscort">
          {{ $t('general.minSizeWithoutEscort', [poi.minSizeWithoutEscort]) }}
        </div>
        <div v-if="poi.maxAge">{{ $t('general.maxAge', [poi.maxAge]) }}</div>
        <div v-if="poi.maxSize">{{ $t('general.maxSize', [poi.maxSize]) }}</div>
      </div>

      <div v-if="poi.currentWaitTime !== undefined" class="font-bold text-indigo-700 mt-2">
        {{ $t('general.currentWaitTime', [poi.currentWaitTime]) }}
      </div>
    </template>
  </card>
</template>

<script>
import ImageCard from './ImageCard'
import Card from '@/components/cards/Card'

export default {
  name: 'EventPoiCard',
  components: { Card, ImageCard },
  props: {
    poi: {
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
    eventId: {
      type: String,
      required: true,
    },
    h1: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  computed: {
    btnLink() {
      return this.poi.id
    },
    cardLink() {
      if (!this.park || !this.poi || !this.eventId || !this.showMore) {
        return null
      }

      return `/parks/${this.park.id}/events/${this.eventId}/${this.poi.id}`
    },
    eventType() {
      if (!this.poi) {
        return ''
      }

      switch (this.poi.category) {
        case 'HALLOWEEN_HOUSE':
          return this.$t('halloween.house')
        case 'HALLOWEEN_SCAREZONE':
          return this.$t('halloween.scarezone')
        case 'HALLOWEEN_EXPERIENCE':
          return this.$t('halloween.experience')
        case 'HALLOWEEN_MAZE':
          return this.$t('halloween.maze')
        default:
          return null
      }
    },
  },
}
</script>
