<template>
  <div class="flex flex-col">
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <div class="grid md:grid-cols-2 gap-4">
      <poi-card h1 :type="type" :park="park" :poi="poi"></poi-card>

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

      <card v-if="futureShows.length > 0" :title="$t('shows.futureShowTimesCardTitle')" :subtitle="$t('shows.futureShowTimesCardSubtitle')">
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

      <card v-if="pastShows.length > 0" :title="$t('shows.passedShowTimesCardTitle')" :subtitle="$t('shows.passedShowTimesCardSubtitle')">
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

      <div v-if="$store.state.auth.user && type === 'ride'" class="flex flex-col gap-2">
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

      <card v-if="$store.state.auth.user && type === 'ride'" :title="$t('checkins.existingCheckinsTitle')">
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

      <!--      <div v-if="ride && park && park.supports.supportsRideWaitTimesHistory && ride.waitingTimes">-->
      <!--        <RideWaitTimeHistoryChart :ride="ride" :park="park" :chartdata="ride.waitingTimes"></RideWaitTimeHistoryChart>-->
      <!--      </div>-->

      <!-- TODO: Re-enable once fetching historic wait times is faster -->
      <!--      <div v-if="ride && park && park.supports.supportsRideWaitTimesHistory">-->
      <!--        <RideAverageWaitTimeHistoryChart-->
      <!--          v-if="averageWaitingTimes"-->
      <!--          :ride="ride"-->
      <!--          :park="park"-->
      <!--          :chartdata="averageWaitingTimes"-->
      <!--        ></RideAverageWaitTimeHistoryChart>-->

      <!--        <loading-spinner v-else class="my-8" :subtitle="$t('ride.averageWaitingTimesLoading')"></loading-spinner>-->
      <!--      </div>-->

      <RideStatsCard v-if="type === 'ride'" :park="park" :ride="poi"></RideStatsCard>

      <client-only>
        <RCDBStatsCard v-if="type === 'ride'" :park="park" :ride="poi"></RCDBStatsCard>
      </client-only>

      <AdCard />
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

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {
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
    return {}
  },
  computed: {
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
  methods: {
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
  },
}
</script>
