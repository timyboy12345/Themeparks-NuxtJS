<template>
  <card h1 :title="park.name" :sub-title="park.countryCode" :content="park.description" :image-src="park.image" :link="link" />
</template>

<script>
import Card from '@/components/cards/Card'

export default {
  name: 'ParkCard',
  components: { Card },
  props: {
    park: {
      type: Object,
      required: true,
    },
    usesLink: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    link() {
      return this.usesLink ? '/parks/' + this.park.id : null
    },
  },
}
</script>

<style scoped></style>
