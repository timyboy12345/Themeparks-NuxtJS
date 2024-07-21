<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading v-if="!halloweenEvents && !error"></loading>

    <general-error v-if="error"></general-error>

    <h1 v-if="park && halloweenEvents && halloweenEvents.length > 0" class="text-lg text-indigo-800 font-bold mb-2">
      {{ $t('park.allHalloweenEventsOf', [park.name]) }}
    </h1>

    <halloween-event-card-list
      v-if="halloweenEvents && halloweenEvents.length > 0"
      :park="park"
      :halloween-events="halloweenEvents"
    ></halloween-event-card-list>

    <div v-if="park && halloweenEvents && halloweenEvents.length > 0" class="my-8 grid md:grid-cols-2 gap-4">
      <card
        :title="$t('halloween.descriptionTitle', [park.name])"
        :content="$t('halloween.descriptionContent', [park.name, halloweenEvents.length])"
      ></card>
    </div>
  </div>
</template>

<script>
import Loading from '../../../../components/LoadingSpinner'
import Breadcrumbs from '@/components/Breadcrumbs'
import GeneralError from '@/components/GeneralError'
import Card from '@/components/cards/Card'
import HalloweenEventCardList from '@/views/HalloweenEventCardList.vue'

export default {
  components: { HalloweenEventCardList, Card, GeneralError, Breadcrumbs, Loading },
  data() {
    return {
      parkId: this.$route.params.id,
      halloweenEvents: null,
      park: null,
      error: null,
    }
  },
  async fetch() {
    await Promise.all([this.getParkHalloweenEvents(), this.getPark()]).then()
  },
  head() {
    return {
      title: this.park ? this.$t('park.allRidesOf', [this.park.name]) : this.$t('park.allRides'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.park ? this.$t('park.allRidesDescription') : this.$t('park.allRidesOfDescription'),
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
          title: this.$t('general.halloweenEvents'),
          url: '#',
        },
      ]
    },
  },
  methods: {
    getParkHalloweenEvents() {
      return this.$axios
        .get('/parks/' + this.parkId + '/halloween')
        .then((halloweenEvents) => {
          this.halloweenEvents = halloweenEvents.data
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
