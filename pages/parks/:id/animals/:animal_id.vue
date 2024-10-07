<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading v-if="!animal" class="my-4"></loading>

    <div v-if="animal && park" class="grid md:grid-cols-2 gap-4">
      <animal-card h1 :park="park" :animal="animal"></animal-card>

      <card v-if="animal.description" :title="$t('general.generalInformation')">
        <template #content>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="animal.description"></div>
        </template>
      </card>

      <a
        v-if="park && animal.website_url"
        target="_blank"
        :href="animal.website_url"
        class="rounded bg-indigo-800 hover:bg-indigo-900 transition duration-100 py-2 px-4 text-white"
      >
        {{ $t('general.readMoreOn', [park.name]) }}
      </a>

      <div class="grid grid-cols-2 md:grid-cols-3 md:grid-cols-4 gap-4 content-start">
        <img v-for="(img, i) of animal.images" :key="i" alt="Image of this animal" :src="img" class="bg-white rounded shadow" />
      </div>

      <AdCard v-if="animal" />
    </div>
  </div>
</template>

<script>
import AnimalCard from '@/components/cards/AnimalCard'
import Breadcrumbs from '@/components/Breadcrumbs'
import Card from '@/components/cards/Card'
import AdCard from '@/components/cards/AdCard'
import Loading from '@/components/LoadingSpinner'

export default {
  components: { AdCard, Card, Breadcrumbs, AnimalCard, Loading },
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
  computed: {
    breadcrumbs() {
      if (!this.park || !this.animal) {
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
          title: this.$t('general.animals'),
          url: '/parks/' + this.parkId + '/animals',
        },
        {
          title: this.animal ? this.animal.title : this.$t('general.animal'),
          url: '#',
        },
      ]
    },
  },
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
