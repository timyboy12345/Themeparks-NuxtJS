<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading v-if="!park"></loading>

    <div v-else class="grid grid-cols-1 gap-4">
      <map-component component-height="h-128" :lat="averageLat" :lng="averageLng" :zoom="16">
        <!-- TODO: Add links to rides, restaurants, shows, ... -->
        <map-marker
          v-for="ride of latLngRides"
          :key="ride.id"
          icon="blue"
          :lat="ride.location.lat"
          :lng="ride.location.lng"
          :popup="ride.title"
        />

        <map-marker
          v-for="restaurant of latLngRestaurants"
          :key="restaurant.id"
          icon="red"
          :lat="restaurant.location.lat"
          :lng="restaurant.location.lng"
          :popup="restaurant.title"
        />

        <map-marker
          v-for="show of latLngShows"
          :key="show.id"
          icon="orange"
          :lat="show.location.lat"
          :lng="show.location.lng"
          :popup="show.title"
        />

        <map-marker
          v-for="shop of latLngShops"
          :key="shop.id"
          icon="yellow"
          :lat="shop.location.lat"
          :lng="shop.location.lng"
          :popup="shop.title"
        />

        <map-marker
          v-for="animal of latLngAnimals"
          :key="animal.id"
          icon="purple"
          :lat="animal.location.lat"
          :lng="animal.location.lng"
          :popup="animal.title"
        />
      </map-component>

      <!-- TODO: Translate this page and add more information -->
      <card v-if="park" :title="$t('general.map')" subtitle="On this map, all retrievable data is shown">
        <template #content>
          <ul class="list list-disc">
            <li class="ml-8"><span class="text-blue-700">Blue</span> markers are rides</li>
            <li class="ml-8"><span class="text-red-800">Red</span> markers are restaurants</li>
            <li class="ml-8"><span class="text-orange-700">Orange</span> markers are shows</li>
            <li class="ml-8"><span class="text-yellow-600">Yellow</span> markers are shops</li>
            <li class="ml-8"><span class="text-indigo-600">Purple</span> markers are animals</li>
          </ul>
        </template>
      </card>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs'
import MapComponent from '@/components/maps/MapComponent'
import MapMarker from '@/components/maps/MapMarker'
import Loading from '@/components/LoadingSpinner'
import Card from '@/components/cards/Card'

export default {
  name: 'ParkMap',
  components: { Card, Loading, MapMarker, MapComponent, Breadcrumbs },
  async validate({ params, $axios, $sentry }) {
    return await $axios
      .get('/parks/' + params.id)
      .then((data) => {
        return data.data.supports.supportsPoiLocations
      })
      .catch((e) => {
        if (e.response.status === 500) {
          $sentry.captureException(e)
          throw new Error('Under Construction!')
        }

        $sentry.captureException(e)
        return false
      })
  },
  data() {
    return {
      park: null,
      rides: [],
      restaurants: [],
      shows: [],
      shops: [],
      animals: [],
      parkId: this.$route.params.id,
    }
  },
  async fetch() {
    await this.getPark()
    // await Promise.all([this.getPark(), this.getRides(), this.getRestaurants(), this.getShows(), this.getShops(), this.getAnimals()])
  },
  head() {
    const title = this.park ? 'All rides and attractions of ' + this.park.name : 'All rides and attractions on a map'

    return {
      title,
    }
  },
  computed: {
    averageLat() {
      if (this.latLngRides.length === 0) return this.park.location.lat

      return this.latLngRides.reduce((total, next) => total + next.location.lat, 0) / this.rides.length
    },
    averageLng() {
      if (this.latLngRides.length === 0) return this.park.location.lng

      return this.latLngRides.reduce((total, next) => total + next.location.lng, 0) / this.rides.length
    },
    latLngRides() {
      return this.rides.filter((r) => r.location && r.location.lat && typeof r.location.lat === 'number')
    },
    latLngRestaurants() {
      return this.restaurants.filter((r) => r.location && r.location.lng && typeof r.location.lng === 'number')
    },
    latLngShows() {
      return this.shows.filter((r) => r.location && r.location.lng && typeof r.location.lng === 'number')
    },
    latLngShops() {
      return this.shops.filter((r) => r.location && r.location.lng && typeof r.location.lng === 'number')
    },
    latLngAnimals() {
      return this.animals.filter((r) => r.location && r.location.lng && typeof r.location.lng === 'number')
    },
    breadcrumbs() {
      if (!this.park) {
        return []
      }

      return [
        {
          title: this.$t('general.parks'),
          url: '/parks/',
        },
        {
          title: this.park.name,
          url: '/parks/' + this.parkId,
        },
        {
          title: this.$t('general.map'),
          url: '#',
        },
      ]
    },
  },
  methods: {
    async getPark() {
      await this.$axios
        .get('/parks/' + this.parkId)
        .then(async (parkResponse) => {
          this.park = parkResponse.data

          await Promise.all([this.getRides(), this.getRestaurants(), this.getShows(), this.getShops(), this.getAnimals()])
        })
        .catch((e) => {
          this.park = null
          this.$sentry.captureException(e)
        })
    },
    async getRides() {
      if (!this.park.supports.supportsRides) {
        return Promise.resolve()
      }

      await this.$axios
        .get('/parks/' + this.parkId + '/rides')
        .then((ridesResponse) => {
          this.rides = ridesResponse.data
        })
        .catch((e) => {
          this.rides = []
          this.$sentry.captureException(e)
        })
    },
    async getRestaurants() {
      if (!this.park.supports.supportsRestaurants) {
        return Promise.resolve()
      }

      await this.$axios
        .get('/parks/' + this.parkId + '/restaurants')
        .then((restaurantsResponse) => {
          this.restaurants = restaurantsResponse.data
        })
        .catch((e) => {
          this.restaurants = []
          this.$sentry.captureException(e)
        })
    },
    async getShows() {
      if (!this.park.supports.supportsShows) {
        return Promise.resolve()
      }

      await this.$axios
        .get('/parks/' + this.parkId + '/shows')
        .then((showsResponse) => {
          this.shows = showsResponse.data
        })
        .catch((e) => {
          this.shows = []
          this.$sentry.captureException(e)
        })
    },
    async getShops() {
      if (!this.park.supports.supportsShops) {
        return Promise.resolve()
      }

      await this.$axios
        .get('/parks/' + this.parkId + '/shops')
        .then((shopsResponse) => {
          this.shops = shopsResponse.data
        })
        .catch((e) => {
          this.shops = []
          this.$sentry.captureException(e)
        })
    },
    async getAnimals() {
      if (!this.park.supports.supportsAnimals) {
        return Promise.resolve()
      }

      await this.$axios
        .get('/parks/' + this.parkId + '/animals')
        .then((animalsResponse) => {
          this.animals = animalsResponse.data
        })
        .catch((e) => {
          this.animals = []
          this.$sentry.captureException(e)
        })
    },
  },
}
</script>

<style scoped></style>
