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
