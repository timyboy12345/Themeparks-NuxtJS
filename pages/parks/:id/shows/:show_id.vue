<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <div class="grid md:grid-cols-2 gap-4">
      <loading v-if="!show && !error"></loading>

      <show-card v-if="show" :park="park" :show="show"></show-card>

      <general-error v-if="error"></general-error>

      <card v-if="show.showTimes" title="Shows van vandaag">
        <template #content>
          <div class="flex flex-col bg-white divide-y divide-gray-200 -mx-4">
            <div
              v-for="showTime of show.showTimes.futureShowTimes"
              :key="showTime.id"
              class="py-2 px-4 flex flex-row justify-between items-center"
            >
              <div class="flex flex-row items-center">
                <div class="flex flex-col">
                  <div class="text-indigo-700">{{ showTime.fromTime }}</div>
                  <div v-if="showTime.edition" class="text-sm text-gray-600">
                    {{ showTime.edition }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </card>

      <div v-if="show" class="grid grid-cols-2 md:grid-cols-3 md:grid-cols-4 gap-4">
        <img v-for="(img, i) of show.images" :key="i" alt="Image of this restaurant" :src="img" class="bg-white rounded shadow" />
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs'
import GeneralError from '@/components/GeneralError'
import ShowCard from '@/components/cards/ShowCard'
import Card from '@/components/cards/Card'
import Loading from '../../../../components/LoadingSpinner'

export default {
  components: { Card, ShowCard, GeneralError, Breadcrumbs, Loading },
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
