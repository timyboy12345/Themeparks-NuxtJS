<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading-spinner v-if="!park" class="mt-8"></loading-spinner>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <park-card v-if="park" :park="park" :uses-link="false"></park-card>

      <card v-if="park && park.supports.supportsRides" title="Rides" content="See all rides of this park.">
        <template #content>
          <ride-list class="-mx-4" :max-rides="5" :park-id="parkId"></ride-list>
        </template>

        <template #buttons>
          <card-actions>
            <card-button :btn-link="ridesButtonLink" btn-title="All rides" />
            <card-button v-if="park && park.supports.supportsPoiLocations" :btn-link="mapButtonLink" btn-title="Show Map" />
          </card-actions>
        </template>
      </card>

      <card v-if="park && park.supports.supportsRestaurants" title="Restaurants" content="See all restaurants of this park.">
        <template #content>
          <restaurant-list class="-mx-4" :max-restaurants="5" :park-id="parkId"></restaurant-list>
        </template>

        <template #buttons>
          <card-actions>
            <card-button :btn-link="restaurantsButtonLink" btn-title="All restaurants" />
            <card-button v-if="park && park.supports.supportsPoiLocations" :btn-link="mapButtonLink" btn-title="Show Map" />
          </card-actions>
        </template>
      </card>
    </div>
  </div>
</template>

<script>
import CardActions from '@/components/cards/actions/CardActions'
import RestaurantList from '@/views/RestaurantList'
import Breadcrumbs from '@/components/Breadcrumbs'
import RideList from '@/views/RideList'
import LoadingSpinner from '@/components/LoadingSpinner'
import ParkCard from '../../../components/cards/ParkCard'
import Card from '../../../components/cards/Card'
import CardButton from '../../../components/cards/actions/CardButton'

export default {
  components: { LoadingSpinner, RideList, Breadcrumbs, RestaurantList, CardActions, CardButton, Card, ParkCard },
  data() {
    return {
      parkId: this.$route.params.id,
      park: null,
    }
  },
  async fetch() {
    this.park = await this.$axios
      .get('/park/' + this.parkId)
      .then((park) => {
        return park.data
      })
      .catch((e) => {
        if (e) {
          this.$router.push('/parks')
        }
      })
  },
  head() {
    return {
      title: this.park ? this.park.name : '',
    }
  },
  computed: {
    ridesButtonLink() {
      return `/parks/${this.parkId}/rides`
    },
    mapButtonLink() {
      return `/parks/${this.parkId}/map`
    },
    restaurantsButtonLink() {
      return `/parks/${this.parkId}/restaurants`
    },
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
          url: '#',
        },
      ]
    },
  },
}
</script>