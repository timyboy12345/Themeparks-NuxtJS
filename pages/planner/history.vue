<template>
  <div>
    <h1 class="mb-4 text-2xl text-indigo-800 dark:text-indigo-300 font-bold">Eerder Gedaan vandaag</h1>

    <LoadingSpinner v-if="!checkins" />
    <div v-else-if="checkins.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="checkin of checkins" :key="checkin.id">
        <PoiCard
          target="_blank"
          :park="$store.state.planner.park"
          type="auto"
          :poi="$store.state.planner.pois.find((p) => p.id === checkin.rideId)"
          size="sm"
          class="cursor-pointer"
          @click.native="handleClick($store.state.planner.pois.find((p) => p.id === checkin.rideId))"
        />
        <div class="flex flex-row gap-x-2 text-sm items-center content-center mt-1">
          <button type="button" class="underline text-red-600 hover:no-underline" @click="deleteCheckin(checkin.id)">Verwijderen</button>
          <div class="text-gray-600 dark:text-gray-400">Ingecheckt op {{ checkin.dateTime | formatDateTime }}</div>
        </div>
      </div>
    </div>
    <div v-else class="my-16 text-center text-gray-600 dark:text-gray-400">
      Je hebt nog geen attracties, restaurants of shows bezocht vandaag.
    </div>
  </div>
</template>

<script>
import PoiCard from '~/components/cards/PoiCard.vue'
import LoadingSpinner from '~/components/LoadingSpinner.vue'

export default {
  name: 'PlannerHistory',
  components: { LoadingSpinner, PoiCard },
  layout: 'planner',
  head() {
    return {
      title: this.$t('planner.historyTitle'),
    }
  },
  computed: {
    checkins() {
      if (!this.$store.getters['auth/todaysCheckins']) {
        return undefined
      }

      return this.$store.getters['auth/todaysCheckins']
        .filter((ci) => ci.parkId === this.$store.state.planner.parkId)
        .sort(function (a, b) {
          return new Date(b.date) - new Date(a.date)
        })
    },
  },
  methods: {
    deleteCheckin(checkinId) {
      this.$axios
        .delete(`/checkins/${checkinId}`)
        .then(() => {
          const newCheckins = this.$store.state.auth.checkins.filter((c) => c.id !== checkinId)
          this.$store.commit('auth/setCheckins', newCheckins)
        })
        .catch((exception) => {
          this.$sentry.captureException(exception)
        })
    },
    handleClick(poi) {
      this.$store.commit('popup/addPopup', {
        type: 'poi',
        poi,
        park: this.$store.state.planner.park,
        parkId: this.$store.state.planner.parkId,
        rideId: poi.id,
      })
    },
  },
}
</script>
