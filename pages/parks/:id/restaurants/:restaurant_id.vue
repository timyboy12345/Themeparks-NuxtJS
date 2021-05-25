<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading v-if="!restaurant"></loading>

    <restaurant-card v-if="restaurant" :park="park" :restaurant="restaurant"></restaurant-card>

    <div v-if="restaurant" class="grid grid-cols-2 md:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      <img v-for="(img, i) of restaurant.images" :key="i" alt="Image of this restaurant" :src="img" class="bg-white rounded shadow" />
    </div>
  </div>
</template>

<script>
import RestaurantCard from '@/components/cards/RestaurantCard'
import Breadcrumbs from '@/components/Breadcrumbs'
import Loading from '../../../../components/LoadingSpinner'

export default {
  components: { Breadcrumbs, RestaurantCard, Loading },
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
  computed: {
    breadcrumbs() {
      if (!this.park || !this.restaurant) {
        return []
      }

      return [
        {
          title: 'Parks',
          url: '/parks/',
        },
        {
          title: this.park ? this.park.name : 'Park',
          url: '/parks/' + this.parkId,
        },
        {
          title: 'Restaurants',
          url: '/parks/' + this.parkId + '/restaurants',
        },
        {
          title: this.restaurant ? this.restaurant.title : 'Restaurant',
          url: '#',
        },
      ]
    },
  },
  methods: {
    getRestaurant() {
      return this.$axios.get('/park/' + this.parkId + '/restaurants').then((restaurants) => {
        this.restaurant = restaurants.data.find((r) => r.id === this.restaurantId)
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
