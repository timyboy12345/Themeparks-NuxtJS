<template>
  <div>
    <h1 class="mb-4 text-2xl text-indigo-800 dark:text-indigo-300 font-bold">Jouw Account</h1>

    <div class="grid gap-4">
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
              <div class="flex flex-col">
                <div class="flex flex-col md:flex-row gap-x-2 gap-y-1">
                  <div>{{ getName(push.poiId) }}: {{ push.minutes }} minuten</div>
                  <div v-if="push.downUp" class="opacity-60">Of als de POI down/up gaat.</div>
                </div>
                <div v-if="push.parkId !== $store.state.planner.parkId" class="text-sm opacity-60">
                  Staat in een ander park: {{ push.parkId }}
                </div>
              </div>
            </div>
          </div>

          <button type="button" class="opacity-60 text-xs underline hover:no-underline" @click="loadAllPushMessages">
            Laad ook pushmeldingen van andere parken en andere data.
          </button>
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
          Toon alle pushberichten, ook van andere data en andere parken
        </button>
      </div>

      <Card v-if="$store.state.auth.user" title="Jouw gegevens">
        <template #content>
          <div class="-mx-4 divide-y divide-gray-200 -mb-4">
            <div v-for="[key, value] of Object.entries($store.state.auth.user)" :key="key" class="px-4 py-2">
              {{ keyToString(key) }}:
              {{ value }}
            </div>
          </div>
        </template>
      </Card>
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

          if (this.allPushMessages) {
            this.allPushMessages = this.allPushMessages.filter((p) => p.id !== push.id)
          }
        })
        .catch((e) => {
          alert(e)
          this.$sentry.captureException(e)
        })
    },
    loadAllPushMessages() {
      this.showAllPushMessages = true

      this.$axios
        .get('/push')
        .then((d) => (this.allPushMessages = d.data))
        .catch((e) => this.$sentry.captureException(e))
    },
    getName(poiId) {
      const poi = (this.$store.state.planner.pois ?? []).find((p) => p.id === poiId)
      return poi ? poi.title : poiId
    },
    keyToString(key) {
      if (key === 'id') {
        return 'ID'
      } else {
        const split = key.split(/(?=[A-Z])/).join(' ')
        return split.charAt(0).toUpperCase() + split.slice(1)
      }
    },
  },
}
</script>
