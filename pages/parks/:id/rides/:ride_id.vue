<template>
  <div>
    <breadcrumbs v-if="breadcrumbs" :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading v-if="!ride || !park"></loading>

    <div class="grid md:grid-cols-2 gap-4">
      <ride-card v-if="ride && park" :park="park" :ride="ride"></ride-card>

      <card v-if="ride" :title="$t('general.generalInformation')">
        <template #content>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="ride.description"></div>
        </template>
      </card>

      <div v-if="ride && park && ride.images && ride.images.length > 0" class="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <img v-for="(img, i) of ride.images" :key="i" alt="Image of this ride" :src="img" class="bg-white rounded shadow" />
      </div>

      <!--      <div v-if="ride && park && park.supports.supportsRideWaitTimesHistory && ride.waitingTimes">-->
      <!--        <RideWaitTimeHistoryChart :ride="ride" :park="park" :chartdata="ride.waitingTimes"></RideWaitTimeHistoryChart>-->
      <!--      </div>-->

      <div v-if="ride && park && park.supports.supportsRideWaitTimesHistory">
        <RideAverageWaitTimeHistoryChart
          v-if="averageWaitingTimes"
          :ride="ride"
          :park="park"
          :chartdata="averageWaitingTimes"
        ></RideAverageWaitTimeHistoryChart>

        <loading-spinner v-else :subtitle="$t('ride.averageWaitingTimesLoading')"></loading-spinner>
      </div>

      <ad-card></ad-card>
    </div>
  </div>
</template>

<script>
import Card from '@/components/cards/Card'
import Breadcrumbs from '@/components/Breadcrumbs'
import RideWaitTimeHistoryChart from '@/components/charts/RideWaitTimeHistoryChart'
import RideAverageWaitTimeHistoryChart from '@/components/charts/RideAverageWaitTimeHistoryChart'
import LoadingSpinner from '@/components/LoadingSpinner'
import AdCard from '@/components/cards/AdCard'
import Loading from '../../../../components/LoadingSpinner'
import RideCard from '../../../../components/cards/RideCard'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { AdCard, LoadingSpinner, RideAverageWaitTimeHistoryChart, RideWaitTimeHistoryChart, Breadcrumbs, Card, RideCard, Loading },
  data() {
    return {
      parkId: this.$route.params.id,
      rideId: this.$route.params.ride_id,
      park: null,
      ride: null,
      averageWaitingTimes: null,
    }
  },
  async fetch() {
    await Promise.all([this.fetchPark(), this.fetchRide()])
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
          title: this.$t('general.rides'),
          url: '/parks/' + this.parkId + '/rides',
        },
        {
          title: this.ride ? this.ride.title : this.$t('general.ride'),
          url: '#',
        },
      ]
    },
  },
  created() {
    this.fetchHistory()
  },
  methods: {
    async fetchRide() {
      this.ride = await this.$axios.get('/parks/' + this.parkId + '/rides').then((rides) => {
        return rides.data.find((r) => r.id === this.rideId)
      })
    },
    async fetchPark() {
      this.park = await this.$axios.get('/parks/' + this.parkId).then((park) => {
        return park.data
      })
    },
    async fetchHistory() {
      this.averageWaitingTimes = await this.$axios.get('/parks/' + this.parkId + '/history/averages').then((rides) => {
        const ride = rides.data.find((ride) => ride.id === this.rideId)
        if (ride) {
          return ride.waitingTimes
        } else {
          return []
        }
      })
    },
  },
}
</script>
