<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading v-if="!rides && !error"></loading>

    <general-error v-if="error"></general-error>

    <ride-list v-if="rides && rides.length > 0" :park="park" :rides="rides"></ride-list>
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
        })
    },
  },
}
</script>
