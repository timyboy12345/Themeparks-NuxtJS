<template>
  <image-card v-if="ride.image_url" :h1="h1" :title="ride.title" :description="ride.subTitle" :image-src="ride.image_url" :link="cardLink">
    <template #content>
      <div
        v-if="ride.minAgeWithoutEscort || ride.maxAge || ride.minSizeWithEscort || ride.minSizeWithoutEscort || ride.maxSize"
        class="mt-2 grid text-sm text-gray-600"
      >
        <div v-if="ride.minAgeWithoutEscort">{{ $t('general.minAge', [ride.minAgeWithoutEscort]) }}</div>
        <div v-if="ride.minSizeWithEscort">{{ $t('general.minSizeWithEscort', [ride.minSizeWithEscort]) }}</div>
        <div v-if="ride.minSizeWithoutEscort && typeof ride.minSizeWithEscort === 'undefined'">
          {{ $t('general.minSize', [ride.minSizeWithoutEscort]) }}
        </div>
        <div v-else-if="ride.minSizeWithoutEscort">
          {{ $t('general.minSizeWithoutEscort', [ride.minSizeWithoutEscort]) }}
        </div>
        <div v-if="ride.maxAge">{{ $t('general.maxAge', [ride.maxAge]) }}</div>
        <div v-if="ride.maxSize">{{ $t('general.maxSize', [ride.maxSize]) }}</div>
      </div>

      <div v-if="ride.currentWaitTime !== undefined" class="font-bold text-indigo-700 mt-2">
        {{ $t('general.currentWaitTime', [ride.currentWaitTime]) }}
      </div>
    </template>
  </image-card>

  <card v-else :title="ride.title" :content="ride.subTitle" :link="cardLink">
    <template #content>
      <div
        v-if="ride.minAgeWithoutEscort || ride.maxAge || ride.minSizeWithEscort || ride.maxSize || ride.minSizeWithoutEscort"
        class="mt-2 grid text-sm text-gray-600"
      >
        <div v-if="ride.minAgeWithoutEscort">{{ $t('general.minAge', [ride.minAgeWithoutEscort]) }}</div>
        <div v-if="ride.minSizeWithEscort">{{ $t('general.minSizeWithEscort', [ride.minSizeWithEscort]) }}</div>
        <div v-if="ride.minSizeWithoutEscort && !ride.minSizeWithEscort">{{ $t('general.minSize', [ride.minSizeWithoutEscort]) }}</div>
        <div v-else-if="ride.minSizeWithoutEscort && ride.minSizeWithEscort">
          {{ $t('general.minSizeWithoutEscort', [ride.minSizeWithoutEscort]) }}
        </div>
        <div v-if="ride.maxAge">{{ $t('general.maxAge', [ride.maxAge]) }}</div>
        <div v-if="ride.maxSize">{{ $t('general.maxSize', [ride.maxSize]) }}</div>
      </div>

      <div v-if="ride.currentWaitTime !== undefined" class="font-bold text-indigo-700 mt-2">
        {{ $t('general.currentWaitTime', [ride.currentWaitTime]) }}
      </div>
    </template>
  </card>
</template>

<script>
import ImageCard from './ImageCard'
import Card from '@/components/cards/Card'

export default {
  name: 'RideCard',
  components: { Card, ImageCard },
  props: {
    ride: {
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
      return this.ride.id
    },
    cardLink() {
      if (!this.park || !this.ride || !this.showMore) {
        return null
      }

      return `/parks/${this.park.id}/rides/${this.ride.id}`
    },
  },
}
</script>
