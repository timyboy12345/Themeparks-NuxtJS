<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <show-card v-for="restaurant of shows" :key="restaurant.id" :park="park" :show="restaurant" :show-more="true"></show-card>
  </div>
</template>

<script>
import ShowCard from '@/components/cards/ShowCard'

export default {
  components: { ShowCard },
  props: {
    shows: {
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
