<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <poi-card v-for="poi of filteredPois" :key="poi.id" :type="type" :park="park" :poi="poi" :show-more="true"></poi-card>
    </div>

    <div v-if="notAllowedPois.length > 0" class="mt-6 mb-2">
      <h2 class="text-indigo-700 dark:text-indigo-300 font-bold">Niet geschikt voor de doorgegeven lengte</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <poi-card
          v-for="poi of notAllowedPois"
          :key="poi.id"
          class="opacity-50"
          :type="type"
          :park="park"
          :poi="poi"
          :show-more="true"
        ></poi-card>
      </div>
    </div>
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
    length: {
      type: Number,
      required: false,
      default: null,
    },
  },
  computed: {
    filteredPois() {
      if (!this.length) {
        return this.pois
      }

      if (!this.pois) {
        return []
      }

      return this.pois.filter(this.allowedInPoi)
    },
    notAllowedPois() {
      if (!this.length) {
        return []
      }

      if (!this.pois) {
        return []
      }

      return this.pois.filter((poi) => !this.allowedInPoi(poi))
    },
  },
  methods: {
    allowedInPoi(poi) {
      if (poi.minSizeWithEscort && this.size < poi.minSizeWithEscort) {
        return false
      }

      if (poi.maxSize && this.length > poi.maxSize) {
        return false
      }

      return true
    },
  },
}
</script>
