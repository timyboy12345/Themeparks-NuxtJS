<template>
  <image-card
    v-if="halloweenEvent && halloweenEvent.image_url"
    :title="halloweenEvent.title"
    :subtitle="halloweenEventType"
    :description="halloweenEvent.subTitle"
    :image-src="halloweenEvent.image_url"
    :link="cardLink"
  >
    <template #content>
      <div
        v-if="
          halloweenEvent.minAgeWithoutEscort ||
          halloweenEvent.maxAge ||
          halloweenEvent.minSizeWithEscort ||
          halloweenEvent.minSizeWithoutEscort ||
          halloweenEvent.maxSize
        "
        class="mt-2 grid text-sm text-gray-600"
      >
        <div v-if="halloweenEvent.minAgeWithoutEscort">{{ $t('general.minAge', [halloweenEvent.minAgeWithoutEscort]) }}</div>
        <div v-if="halloweenEvent.minSizeWithEscort">{{ $t('general.minSizeWithEscort', [halloweenEvent.minSizeWithEscort]) }}</div>
        <div v-if="halloweenEvent.minSizeWithoutEscort && typeof halloweenEvent.minSizeWithEscort === 'undefined'">
          {{ $t('general.minSize', [halloweenEvent.minSizeWithoutEscort]) }}
        </div>
        <div v-else-if="halloweenEvent.minSizeWithoutEscort">
          {{ $t('general.minSizeWithoutEscort', [halloweenEvent.minSizeWithoutEscort]) }}
        </div>
        <div v-if="halloweenEvent.maxAge">{{ $t('general.maxAge', [halloweenEvent.maxAge]) }}</div>
        <div v-if="halloweenEvent.maxSize">{{ $t('general.maxSize', [halloweenEvent.maxSize]) }}</div>
      </div>

      <div
        v-if="halloweenEvent.currentWaitTime !== undefined && halloweenEvent.category !== 'HALLOWEEN_SCAREZONE'"
        class="font-bold text-indigo-700 mt-2"
      >
        {{ $t('general.currentWaitTime', [halloweenEvent.currentWaitTime]) }}
      </div>
    </template>
  </image-card>

  <card v-else :title="halloweenEvent.title" :sub-title="halloweenEventType" :content="halloweenEvent.subTitle" :link="cardLink">
    <template #content>
      <div
        v-if="
          halloweenEvent.minAgeWithoutEscort ||
          halloweenEvent.maxAge ||
          halloweenEvent.minSizeWithEscort ||
          halloweenEvent.maxSize ||
          halloweenEvent.minSizeWithoutEscort
        "
        class="mt-2 grid text-sm text-gray-600"
      >
        <div v-if="halloweenEvent.minAgeWithoutEscort">{{ $t('general.minAge', [halloweenEvent.minAgeWithoutEscort]) }}</div>
        <div v-if="halloweenEvent.minSizeWithEscort">{{ $t('general.minSizeWithEscort', [halloweenEvent.minSizeWithEscort]) }}</div>
        <div v-if="halloweenEvent.minSizeWithoutEscort && !halloweenEvent.minSizeWithEscort">
          {{ $t('general.minSize', [halloweenEvent.minSizeWithoutEscort]) }}
        </div>
        <div v-else-if="halloweenEvent.minSizeWithoutEscort && halloweenEvent.minSizeWithEscort">
          {{ $t('general.minSizeWithoutEscort', [halloweenEvent.minSizeWithoutEscort]) }}
        </div>
        <div v-if="halloweenEvent.maxAge">{{ $t('general.maxAge', [halloweenEvent.maxAge]) }}</div>
        <div v-if="halloweenEvent.maxSize">{{ $t('general.maxSize', [halloweenEvent.maxSize]) }}</div>
      </div>

      <div
        v-if="halloweenEvent.currentWaitTime !== undefined && halloweenEvent.category !== 'HALLOWEEN_SCAREZONE'"
        class="font-bold text-indigo-700 mt-2"
      >
        {{ $t('general.currentWaitTime', [halloweenEvent.currentWaitTime]) }}
      </div>
    </template>
  </card>
</template>

<script>
import ImageCard from './ImageCard'
import Card from '@/components/cards/Card'

export default {
  name: 'HalloweenEventCard',
  components: { Card, ImageCard },
  props: {
    halloweenEvent: {
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
      return this.halloweenEvent.id
    },
    cardLink() {
      if (!this.park || !this.halloweenEvent || !this.showMore) {
        return null
      }

      return `/parks/${this.park.id}/halloween/${this.halloweenEvent.id}`
    },
    halloweenEventType() {
      if (!this.halloweenEvent) {
        return ''
      }

      switch (this.halloweenEvent.category) {
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
