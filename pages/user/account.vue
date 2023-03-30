<template>
  <div class="flex flex-col">
    <h1 class="text-lg text-indigo-800 font-bold mb-2">
      {{ $t('general.account') }}
    </h1>

    <div class="grid items-start content-start justify-start lg:grid-cols-2 gap-4">
      <Card :title="$t('general.userData')">
        <template #content>
          {{ $store.state.auth.user }}
        </template>
      </Card>

      <card :title="$t('general.checkins')">
        <template #content>
          <div
            v-if="$store.state.auth.checkins && $store.state.auth.checkins.length > 0"
            class="-mx-4 mt-2 flex flex-col bg-white divide-y divide-gray-200"
          >
            <NuxtLink
              v-for="checkin of $store.state.auth.checkins"
              :key="checkin.id"
              :to="localePath('/parks/' + checkin.parkId + '/rides/' + checkin.rideId)"
              class="py-2 px-4 flex hover:bg-gray-100 transition duration-100 flex-row justify-between items-center"
            >
              <div class="flex flex-row items-center">
                <div class="rounded-full bg-gray-500 w-6 h-6 lg:w-8 lg:h-8 mr-2 overflow-hidden">
                  <img
                    v-if="checkin.image_url"
                    v-lazy-load
                    :alt="`Image of ${checkin.title}`"
                    :title="`Image of ${checkin.title}`"
                    :data-src="checkin.image_url"
                    class="object-cover object-center w-full h-full"
                  />
                  <div v-else class="object-cover object-center w-full h-full" />
                </div>

                <div class="flex flex-col">
                  <div class="text-indigo-700">{{ checkin.rideId }} / {{ checkin.parkId }}</div>
                  <div v-if="checkin.currentWaitTime !== undefined" class="text-sm text-gray-600">
                    {{ checkin.currentWaitTime }} min wachttijd
                  </div>
                </div>
              </div>

              <div class="text-gray-700">{{ checkin.area }}</div>
            </NuxtLink>
          </div>
        </template>
      </card>
    </div>
  </div>
</template>

<script>
import Card from '@/components/cards/Card'

export default {
  components: { Card },
  data() {
    return {
      account: null,
      checkins: null,
    }
  },
  created() {},
  methods: {},
}
</script>
