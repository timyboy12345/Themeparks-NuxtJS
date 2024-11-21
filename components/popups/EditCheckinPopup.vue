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
          @click="editCheckin"
        >
          {{ $t('checkins.saveCheckinButton') }}
        </button>

        <div class="mt-4 text-red-700 hover:text-red-800 cursor-pointer underline" @click="deleteCheckin">
          {{ $t('checkins.deleteCheckin') }}
        </div>
      </div>

      <loading-spinner v-else :subtitle="$t('general.dataIsBeingSaved')" />
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner'
import CustomTextInput from '@/components/form/CustomTextInput.vue'

export default {
  name: 'EditCheckinPopup',
  components: { CustomTextInput, LoadingSpinner },
  props: {
    checkin: { type: Object, required: true },
  },
  data() {
    return {
      saving: false,
      dateTime: `${new Date(this.checkin.dateTime).toISOString().substr(0, 10)} ${new Date().toISOString().substr(11, 5)}`,
      waitTime: this.checkin.waitTime,
    }
  },
  methods: {
    editCheckin() {
      if (!this.dateTime) {
        return
      }

      this.saving = true

      this.$axios
        .put(`/checkins/${this.checkin.id}`, {
          dateTime: this.dateTime,
          rideId: this.$store.getters['popup/getCurrentPopup'].rideId,
          waitTime: this.waitTime,
        })
        .then(() => {
          this.$store.commit('popup/closePopup')

          // Todo: Reload checkins or add checkin to array
        })
        .catch((exception) => {
          this.$sentry.captureException(exception)
        })
        .then(() => {
          this.saving = false
        })
    },
    deleteCheckin() {
      if (!this.dateTime) {
        return
      }

      this.saving = true

      this.$axios
        .delete(`/checkins/${this.checkin.id}`)
        .then(() => {
          this.$store.commit('popup/closePopup')

          // TODO: Reload checkins or add checkin to array
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
