<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <restaurant-card
      v-for="restaurant of restaurants"
      :key="restaurant.id"
      :park="park"
      :restaurant="restaurant"
      :show-more="true"
    ></restaurant-card>

    <AdCard class="col-span-2" />
  </div>
</template>

<script>
import RestaurantCard from '@/components/cards/RestaurantCard'
import AdCard from '@/components/cards/AdCard'

export default {
  components: { AdCard, RestaurantCard },
  props: {
    restaurants: {
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
