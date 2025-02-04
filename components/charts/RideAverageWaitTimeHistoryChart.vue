<template>
  <card :title="$t('ride.averageWaitTimes')" :subtitle="$t('ride.subTitle', [avgWaitTime])">
    <template #content>
      <highchart class="mt-3" :options="highChartsOptions"></highchart>
    </template>
  </card>
</template>

<script>
import Card from '@/components/cards/Card'

export default {
  name: 'RideAverageWaitTimeHistoryChart',
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
        const now = new Date()
        const hour = dataPoint.time.split(':')[0]
        const minutes = dataPoint.time.split(':')[1]

        const date = Date.UTC(now.getFullYear(), now.getMonth(), now.getDay(), hour, minutes, 0)
        // date.setHours(dataPoint.time.split(':')[0], dataPoint.time.split(':')[1])

        array.push([date, Math.round(dataPoint.wait)])
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
