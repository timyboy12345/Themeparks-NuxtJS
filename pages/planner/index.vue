<template>
  <div>
    <h1 class="text-2xl text-indigo-800 dark:text-indigo-300 font-bold">Planner</h1>

    <h2 v-if="$store.state.planner.park" class="dark:text-gray-100">Welkom in {{ $store.state.planner.park.name }}</h2>

    <div v-if="$store.getters['planner/openingTimesToday']" class="text-sm opacity-60 dark:text-gray-100">
      Open van
      {{ $store.getters['planner/openingTimesToday'].openingTimes.map((t) => `${t.open} tot ${t.close}`).join(', ') }}
    </div>

    <ParkPicker v-if="!$store.state.planner.parkId" class="mt-4" @select="handleParkSelect" />

    <div v-else class="grid gap-4 mt-4">
      <Card title="Aanbevelingen" subtitle="Gebaseerd op je huidige locatie, voorspelde wachttijd en showtijd">
        <template #content>
          <div class="flex overflow-x-auto space-x-4 w-full mt-2">
            <PoiCard
              v-for="poi of recommendedPois"
              :key="poi.id"
              size="sm"
              class="w-11/12 md:w-5/12 lg:w-3/12 flex-shrink-0 cursor-pointer"
              type="auto"
              :poi="poi"
              @click.native="handleClick(poi)"
            />
          </div>
        </template>
      </Card>

      <Card v-if="upcomingShows.length > 0" title="Aankomende Shows">
        <template #content>
          <div class="flex overflow-x-auto space-x-4 w-full mt-2">
            <PoiCard
              v-for="show of upcomingShows"
              :key="show.id"
              size="sm"
              class="w-11/12 md:w-5/12 lg:w-3/12 flex-shrink-0 cursor-pointer"
              type="show"
              :poi="show"
              @click.native="handleClick(show)"
            />
          </div>
        </template>
      </Card>

      <Card title="Favoriete Plekken">
        <template #content>
          <div class="flex overflow-x-auto space-x-4 w-full mt-2">
            <!-- TODO: Fix POI type -->
            <PoiCard
              v-for="f of favoritePois"
              :key="f.id"
              class="w-11/12 flex-shrink-0 cursor-pointer"
              type="ride"
              :poi="f"
              size="sm"
              @click.native="handleClick(f)"
            />
          </div>

          <div v-if="favoritePois.length === 0" class="opacity-80">Je hebt nog geen favorieten aangemaakt</div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import ParkPicker from '~/components/planner/ParkPicker.vue'
import Card from '~/components/cards/Card.vue'
import PoiCard from '~/components/cards/PoiCard.vue'

export default {
  name: 'PlannerIndex',
  components: { PoiCard, Card, ParkPicker },
  layout: 'planner',
  head() {
    return {
      title: this.$t('planner.indexTitle'),
    }
  },
  computed: {
    recommendedPois() {
      const favorites = this.$store.state.planner.favorites
        .filter((f) => !this.$store.getters['auth/todaysCheckins'].find((ci) => ci.rideId === f))
        .map((p) => this.$store.state.planner.pois.find((poi) => poi.id === p))
        .map((p) => {
          const showTimes = p.showTimes && p.showTimes.showTimes ? p.showTimes.showTimes : []
          const nextShow = showTimes.find((st) => !st.isPassed)

          if (nextShow) {
            const now = new Date()
            const endTime = new Date()
            endTime.setHours(nextShow.localFromTime.split(':')[0])
            endTime.setMinutes(nextShow.localFromTime.split(':')[1])
            const difference = endTime.getTime() - now.getTime() // This will give difference in milliseconds
            const minutes = Math.round(difference / 60000)

            return {
              ...p,
              nextShowInMinutes: minutes,
            }
          }

          return p
        })
        .sort((a, b) => {
          // Compare show times
          if (a.nextShowInMinutes && b.nextShowInMinutes) {
            return a.nextShowInMinutes > b.nextShowInMinutes ? 1 : -1
          }

          if (a.nextShowInMinutes && b.category === 'ATTRACTION') {
            return a.nextShowInMinutes > 30 ? 1 : -1
          }

          // Compare ride wait times
          if (a.category === 'ATTRACTION' && b.category === 'ATTRACTION') {
            if (!a.currentWaitTime || !b.currentWaitTime) {
              return -1
            }

            if (a.currentWaitTime > b.currentWaitTime) {
              return 1
            }

            if (a.currentWaitTime < b.currentWaitTime) {
              return -1
            }
          }

          return 0
        })

      return favorites
    },
    upcomingShows() {
      return this.$store.state.planner.pois
        .filter((p) => p.category === 'SHOW')
        .filter((s) => s.showTimes && s.showTimes.showTimes.filter((st) => !st.isPassed).length > 0)
        .sort(function (a, b) {
          const firstShowTimeA = a.showTimes.showTimes.filter((st) => !st.isPassed)[0].localFromTime ?? '23:59'
          const firstShowTimeB = b.showTimes.showTimes.filter((st) => !st.isPassed)[0].localFromTime ?? '23:59'
          return firstShowTimeA.localeCompare(firstShowTimeB)
        })
    },
    favoritePois() {
      const favorites = this.$store.state.planner.favorites
      return this.$store.state.planner.pois.filter((p) => favorites.includes(p.id))
    },
  },
  mounted() {},
  methods: {
    handleParkSelect(park) {
      this.$store.commit('planner/setInitialized', false)
      this.$store.commit('planner/setPark', park)

      this.$axios.get('/parks/' + localStorage.getItem('planner_park_id') + '/pois').then((d) => {
        this.$store.commit('planner/setPois', d.data)
        this.$store.commit('planner/setInitialized', true)
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
