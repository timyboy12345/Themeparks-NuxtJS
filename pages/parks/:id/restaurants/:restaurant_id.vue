<template>
  <loading v-if="$fetchState.pending" class="my-4"></loading>
  <general-error v-else-if="$fetchState.error" :sub-title="$fetchState.error.message" title="Restaurant not found" />
  <PoiInformation v-else type="restaurant" :park="park" :poi="restaurant"></PoiInformation>
</template>

<script>
import Loading from '~/components/LoadingSpinner'
import PoiInformation from '~/views/PoiInformation.vue'
import GeneralError from '~/components/GeneralError.vue'

export default {
  components: { GeneralError, PoiInformation, Loading },
  async validate({ params, $axios, $sentry }) {
    return await $axios
      .get('/parks/' + params.id + '/restaurants')
      .then((restaurants) => {
        return restaurants.data.some((r) => r.id === params.restaurant_id)
      })
      .catch((e) => {
        $sentry.captureException(e)
        return false
      })
  },
  data() {
    return {
      parkId: this.$route.params.id,
      restaurantId: this.$route.params.restaurant_id,
      park: null,
      restaurant: null,
    }
  },
  async fetch() {
    await Promise.all([this.getRestaurant(), this.getPark()]).then()
  },
  head() {
    const description =
      this.restaurant && this.park
        ? 'See current and past opening times from ' +
          this.restaurant.title +
          ', ' +
          this.park.name +
          ' and other restaurants and theme parks all over the world'
        : 'See current and past waiting times and opening times from theme parks all over the world.'

    return {
      title: this.restaurant && this.park ? `${this.restaurant.title} @ ${this.park.name}` : 'Attraction',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.restaurant ? this.restaurant.image_url : null,
        },
      ],
    }
  },
  methods: {
    getRestaurant() {
      return this.$axios.get('/parks/' + this.parkId + '/restaurants').then((restaurants) => {
        this.restaurant = restaurants.data.find((r) => r.id === this.restaurantId)
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
