<template>
  <div>
    <breadcrumbs v-if="breadcrumbs" :breadcrumbs="breadcrumbs"></breadcrumbs>

    <div class="grid md:grid-cols-2 gap-4">
      <card class="md:col-span-2" :title="$t('general.statistics')" :sub-title="$t('statistics.subTitle')"></card>

      <loading-spinner v-if="!rides" class="md:col-span-2"></loading-spinner>

      <div v-if="rides">
        <RidesWaitTimeHistoryChart :rides="rides"></RidesWaitTimeHistoryChart>
      </div>

      <card v-if="rides" :title="$t('statistics.longestWaitTimesToday')">
        <template #content>
          <div v-if="topWaitTimes" class="-mx-4 mt-2 flex flex-col bg-white divide-y divide-gray-200">
            <NuxtLink
              v-for="ride of topWaitTimes.slice(0, 10)"
              :key="ride.id"
              :to="localePath('/parks/' + parkId + '/rides/' + ride.ride.id)"
              class="py-2 px-4 flex hover:bg-gray-100 transition duration-100 flex-row justify-between items-center"
            >
              <div class="flex flex-row items-center">
                <div class="rounded-full bg-gray-500 w-6 h-6 lg:w-8 lg:h-8 mr-2 overflow-hidden">
                  <img
                    v-if="ride.ride.image_url"
                    v-lazy-load
                    alt="Image of this ride"
                    :data-src="ride.ride.image_url"
                    class="object-cover object-center w-full h-full"
                  />
                  <div v-else class="object-cover object-center w-full h-full" />
                </div>

                <div class="flex flex-col">
                  <div class="text-indigo-700">{{ ride.ride.title }}</div>
                </div>
              </div>

              <div class="text-gray-700">{{ ride.maxWaitTime }} min</div>
            </NuxtLink>
          </div>
        </template>
      </card>

      <card v-if="rides" :title="$t('statistics.shortestWaitTimesToday')">
        <template #content>
          <div v-if="topWaitTimes" class="-mx-4 mt-2 flex flex-col bg-white divide-y divide-gray-200">
            <NuxtLink
              v-for="ride of topWaitTimes.reverse().slice(0, 10)"
              :key="ride.id"
              :to="localePath('/parks/' + parkId + '/rides/' + ride.ride.id)"
              class="py-2 px-4 flex hover:bg-gray-100 transition duration-100 flex-row justify-between items-center"
            >
              <div class="flex flex-row items-center">
                <div class="rounded-full bg-gray-500 w-6 h-6 lg:w-8 lg:h-8 mr-2 overflow-hidden">
                  <img
                    v-if="ride.ride.image_url"
                    v-lazy-load
                    alt="Image of this ride"
                    :data-src="ride.ride.image_url"
                    class="object-cover object-center w-full h-full"
                  />
                  <div v-else class="object-cover object-center w-full h-full" />
                </div>

                <div class="flex flex-col">
                  <div class="text-indigo-700">{{ ride.ride.title }}</div>
                </div>
              </div>

              <div class="text-gray-700">{{ ride.maxWaitTime }} min</div>
            </NuxtLink>
          </div>
        </template>
      </card>

      <AdCard />
    </div>
  </div>
</template>

<script>
import Card from '@/components/cards/Card'
import RidesWaitTimeHistoryChart from '@/components/charts/RidesWaitTimeHistoryChart'
import Breadcrumbs from '@/components/Breadcrumbs'
import LoadingSpinner from '@/components/LoadingSpinner'
import AdCard from '@/components/cards/AdCard'

export default {
  name: 'Stats',
  components: { AdCard, LoadingSpinner, Breadcrumbs, RidesWaitTimeHistoryChart, Card },
  data() {
    return {
      parkId: this.$route.params.id,
      rideId: this.$route.params.ride_id,
      park: null,
      rides: null,
    }
  },
  async fetch() {
    await Promise.all([this.fetchPark(), this.fetchRides()])
  },
  head() {
    return {
      title: this.park ? this.$t('statistics.seoTitle', [this.park.name]) : this.$t('statistics.seoTitleLoading'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.ride
            ? 'See current and past waiting times and opening times from ' + this.ride.title + ' and other rides all over the world'
            : 'See current and past waiting times and opening times from theme parks all over the world.',
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.ride ? this.ride.image_url : null,
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
          title: this.$t('general.statistics'),
          url: '#',
        },
      ]
    },
    topWaitTimes() {
      const rides = []

      this.rides.forEach((ride) => {
        const times = []
        ride.waitingTimes.forEach((time) => {
          if (!times.includes(time.wait)) {
            times.push(time.wait)
          }
        })

        rides.push({
          ride: {
            title: ride.title,
            id: ride.id,
            image_url: ride.image_url,
          },
          maxWaitTime: Math.max(...times),
        })
      })

      return rides.sort((a, b) => {
        if (a.maxWaitTime > b.maxWaitTime) {
          return -1
        }
        if (a.maxWaitTime < b.maxWaitTime) {
          return 1
        }
        return 0
      })
    },
  },
  methods: {
    async fetchRides() {
      this.rides = await this.$axios.get('/parks/' + this.parkId + '/history/today').then((rides) => {
        return rides.data
      })
    },
    async fetchPark() {
      this.park = await this.$axios.get('/parks/' + this.parkId).then((park) => {
        return park.data
      })
    },
  },
}
</script>

<style scoped></style>
