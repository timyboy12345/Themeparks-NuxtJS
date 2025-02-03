<template>
  <loading v-if="$fetchState.pending" class="my-4"></loading>
  <general-error v-else-if="$fetchState.error" :sub-title="$fetchState.error.message" title="Show not found" />
  <PoiInformation v-else type="show" :park="park" :poi="show"></PoiInformation>
</template>

<script>
import Loading from '../../../../components/LoadingSpinner'
import GeneralError from '@/components/GeneralError'
import PoiInformation from '~/views/PoiInformation.vue'

export default {
  components: { PoiInformation, GeneralError, Loading },
  async validate({ params, $axios, $sentry }) {
    return await $axios
      .get('/parks/' + params.id + '/shows')
      .then((shows) => {
        return shows.data.some((r) => r.id === params.show_id)
      })
      .catch((e) => {
        $sentry.captureException(e)
        return false
      })
  },
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
  computed: {},
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
          throw reason
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
          throw reason
        })
    },
  },
}
</script>
