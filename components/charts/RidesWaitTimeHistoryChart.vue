<template>
  <no-ssr>
    <card :title="$t('statistics.waitTimesGraph')" :subtitle="$t('statistics.averageWaitTime', [avgWaitTime])">
      <template #content>
        <highchart class="mt-3" :options="highChartsOptions"></highchart>
      </template>
    </card>
  </no-ssr>
</template>

<script>
import Card from '@/components/cards/Card'

export default {
  name: 'RidesWaitTimeHistoryChart',
  components: { Card },
  props: {
    history: {
      type: Object,
      required: true,
    },
    rides: {
      type: Array,
      required: true,
    },
  },
  computed: {
    highChartsOptions() {
      return {
        title: {
          text: '',
        },
        yAxis: {
          title: {
            text: 'Wachttijd (min)',
          },
        },
        legend: {
          maxHeight: 100,
        },
        time: {
          timeZone: 'Europe/Amsterdam',
        },
        plotOptions: {
          line: {
            marker: {
              enabled: false,
            },
          },
          series: {
            label: {
              connectorAllowed: false,
            },
          },
        },
        xAxis: {
          type: 'datetime',
        },
        series: this.parsedData,
      }
    },
    parsedData() {
      if (!this.history) {
        return []
      }

      const rides = []

      for (const [rideId, waitingTimes] of Object.entries(this.history)) {
        const data = []

        waitingTimes
          .filter((d) => d.wait !== null)
          .filter((d) => this.parkIsOpen(d.date))
          .forEach((dataPoint) => {
            data.push([Date.parse(dataPoint.date), dataPoint.wait])
          })

        const ride = this.rides.find((r) => r.id === rideId)
        rides.push({
          name: ride ? ride.title : rideId,
          data,
        })
      }

      return rides
    },
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
  methods: {
    parkIsOpen(rawDate) {
      const d = new Date(rawDate)
      return d.getHours() > 9 && d.getHours() < 23
    },
  },
}
</script>

<style></style>
