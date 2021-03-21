<template>
  <image-card v-if="ride.image_url" :title="ride.title" :description="ride.subTitle" :image-src="ride.image_url" :link="cardLink">
    <template #content>
      <div v-if="ride.minAge || ride.maxAge || ride.minSize || ride.maxSize || ride.minSizeEscort" class="mt-2 grid text-sm text-gray-600">
        <div v-if="ride.minAge">Min age: {{ ride.minAge }} years</div>
        <div v-if="ride.maxAge">Max age: {{ ride.maxAge }} years</div>
        <div v-if="ride.minSize">Min length: {{ ride.minSize }} cm</div>
        <div v-if="ride.maxSize">Max length: {{ ride.maxSize }} cm</div>
        <div v-if="ride.minSizeEscort">With family member: {{ ride.minSize ? ride.minSize + '-' : '' }}{{ ride.minSizeEscort }} cm</div>
      </div>
    </template>
  </image-card>

  <card v-else :title="ride.title" :content="ride.subTitle" :link="cardLink">
    <template #content>
      <div v-if="ride.minAge || ride.maxAge || ride.minSize || ride.maxSize || ride.minSizeEscort" class="mt-2 grid text-sm text-gray-600">
        <div v-if="ride.minAge">Min age: {{ ride.minAge }} years</div>
        <div v-if="ride.maxAge">Max age: {{ ride.maxAge }} years</div>
        <div v-if="ride.minSize">Min length: {{ ride.minSize }} cm</div>
        <div v-if="ride.maxSize">Max length: {{ ride.maxSize }} cm</div>
        <div v-if="ride.minSizeEscort">With family member: {{ ride.minSize ? ride.minSize + '-' : '' }}{{ ride.minSizeEscort }} cm</div>
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
