<template>
  <div>
    <loading-spinner v-if="$fetchState.pending" class="py-4"></loading-spinner>

    <general-error v-if="$fetchState.error" class="m-4" sub-title="We couldn't fetch the openingHours for this park" />

    <general-message v-if="!$fetchState.pending && !weatherData && !$fetchState.error" class="m-4" />

    <div
      v-if="!$fetchState.pending && weatherData.current"
      class="mt-2 flex flex-col bg-white divide-y divide-gray-200 dark:divide-gray-600"
    >
      <div
        v-for="hour of remainingHours"
        :key="hour"
        class="py-2 px-4 flex hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-800 transition duration-100 flex-row justify-between items-center"
      >
        <div class="flex flex-row items-center">
          <div class="flex flex-col">
            <div class="text-indigo-700 dark:text-indigo-300">{{ hour }}:00</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ weatherData.hourly.temperature_2m[hour] }}&deg; / {{ weatherData.hourly.rain[hour] }}mm
            </div>
          </div>
        </div>

        <div class="text-gray-700 dark:text-gray-300">
          <img
            class="w-8 h-8 bg-gray-400 rounded-full p-0.5 object-center"
            alt="Image depicting weather type"
            :src="weatherIcon(weatherData.hourly.weather_code[hour], weatherData.hourly.is_day[hour])"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner'
import GeneralError from '@/components/GeneralError'
import GeneralMessage from '@/components/GeneralMessage'
import WmoWeatherCodes from '~/assets/wmo-weather-codes.json'

export default {
  name: 'WeatherList',
  components: { GeneralMessage, GeneralError, LoadingSpinner },
  props: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      weatherData: null,
      error: null,
      wmoCodes: WmoWeatherCodes,
    }
  },
  async fetch() {
    this.weatherData = await this.$openMeteo
      .get('/v1/forecast', { params: { latitude: this.lat, longitude: this.lng } })
      .then((response) => {
        return response.data
      })
      .catch((e) => {
        this.$sentry.captureException(e)
        throw e
      })
  },
  computed: {
    remainingHours() {
      const hours = []

      for (let i = new Date().getHours(); i < 24; i++) {
        hours.push(i)
      }

      return hours.slice(0, 6)
    },
  },
  methods: {
    weatherIcon(code, isDay) {
      return this.wmoCodes[code][isDay ? 'day' : 'night'].image
    },
  },
}
</script>

<style scoped></style>
