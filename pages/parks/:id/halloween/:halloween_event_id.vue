<template>
  <div>
    <breadcrumbs v-if="breadcrumbs" :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading v-if="!halloweenEvent || !park" class="my-4"></loading>

    <div class="grid md:grid-cols-2 gap-4">
      <halloween-event-card v-if="halloweenEvent && park" :park="park" :halloween-event="halloweenEvent"></halloween-event-card>

      <card v-if="halloweenEvent" :title="$t('general.generalInformation')">
        <template #content>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="halloweenEvent.description"></div>
        </template>
      </card>

      <card v-if="halloweenEvent && $store.state.auth.user" :title="$t('checkins.addCheckinTitle')">
        <template #content>
          <p class="text-gray-600 text-sm mb-4">
            {{ $t('checkins.addCheckinDescription') }}
          </p>

          <button
            class="rounded py-2 px-4 text-white bg-indigo-800 hover:bg-indigo-900 transition-colors duration-100"
            type="button"
            @click="addCheckin"
          >
            {{ $t('checkins.addCheckinButton') }}
          </button>
        </template>
      </card>

      <card v-if="halloweenEvent && $store.state.auth.user" :title="$t('checkins.existingCheckinsTitle')">
        <template #content>
          <checkin-list
            v-if="$store.state.auth.checkins && $store.state.auth.checkins.filter((r) => r.rideId === halloweenEvent).length > 0"
            edit
            :ride-id="halloweenEvent.id"
            class="-mx-4 mt-2 flex flex-col bg-white divide-y divide-gray-200"
          />

          <div v-else>
            {{ $t('checkins.notCheckedIn') }}
          </div>
        </template>
      </card>

      <div
        v-if="halloweenEvent && park && halloweenEvent.images && halloweenEvent.images.length > 0"
        class="grid grid-cols-2 lg:grid-cols-3 gap-4 content-start"
      >
        <img
          v-for="(img, i) of halloweenEvent.images"
          :key="i"
          alt="Image of this ride"
          :src="img"
          class="cursor-pointer bg-white rounded shadow"
          @click="openImage(img)"
        />
      </div>

      <RideStatsCard v-if="halloweenEvent" :park="park" :ride="halloweenEvent"></RideStatsCard>

      <AdCard v-if="halloweenEvent" />
    </div>
  </div>
</template>

<script>
import Loading from '../../../../components/LoadingSpinner'
import Card from '@/components/cards/Card'
import Breadcrumbs from '@/components/Breadcrumbs'
import AdCard from '@/components/cards/AdCard'
import CheckinList from '@/views/CheckinList'
import RideStatsCard from '@/components/cards/RideStatsCard'
import HalloweenEventCard from '@/components/cards/HalloweenEventCard.vue'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {
    HalloweenEventCard,
    RideStatsCard,
    CheckinList,
    AdCard,
    Breadcrumbs,
    Card,
    Loading,
  },
  data() {
    return {
      parkId: this.$route.params.id,
      halloweenEventId: this.$route.params.halloween_event_id,
      park: null,
      halloweenEvent: null,
      averageWaitingTimes: null,
    }
  },
  async fetch() {
    await Promise.all([this.fetchPark(), this.fetchHalloweenEvent()])
  },
  head() {
    return {
      title: this.halloweenEvent && this.park ? `${this.halloweenEvent.title} @ ${this.park.name}` : 'Attraction',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.halloweenEvent
            ? 'See current and past waiting times and opening times from ' +
              this.halloweenEvent.title +
              ' and other rides all over the world'
            : 'See current and past waiting times and opening times from theme parks all over the world.',
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.halloweenEvent ? this.halloweenEvent.image_url : null,
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
          title: this.$t('general.halloweenEvents'),
          url: '/parks/' + this.parkId + '/halloween',
        },
        {
          title: this.halloweenEvent ? this.halloweenEvent.title : this.$t('general.halloweenEvent'),
          url: '#',
        },
      ]
    },
  },
  methods: {
    openImage(imgSrc) {
      window.open(imgSrc, '_blank')
    },
    async fetchHalloweenEvent() {
      this.halloweenEvent = await this.$axios.get('/parks/' + this.parkId + '/halloween').then((halloweenEvents) => {
        return halloweenEvents.data.find((r) => r.id === this.halloweenEventId)
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
        ride: this.halloweenEvent,
        park: this.park,
        parkId: this.parkId,
        rideId: this.halloweenEventId,
      })
    },
  },
}
</script>
