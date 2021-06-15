<template>
  <div>
    <breadcrumbs v-if="breadcrumbs" :breadcrumbs="breadcrumbs"></breadcrumbs>

    <div class="grid gap-4">
      <card :title="$t('general.statistics')" :sub-title="$t('statistics.subTitle')"></card>

      <loading-spinner v-if="!rides"></loading-spinner>

      <div v-if="rides">
        <RidesWaitTimeHistoryChart :rides="rides"></RidesWaitTimeHistoryChart>
      </div>
    </div>
  </div>
</template>

<script>
import Card from '@/components/cards/Card'
import RidesWaitTimeHistoryChart from '@/components/charts/RidesWaitTimeHistoryChart'
import Breadcrumbs from '@/components/Breadcrumbs'
import LoadingSpinner from '@/components/LoadingSpinner'

export default {
  name: 'Stats',
  components: { LoadingSpinner, Breadcrumbs, RidesWaitTimeHistoryChart, Card },
  data() {
    return {
      parkId: this.$route.params.id,
      rideId: this.$route.params.ride_id,
      park: null,
      rides: null,
    }
  },
  async fetch() {
    await Promise.all([this.fetchPark(), this.fetchRides()])
  },
  head() {
    return {
      title: this.ride && this.park ? `${this.ride.title} @ ${this.park.name}` : 'Attraction',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.ride
            ? 'See current and past waiting times and opening times from ' + this.ride.title + ' and other rides all over the world'
            : 'See current and past waiting times and opening times from theme parks all over the world.',
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.ride ? this.ride.image_url : null,
        },
      ],
    }
  },
  computed: {
    breadcrumbs() {
      return [
        {
          title: this.$t('general.parks'),
          url: '/parks/',
        },
        {
          title: this.park ? this.park.name : this.$t('general.park'),
          url: '/parks/' + this.parkId,
        },
        {
          title: this.$t('general.statistics'),
          url: '#',
        },
      ]
    },
  },
  methods: {
    async fetchRides() {
      this.rides = await this.$axios.get('/park/' + this.parkId + '/rides/history').then((rides) => {
        return rides.data
      })
    },
    async fetchPark() {
      this.park = await this.$axios.get('/park/' + this.parkId).then((park) => {
        return park.data
      })
    },
  },
}
</script>

<style scoped></style>
