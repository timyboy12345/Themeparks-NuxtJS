<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading v-if="!animals || animals.length === 0"></loading>

    <poi-card-list v-if="animals && animals.length > 0" type="animal" :park="park" :pois="animals"></poi-card-list>
  </div>
</template>

<script>
import Loading from '../../../../components/LoadingSpinner'
import Breadcrumbs from '@/components/Breadcrumbs'
import PoiCardList from '~/views/PoiCardList.vue'

export default {
  components: { PoiCardList, Breadcrumbs, Loading },
  async validate({ params, $axios, $sentry }) {
    return await $axios
      .get('/parks/' + params.id)
      .then((data) => {
        return data.data.supports.supportsAnimals
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
      animals: null,
      park: null,
    }
  },
  async fetch() {
    await Promise.all([this.getParkRides(), this.getPark()]).then()
  },
  head() {
    return {
      title: this.park ? 'All animals at ' + this.park.name : 'All animals',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.park
            ? 'See current and past animal opening times from ' + this.park.name + ' and other parks and shows all over the world'
            : 'See current and past opening times from animals and theme parks all over the world.',
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
          title: this.$t('general.animals'),
          url: '#',
        },
      ]
    },
  },
  methods: {
    getParkRides() {
      return this.$axios.get('/parks/' + this.parkId + '/animals').then((rides) => {
        this.animals = rides.data
      })
    },
    getPark() {
      return this.$axios.get('/parks/' + this.parkId).then((park) => {
        this.park = park.data
      })
    },
  },
}
</script>
