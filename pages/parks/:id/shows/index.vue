<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading v-if="!shows || shows.length === 0"></loading>

    <h1 v-if="park && shows && shows.length > 0" class="text-lg text-indigo-800 dark:text-indigo-300 font-bold mb-2">
      {{ $t('park.allShowsOf', [park.name]) }}
    </h1>

    <show-card-list v-if="shows && shows.length > 0" :park="park" :shows="shows"></show-card-list>

    <div v-if="park && shows && shows.length > 0" class="my-8 grid md:grid-cols-2 gap-4">
      <card :title="$t('shows.descriptionTitle', [park.name])" :content="$t('shows.descriptionContent', [park.name, shows.length])"></card>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs'
import ShowCardList from '@/views/ShowCardList'
import Card from '@/components/cards/Card'
import Loading from '@/components/LoadingSpinner'

export default {
  components: { Card, ShowCardList, Breadcrumbs, Loading },
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
          title: this.$t('general.parks'),
          url: '/parks/',
        },
        {
          title: this.park.name,
          url: '/parks/' + this.parkId,
        },
        {
          title: this.$t('general.shows'),
          url: '#',
        },
      ]
    },
  },
  methods: {
    getParkRides() {
      return this.$axios.get('/parks/' + this.parkId + '/shows').then((rides) => {
        this.shows = rides.data
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
