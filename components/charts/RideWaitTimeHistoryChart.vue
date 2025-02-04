<template>
  <card title="Wachttijden van vandaag" :subtitle="`Gemiddelde wachttijd: ${avgWaitTime}`">
    <template #content>
      <highchart class="mt-3" :options="highChartsOptions"></highchart>
    </template>
  </card>
</template>

<script>
import Card from '@/components/cards/Card'

export default {
  name: 'RideWaitTimeHistoryChart',
  components: { Card },
  props: {
    chartdata: {
      type: Array,
      required: true,
    },
    ride: {
      type: Object,
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
        series: [
          {
            name: this.ride.title,
            data: this.parsedData,
            color: '#3730a3',
          },
        ],
      }
    },
    parsedData() {
      const validData = this.chartdata.filter((d) => d.wait !== null)
      const array = []
      validData.forEach((dataPoint) => {
        array.push([Date.parse(dataPoint.date), dataPoint.wait])
      })
      return array
    },
    avgWaitTime() {
      let total = 0
      this.parsedData.forEach((dataPoint) => {
        total += dataPoint[1]
      })
      return Math.round(total / this.parsedData.length)
    },
  },
}
</script>

<style></style>
