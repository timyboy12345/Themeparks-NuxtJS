<template>
  <div>
    <breadcrumbs v-if="breadcrumbs" :breadcrumbs="breadcrumbs"></breadcrumbs>

    <div class="grid md:grid-cols-2 gap-4">
      <card class="md:col-span-2" :title="$t('general.statistics')" :subtitle="$t('statistics.subTitle')"></card>

      <LoadingPulseCard v-if="$fetchState.pending" />
      <GeneralError v-else-if="$fetchState.error" title="Er ging iets fout" :sub-title="$fetchState.error" />

      <Card v-else :title="$t('statistics.waitTimesToday')">
        <template #content>
          <div class="-mx-4 max-h-96 overflow-y-auto flex flex-col divide-y divide-gray-100 dark:divide-gray-600">
            <NuxtLink
              v-for="ride of sortedRides"
              :key="ride.id"
              :to="localePath('/parks/' + park.id + '/rides/' + ride.id)"
              target="_blank"
              class="cursor-pointer py-1 flex hover:bg-gray-100 dark:hover:bg-gray-600 flex-row justify-between px-4"
            >
              <div class="text-indigo-700 dark:text-indigo-300">{{ ride.title }}</div>
              <div>{{ rideTag(ride) }}</div>
            </NuxtLink>
          </div>
        </template>
      </Card>

      <RidesWaitTimeHistoryChart v-if="loadedHistory" :date="formattedDate" :rides="rides" :history="history"></RidesWaitTimeHistoryChart>

      <LoadingPulseCard v-if="!loadedHistory" />
      <LoadingPulseCard v-if="!loadedHistory" />
      <LoadingPulseCard v-if="!loadedHistory" />

      <card v-if="loadedHistory" :title="$t('statistics.longestWaitTimesOnDate', [formattedDate])">
        <template #content>
          <div v-if="topWaitTimes" class="-mx-4 mt-2 flex flex-col bg-white divide-y dark:bg-gray-700 dark:divide-gray-600 divide-gray-200">
            <NuxtLink
              v-for="ride of topWaitTimes.slice(0, 10)"
              :key="ride.id"
              target="_blank"
              :to="localePath('/parks/' + parkId + '/rides/' + ride.ride.id)"
              class="py-2 px-4 flex hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-100 flex-row justify-between items-center"
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
                  <div class="text-indigo-700 dark:text-indigo-300">{{ ride.ride.title }}</div>
                </div>
              </div>

              <div class="text-gray-700 dark:text-gray-300">{{ ride.maxWaitTime }} min</div>
            </NuxtLink>
          </div>
        </template>
      </card>

      <card v-if="loadedHistory" :title="$t('statistics.shortestWaitTimesOnDate', [formattedDate])">
        <template #content>
          <div v-if="topWaitTimes" class="-mx-4 mt-2 flex flex-col bg-white dark:bg-gray-700 dark:divide-gray-600 divide-y divide-gray-200">
            <NuxtLink
              v-for="ride of [...topWaitTimes].reverse().slice(0, 10)"
              :key="ride.id"
              target="_blank"
              :to="localePath('/parks/' + parkId + '/rides/' + ride.ride.id)"
              class="py-2 px-4 flex hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-100 flex-row justify-between items-center"
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
                  <div class="text-indigo-700 dark:text-indigo-300">{{ ride.ride.title }}</div>
                </div>
              </div>

              <div class="text-gray-700 dark:text-gray-300">{{ ride.maxWaitTime }} min</div>
            </NuxtLink>
          </div>
        </template>
      </card>

      <LoadingPulseCard v-if="!weeklyHistory" />
      <RidesAverageWaitTimeHistoryChartCard v-else :rides="rides" :data="weeklyHistory" />

      <AdCard />
    </div>

    <div class="flex flex-row justify-end items-center mt-4 gap-x-4">
      <div class="dark:text-gray-300">Datum Aanpassen</div>
      <input
        v-model="dateSelector"
        class="form-input border border-gray-300 rounded focus:outline-none focus:shadow-outline focus:border-indigo-300"
        type="date"
      />
    </div>
  </div>
</template>

<script>
import Card from '@/components/cards/Card'
import Breadcrumbs from '@/components/Breadcrumbs'
import AdCard from '@/components/cards/AdCard'
import GeneralError from '~/components/GeneralError.vue'
import RidesWaitTimeHistoryChart from '~/components/charts/RidesWaitTimeHistoryChart.vue'
import LoadingPulseCard from '~/components/cards/LoadingPulseCard.vue'
import RidesAverageWaitTimeHistoryChartCard from '~/components/cards/RidesAverageWaitTimeHistoryChartCard.vue'

