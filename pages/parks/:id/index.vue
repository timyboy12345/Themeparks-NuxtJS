<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading-spinner v-if="!park" class="mt-8"></loading-spinner>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <park-card v-if="park" :park="park" :uses-link="false"></park-card>

      <card v-if="park && park.supports.supportsRides" :title="$t('general.rides')" :sub-title="$t('park.allRidesSubtitle')">
        <template #content>
          <ride-list class="-mx-4" :max-rides="5" :park-id="parkId"></ride-list>
        </template>

        <template #buttons>
          <card-actions>
            <card-button :btn-link="ridesButtonLink" :btn-title="$t('park.allRides')" />
            <card-button v-if="park && park.supports.supportsPoiLocations" :btn-link="mapButtonLink" :btn-title="$t('park.showMap')" />
          </card-actions>
        </template>
      </card>

      <card
        v-if="park && park.supports.supportsRestaurants"
        :title="$t('general.restaurants')"
        :sub-title="$t('park.allRestaurantsSubtitle')"
      >
        <template #content>
          <restaurant-list class="-mx-4" :max-restaurants="5" :park-id="parkId"></restaurant-list>
        </template>

        <template #buttons>
          <card-actions>
            <card-button :btn-link="restaurantsButtonLink" :btn-title="$t('park.allRestaurants')" />
            <card-button v-if="park && park.supports.supportsPoiLocations" :btn-link="mapButtonLink" :btn-title="$t('park.showMap')" />
          </card-actions>
        </template>
      </card>

      <card v-if="park && park.supports.supportsShows" :title="$t('general.shows')" :sub-title="$t('park.allShowsSubtitle')">
        <template #content>
          <show-list class="-mx-4" :max-shows="5" :park-id="parkId"></show-list>
        </template>

        <template #buttons>
          <card-actions>
            <card-button :btn-link="'/parks/' + parkId + '/shows'" :btn-title="$t('park.allShows')" />
            <card-button v-if="park && park.supports.supportsPoiLocations" :btn-link="mapButtonLink" :btn-title="$t('park.showMap')" />
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
import ShowList from '@/views/ShowList'
import ParkCard from '../../../components/cards/ParkCard'
import Card from '../../../components/cards/Card'
import CardButton from '../../../components/cards/actions/CardButton'

export default {
  components: {
    ShowList,
    LoadingSpinner,
    RideList,
    Breadcrumbs,
    RestaurantList,
    CardActions,
    CardButton,
    Card,
    ParkCard,
  },
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
          this.$router.push(this.localePath('/parks'))
        }
      })
  },
  head() {
    const title = this.park ? this.park.name : undefined
    let description = 'See rides, restaurants, shows, shops and more from'

    if (this.park) {
      if (this.park.description) {
        description = this.park.description
      } else {
        description += this.park.name
      }
    } else {
      description += ' this theme park.'
    }

    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
      ],
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
          title: this.$t('general.parks'),
          url: '/parks',
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
