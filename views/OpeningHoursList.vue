<template>
  <div>
    <loading-spinner v-if="!openingHours && !error" class="py-4"></loading-spinner>

    <general-error v-if="error" class="m-4" sub-title="We couldn't fetch the openingHours for this park" />

    <general-message v-if="openingHours && openingHours.length === 0" class="m-4" />

    <div v-if="openingHours && openingHours.length > 0" class="mt-2 flex flex-col bg-white divide-y divide-gray-200">
      <div
        v-for="openingHour of openingHours"
        :key="openingHour.id"
        class="py-2 px-4 flex hover:bg-gray-100 transition duration-100 flex-row justify-between items-center"
      >
        <div class="flex flex-row items-center">
          <div class="flex flex-col">
            <div class="text-indigo-700">{{ openingHour.date | formatDate }}</div>
            <div v-if="openingHour.currentWaitTime !== undefined" class="text-sm text-gray-600">
              {{ $t('general.unspecifiedWaitTime', [openingHour.currentWaitTime]) }}
            </div>
          </div>
        </div>

        <div class="text-gray-700">
          <div v-for="timeSlot of openingHour.openingTimes" :key="timeSlot.openTime">
            {{ timeSlot.openTime }} -
            {{ timeSlot.closeTime }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner'
import GeneralError from '@/components/GeneralError'
import GeneralMessage from '@/components/GeneralMessage'

export default {
  name: 'OpeningHoursList',
  components: { GeneralMessage, GeneralError, LoadingSpinner },
  props: {
    parkId: {
      type: String,
      required: true,
    },
    maxOpeningHours: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      openingHours: undefined,
      error: null,
    }
  },
  async fetch() {
    this.openingHours = await this.$axios
      .get('/parks/' + this.parkId + '/opening-hours')
      .then((openingHours) => {
        return openingHours.data.slice(0, this.maxOpeningHours)
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
