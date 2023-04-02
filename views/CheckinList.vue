<template>
  <div>
    <loading-spinner v-if="!$store.state.auth.checkins" class="py-4"></loading-spinner>

    <general-message v-if="$store.state.auth.checkins && $store.state.auth.checkins.length === 0" class="m-4" />

    <div
      v-if="$store.state.auth.checkins && $store.state.auth.checkins.length > 0"
      class="mt-2 flex flex-col bg-white divide-y divide-gray-200"
    >
      <NuxtLink
        v-for="checkin of checkins"
        :key="checkin.id"
        :to="localePath('/parks/' + checkin.parkId + '/rides/' + checkin.rideId)"
        class="py-2 px-4 flex hover:bg-gray-100 transition duration-100 flex-row justify-between items-center"
      >
        <div class="flex flex-row items-center">
          <div class="flex flex-col">
            <div class="text-indigo-700">{{ checkin.dateTime | formatDateTime }}</div>
            <div v-if="checkin.waitTime" class="text-sm text-gray-600">
              {{ $t('general.unspecifiedWaitTime', [checkin.waitTime]) }}
            </div>
          </div>
        </div>

        <div class="text-gray-700">{{ checkin.parkId }} / {{ checkin.rideId }}</div>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner'
import GeneralMessage from '@/components/GeneralMessage'

export default {
  name: 'CheckinList',
  components: { GeneralMessage, LoadingSpinner },
  props: {
    maxCheckins: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: false,
      default: null,
    },
  },
  computed: {
    checkins() {
      let checkins = this.$store.state.auth.checkins

      if (this.date) {
        checkins = checkins.filter((ci) => ci.dateTime.substr(0, 10) === this.date)
      }

      if (this.maxCheckins && this.maxCheckins >= 0) {
        checkins = checkins.slice(Math.max(checkins.length - this.maxCheckins, 0))
      }

      return checkins
    },
  },
}
</script>

<style scoped></style>
