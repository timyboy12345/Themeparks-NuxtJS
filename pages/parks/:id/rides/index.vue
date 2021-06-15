<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading v-if="!rides && !error"></loading>

    <general-error v-if="error"></general-error>

    <ride-list v-if="rides && rides.length > 0" :park="park" :rides="rides"></ride-list>

    <div v-if="park && park.supports.supportsRideWaitTimesHistory" class="py-2 px-4 bg-yellow-200 relative mt-4 text-yellow-900 shadow-sm">
      <div class="absolute rounded-l bg-yellow-600 left-0 top-0 h-full w-1"></div>
      <div class="flex flex-col">
        <h4 class="text-yellow-900 capitalize font-bold">{{ $t('statistics.goToTitle') }}</h4>
        <p class="text-sm text-yellow-800">{{ $t('statistics.goToDescription') }}</p>
        <router-link class="underline text-sm mt-2 text-yellow-600" :to="localePath('/parks/' + parkId + '/stats/')">
          {{ $t('statistics.goToLink') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs'
import GeneralError from '@/components/GeneralError'
import Loading from '../../../../components/LoadingSpinner'
import RideList from '../../../../views/RideCardList'
export default {
  components: { GeneralError, Breadcrumbs, RideList, Loading },
  data() {
    return {
      parkId: this.$route.params.id,
      rides: null,
      park: null,
      error: null,
    }
  },
  async fetch() {
    await Promise.all([this.getParkRides(), this.getPark()]).then()
  },
  head() {
    return {
      title: this.park ? 'All rides at ' + this.park.name : 'All rides',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.park
            ? 'See current and past wait times from ' + this.park.name + ' and other parks and shows all over the world'
            : 'See current and past wait times from rides and theme parks all over the world.',
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.park ? this.park.image : null,
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
          title: this.$t('general.parks'),
          url: '/parks/',
        },
        {
          title: this.park.name,
          url: '/parks/' + this.parkId,
        },
        {
          title: this.$t('general.rides'),
          url: '#',
        },
      ]
    },
  },
  methods: {
    getParkRides() {
      return this.$axios
        .get('/park/' + this.parkId + '/rides')
        .then((rides) => {
          this.rides = rides.data
        })
        .catch((reason) => {
          this.error = reason
          this.$sentry.captureException(reason)
        })
    },
    getPark() {
      return this.$axios
        .get('/park/' + this.parkId)
        .then((park) => {
          this.park = park.data
        })
        .catch((reason) => {
          this.error = reason
          this.$sentry.captureException(reason)
        })
    },
  },
}
</script>
