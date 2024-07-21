<template>
  <div>
    <loading-spinner v-if="!rides && !error" class="py-4"></loading-spinner>

    <general-error v-if="error" class="m-4" sub-title="We couldn't fetch the rides for this park" />

    <general-message v-if="rides && rides.length === 0" class="m-4" />

    <div v-if="rides && rides.length > 0" class="mt-2 flex flex-col bg-white divide-y divide-gray-200 dark:divide-gray-600">
      <NuxtLink
        v-for="ride of rides"
        :key="ride.id"
        :to="localePath('/parks/' + parkId + '/rides/' + ride.id)"
        class="py-2 px-4 flex hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-800 transition duration-100 flex-row justify-between items-center"
      >
        <div class="flex flex-row items-center">
          <div class="rounded-full bg-gray-500 w-6 h-6 lg:w-8 lg:h-8 mr-2 overflow-hidden">
            <img
              v-if="ride.image_url"
              v-lazy-load
              :alt="`Image of ${ride.title}`"
              :title="`Image of ${ride.title}`"
              :data-src="ride.image_url"
              class="object-cover object-center w-full h-full"
            />
            <div v-else class="object-cover object-center w-full h-full" />
          </div>

          <div class="flex flex-col">
            <div class="text-indigo-700 dark:text-indigo-400">{{ ride.title }}</div>
            <div v-if="ride.currentWaitTime !== undefined" class="text-sm text-gray-600">
              {{ $t('general.unspecifiedWaitTime', [ride.currentWaitTime]) }}
            </div>
          </div>
        </div>

        <div class="text-gray-700">{{ ride.area }}</div>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner'
import GeneralError from '@/components/GeneralError'
import GeneralMessage from '@/components/GeneralMessage'

export default {
  name: 'RideList',
  components: { GeneralMessage, GeneralError, LoadingSpinner },
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
      error: null,
    }
  },
  async fetch() {
    this.rides = await this.$axios
      .get('/parks/' + this.parkId + '/rides')
      .then((rides) => {
        return rides.data.slice(0, this.maxRides)
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