export default {
  name: 'Stats',
  components: {
    RidesAverageWaitTimeHistoryChartCard,
    LoadingPulseCard,
    RidesWaitTimeHistoryChart,
    GeneralError,
    AdCard,
    Breadcrumbs,
    Card,
  },
  async validate({ params, $axios, $sentry }) {
    return await $axios
      .get('/parks/' + params.id)
      .then((data) => {
        return data.data.supports.supportsRideWaitTimesHistory
      })
      .catch((e) => {
        if (e.response.status === 500) {
          $sentry.captureException(e)
          throw new Error('Under Construction!')
        }

        $sentry.captureException(e)
        return false
      })
  },
  data() {
    return {
      parkId: this.$route.params.id,
      rideId: this.$route.params.ride_id,
      park: null,
      rides: null,
      history: null,
      weeklyHistory: null,
      selectedDate: null,
    }
  },
  async fetch() {
    // await Promise.all([this.fetchPark(), this.fetchRides()])
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
    dateSelector: {
      get() {
        return this.selectedDate ? this.isoFormattedDate : null
      },
      set(v) {
        this.selectedDate = new Date(v)
        this.fetchDailyHistoryData()
      },
    },
    loadedHistory() {
      return this.history && this.rides
    },
    formattedDate() {
      return this.selectedDate.toLocaleDateString({ year: 'numeric', month: 'long', day: 'numeric' })
    },
    isoFormattedDate() {
      const year = this.selectedDate.getFullYear()
      const month = String(this.selectedDate.getMonth() + 1).padStart(2, '0')
      const day = String(this.selectedDate.getDate()).padStart(2, '0')

      return `${year}-${month}-${day}`
    },
    sortedRides() {
      return this.rides
        ? [...this.rides].sort((a, b) => {
            if (!a.currentWaitTime) return 1
            if (!b.currentWaitTime) {
              return -1
            }

            if (a.currentWaitTime < b.currentWaitTime) {
              return 1
            } else if (a.currentWaitTime > b.currentWaitTime) {
              return -1
            }

            return 0
          })
        : []
    },
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

      if (!this.history) {
        return []
      }

      for (const [rideId, waitingTimes] of Object.entries(this.history)) {
        const ride = this.rides.find((r) => r.id === rideId)

        const times = []

        waitingTimes.forEach((time) => {
          if (!times.includes(time.wait)) {
            times.push(time.wait)
          }
        })

        rides.push({
          ride: {
            title: ride ? ride.title : rideId,
            id: rideId,
            image_url: ride ? ride.image_url : null,
          },
          maxWaitTime: Math.max(...times),
        })
      }

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
  mounted() {
    this.selectedDate = new Date()
    this.selectedDate.setDate(this.selectedDate.getDate() - 1)

    const [month, day, year] = [this.selectedDate.getMonth(), this.selectedDate.getDate(), this.selectedDate.getFullYear()]
    this.fetchDailyHistoryData(`${year}-${('0' + (month + 1)).slice(-2)}-${day}`)

    const startOfWeek = this.startOfWeek(this.subtractOneWeek(new Date()))
    const [weekMonth, weekDay, weekYear] = [startOfWeek.getMonth(), startOfWeek.getDate(), startOfWeek.getFullYear()]
    this.fetchWeeklyHistoryData(`${weekYear}-${('0' + (weekMonth + 1)).slice(-2)}-${weekDay}`)
    // this.fetchWeeklyHistoryData('2025-02-13')
  },
  methods: {
    async fetchDailyHistoryData(date) {
      if (!date) {
        const [month, day, year] = [this.selectedDate.getMonth(), this.selectedDate.getDate(), this.selectedDate.getFullYear()]

        date = `${year}-${('0' + (month + 1)).slice(-2)}-${day}`
      }

      this.history = null

      this.history = await this.$axios
        .get('https://themeparks-data.arendz.nl/history/daily/' + this.parkId + '/' + date + '.json')
        .then((d) => {
          return d.data
        })
        .catch((error) => {
          this.$sentry.captureException(error)
          alert(error)
        })
    },
    async fetchWeeklyHistoryData(date) {
      this.weeklyHistory = null

      this.weeklyHistory = await this.$axios
        .get('https://themeparks-data.arendz.nl/history/weekly/' + this.parkId + '/' + date + '.json')
        .then((d) => {
          return d.data
        })
        .catch((error) => {
          this.$sentry.captureException(error)
          alert(error)
        })
    },
    rideTag(ride) {
      if (ride.currentWaitTime) {
        return ride.currentWaitTime + 'min'
      }

      if (ride.state) {
        return this.$t(`general.states.${ride.state}`)
      }

      return ''
    },
    async fetchPark() {
      this.park = await this.$axios.get('/parks/' + this.parkId).then((park) => {
        return park.data
      })
    },
    async fetchRides() {
      this.rides = await this.$axios.get('/parks/' + this.parkId + '/rides').then((park) => {
        return park.data
      })
    },
    startOfWeek(date) {
      const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
      return new Date(date.setDate(diff))
    },
    subtractOneWeek(date) {
      return new Date(date.setDate(date.getDate() - 7))
    },
  },
}
</script>

<style scoped></style>
