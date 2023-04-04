<template>
  <div>
    <loading-spinner v-if="!$store.state.auth.checkins" class="py-4"></loading-spinner>

    <general-message v-if="$store.state.auth.checkins && $store.state.auth.checkins.length === 0" class="m-4" />

    <div
      v-if="$store.state.auth.checkins && $store.state.auth.checkins.length > 0"
      class="mt-2 flex flex-col bg-white divide-y divide-gray-200"
    >
      <component
        :is="edit ? 'div' : 'NuxtLink'"
        v-for="checkin of checkins"
        :key="checkin.id"
        :to="localePath('/parks/' + checkin.parkId + '/rides/' + checkin.rideId)"
        :class="{ 'cursor-pointer': edit }"
        class="py-2 px-4 flex hover:bg-gray-100 transition duration-100 flex-row justify-between items-center"
        @click="handleEdit(checkin)"
      >
        <div class="flex flex-row items-center">
          <div class="flex flex-col">
            <div class="text-indigo-700">{{ checkin.dateTime | formatDateTime }}</div>
            <div v-if="checkin.waitTime" class="text-sm text-gray-600">
              {{ $t('general.unspecifiedWaitTime', [checkin.waitTime]) }}
            </div>
          </div>
        </div>

        <div class="flex flex-row gap-x-2">
          <div class="text-gray-700">{{ checkin.parkId }} / {{ checkin.rideId }}</div>
          <div v-if="edit" class="text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 stroke-indigo-800"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </div>
        </div>
      </component>
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
    rideId: {
      type: String,
      required: false,
      default: null,
    },
    maxCheckins: {
      type: Number,
      required: false,
      default: 5,
    },
    date: {
      type: String,
      required: false,
      default: null,
    },
    edit: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    checkins() {
      let checkins = this.$store.state.auth.checkins

      if (this.date) {
        checkins = checkins.filter((ci) => ci.dateTime.substr(0, 10) === this.date)
      }

      if (this.rideId) {
        checkins = checkins.filter((ci) => ci.rideId === this.rideId)
      }

      if (this.maxCheckins && this.maxCheckins >= 0) {
        checkins = checkins.slice(Math.max(checkins.length - this.maxCheckins, 0))
      }

      return checkins
    },
  },
  methods: {
    handleEdit(checkin) {
      if (!this.edit) {
        return
      }

      this.$store.commit('popup/addPopup', {
        type: 'editCheckin',
        checkin,
      })
    },
  },
}
</script>

<style scoped></style>
