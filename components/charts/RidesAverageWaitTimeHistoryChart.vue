<template>
  <no-ssr>
    <highchart v-if="hasData" class="rounded overflow-hidden mt-3" :options="highChartsOptions"></highchart>
    <div v-else>Geen data beschikbaar</div>
  </no-ssr>
</template>

<script>
import chartMixin from '@/mixins/charts'

export default {
  name: 'RidesAverageWaitTimeHistoryChart',
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
    dayOfWeek: {
      type: String,
      required: false,
      default: null,
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
          dateTimeLabelFormats: {
            hour: '%I %p',
            minute: '%I:%M %p',
          },
        },
        tooltip: {
          formatter() {
            return `${this.series.name} at ${new Date(this.x).getHours()}:00: ${this.y.toFixed(2)} min`
          },
        },
        series: this.parsedData,
      }
    },
    hasData() {
      if (this.parsedData) {
        for (let i = this.parsedData.length - 1; i >= 0; i--) {
          if (this.parsedData[i].data.length > 0) {
            return true
          }
        }
      }

      return false
    },
  },
  methods: {},
}
</script>

<style></style>
