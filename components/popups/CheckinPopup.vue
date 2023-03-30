<template>
  <div class="absolute shadow w-full bottom-0 left-0 z-10">
    <div class="bg-white rounded shadow m-4 p-4 rounded gap-y-4">
      <CustomInput id="dateTime" v-model="dateTime" type="date" label="Datum en tijd" placeholder="Wanneer ben je er in geweest?" />
      <CustomInput id="wait" v-model="waitTime" label="Wachttijd" placeholder="Hoeveel minuten heb je gewacht?" />

      <button
        :class="{ 'opacity-50': !dateTime }"
        type="button"
        class="rounded bg-indigo-800 hover:bg-indigo-900 transition-colors duration-100 text-white py-2 px-4 mt-4"
        @click="addCheckin"
      >
        {{ $t('checkins.addCheckinButton') }}
      </button>
    </div>
  </div>
</template>

<script>
import CustomInput from '@/components/form/CustomInput'
export default {
  name: 'CheckinPopup',
  components: { CustomInput },
  data() {
    return {
      dateTime: new Date().toISOString().substr(0, 10),
      waitTime: null,
    }
  },
  methods: {
    addCheckin() {
      if (!this.dateTime) {
        return
      }

      this.$axios
        .post('/checkins/create', {
          dateTime: this.dateTime,
          parkId: this.$store.getters['popup/getCurrentPopup'].parkId,
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
    },
  },
}
</script>
