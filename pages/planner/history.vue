<template>
  <div>
    <h1 class="mb-4 text-2xl text-indigo-800 dark:text-indigo-300 font-bold">Eerder Gedaan vandaag</h1>

    <LoadingSpinner v-if="!checkins" />
    <div v-else-if="checkins.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <PoiCard
        v-for="checkin of checkins.reverse()"
        :key="checkin.id"
        target="_blank"
        :park="$store.state.planner.park"
        type="auto"
        :poi="$store.state.planner.pois.find((p) => p.id === checkin.rideId)"
        size="sm"
        class="cursor-pointer"
        @click.native="handleClick($store.state.planner.pois.find((p) => p.id === checkin.rideId))"
      />
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

      return this.$store.getters['auth/todaysCheckins'].filter((ci) => ci.parkId === this.$store.state.planner.parkId)
    },
  },
  methods: {
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
