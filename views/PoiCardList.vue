<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <poi-card v-for="poi of pois" :key="poi.id" :type="type" :park="park" :poi="poi" :show-more="true"></poi-card>
  </div>
</template>

<script>
import PoiCard from '~/components/cards/PoiCard.vue'

export default {
  components: { PoiCard },
  props: {
    pois: {
      type: Array,
      required: true,
    },
    park: {
      type: Object,
      required: false,
      default: null,
    },
    type: {
      type: String,
      required: true,
      validator(value) {
        return ['ride', 'restaurant', 'show', 'animal', 'shop'].includes(value)
      },
    },
  },
}
</script>
