<template>
  <card title="Wachttijden van vandaag" :sub-title="`Gemiddelde wachttijd: ${avgWaitTime} min`">
    <template #content>
      <highchart class="mt-3" :options="highChartsOptions"></highchart>
    </template>
  </card>
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
  },
}
</script>

<style></style>
