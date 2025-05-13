<template>
  <card :title="$t('statistics.averageWaitTimesGraph')" :subtitle="$t('statistics.averageWaitTime', [avgWaitTime])">
    <template #content>
      <select
        v-model="dayOfWeek"
        class="form-select border border-gray-300 rounded focus:outline-none focus:shadow-outline focus:border-indigo-300 text-gray-700 w-full mt-2 -mb-1 py-1 px-2 text-sm"
      >
        <option value="">Alle Dagen</option>
        <option value="0">Maandag</option>
        <option value="1">Dinsdag</option>
        <option value="2">Woensdag</option>
        <option value="3">Donderdag</option>
        <option value="4">Vrijdag</option>
        <option value="5">Zaterdag</option>
        <option value="6">Zondag</option>
      </select>

      <RidesAverageWaitTimeHistoryChart v-if="data" :data="data" :day-of-week="dayOfWeek" :ride-id="rideId" :rides="rides" />

      <LoadingSpinner v-else class="mt-4" />
    </template>
  </card>
</template>

<script>
import RidesAverageWaitTimeHistoryChart from '~/components/charts/RidesAverageWaitTimeHistoryChart.vue'
import Card from '~/components/cards/Card.vue'
import chartMixin from '@/mixins/charts'
import LoadingSpinner from '~/components/LoadingSpinner.vue'

export default {
  name: 'RidesAverageWaitTimeHistoryChartCard',
  components: { LoadingSpinner, Card, RidesAverageWaitTimeHistoryChart },
  mixins: [chartMixin],
  props: {
    data: {
      type: Object,
      required: true,
    },
    rides: {
      type: Array,
      required: true,
    },
    rideId: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      dayOfWeek: '',
    }
  },
  computed: {
    avgWaitTime() {
      let total = 0
      let points = 0

      this.parsedData.forEach((dataArray) => {
        dataArray.data.forEach((dataPoint) => {
          total += dataPoint[1]
          points++
        })
      })

      return Math.round(total / points)
    },
  },
}
</script>
