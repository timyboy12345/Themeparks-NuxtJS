<template>
  <no-ssr>
    <card :title="$t('statistics.waitTimesToday')" :sub-title="$t('statistics.averageWaitTime', [avgWaitTime])">
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
      if (!this.rides) {
        return []
      }

      const rides = []

      this.rides.forEach((ride) => {
        const data = []

        ride.waitingTimes
          .filter((d) => d.wait !== null)
          .filter((d) => this.isToday(d.date))
          .filter((d) => this.parkIsOpen(d.date))
          .forEach((dataPoint) => {
            data.push([Date.parse(dataPoint.date), dataPoint.wait])
          })

        rides.push({
          name: ride.title,
          data,
        })
      })

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
    isToday(rawDate) {
      const today = new Date()
      const someDate = new Date(rawDate)

      return (
        someDate.getDate() === today.getDate() && someDate.getMonth() === today.getMonth() && someDate.getFullYear() === today.getFullYear()
      )
    },
    parkIsOpen(rawDate) {
      const d = new Date(rawDate)
      return d.getHours() > 9 && d.getHours() < 23
    },
  },
}
</script>

<style></style>
