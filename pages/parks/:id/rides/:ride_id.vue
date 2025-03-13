<template>
  <loading v-if="$fetchState.pending" class="my-4"></loading>
  <general-error v-else-if="$fetchState.error" :sub-title="$fetchState.error.message" title="Ride not found" />
  <PoiInformation v-else type="ride" :park="park" :poi="ride"></PoiInformation>
</template>

<script>
import PoiInformation from '~/views/PoiInformation.vue'
import Loading from '~/components/LoadingSpinner.vue'
import GeneralError from '~/components/GeneralError.vue'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {
    GeneralError,
    Loading,
    PoiInformation,
  },
  async validate({ params, $axios, $sentry }) {
    return await $axios
      .get('/parks/' + params.id + '/rides')
      .then((rides) => {
        return rides.data.some((r) => r.id === params.ride_id)
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
      parkId: this.$route.params.id,
      rideId: this.$route.params.ride_id,
      park: null,
      ride: null,
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
  computed: {},
  methods: {
    async fetchRide() {
      this.ride = await this.$axios.get('/parks/' + this.parkId + '/rides').then((rides) => {
        const ride = rides.data.find((r) => r.id === this.rideId)

        if (ride) return ride

        throw new Error('Ride could not be found, is the API down?')
      })
    },
    async fetchPark() {
      this.park = await this.$axios.get('/parks/' + this.parkId).then((park) => {
        return park.data
      })
    },
  },
}
</script>
