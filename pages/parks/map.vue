<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <div class="grid gap-4">
      <card h1 :title="$t('map.title')" :subtitle="$t('map.subtitle')"></card>

      <no-ssr v-if="parks">
        <map-component component-height="h-128" :zoom="1" :lat="0" :lng="0">
          <map-marker v-for="park in locatedParks" :key="park.id" :popup="park.name" :lat="park.location.lat" :lng="park.location.lng">
            <template #default>
              <img
                v-if="park.image"
                v-lazy-load
                alt="Image depecting theme park"
                :data-src="park.image"
                class="rounded overflow-hidden mb-2 w-40 h-20 object-cover"
              />
              <router-link :to="localePath(`/parks/${park.id}`)" class="underline hover:no-underline text-indigo-800">{{
                park.name
              }}</router-link>
            </template>
          </map-marker>
        </map-component>
      </no-ssr>

      <loading-card v-else></loading-card>
    </div>
  </div>
</template>

<script>
import MapComponent from '@/components/maps/MapComponent'
import MapMarker from '@/components/maps/MapMarker'
import Breadcrumbs from '@/components/Breadcrumbs'
import Card from '@/components/cards/Card'
import LoadingCard from '@/components/cards/LoadingCard'

export default {
  name: 'Map',
  components: { LoadingCard, Card, Breadcrumbs, MapMarker, MapComponent },
  data() {
    return {
      parks: null,
    }
  },
  async fetch() {
    await this.getParks()
  },
  head() {
    return {
      title: this.$t('map.title'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Here you will find all the different theme parks that we support',
        },
      ],
    }
  },
  computed: {
    locatedParks() {
      return this.parks.filter((p) => p.location && p.location.lat && p.location.lng && p.location.lat > -80 && p.location.lat < 80)
    },
    breadcrumbs() {
      return [
        {
          title: this.$t('general.home'),
          url: '/',
        },
        {
          title: this.$t('general.parks'),
          url: '/parks',
        },
        {
          title: this.$t('general.map'),
          url: '#',
        },
      ]
    },
  },
  methods: {
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

<style scoped></style>
