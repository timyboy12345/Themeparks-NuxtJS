<template>
  <div>
    <loading-spinner v-if="!restaurants && !error" class="py-4"></loading-spinner>

    <general-error v-if="error" class="m-4" sub-title="We couldn't fetch the restaurants for this park" />

    <general-message v-if="restaurants && restaurants.length === 0" class="m-4" />

    <div v-if="restaurants && restaurants.length > 0" class="mt-2 flex flex-col bg-white divide-y divide-gray-200">
      <NuxtLink
        v-for="restaurant of restaurants"
        :key="restaurant.id"
        :to="localePath('/parks/' + parkId + '/restaurants/' + restaurant.id)"
        class="py-2 px-4 flex hover:bg-gray-100 transition duration-100 flex-row justify-between items-center"
      >
        <div class="flex flex-row items-center">
          <div class="rounded-full bg-gray-500 w-6 h-6 lg:w-8 lg:h-8 mr-2 overflow-hidden">
            <img
              v-if="restaurant.image_url"
              v-lazy-load
              :alt="`Image of ${restaurant.title}`"
              :title="`Image of ${restaurant.title}`"
              :src="restaurant.image_url"
              class="object-cover object-center w-full h-full"
            />
            <div v-else class="object-cover object-center w-full h-full" />
          </div>

          <div class="flex flex-col">
            <div class="text-indigo-700">{{ restaurant.title }}</div>
            <!--            <div v-if="restaurant.openingTimes" class="text-sm text-gray-600">-->
            <!--              Open van {{ restaurant.openingTimes[0].openTime | time }} tot {{ restaurant.openingTimes[0].closeTime | time }}-->
            <!--            </div>-->
          </div>
        </div>

        <div class="text-gray-700">{{ restaurant.area }}</div>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner'
import GeneralError from '@/components/GeneralError'
import GeneralMessage from '@/components/GeneralMessage'

export default {
  name: 'RestaurantList',
  components: { GeneralMessage, GeneralError, LoadingSpinner },
  filters: {
    time(value) {
      const times = value.split(':')
      return `${times[0]}:${times[1]}`
    },
  },
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
      error: null,
    }
  },
  async fetch() {
    this.restaurants = await this.$axios
      .get('/parks/' + this.parkId + '/restaurants')
      .then((rides) => {
        return rides.data.slice(0, this.maxRestaurants)
      })
      .catch((e) => {
        this.error = true
        this.$sentry.captureException(e)
        return null
      })
  },
}
</script>

<style scoped></style>
