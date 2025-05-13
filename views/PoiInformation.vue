<template>
  <div class="flex flex-col">
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <div class="flex flex-col lg:flex-row gap-x-4 items-start">
      <div class="hidden lg:flex flex-col gap-2 text-nowrap sticky top-4 dark:text-gray-400">
        <NuxtLink
          :class="{ 'text-indigo-800 bg-gray-200 dark:bg-gray-800 dark:text-indigo-300': activeSection === 'information' }"
          to="#information"
          class="transition duration-100 rounded py-2 px-4"
        >
          Informatie
        </NuxtLink>
        <NuxtLink
          :class="{ 'text-indigo-800 bg-gray-200 dark:bg-gray-800 dark:text-indigo-300': activeSection === 'openingtimes' }"
          to="#openingtimes"
          class="transition duration-100 rounded py-2 px-4"
        >
          Show- en Openingstijden
        </NuxtLink>
        <NuxtLink
          :class="{ 'text-indigo-800 bg-gray-200 dark:bg-gray-800 dark:text-indigo-300': activeSection === 'checkins' }"
          to="#checkins"
          class="transition duration-100 rounded py-2 px-4"
        >
          Checkins
        </NuxtLink>
        <NuxtLink
          :class="{ 'text-indigo-800 bg-gray-200 dark:bg-gray-800 dark:text-indigo-300': activeSection === 'images' }"
          to="#images"
          class="transition duration-100 rounded py-2 px-4"
        >
          Afbeeldingen
        </NuxtLink>
        <NuxtLink
          :class="{ 'text-indigo-800 bg-gray-200 dark:bg-gray-800 dark:text-indigo-300': activeSection === 'stats' }"
          to="#stats"
          class="transition duration-100 rounded py-2 px-4"
        >
          Statistieken
        </NuxtLink>

        <!--        <div class="max-w-full max-h-60 overflow-hidden">-->
        <!--          <AdCard />-->
        <!--        </div>-->
      </div>

      <div class="grid gap-y-4">
        <div id="information" class="grid lg:grid-cols-2 gap-4">
          <poi-card h1 :type="type" :park="park" :poi="poi"></poi-card>

          <div class="flex flex-col gap-4">
            <card v-if="poi.description" :title="$t('general.generalInformation')">
              <template #content>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div
                  v-if="park.supports.textType === 'MARKDOWN'"
                  class="prose prose-sm dark:prose-invert max-w-none prose-a:text-indigo-700 dark:prose-a:text-indigo-300 prose-headings:mb-1 prose-headings:mt-2 hover:prose-a:no-underline"
                  v-html="$md.render(poi.description)"
                ></div>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div
                  v-else
                  class="prose prose-sm dark:prose-invert max-w-none prose-a:text-indigo-700 dark:prose-a:text-indigo-300 prose-headings:mb-1 prose-headings:mt-2 hover:prose-a:no-underline"
                  v-html="poi.description"
                ></div>
              </template>
            </card>

            <a
              v-if="poi.website_url"
              target="_blank"
              :href="poi.website_url"
              class="rounded bg-indigo-800 hover:bg-indigo-900 transition duration-100 py-2 px-4 text-white self-start text-center"
            >
              {{ $t('general.readMoreOn', [park.name]) }}
            </a>
          </div>

          <div class="lg:col-span-2">
            <AdCard />
          </div>
        </div>

        <div id="openingtimes" class="w-full flex flex-row gap-2 text-nowrap items-center">
          <div class="text-gray-600 dark:text-gray-400">Openingstijden, Wachttijden en Showtijden</div>
          <div class="w-full h-0.5 bg-gray-200 dark:bg-gray-800"></div>
        </div>
        <div class="grid lg:grid-cols-2 gap-4">
          <card
            v-if="poi.openingTimes && poi.openingTimes.length > 0"
            :title="$t('restaurants.futureOpeningTimesCardTitle')"
            :subtitle="$t('restaurants.futureOpeningTimesCardSubtitle')"
          >
            <template #content>
              <div class="flex flex-col bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray600 -mx-4">
                <div v-for="(openingTime, i) of poi.openingTimes" :key="i" class="py-2 px-4 flex flex-row justify-between items-center">
                  <div class="flex flex-row items-center">
                    <div class="flex flex-col">
                      <div class="text-indigo-700 dark:text-indigo-300">
                        {{ openingTime.open | formatDateTime }}

                        <span v-if="openingTime.closeTime">- {{ openingTime.closeTime | formatTime }}</span>
                      </div>
                      <div
                        v-if="new Date(openingTime.date).toDateString() === new Date().toDateString()"
                        class="text-sm text-gray-600 dark:text-gray-300"
                      >
                        {{ $t('general.today') }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </card>

          <card
            v-if="futureShows.length > 0"
            :title="$t('shows.futureShowTimesCardTitle')"
            :subtitle="$t('shows.futureShowTimesCardSubtitle')"
          >
            <template #content>
              <div class="flex flex-col bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray600 -mx-4">
                <div v-for="showTime of futureShows" :key="showTime.id" class="py-2 px-4 flex flex-row justify-between items-center">
                  <div class="flex flex-row items-center">
                    <div class="flex flex-col">
                      <div class="text-indigo-700 dark:text-indigo-300">{{ showTime.localFromTime }}</div>
                      <div v-if="showTime.edition" class="text-sm text-gray-600 dark:text-gray-300">
                        {{ showTime.edition }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </card>

          <card
            v-if="pastShows.length > 0"
            :title="$t('shows.passedShowTimesCardTitle')"
            :subtitle="$t('shows.passedShowTimesCardSubtitle')"
          >
            <template #content>
              <div class="flex flex-col bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600 -mx-4">
                <div v-for="showTime of pastShows" :key="showTime.id" class="py-2 px-4 flex flex-row justify-between items-center">
                  <div class="flex flex-row items-center">
                    <div class="flex flex-col">
                      <div class="text-gray-700 dark:text-gray-400">{{ showTime.localFromTime }}</div>
                      <div v-if="showTime.edition" class="text-sm text-gray-600 dark:text-gray-300">
                        {{ showTime.edition }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </card>

          <RideAlternativeQueuesCard v-if="showAlternativeQueues" :park="park" :ride="poi" />
        </div>

        <div v-if="type === 'ride'" id="checkins" class="w-full flex flex-row gap-2 text-nowrap items-center">
          <div class="text-gray-600 dark:text-gray-400">Checkins</div>
          <div class="w-full h-0.5 bg-gray-200 dark:bg-gray-800"></div>
        </div>
        <div v-if="$store.state.auth.user && type === 'ride'" class="grid lg:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <card :title="$t('checkins.addCheckinTitle')">
              <template #content>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ $t('checkins.addCheckinDescription') }}
                </p>
              </template>
            </card>

            <button
              class="rounded py-2 px-4 text-white bg-indigo-800 hover:bg-indigo-900 dark:bg-indigo-400 dark:hover:bg-indigo-500 transition-colors duration-100"
              type="button"
              @click="addCheckin"
            >
              {{ $t('checkins.addCheckinButton') }}
            </button>
          </div>

          <card :title="$t('checkins.existingCheckinsTitle')">
            <template #content>
              <checkin-list
                v-if="$store.state.auth.checkins && $store.state.auth.checkins.filter((r) => r.rideId === poi.id).length > 0"
                edit
                :ride-id="poi.id"
                class="-mx-4 mt-2 flex flex-col bg-white divide-y divide-gray-200 dark:bg-gray-700"
              />

              <div v-else>
                {{ $t('checkins.notCheckedIn') }}
              </div>
            </template>
          </card>
        </div>

        <div v-else-if="type === 'ride'" class="dark:text-gray-300">
          {{ $t('ride.loginForCheckins') }}
          <NuxtLink class="text-indigo-800 dark:text-indigo-300 underline hover:no-underline" :to="localePath('/user/login')">
            {{ $t('general.login') }}
          </NuxtLink>
        </div>

        <div v-if="poi.images && poi.images.length > 0" id="images" class="w-full flex flex-row gap-2 text-nowrap items-center">
          <div class="text-gray-600 dark:text-gray-400">Afbeeldingen</div>
          <div class="w-full h-0.5 bg-gray-200 dark:bg-gray-800"></div>
        </div>
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

        <div id="stats" class="w-full flex flex-row gap-2 text-nowrap items-center">
          <div class="text-gray-600 dark:text-gray-400">Statistieken</div>
          <div class="w-full h-0.5 bg-gray-200 dark:bg-gray-800"></div>
        </div>
        <div class="grid gap-4 lg:grid-cols-2">
          <client-only>
            <RCDBStatsCard v-if="type === 'ride'" :park="park" :ride="poi"></RCDBStatsCard>
          </client-only>

          <RideStatsCard v-if="type === 'ride'" :park="park" :ride="poi"></RideStatsCard>

          <div v-if="poi && park && park.supports.supportsRideWaitTimesHistory && historicData">
            <RidesAverageWaitTimeHistoryChartCard :data="historicData" :ride-id="poi.id" :rides="[poi]" />
          </div>

          <LoadingSpinner
            v-else-if="!historicData || !poi || !park"
            class="my-8"
            :subtitle="$t('ride.averageWaitingTimesLoading')"
          ></LoadingSpinner>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from '@/components/cards/Card'
import AdCard from '@/components/cards/AdCard'
import CheckinList from '@/views/CheckinList'
import RideStatsCard from '@/components/cards/RideStatsCard'
import RCDBStatsCard from '@/components/cards/RCDBStatsCard'
import Breadcrumbs from '~/components/Breadcrumbs.vue'
import PoiCard from '~/components/cards/PoiCard.vue'
import RideAlternativeQueuesCard from '~/components/cards/RideAlternativeQueuesCard.vue'
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import RidesAverageWaitTimeHistoryChartCard from '~/components/cards/RidesAverageWaitTimeHistoryChartCard.vue'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {
    RidesAverageWaitTimeHistoryChartCard,
    LoadingSpinner,
    RideAlternativeQueuesCard,
    PoiCard,
    Breadcrumbs,
    RCDBStatsCard,
    RideStatsCard,
    CheckinList,
    AdCard,
    Card,
  },
  props: {
    type: {
      type: String,
      required: true,
      validator(value) {
        return ['ride', 'restaurant', 'show', 'animal', 'shop'].includes(value)
      },
    },
    poi: {
      type: Object,
      required: true,
    },
    park: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      historicData: null,
      historicError: null,
      activeSection: 'information',
      observers: [],
    }
  },
  computed: {
    showAlternativeQueues() {
      if (!this.poi) {
        return false
      }

      if (this.type !== 'ride') {
        return false
      }

      if (this.poi.currentWaitTime !== undefined) {
        return true
      }

      return this.poi.alternativeQueues && this.poi.alternativeQueues.filter((q) => q.currentWaitTime > 0 || q.state).length > 0
    },
    breadcrumbs() {
      const bc = [
        {
          title: this.$t('general.parks'),
          url: '/parks/',
        },
        {
          title: this.park ? this.park.name : this.$t('general.park'),
          url: '/parks/' + this.park.id,
        },
      ]

      if (this.type === 'ride') {
        bc.push({
          title: this.$t('general.rides'),
          url: '/parks/' + this.park.id + '/rides',
        })
      } else if (this.type === 'show') {
        bc.push({
          title: this.$t('general.shows'),
          url: '/parks/' + this.park.id + '/shows',
        })
      } else if (this.type === 'restaurant') {
        bc.push({
          title: this.$t('general.restaurants'),
          url: '/parks/' + this.park.id + '/restaurants',
        })
      } else if (this.type === 'animal') {
        bc.push({
          title: this.$t('general.animals'),
          url: '/parks/' + this.park.id + '/animals',
        })
      } else if (this.type === 'shop') {
        bc.push({
          title: this.$t('general.shops'),
          url: '/parks/' + this.park.id + '/shops',
        })
      }

      bc.push({
        title: this.poi ? this.poi.title : this.$t('general.ride'),
        url: '#',
      })

      return bc
    },
    futureShows() {
      return this.poi && this.poi.showTimes && this.poi.showTimes.showTimes ? this.poi.showTimes.showTimes.filter((st) => !st.isPassed) : []
    },
    pastShows() {
      return this.poi && this.poi.showTimes && this.poi.showTimes.showTimes ? this.poi.showTimes.showTimes.filter((st) => st.isPassed) : []
    },
  },
  async mounted() {
    if (this.park.supports.supportsRideWaitTimesHistory) {
      this.historicData = null

      const startOfWeek = this.startOfWeek(this.subtractOneWeek(new Date()))
      const [weekMonth, weekDay, weekYear] = [startOfWeek.getMonth(), ('0' + startOfWeek.getDate()).slice(-2), startOfWeek.getFullYear()]
      const date = `${weekYear}-${('0' + (weekMonth + 1)).slice(-2)}-${weekDay}`

      this.historicData = await this.$axios
        .get('https://themeparks-data.arendz.nl/history/weekly/' + this.park.id + '/' + date + '.json')
        .then((d) => {
          return d.data
        })
        .catch((error) => {
          this.$sentry.captureException(error)
          this.historicError = error
          // alert(error)
        })
    }

    this.$nextTick(() => {
      this.setupSectionObservers()
    })
  },
  beforeDestroy() {
    // Cleanup observers
    this.observers.forEach((observer) => observer.disconnect())
  },
  methods: {
    startOfWeek(date) {
      const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
      return new Date(date.setDate(diff))
    },
    subtractOneWeek(date) {
      return new Date(date.setDate(date.getDate() - 7))
    },
    openImage(imgSrc) {
      window.open(imgSrc, '_blank')
    },
    addCheckin() {
      this.$store.commit('popup/addPopup', {
        type: 'addCheckin',
        ride: this.poi,
        park: this.park,
        parkId: this.park.id,
        rideId: this.poi.id,
      })
    },
    setupSectionObservers() {
      const sections = ['information', 'openingtimes', 'checkins', 'images', 'stats']

      const observer = new IntersectionObserver(
        () => {
          // Find the first section that's fully in view from top to bottom
          const firstFullyVisibleSection = sections.find((sectionId) => {
            const element = document.getElementById(sectionId)
            if (!element) return false

            const rect = element.getBoundingClientRect()
            // Check if the element is fully visible and starts at or below the top of viewport
            return rect.top >= 0 && rect.bottom <= window.innerHeight
          })

          if (firstFullyVisibleSection) {
            this.activeSection = firstFullyVisibleSection
          }
        },
        {
          threshold: [0, 1.0],
        }
      )

      // Observe all sections
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
          observer.observe(element)
        }
      })

      // Store observer for cleanup
      this.observers.push(observer)
    },
  },
}
</script>
