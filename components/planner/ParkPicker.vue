<template>
  <div class="flex flex-col gap-4">
    <button
      v-if="!$store.state.planner.location"
      class="text-center bg-indigo-800 text-white hover:bg-indigo-900 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition duration-100 rounded py-2 px-4"
      type="button"
      @click="getLocation"
    >
      Klik om je locatie te gebruiken
    </button>

    <input v-model="query" class="rounded py-2 px-4" type="text" placeholder="Efteling" />

    <LoadingSpinner v-if="$fetchState.pending" />
    <div v-if="$fetchState.error">{{ $fetchState.error }}</div>

    <Card v-else>
      <template #content>
        <div class="max-h-60 -m-4 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-600">
          <div
            v-for="park of filteredParks"
            :key="park.id"
            class="py-2 px-4 cursor-pointer hover:bg-black hover:bg-opacity-10"
            @click="$emit('select', park)"
          >
            <div class="">{{ park.name }}</div>
            <div v-if="$store.state.planner.location && park.location" class="opacity-60">{{ (park.distance / 100).toFixed(1) }} km</div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { measureLatLngPoints } from '~/mixins/planner'
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import Card from '~/components/cards/Card.vue'

export default {
  name: 'ParkPicker',
  components: { Card, LoadingSpinner },
  data() {
    return {
      parks: null,
      query: '',
    }
  },
  async fetch() {
    await this.getParks()
  },
  computed: {
    filteredParks() {
      return this.parks
        ? this.parks
            .map((p) => {
              const distance = measureLatLngPoints(p.location, this.$store.state.planner.location)

              return {
                ...p,
                distance,
              }
            })
            .sort((a, b) => {
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
            .filter((p) => p.name.toLowerCase().includes(this.query.toLowerCase()))
        : []
    },
  },
  methods: {
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
          console.error(err)
        }
      )
    },
    async getParks() {
      await this.$axios
        .get('/parks/')
        .then((parkResponse) => {
          this.parks = parkResponse.data
        })
        .catch((e) => {
          this.park = null
          this.$sentry.captureException(e)
        })
    },
  },
}
</script>
