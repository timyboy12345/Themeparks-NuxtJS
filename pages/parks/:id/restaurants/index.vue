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
  head() {
    return {
      title: this.park ? 'All restaurants at ' + this.park.name : 'All restaurants',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.park
            ? 'See current and past restaurant opening times from ' + this.park.name + ' and other parks and shows all over the world'
            : 'See current and past opening times from restaurants and theme parks all over the world.',
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
