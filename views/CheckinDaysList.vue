<template>
  <div>
    <loading-spinner v-if="!$store.state.auth.checkins" class="py-4"></loading-spinner>

    <general-message v-if="$store.state.auth.checkins && $store.state.auth.checkins === 0" class="m-4" />

    <div
      v-if="$store.state.auth.checkins && $store.state.auth.checkins.length > 0"
      class="mt-2 flex flex-col bg-white divide-y divide-gray-200 dark:divide-gray-600"
    >
      <NuxtLink
        v-for="checkin of $store.getters['auth/individualDays']"
        :key="checkin.id"
        :to="localePath(`/user/checkins/${checkin.year}/${checkin.month}/${checkin.day}`)"
        class="
          py-2
          px-4
          flex
          hover:bg-gray-100
          dark:bg-gray-700 dark:hover:bg-gray-800
          transition
          duration-100
          flex-row
          justify-between
          items-center
        "
      >
        <div class="flex flex-row items-center">
          <div class="flex flex-col">
            <div class="text-indigo-700 dark:text-indigo-200">{{ checkin.dateTime | formatDate }}</div>
          </div>
        </div>

        <!-- <div class="text-gray-700">Parken: {{ checkin.parkId }}</div> -->
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner'
import GeneralMessage from '@/components/GeneralMessage'

export default {
  name: 'CheckinDaysList',
  components: { GeneralMessage, LoadingSpinner },
  props: {
    maxDays: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      checkins: undefined,
    }
  },
}
</script>

<style scoped></style>
