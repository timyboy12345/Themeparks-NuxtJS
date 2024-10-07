<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <general-error v-if="error"></general-error>

    <loading v-if="$fetchState.pending" class="my-4"></loading>
    <div v-else-if="show" class="grid md:grid-cols-2 gap-4">
      <show-card h1 :park="park" :show="show"></show-card>

      <card v-if="show.description" :title="$t('general.generalInformation')">
        <template #content>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="show.description"></div>
        </template>
      </card>

      <card
        v-if="futureShows.length > 0"
        :title="$t('shows.futureShowTimesCardTitle')"
        :sub-title="$t('shows.futureShowTimesCardSubtitle')"
      >
        <template #content>
          <div class="flex flex-col bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray600 -mx-4">
            <div v-for="showTime of futureShows" :key="showTime.id" class="py-2 px-4 flex flex-row justify-between items-center">
              <div class="flex flex-row items-center">
                <div class="flex flex-col">
                  <div class="text-indigo-700 dark:text-indigo-400">{{ showTime.localFromTime }}</div>
                  <div v-if="showTime.edition" class="text-sm text-gray-600 dark:text-gray-300">
                    {{ showTime.edition }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </card>

      <card v-if="pastShows.length > 0" :title="$t('shows.passedShowTimesCardTitle')" :sub-title="$t('shows.passedShowTimesCardSubtitle')">
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

      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 content-start">
        <img v-for="(img, i) of show.images" :key="i" alt="Image of this restaurant" :src="img" class="bg-white rounded shadow" />
      </div>

      <AdCard />
    </div>

    <general-error v-else title="Show not found" />
  </div>
</template>

<script>
import Loading from '../../../../components/LoadingSpinner'
import Breadcrumbs from '@/components/Breadcrumbs'
import GeneralError from '@/components/GeneralError'
import ShowCard from '@/components/cards/ShowCard'
import Card from '@/components/cards/Card'
import AdCard from '@/components/cards/AdCard'

export default {
  components: { AdCard, Card, ShowCard, GeneralError, Breadcrumbs, Loading },
  data() {
    return {
      parkId: this.$route.params.id,
      showId: this.$route.params.show_id,
      park: null,
      show: null,
      error: null,
    }
  },
  async fetch() {
    await Promise.all([this.getShow(), this.getPark()]).then()
  },
  head() {
    return {
      title: this.show && this.park ? `${this.show.title} @ ${this.park.name}` : this.$t('general.show'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.show
            ? 'See show and opening times from ' + this.show.title + ' and other shows and theme parks all over the world'
            : 'See show and opening times from theme parks all over the world.',
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.show ? this.show.image_url : null,
        },
      ],
    }
  },
  computed: {
    breadcrumbs() {
      if (!this.park || !this.show) {
        return []
      }

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
          title: this.$t('general.shows'),
          url: '/parks/' + this.parkId + '/shows',
        },
        {
          title: this.show ? this.show.title : this.$t('general.show'),
          url: '#',
        },
      ]
    },
    futureShows() {
      return this.show && this.show.showTimes && this.show.showTimes.showTimes
        ? this.show.showTimes.showTimes.filter((st) => !st.isPassed)
        : []
    },
    pastShows() {
      return this.show && this.show.showTimes && this.show.showTimes.showTimes
        ? this.show.showTimes.showTimes.filter((st) => st.isPassed)
        : []
    },
  },
  methods: {
    getShow() {
      return this.$axios
        .get('/parks/' + this.parkId + '/shows')
        .then((restaurants) => {
          this.show = restaurants.data.find((r) => r.id === this.showId)
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
