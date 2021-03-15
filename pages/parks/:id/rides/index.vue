<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading v-if="!rides || rides.length === 0"></loading>

    <ride-list v-if="rides && rides.length > 0" :park="park" :rides="rides"></ride-list>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs'
import Loading from '../../../../components/LoadingSpinner'
import RideList from '../../../../views/RideCardList'
export default {
  components: { Breadcrumbs, RideList, Loading },
  data() {
    return {
      parkId: this.$route.params.id,
      rides: null,
      park: null,
    }
  },
  async fetch() {
    await Promise.all([this.getParkRides(), this.getPark()]).then()
  },
  head() {
    const name = this.park ? this.park.name : 'dit park'

    return {
      title: 'All rides of ' + name,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'These are all rides of ' + name,
        },
      ],
    }
  },
  computed: {
    breadcrumbs() {
      if (!this.park) {
        return []
      }

      return [
        {
          title: 'Parks',
          url: '/parks/',
        },
        {
          title: this.park.name,
          url: '/parks/' + this.parkId,
        },
        {
          title: 'Rides',
          url: '#',
        },
      ]
    },
  },
  methods: {
    getParkRides() {
      return this.$axios.get('/park/' + this.parkId + '/rides').then((rides) => {
        this.rides = rides.data
      })
    },
    getPark() {
      return this.$axios.get('/park/' + this.parkId).then((park) => {
        this.park = park.data
      })
    },
  },
}
</script>
