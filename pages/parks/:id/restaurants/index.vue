<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading v-if="!restaurants || restaurants.length === 0"></loading>

    <h1 v-if="park && restaurants && restaurants.length > 0" class="text-lg text-indigo-800 dark:text-indigo-300 font-bold mb-2">
      {{ $t('park.allRestaurantsOf', [park.name]) }}
    </h1>

    <poi-card-list v-if="restaurants && restaurants.length > 0" :park="park" type="restaurant" :pois="restaurants"></poi-card-list>

    <div v-if="park && restaurants && restaurants.length > 0" class="my-8 grid md:grid-cols-2 gap-4">
      <card
        :title="$t('restaurants.descriptionTitle', [park.name])"
        :content="$t('restaurants.descriptionContent', [park.name, restaurants.length])"
      ></card>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs'
import Card from '@/components/cards/Card'
import Loading from '@/components/LoadingSpinner'
import PoiCardList from '@/views/PoiCardList'

export default {
  components: { PoiCardList, Card, Breadcrumbs, Loading },
  async validate({ params, $axios, $sentry }) {
    return await $axios
      .get('/parks/' + params.id)
      .then(() => {
        return true
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
      restaurants: null,
      park: null,
    }
  },
  async fetch() {
    await Promise.all([this.getParkRides(), this.getPark()]).then()
  },
  head() {
    return {
      title: this.park ? this.$t('park.allRestaurantsOf', [this.park.name]) : this.$t('park.allRestaurants'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.park ? this.$t('park.allRestaurantsDescription') : this.$t('park.allRestaurantsOfDescription'),
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
          title: this.$t('general.restaurants'),
          url: '#',
        },
      ]
    },
  },
  methods: {
    getParkRides() {
      return this.$axios.get('/parks/' + this.parkId + '/restaurants').then((rides) => {
        this.restaurants = rides.data
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
