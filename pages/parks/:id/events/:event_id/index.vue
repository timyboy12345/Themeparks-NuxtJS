<template>
  <div>
    <breadcrumbs v-if="breadcrumbs" :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading v-if="$fetchState.pending" class="my-4"></loading>

    <div v-else-if="event" class="flex flex-col gap-4">
      <div class="bg-white rounded dark:bg-gray-800 overflow-hidden shadow md:col-span-3 flex flex-col md:flex-row">
        <img alt="Image depicting the event" :src="event.image" class="w-60 h-40 object-cover" />

        <div class="p-4">
          <h1 class="font-bold text-2xl text-indigo-700 dark:text-indigo-400">{{ event.name }}</h1>
          <p class="text-gray-600">{{ event.subTitle }}</p>

          <p v-if="event.description" class="text-gray-800 pt-2">{{ event.description }}</p>

          <div class="text-gray-600 pt-2">
            {{ event.dates | formatDateArray }}
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-4">
        <EventPoiCard v-for="poi in event.pois" :key="poi.id" :park="park" :event-id="eventId" :show-more="true" :poi="poi"></EventPoiCard>
      </div>
    </div>

    <div v-else>Something went wrong loading the event</div>
  </div>
</template>

<script>
import Loading from '../../../../../components/LoadingSpinner.vue'
import Breadcrumbs from '~/components/Breadcrumbs.vue'
import EventPoiCard from '~/components/cards/EventPoiCard.vue'

export default {
  components: {
    EventPoiCard,
    Breadcrumbs,
    Loading,
  },
  data() {
    return {
      parkId: this.$route.params.id,
      eventId: this.$route.params.event_id,
      park: null,
      event: null,
      averageWaitingTimes: null,
    }
  },
  async fetch() {
    await Promise.all([this.fetchPark(), this.fetchEvent()])
  },
  head() {
    return {
      title: this.event && this.park ? `${this.event.name} @ ${this.park.name}` : 'Event',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.event
            ? 'See current and past waiting times and opening times from ' + this.event.name + ' and other rides all over the world'
            : 'See current and past waiting times and opening times from theme parks all over the world.',
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.event ? this.event.image : null,
        },
      ],
    }
  },
  computed: {
    breadcrumbs() {
      return [
        {
          title: this.$t('general.parks'),
          url: '/parks/',
        },
        {
          title: this.park ? this.park.name : this.$t('general.park'),
          url: '/parks/' + this.parkId,
        },
        {
          title: this.$t('general.events'),
          url: '/parks/' + this.parkId + '/events',
        },
        {
          title: this.event ? this.event.name : this.$t('general.event'),
          url: '#',
        },
      ]
    },
  },
  methods: {
    async fetchEvent() {
      this.event = await this.$axios.get('/parks/' + this.parkId + '/events').then((events) => {
        return events.data.find((e) => e.type.toLowerCase() === this.eventId)
      })
    },
    async fetchPark() {
      this.park = await this.$axios.get('/parks/' + this.parkId).then((park) => {
        return park.data
      })
    },
    addCheckin() {
      this.$store.commit('popup/addPopup', {
        type: 'addCheckin',
        ride: this.event,
        park: this.park,
        parkId: this.parkId,
        rideId: this.eventId,
      })
    },
  },
}
</script>
