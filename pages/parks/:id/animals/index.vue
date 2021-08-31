<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading v-if="!animals || animals.length === 0"></loading>

    <animal-card-list v-if="animals && animals.length > 0" :park="park" :animals="animals"></animal-card-list>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs'
import AnimalCardList from '@/views/AnimalCardList'
import Loading from '../../../../components/LoadingSpinner'

export default {
  components: { Breadcrumbs, AnimalCardList, Loading },
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
