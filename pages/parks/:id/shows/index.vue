<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading v-if="!shows || shows.length === 0"></loading>

    <show-card-list v-if="shows && shows.length > 0" :park="park" :shows="shows"></show-card-list>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs'
import ShowCardList from '@/views/ShowCardList'
import Loading from '../../../../components/LoadingSpinner'

export default {
  components: { ShowCardList, Breadcrumbs, Loading },
  data() {
    return {
      parkId: this.$route.params.id,
      shows: null,
      park: null,
    }
  },
  async fetch() {
    await Promise.all([this.getParkRides(), this.getPark()]).then()
  },
  head() {
    return {
      title: this.park ? 'All shows at ' + this.park.name : 'All shows',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.park
            ? 'See current and past show and opening times from ' + this.park.name + ' and other parks and shows all over the world'
            : 'See current and past show and opening times from theme parks all over the world.',
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
          title: 'Parks',
          url: '/parks/',
        },
        {
          title: this.park.name,
          url: '/parks/' + this.parkId,
        },
        {
          title: 'Shows',
          url: '#',
        },
      ]
    },
  },
  methods: {
    getParkRides() {
      return this.$axios.get('/park/' + this.parkId + '/shows').then((rides) => {
        this.shows = rides.data
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
