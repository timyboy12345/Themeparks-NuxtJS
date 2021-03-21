<template>
  <div>
    <loading-spinner v-if="!shows" class="py-4"></loading-spinner>

    <general-error v-if="error" class="m-4" sub-title="We couldn't fetch the shows for this park" />

    <general-message v-if="shows && shows.length === 0" class="m-4" />

    <div v-if="shows && shows.length > 0" class="flex flex-col bg-white divide-y divide-gray-200">
      <NuxtLink
        v-for="show of shows"
        :key="show.id"
        :to="'/parks/' + parkId + '/shows/' + show.id"
        class="py-2 px-4 flex hover:bg-gray-100 transition duration-100 flex-row justify-between"
      >
        <div class="flex flex-row items-center">
          <div class="rounded-full bg-gray-500 w-6 h-6 lg:w-8 lg:h-8 mr-2 overflow-hidden">
            <img v-if="show.image_url" :src="show.image_url" class="object-cover object-center w-full h-full" />
            <div v-else class="object-cover object-center w-full h-full" />
          </div>
          <div class="text-indigo-700">{{ show.title }}</div>
        </div>

        <div class="text-gray-700">{{ show.area }}</div>
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
      .get('/park/' + this.parkId + '/shows')
      .then((rides) => {
        return rides.data.slice(0, this.maxShows)
      })
      .catch((e) => {
        this.error = e
        return undefined
      })
  },
}
</script>

<style scoped></style>
