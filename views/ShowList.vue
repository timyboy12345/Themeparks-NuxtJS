<template>
  <div>
    <loading-spinner v-if="!shows && !error" class="py-4"></loading-spinner>

    <general-error v-if="error" class="m-4" sub-title="We couldn't fetch the shows for this park" />

    <general-message v-if="shows && shows.length === 0" class="m-4" />

    <div v-if="shows && shows.length > 0" class="mt-2 flex flex-col bg-white divide-y divide-gray-200 dark:divide-gray-600">
      <NuxtLink
        v-for="show of shows"
        :key="show.id"
        :to="localePath('/parks/' + parkId + '/shows/' + show.id)"
        class="py-2 px-4 flex hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-800 transition duration-100 flex-row justify-between items-center"
      >
        <div class="flex flex-row items-center">
          <div class="grow rounded-full bg-gray-500 w-6 h-6 lg:w-8 lg:h-8 mr-2 overflow-hidden">
            <img
              v-if="show.image_url"
              :alt="`Image of ${show.title}`"
              :title="`Image of ${show.title}`"
              :src="show.image_url"
              class="object-cover object-center w-full h-full"
            />
            <div v-else class="object-cover object-center w-full h-full" />
          </div>

          <div class="flex flex-col">
            <div class="text-indigo-700 dark:text-indigo-300">{{ show.title }}</div>
            <div v-if="futureShowTimes(show).length > 0" class="text-gray-600 dark:text-gray-400 text-sm">
              Volgende show: {{ futureShowTimes(show)[0].localFromTime | time }}
            </div>
          </div>
        </div>

        <div class="text-gray-700 dark:text-gray-400">{{ show.area }}</div>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import GeneralError from '@/components/GeneralError'
import LoadingSpinner from '@/components/LoadingSpinner'
import GeneralMessage from '@/components/GeneralMessage'

export default {
  name: 'ShowList',
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
    maxShows: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      shows: undefined,
      error: null,
    }
  },
  async fetch() {
    this.shows = await this.$axios
      .get('/parks/' + this.parkId + '/shows')
      .then((rides) => {
        return rides.data.slice(0, this.maxShows)
      })
      .catch((e) => {
        this.error = true
        this.$sentry.captureException(e)
        return null
      })
  },
  methods: {
    futureShowTimes(show) {
      if (!show.showTimes || !show.showTimes.showTimes) {
        return []
      }

      return show.showTimes.showTimes.filter((st) => !st.isPassed)
    },
  },
}
</script>

<style scoped></style>
