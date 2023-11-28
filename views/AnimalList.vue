<template>
  <div>
    <loading-spinner v-if="!animals && !error" class="py-4"></loading-spinner>

    <general-error v-if="error" class="m-4" sub-title="We couldn't fetch the animals for this park" />

    <general-message v-if="animals && animals.length === 0" class="m-4" />

    <div v-if="animals && animals.length > 0" class="mt-2 flex flex-col bg-white divide-y divide-gray-200 dark:divide-gray-600">
      <NuxtLink
        v-for="animal of animals"
        :key="animal.id"
        :to="localePath('/parks/' + parkId + '/animals/' + animal.id)"
        class="py-2 px-4 flex hover:bg-gray-100 transition duration-100 flex-row justify-between items-center"
      >
        <div class="flex flex-row items-center">
          <div class="rounded-full bg-gray-500 w-6 h-6 lg:w-8 lg:h-8 mr-2 overflow-hidden">
            <img
              v-if="animal.image_url"
              :alt="`Image of ${animal.title}`"
              :title="`Image of ${animal.title}`"
              :src="animal.image_url"
              class="object-cover object-center w-full h-full"
            />
            <div v-else class="object-cover object-center w-full h-full" />
          </div>

          <div class="flex flex-col">
            <div class="text-indigo-700">{{ animal.title }}</div>
            <div
              v-if="animal.animalTimes && animal.animalTimes.futureAnimalTimes && animal.animalTimes.futureAnimalTimes.length > 0"
              class="text-gray-600 text-sm"
            >
              Volgende animal: {{ animal.animalTimes.futureAnimalTimes[0].fromTime | time }}
            </div>
          </div>
        </div>

        <div class="text-gray-700">{{ animal.area }}</div>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import GeneralError from '@/components/GeneralError'
import LoadingSpinner from '@/components/LoadingSpinner'
import GeneralMessage from '@/components/GeneralMessage'

export default {
  name: 'AnimalList',
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
    maxAnimals: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      animals: undefined,
      error: null,
    }
  },
  async fetch() {
    this.animals = await this.$axios
      .get('/parks/' + this.parkId + '/animals')
      .then((rides) => {
        return rides.data.slice(0, this.maxAnimals)
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
