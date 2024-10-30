<template>
  <div>
    <loading-spinner v-if="$fetchState.pending" class="py-4"></loading-spinner>

    <general-error v-if="$fetchState.error" class="m-4" sub-title="We couldn't fetch the events for this park" />

    <general-message v-if="!$fetchState.pending && events.length === 0" class="m-4" />

    <div v-if="!$fetchState.loading && events" class="mt-2 flex flex-col bg-white divide-y divide-gray-200 dark:divide-gray-600">
      <NuxtLink
        v-for="event of events"
        :key="event.id"
        :to="localePath('/parks/' + parkId + '/events/' + event.type.toLowerCase())"
        class="py-2 px-4 flex hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-800 transition duration-100 flex-row justify-between items-center"
      >
        <div class="flex flex-row items-center">
          <div class="rounded-full bg-gray-500 w-6 h-6 lg:w-8 lg:h-8 mr-2 overflow-hidden">
            <img
              v-if="event.image"
              v-lazy-load
              :alt="`Image of ${event.name}`"
              :title="`Image of ${event.name}`"
              :data-src="event.image"
              class="object-cover object-center w-full h-full"
            />
            <div v-else class="object-cover object-center w-full h-full" />
          </div>

          <div class="flex flex-col">
            <div class="text-indigo-700 dark:text-indigo-400">{{ event.name }}</div>
            <div class="text-sm text-gray-600">{{ event.subTitle }}</div>
          </div>
        </div>

        <div class="text-gray-700 dark:text-gray-500">{{ event.area }}</div>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner'
import GeneralError from '@/components/GeneralError'
import GeneralMessage from '@/components/GeneralMessage'

export default {
  name: 'EventList',
  components: { GeneralMessage, GeneralError, LoadingSpinner },
  props: {
    parkId: {
      type: String,
      required: true,
    },
    maxEvents: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      events: undefined,
      error: null,
    }
  },
  async fetch() {
    this.events = await this.$axios
      .get('/parks/' + this.parkId + '/events')
      .then((eventData) => {
        return eventData.data.slice(0, this.maxEvents)
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
