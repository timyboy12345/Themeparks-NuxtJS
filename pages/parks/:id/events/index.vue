<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading v-if="$fetchState.pending"></loading>

    <general-error v-if="$fetchState.error"></general-error>

    <h1 v-if="park && events && events.length > 0" class="text-lg text-indigo-800 dark:text-indigo-300 font-bold mb-2">
      {{ $t('park.allEventsOf', [park.name]) }}
    </h1>

    <event-card-list v-if="events && events.length > 0" :park="park" :events="events"></event-card-list>

    <div v-if="park && events && events.length > 0" class="my-8 grid md:grid-cols-2 gap-4">
      <card
        :title="$t('events.descriptionTitle', [park.name])"
        :content="$t('events.descriptionContent', [park.name, events.length])"
      ></card>
    </div>
  </div>
</template>

<script>
import Loading from '../../../../components/LoadingSpinner'
import Breadcrumbs from '@/components/Breadcrumbs'
import GeneralError from '@/components/GeneralError'
import Card from '@/components/cards/Card'
import EventCardList from '@/views/EventCardList.vue'

export default {
  components: { EventCardList, Card, GeneralError, Breadcrumbs, Loading },
  data() {
    return {
      parkId: this.$route.params.id,
      events: null,
      park: null,
      error: null,
    }
  },
  async fetch() {
    await Promise.all([this.getParkEvents(), this.getPark()]).then()
  },
  head() {
    // TODO: Improve Title and Description
    return {
      title: this.park ? this.$t('park.allEventsOf', [this.park.name]) : this.$t('general.events'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('park.allEvents'),
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
          title: this.$t('general.events'),
          url: '#',
        },
      ]
    },
  },
  methods: {
    getParkEvents() {
      return this.$axios
        .get('/parks/' + this.parkId + '/events')
        .then((data) => {
          this.events = data.data
        })
        .catch((reason) => {
          this.error = reason
          this.$sentry.captureException(reason)
        })
    },
    getPark() {
      return this.$axios
        .get('/parks/' + this.parkId)
        .then((park) => {
          this.park = park.data
        })
        .catch((reason) => {
          this.error = reason
          this.$sentry.captureException(reason)
        })
    },
  },
}
</script>
