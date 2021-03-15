<template>
  <div>
    <loading-spinner v-if="!restaurants" class="py-4"></loading-spinner>

    <general-error v-if="restaurants && restaurants.length === 0" sub-title="We couldn't fetch the restaurants for this park" />

    <div v-if="restaurants && restaurants.length > 0" class="flex flex-col bg-white divide-y divide-gray-200">
      <NuxtLink
        v-for="restaurant of restaurants"
        :key="restaurant.id"
        :to="'/parks/' + parkId + '/restaurants/' + restaurant.id"
        class="py-2 px-4 flex hover:bg-gray-100 transition duration-100 flex-row justify-between"
      >
        <div class="flex flex-row items-center">
          <div class="rounded-full bg-gray-500 w-6 h-6 lg:w-8 lg:h-8 mr-2 overflow-hidden">
            <img v-if="restaurant.image_url" :src="restaurant.image_url" class="object-cover object-center w-full h-full" />
            <div v-else class="object-cover object-center w-full h-full" />
          </div>
          <div class="text-indigo-700">{{ restaurant.title }}</div>
        </div>

        <div class="text-gray-700">{{ restaurant.area }}</div>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner'
import GeneralError from '@/components/GeneralError'

export default {
  name: 'RestaurantList',
  components: { GeneralError, LoadingSpinner },
  props: {
    parkId: {
      type: String,
      required: true,
    },
    maxRestaurants: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      restaurants: undefined,
    }
  },
  async fetch() {
    this.restaurants = await this.$axios
      .get('/park/' + this.parkId + '/restaurants')
      .then((rides) => {
        return rides.data.slice(0, this.maxRestaurants)
      })
      .catch(() => {
        return []
      })
  },
}
</script>

<style scoped></style>
