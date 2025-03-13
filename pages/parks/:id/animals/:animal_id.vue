<template>
  <loading v-if="$fetchState.pending" class="my-4"></loading>
  <general-error v-else-if="$fetchState.error" :subtitle="$fetchState.error.message" title="Animal not found" />
  <PoiInformation v-else type="animal" :park="park" :poi="animal"></PoiInformation>
</template>

<script>
import Loading from '@/components/LoadingSpinner'
import PoiInformation from '~/views/PoiInformation.vue'
import GeneralError from '~/components/GeneralError.vue'

export default {
  components: { GeneralError, PoiInformation, Loading },
  async validate({ params, $axios, $sentry }) {
    return await $axios
      .get('/parks/' + params.id + '/animals')
      .then((animals) => {
        return animals.data.some((r) => r.id === params.animal_id)
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
      animalId: this.$route.params.animal_id,
      park: null,
      animal: null,
    }
  },
  async fetch() {
    await Promise.all([this.getAnimal(), this.getPark()]).then()
  },
  head() {
    const description =
      this.animal && this.park
        ? 'See current and past opening times from ' +
          this.animal.title +
          ', ' +
          this.park.name +
          ' and other animals and theme parks all over the world'
        : 'See current and past waiting times and opening times from theme parks all over the world.'

    return {
      title: this.animal && this.park ? `${this.animal.title} @ ${this.park.name}` : 'Attraction',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.animal ? this.animal.image_url : null,
        },
      ],
    }
  },
  computed: {},
  methods: {
    getAnimal() {
      return this.$axios.get('/parks/' + this.parkId + '/animals').then((animals) => {
        this.animal = animals.data.find((r) => r.id === this.animalId)
      })
    },
    getPark() {
      return this.$axios.get('/parks/' + this.parkId).then((park) => {
        this.park = park.data
      })
    },
  },
}
</script>
