<template>
  <Card :title="$t('general.statistics')" :sub-title="$t('ride.statisticsSubTitle')">
    <template #content>
      <div class="flex flex-col gap-y-2 mt-2">
        <div v-if="ride.minSizeWithEscort || ride.minSizeWithoutEscort">
          <h3 class="font-bold text-indigo-700 dark:text-indigo-400">{{ $t('ride.stats.lengthTitle', [ride.title]) }}</h3>
          <p>{{ sizeSentence }}</p>
        </div>

        <div v-if="ride.minAgeWithoutEscort || ride.minAgeWithEscort">
          <h3 class="font-bold text-indigo-700 dark:text-indigo-400">{{ $t('ride.stats.ageTitle', [ride.title]) }}</h3>
          {{ ageSentence }}
        </div>

        <div v-if="park">
          <h3 class="font-bold text-indigo-700 dark:text-indigo-400">{{ $t('ride.stats.locationTitle', [ride.title]) }}</h3>
          {{ locationSentence }}
        </div>

        <div v-if="ride.facts && ride.facts.find((f) => f.type === 'height')">
          <h3 class="font-bold text-indigo-700 dark:text-indigo-400">{{ $t('ride.stats.heightTitle', [ride.title]) }}</h3>
          {{ $t('ride.stats.height', [ride.facts.find((f) => f.type === 'height').value, ride.title]) }}
        </div>

        <div v-if="ride.facts && ride.facts.find((f) => f.type === 'speed')">
          <h3 class="font-bold text-indigo-700 dark:text-indigo-400">{{ $t('ride.stats.speedTitle', [ride.title]) }}</h3>
          {{ $t('ride.stats.speed', [ride.facts.find((f) => f.type === 'speed').value, ride.title]) }}
        </div>

        <div v-if="ride.facts && ride.facts.find((f) => f.type === 'manufacturer')">
          <h3 class="font-bold text-indigo-700 dark:text-indigo-400">{{ $t('ride.stats.manufacturerTitle', [ride.title]) }}</h3>
          {{ $t('ride.stats.manufacturer', [ride.facts.find((f) => f.type === 'manufacturer').value, ride.title]) }}
        </div>

        <div v-if="ride.facts && ride.facts.find((f) => f.type === 'build_in')">
          <h3 class="font-bold text-indigo-700 dark:text-indigo-400">{{ $t('ride.stats.buildInTitle', [ride.title]) }}</h3>
          {{ $t('ride.stats.buildIn', [ride.facts.find((f) => f.type === 'build_in').value, ride.title]) }}
        </div>
      </div>
    </template>
  </Card>
</template>

<script>
import Card from '@/components/cards/Card'

export default {
  name: 'RideStatsCard',
  components: { Card },
  props: {
    ride: {
      type: Object,
      required: true,
    },
    park: {
      type: Object,
      required: false,
      default: null,
    },
  },
  computed: {
    sizeSentence() {
      const sentence = []

      if (this.ride.minSizeWithEscort !== 'undefined' && this.ride.minSizeWithEscort === 0) {
        sentence.push(this.$t('ride.stats.minSizeEveryone', [this.ride.title]))
      } else if (this.ride.minSizeWithEscort) {
        sentence.push(this.$t('ride.stats.minSizeWithEscort', [this.ride.minSizeWithEscort, this.ride.title]))
      }

      if (this.ride.minSizeWithoutEscort) {
        sentence.push(this.$t('ride.stats.minSizeWithoutEscort', [this.ride.minSizeWithoutEscort, this.ride.title]))
      }

      if (this.ride.maxSize) {
        sentence.push(this.$t('ride.stats.maxSize', [this.ride.maxSize, this.ride.title]))
      }

      return sentence.join(' ')
    },
    ageSentence() {
      const sentence = []

      if (this.ride.minAgeWithEscort) {
        sentence.push(this.$t('ride.stats.minAgeWithEscort', [this.ride.minAgeWithEscort, this.ride.title]))
      }

      if (this.ride.minAgeWithoutEscort) {
        sentence.push(this.$t('ride.stats.minAgeWithoutEscort', [this.ride.minAgeWithoutEscort, this.ride.title]))
      }

      if (this.ride.maxAge) {
        sentence.push(this.$t('ride.stats.maxAge', [this.ride.maxAge, this.ride.title]))
      }

      return sentence.join(' ')
    },
    locationSentence() {
      const sentence = [this.$t('ride.stats.locationLocatedInPark', [this.ride.title, this.park.name])]

      if (this.ride.area) {
        sentence.push(this.$t('ride.stats.locationLocatedInArea', [this.ride.area]))
      }

      return sentence.join(' ')
    },
  },
}
</script>

<style scoped></style>
