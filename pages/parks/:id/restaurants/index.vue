<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading v-if="!restaurants || restaurants.length === 0"></loading>

    <restaurant-card-list v-if="restaurants && restaurants.length > 0" :park="park" :restaurants="restaurants"></restaurant-card-list>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs'
import RestaurantCardList from '@/views/RestaurantCardList'
import Loading from '../../../../components/LoadingSpinner'

export default {
  components: { Breadcrumbs, RestaurantCardList, Loading },
  data() {
    return {
      parkId: this.$route.params.id,
      restaurants: null,
      park: null,
    }
  },
  async fetch() {
    await Promise.all([this.getParkRides(), this.getPark()]).then()
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
          title: 'Restaurants',
          url: '#',
        },
      ]
    },
  },
  methods: {
    getParkRides() {
      return this.$axios.get('/park/' + this.parkId + '/restaurants').then((rides) => {
        this.restaurants = rides.data
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
