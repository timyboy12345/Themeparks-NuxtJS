<template>
  <div>
    <h1 class="text-2xl text-indigo-800 dark:text-indigo-300 font-bold mb-4">Te Doen</h1>

    <div class="flex flex-col gap-4">
      <button
        v-if="!$store.state.planner.location"
        class="text-center bg-indigo-800 text-white hover:bg-indigo-900 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition duration-100 rounded py-2 px-4"
        type="button"
        @click="getLocation"
      >
        Klik om je locatie te gebruiken
      </button>

      <div class="flex flex-row gap-2 overflow-x-auto whitespace-nowrap">
        <button
          v-for="(name, id) of categories"
          :key="id"
          class="shrink-0 text-center bg-indigo-800 text-white hover:bg-indigo-900 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition duration-100 rounded py-1 px-2 text-sm"
          :class="{ 'opacity-60': category && category !== id }"
          @click="category && category === id ? (category = null) : (category = id)"
        >
          {{ name }}
        </button>
      </div>

      <input
        v-model="query"
        class="rounded py-2 px-4 border-indigo-800 border focus:ring-indigo-800 focus:ring-2"
        type="text"
        placeholder="Zoeken op naam"
      />

      <LoadingSpinner v-if="!$store.state.planner.pois" />
      <div v-else-if="$store.state.planner.pois.length === 0">Geen POIs Gevonden</div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PoiCard
          v-for="poi of filteredPois"
          :key="poi.id"
          target="_blank"
          :park="$store.state.planner.park"
          :type="poiType(poi)"
          :poi="poi"
          size="sm"
          class="cursor-pointer"
          @click.native="handleClick(poi)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import PoiCard from '~/components/cards/PoiCard.vue'
import { measureLatLngPoints } from '~/mixins/planner'

export default {
  name: 'PlannerPois',
  components: { PoiCard, LoadingSpinner },
  layout: 'planner',
  data() {
    return {
      query: '',
      category: null,
      categories: {
        ATTRACTION: 'Attracties',
        SHOP: 'Shops',
        SHOW: 'Shows',
        RESTAURANT: 'Restaurants',
        TOILETS: 'Toiletten',
      },
    }
  },
  head() {
    return {
      title: this.$t('planner.poisTitle'),
    }
  },
  computed: {
    filteredPois() {
      let pois = this.$store.state.planner.pois ?? []

      pois = pois.map((p) => {
        const distance = measureLatLngPoints(p.location, this.$store.state.planner.location)

        return {
          ...p,
          distance,
        }
      })

      if (this.category) {
        pois = pois.filter((p) => p.category === this.category)
      }

      return pois.sort((a, b) => {
        const s1 = this.$store.state.planner.location ? a.distance : a.name
        const s2 = this.$store.state.planner.location ? b.distance : b.name

        if (this.$store.state.planner.location && s2 === undefined) return -1

        if (s1 < s2) {
          return -1
        }
        if (s1 > s2) {
          return 1
        }

        return 0
      })
      // .filter((p) => p.name.toLowerCase().includes(this.query.toLowerCase()))
    },
  },
  methods: {
    poiType(poi) {
      switch (poi.category) {
        case 'ATTRACTION':
          return 'ride'
        case 'RESTAURANT':
          return 'restaurant'
        case 'SHOW':
          return 'show'
        case 'SHOP':
          return 'shop'
        case 'ANIMAL':
          return 'animal'
        case 'SERVICE':
        default:
          return 'ride'
      }
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
    getLocation() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          this.$store.commit('planner/setLocationStatus', 'accepted')
          this.$store.commit('planner/setLocation', {
            lat,
            lng,
          })
        },
        (err) => {
          this.$sentry.captureException(err)
          // console.error(err)
        }
      )
    },
  },
}
</script>
