<template>
  <image-card v-if="ride.image_url" :title="ride.title" :description="ride.subTitle" :image-src="ride.image_url" :link="cardLink">
    <template #content>
      <div v-if="ride.minAge || ride.maxAge || ride.minSize || ride.maxSize || ride.minSizeEscort" class="mt-2 grid text-sm text-gray-600">
        <div v-if="ride.minAge">{{ $t('general.minAge', [ride.minAge]) }}</div>
        <div v-if="ride.maxAge">{{ $t('general.maxAge', [ride.maxAge]) }}</div>
        <div v-if="ride.minSize">{{ $t('general.minSize', [ride.minSize]) }}</div>
        <div v-if="ride.maxSize">{{ $t('general.maxSize', [ride.maxSize]) }}</div>
        <div v-if="ride.minSizeEscort">{{ $t('general.escortSize', [ride.minSizeEscort]) }}</div>
      </div>

      <div v-if="ride.currentWaitTime !== undefined" class="font-bold text-indigo-700 mt-2">
        {{ $t('general.currentWaitTime', [ride.currentWaitTime]) }}
      </div>
    </template>
  </image-card>

  <card v-else :title="ride.title" :content="ride.subTitle" :link="cardLink">
    <template #content>
      <div v-if="ride.minAge || ride.maxAge || ride.minSize || ride.maxSize || ride.minSizeEscort" class="mt-2 grid text-sm text-gray-600">
        <div v-if="ride.minAge">{{ $t('general.minAge', [ride.minAge]) }}</div>
        <div v-if="ride.maxAge">{{ $t('general.maxAge', [ride.maxAge]) }}</div>
        <div v-if="ride.minSize">{{ $t('general.minSize', [ride.minSize]) }}</div>
        <div v-if="ride.maxSize">{{ $t('general.maxSize', [ride.maxSize]) }}</div>
        <div v-if="ride.minSizeEscort">{{ $t('general.escortSize', [ride.minSizeEscort]) }}</div>
      </div>

      <div v-if="ride.currentWaitTime !== undefined" class="font-bold text-indigo-700 mt-2">
        {{ $t('general.currentWaitTime', [ride.currentWaitTime]) }}
      </div>
    </template>
  </card>
</template>

<script>
import Card from '@/components/cards/Card'
import ImageCard from './ImageCard'
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
