<template>
  <div class="flex flex-col">
    <h1 class="text-lg text-indigo-800 font-bold mb-2">
      {{ $t('general.account') }}
    </h1>

    <div class="grid items-start lg:grid-cols-2 gap-4">
      <Card :title="$t('general.userData')">
        <template #content>
          <div v-if="$store.state.auth.user">
            <ul class="list-disc ml-4 my-4">
              <li>Email: {{ $store.state.auth.user.email }}</li>
              <li>Username: {{ $store.state.auth.user.userName }}</li>
              <li>Name: {{ $store.state.auth.user.firstName }} {{ $store.state.auth.user.lastName }}</li>
            </ul>
          </div>

          <LoadingSpinner v-else class="my-4" />

          <button
            type="button"
            class="rounded text-white bg-red-700 hover:bg-red-800 transition-colors duration-100 py-1 px-2"
            @click="logout"
          >
            {{ $t('general.logout') }}
          </button>
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
                  <div class="text-indigo-700">{{ checkin.rideId }} / {{ checkin.parkId }} / {{ checkin.dateTime }}</div>
                  <div v-if="checkin.waitTime" class="text-sm text-gray-600">{{ checkin.waitTime }} min wachttijd</div>
                </div>
              </div>

              <div class="text-gray-700">{{ checkin.area }}</div>
            </NuxtLink>
          </div>

          <LoadingSpinner v-else class="my-4" />
        </template>
      </card>
    </div>
  </div>
</template>

<script>
import Card from '@/components/cards/Card'
import LoadingSpinner from '@/components/LoadingSpinner'

export default {
  components: { LoadingSpinner, Card },
  methods: {
    logout() {
      this.$store.commit('auth/setToken', null)
      this.$store.commit('auth/setUser', null)
      this.$store.commit('auth/setCheckins', null)

      this.$router.push(this.localePath('/user/login'))
    },
  },
}
</script>
