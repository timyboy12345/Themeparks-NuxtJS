<template>
  <div>
    <h1 class="mb-4 text-2xl text-indigo-800 dark:text-indigo-300 font-bold">Jouw Account</h1>

    <LoadingSpinner v-if="!pushMessages" />
    <Card v-else-if="pushMessages.length > 0" title="Jouw Pushberichten">
      <template #content>
        <div class="-mx-4 divide divide-gray-100 dark:divide-gray-600">
          <div v-for="push of pushMessages" :key="push.id" class="flex flex-row items-center px-4 py-2">
            <button
              type="button"
              class="text-white rounded py-1 px-2 text-sm mr-2 bg-red-700 hover:bg-red-800 transition duration-100"
              @click="handleClick(push)"
            >
              Verwijder
            </button>
            <div class="flex flex-col md:flex-row gap-x-2 gap-y-1">
              <div>
                {{ $store.state.planner.pois.find((p) => p.id === push.poiId).title ?? poiId }}: {{ push.minutes }}
                minuten
              </div>
              <div v-if="push.downUp" class="opacity-60">Of als de POI down/up gaat.</div>
            </div>
          </div>
        </div>
      </template>
    </Card>
    <div v-else class="my-16 text-center text-gray-600 dark:text-gray-400 flex flex-col gap-y-2">
      Je hebt nog geen pushmeldingen ingesteld.

      <button
        v-if="!showAllPushMessages"
        type="button"
        class="underline hover:no-underline text-gray-400 dark:text-gray-600"
        @click="loadAllPushMessages"
      >
        Toon alle pushberichten
      </button>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import Card from '~/components/cards/Card.vue'

export default {
  name: 'PlannerHistory',
  components: { Card, LoadingSpinner },
  layout: 'planner',
  data() {
    return {
      allPushMessages: null,
      showAllPushMessages: false,
    }
  },
  head() {
    return {
      title: this.$t('planner.userTitle'),
    }
  },
  computed: {
    pushMessages() {
      return this.showAllPushMessages ? this.allPushMessages : this.$store.state.planner.pushMessages
    },
  },
  methods: {
    handleClick(push) {
      this.$axios
        .delete('/push/' + push.id)
        .then(() => {
          this.$store.commit('planner/removePushMessage', push.id)
        })
        .catch((e) => this.$sentry.captureException(e))
    },
    loadAllPushMessages() {
      this.showAllPushMessages = true

      this.$axios
        .get('/push')
        .then((d) => (this.allPushMessages = d.data))
        .catch((e) => this.$sentry.captureException(e))
    },
  },
}
</script>
