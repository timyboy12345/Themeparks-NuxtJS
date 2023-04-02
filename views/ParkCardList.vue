<template>
  <div>
    <loading-spinner v-if="!parks || parks.length === 0"></loading-spinner>

    <div v-if="parks" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <flag-card
        v-for="park of queriedParks"
        :key="park.id"
        :link="'/parks/' + park.id"
        :title="park.name"
        :country-code="park.countryCode"
      >
        <template #content>
          <div class="flex content-between flex-col">
            <p class="mt-4">{{ park.description }}</p>
            <div v-if="park.supports" class="grid grid-cols-2 gap-2 mt-4 text-center">
              <badge-component v-if="park.supports.supportsRides" :text="$t('general.rides')" />
              <badge-component v-if="park.supports.supportsRestaurants" :text="$t('general.restaurants')" />
              <badge-component v-if="park.supports.supportsShows" :text="$t('general.shows')" />
              <badge-component v-if="park.supports.supportsShops" :text="$t('general.shops')" />
              <badge-component v-if="park.supports.supportsAnimals" :text="$t('general.animals')" />
            </div>
          </div>
        </template>
      </flag-card>
    </div>
  </div>
</template>

<script>
import BadgeComponent from '@/components/components/BadgeComponent'
import LoadingSpinner from '@/components/LoadingSpinner'
import FlagCard from '~/components/cards/FlagCard.vue'

export default {
  name: 'ParkCardList',
  components: { LoadingSpinner, BadgeComponent, FlagCard },
  props: {
    query: {
      type: String,
      required: false,
      default: '',
    },
    queriedCountry: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      parks: [],
    }
  },
  async fetch() {
    this.parks = await this.$axios
      .get('/parks')
      .then((parks) => {
        return parks.data
      })
      .catch((reason) => {
        this.$emit('fetchError', reason)
        this.$sentry.captureException(reason)
      })
  },
  computed: {
    queriedParks() {
      return this.parks
        .filter((p) => p.name.toLowerCase().includes(this.query.toLowerCase()))
        .filter((p) => {
          if (!this.queriedCountry) {
            return true
          }

          return this.queriedCountry === p.countryCode
        })
    },
  },
}
</script>
