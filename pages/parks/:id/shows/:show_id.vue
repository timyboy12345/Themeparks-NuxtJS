<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading v-if="!show && !error"></loading>

    <restaurant-card v-if="show" :park="park" :restaurant="show"></restaurant-card>

    <general-error v-if="error"></general-error>

    <div v-if="show" class="grid grid-cols-2 md:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      <img v-for="(img, i) of show.images" :key="i" alt="Image of this restaurant" :src="img" class="bg-white rounded shadow" />
    </div>
  </div>
</template>

<script>
import RestaurantCard from '@/components/cards/RestaurantCard'
import Breadcrumbs from '@/components/Breadcrumbs'
import GeneralError from '@/components/GeneralError'
import Loading from '../../../../components/LoadingSpinner'

export default {
  components: { GeneralError, Breadcrumbs, RestaurantCard, Loading },
  data() {
    return {
      parkId: this.$route.params.id,
      showId: this.$route.params.show_id,
      park: null,
      show: null,
      error: null,
    }
  },
  async fetch() {
    await Promise.all([this.getShow(), this.getPark()]).then()
  },
  head() {
    return {
      title: this.show ? this.show.title : 'Show',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.show
            ? 'See show and opening times from ' + this.show.title + ' and other shows and theme parks all over the world'
            : 'See show and opening times from theme parks all over the world.',
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.show ? this.show.image_url : null,
        },
      ],
    }
  },
  computed: {
    breadcrumbs() {
      if (!this.park || !this.show) {
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
          title: 'Shows',
          url: '/parks/' + this.parkId + '/shows/',
        },
        {
          title: this.show ? this.show.title : 'Show',
          url: '#',
        },
      ]
    },
  },
  methods: {
    getShow() {
      return this.$axios
        .get('/park/' + this.parkId + '/shows')
        .then((restaurants) => {
          this.show = restaurants.data.find((r) => r.id === this.showId)
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
