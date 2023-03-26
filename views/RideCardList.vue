<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <ride-card v-for="ride of rides" :key="ride.id" :park="park" :ride="ride" :show-more="true"></ride-card>

    <AdCard class="col-span-2" />
  </div>
</template>

<script>
import AdCard from '@/components/cards/AdCard'
import RideCard from '../components/cards/RideCard'

export default {
  components: { AdCard, RideCard },
  props: {
    rides: {
      type: Array,
      required: true,
    },
    park: {
      type: Object,
      required: false,
      default: null,
    },
  },
}
</script>
