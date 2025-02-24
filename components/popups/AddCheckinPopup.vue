<template>
  <div class="absolute shadow w-full bottom-0 left-0 z-10">
    <div class="bg-white rounded shadow m-4 p-4">
      <h2 class="text-indigo-800">Snel Toevoegen</h2>
      <p class="text-gray-600 text-xs md:text-sm mb-2">
        Door hieronder te klikken voeg je automatisch een checkin toe, met als datum/tijd het huidige moment.
      </p>

      <div class="text-sm grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <button
          v-for="i in [5, 10, 15, 20, 30, 40, 50, 60]"
          :key="i"
          type="button"
          class="border border-gray-300 bg-gray-300 bg-opacity-0 py-1 px-2 rounded block transition duration-100"
          :class="{ 'bg-opacity-30 opacity-70': saving, 'cursor-pointer hover:bg-opacity-20': !saving }"
          @click="fastAddCheckin(i)"
        >
          {{ i }} min
        </button>
      </div>
    </div>

    <div class="bg-white rounded shadow m-4 p-4 gap-y-4 flex flex-col">
      <div v-if="!saving" class="flex flex-col gap-y-4">
        <CustomTextInput
          id="dateTime"
          v-model="dateTime"
          :description="$t('checkins.dateTimeDescription')"
          type="datetime-local"
          label="Datum en tijd"
          placeholder="Wanneer ben je er in geweest?"
        />
        <CustomTextInput
          id="wait"
          v-model="waitTime"
          :description="$t('checkins.waitTimeDescription')"
          type="number"
          label="Wachttijd"
          placeholder="Hoeveel minuten heb je gewacht?"
        />

        <button
          :class="{ 'opacity-50': !dateTime }"
          type="button"
          class="rounded bg-indigo-800 hover:bg-indigo-900 transition-colors duration-100 text-white py-2 px-4 mt-4"
          @click="addCheckin"
        >
          {{ $t('checkins.addCheckinButton') }}
        </button>
      </div>

      <loading-spinner v-else :subtitle="$t('general.dataIsBeingSaved')" />
    </div>
  </div>
</template>

<script>
import CustomTextInput from '@/components/form/CustomTextInput'
import LoadingSpinner from '@/components/LoadingSpinner'

export default {
  name: 'AddCheckinPopup',
  components: { LoadingSpinner, CustomTextInput },
  data() {
    return {
      saving: false,
      dateTime: `${new Date().toISOString().substr(0, 10)} ${new Date().toISOString().substr(11, 5)}`,
      waitTime: null,
    }
  },
  methods: {
    fastAddCheckin(mins) {
      if (this.saving) {
        return
      }

      this.waitTime = mins
      this.addCheckin()
    },
    addCheckin() {
      if (!this.dateTime) {
        return
      }

      this.saving = true

      this.$axios
        .post('/checkins', {
          dateTime: this.dateTime,
          parkId: this.$store.getters['popup/getCurrentPopup'].parkId,
          rideId: this.$store.getters['popup/getCurrentPopup'].rideId,
          waitTime: this.waitTime,
        })
        .then((data) => {
          this.$store.commit('popup/closePopup')

          this.$store.commit('auth/addCheckin', {
            id: data.data.identifiers[0].id,
            createdAt: new Date().toISOString(),
            // TODO: This does not work properly with time differences
            dateTime: new Date(this.dateTime).toISOString(),
            parkId: this.$store.getters['popup/getCurrentPopup'].parkId,
            rideId: this.$store.getters['popup/getCurrentPopup'].rideId,
            waitTime: this.waitTime,
          })
        })
        .catch((exception) => {
          this.$sentry.captureException(exception)
        })
        .then(() => {
          this.saving = false
        })
    },
  },
}
</script>
