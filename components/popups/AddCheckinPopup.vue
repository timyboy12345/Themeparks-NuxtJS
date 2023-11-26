<template>
  <div class="absolute shadow w-full bottom-0 left-0 z-10">
    <div class="bg-white rounded shadow m-4 p-4 rounded gap-y-4 flex flex-col">
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
            dateTime: new Date().toISOString(),
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
