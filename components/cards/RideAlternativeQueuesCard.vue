<template>
  <Card :title="$t('ride.waitTimes')" :subtitle="$t('ride.waitTimesSubTitle')">
    <template #content>
      <div class="flex flex-col divide-y -mx-4 divide-gray-200 dark:divide-gray-600 mt-2">
        <div v-if="ride.currentWaitTime" class="px-4 py-2">
          {{ $t('general.currentWaitTime', [ride.currentWaitTime]) }}
        </div>

        <div v-for="a of ride.alternativeQueues" :key="a.id" class="px-4 py-2">
          {{ getTranslatedString(a.type) }}:

          <span v-if="a.waitTime" class="text-indigo-700 dark:text-indigo-300">
            {{ $t('general.unspecifiedWaitTime', [a.waitTime]) }}
          </span>
          <span v-if="a.window_start && !a.window_end" class="text-indigo-700 dark:text-indigo-300">
            {{ $t('ride.comeBackAfter', [a.window_start]) }}
          </span>
          <span v-if="!a.window_start && a.window_end" class="text-indigo-700 dark:text-indigo-300">
            {{ $t('ride.comeBackBefore', [a.window_start]) }}
          </span>
          <span v-if="a.window_start && a.window_end" class="text-indigo-700 dark:text-indigo-300">
            {{ $t('ride.comeBackBetween', [formatTime(a.window_start), formatTime(a.window_end)]) }}
          </span>
          <span v-if="a.state === 'FULL'" class="text-indigo-700 dark:text-indigo-300">
            {{ $t('ride.alternativeFull') }}
          </span>
          <span v-if="a.state === 'CLOSED'" class="text-indigo-700 dark:text-indigo-300">
            {{ $t('ride.alternativeClosed') }}
          </span>
        </div>
      </div>
    </template>
  </Card>
</template>

<script>
import Card from '@/components/cards/Card'

export default {
  name: 'RideAlternativeQueuesCard',
  components: { Card },
  props: {
    ride: {
      type: Object,
      required: true,
    },
    park: {
      type: Object,
      required: false,
      default: null,
    },
  },
  methods: {
    getTranslatedString(queueType) {
      switch (queueType) {
        case 'VIRTUAL_QUEUE':
          return this.$t('ride.virtualQueueTitle')
        default:
          return 'UNSPECIFIED'
      }
    },
    formatTime(time) {
      const date = new Date(time)
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    },
  },
}
</script>

<style scoped></style>
