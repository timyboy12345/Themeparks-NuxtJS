<template>
  <div>
    <loading-spinner v-if="!rides" class="py-4"></loading-spinner>

    <general-error v-if="rides && rides.length === 0" sub-title="We couldn't fetch the rides for this park" />

    <div v-if="rides && rides.length > 0" class="flex flex-col bg-white divide-y divide-gray-200">
      <NuxtLink
        v-for="ride of rides"
        :key="ride.id"
        :to="'/parks/' + parkId + '/rides/' + ride.id"
        class="py-2 px-4 flex hover:bg-gray-100 transition duration-100 flex-row justify-between items-center"
      >
        <div class="flex flex-row items-center">
          <div class="rounded-full bg-gray-500 w-6 h-6 lg:w-8 lg:h-8 mr-2 overflow-hidden">
            <img v-if="ride.image_url" :src="ride.image_url" class="object-cover object-center w-full h-full" />
            <div v-else class="object-cover object-center w-full h-full" />
          </div>
          <div class="text-indigo-700">{{ ride.title }}</div>
        </div>

        <div class="text-gray-700">{{ ride.area }}</div>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner'
import GeneralError from '@/components/GeneralError'

export default {
  name: 'RideList',
  components: { GeneralError, LoadingSpinner },
  props: {
    parkId: {
      type: String,
      required: true,
    },
    maxRides: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      rides: undefined,
    }
  },
  async fetch() {
    this.rides = await this.$axios
      .get('/park/' + this.parkId + '/rides')
      .then((rides) => {
        return rides.data.slice(0, this.maxRides)
      })
      .catch(({ response }) => {
        return []
        console.error('Error while fetching all rides')
        console.log(response)
      })
  },
}
</script>

<style scoped></style>
