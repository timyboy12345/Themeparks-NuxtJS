<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <restaurant-card
      v-for="restaurant of restaurants"
      :key="restaurant.id"
      :park="park"
      :restaurant="restaurant"
      :show-more="true"
    ></restaurant-card>
  </div>
</template>

<script>
import RestaurantCard from '@/components/cards/RestaurantCard'

export default {
  components: { RestaurantCard },
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
