<template>
  <div>
    <breadcrumbs v-if="breadcrumbs" :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading v-if="$fetchState.pending" class="my-4"></loading>

    <div v-else-if="poi && park" class="grid md:grid-cols-2 gap-4">
      <event-poi-card :event-slug="eventSlug" h1 :park="park" :poi="poi" />

      <card v-if="poi.description" :title="$t('general.generalInformation')">
        <template #content>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="poi.description"></div>
        </template>
      </card>

      <card v-if="$store.state.auth.user" :title="$t('checkins.addCheckinTitle')">
        <template #content>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {{ $t('checkins.addCheckinDescription') }}
          </p>

          <button
            class="rounded py-2 px-4 text-white bg-indigo-800 hover:bg-indigo-900 dark:bg-indigo-400 dark:hover:bg-indigo-500 transition-colors duration-100"
            type="button"
            @click="addCheckin"
          >
            {{ $t('checkins.addCheckinButton') }}
          </button>
        </template>
      </card>

      <card v-if="$store.state.auth.user" :title="$t('checkins.existingCheckinsTitle')">
        <template #content>
          <checkin-list
            v-if="$store.state.auth.checkins && $store.state.auth.checkins.filter((r) => r.poiId === poiId).length > 0"
            edit
            :ride-id="poi.id"
            class="-mx-4 mt-2 flex flex-col bg-white divide-y divide-gray-200 dark:bg-gray-700"
          />

          <div v-else>
            {{ $t('checkins.notCheckedIn') }}
          </div>
        </template>
      </card>

      <div v-if="poi.images && poi.images.length > 0" class="grid grid-cols-2 lg:grid-cols-3 gap-4 content-start">
        <img
          v-for="(img, i) of poi.images"
          :key="i"
          alt="Image of this ride"
          :src="img"
          class="cursor-pointer bg-white rounded shadow"
          @click="openImage(img)"
        />
      </div>

      <RideStatsCard :park="park" :ride="poi"></RideStatsCard>

      <AdCard />
    </div>

    <general-error v-else title="Ride not found" />
  </div>
</template>

<script>
import Loading from '@/components/LoadingSpinner'
import Card from '@/components/cards/Card'
import Breadcrumbs from '@/components/Breadcrumbs'
import AdCard from '@/components/cards/AdCard'
import CheckinList from '@/views/CheckinList'
import RideStatsCard from '@/components/cards/RideStatsCard'
import GeneralError from '~/components/GeneralError.vue'
import EventPoiCard from '~/components/cards/EventPoiCard.vue'

export default {
  components: {
    EventPoiCard,
    GeneralError,
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
      eventSlug: this.$route.params.event_slug,
      poiId: this.$route.params.poi_id,
      park: null,
      event: null,
      poi: null,
      averageWaitingTimes: null,
    }
  },
  async fetch() {
    await Promise.all([this.fetchPark(), this.fetchEvent()])
  },
  head() {
    return {
      // TODO: Implement SEO description for events
      title: this.poi && this.park ? `${this.poi.title} @ ${this.park.name}` : 'Event',
      meta: [
        //   {
        //     hid: 'description',
        //     name: 'description',
        //     content: this.poi
        //       ? 'See current and past waiting times and opening times from ' + this.poi.title + ' and other rides all over the world'
        //       : 'See current and past waiting times and opening times from theme parks all over the world.',
        //   },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.poi ? this.poi.image_url : null,
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
          url: '/parks/' + this.parkId + '/events/' + this.eventSlug,
        },
        {
          title: this.poi ? this.poi.title : this.$t('general.event'),
          url: '#',
        },
      ]
    },
  },
  methods: {
    openImage(imgSrc) {
      window.open(imgSrc, '_blank')
    },
    async fetchEvent() {
      const e = await this.$axios.get('/parks/' + this.parkId + '/events').then((events) => {
        return {
          event: events.data.find((r) => r.slug === this.eventSlug),
          poi: events.data.find((r) => r.slug === this.eventSlug).pois.find((p) => p.id === this.poiId),
        }
      })

      this.event = e.event
      this.poi = e.poi
    },
    async fetchPark() {
      this.park = await this.$axios.get('/parks/' + this.parkId).then((park) => {
        return park.data
      })
    },
    addCheckin() {
      this.$store.commit('popup/addPopup', {
        type: 'addCheckin',
        ride: this.poi,
        park: this.park,
        parkId: this.parkId,
        rideId: this.rideId,
      })
    },
  },
}
</script>
