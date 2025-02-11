<template>
  <div class="absolute w-full bottom-0 left-0 z-10">
    <div v-if="poi" class="md:max-w-md md:mx-auto">
      <div class="flex justify-end gap-4 mx-4 mb-2">
        <div
          :class="{
            'bg-green-900 text-white': hasCheckedIn,
            'bg-white text-indigo-800': !hasCheckedIn,
          }"
          class="rounded-full cursor-pointer text-indigo-800 hover:bg-indigo-800 active:bg-indigo-900 hover:text-white py-2 px-4 transition duration-100"
          @click="checkin"
        >
          Inchecken
        </div>

        <div
          :class="{
            'bg-red-600 text-white hover:bg-red-700 active:bg-red-800': hasFavorited,
            'bg-white text-indigo-800 hover:bg-indigo-800 active:bg-indigo-900 hover:text-white': !hasFavorited,
          }"
          class="rounded-full p-2 transition duration-100 cursor-pointer"
          @click="toggleFavorite"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </div>
      </div>

      <div class="bg-white max-h-96 overflow-y-auto rounded shadow m-4 divide-y divide-gray-200">
        <div class="p-4">
          <h1 class="text-indigo-800 text-lg font-bold">{{ poi.title }}</h1>
          <p v-if="poi.subTitle" class="opacity-60 text-sm">{{ poi.subTitle }}</p>

          <p v-if="poi.currentWaitTime" class="opacity-80">{{ poi.currentWaitTime }} minuten wachten</p>
          <div v-else-if="poi.state && poi.state !== 'UNDEFINED'" class="opaciy-60 text-sm">
            {{ $t(`general.states.${poi.state}`) }}
          </div>
        </div>

        <div class="px-4 py-4">
          <img v-if="poi.image_url" v-lazy-load :data-src="poi.image_url" class="rounded w-full max-h-96 object-cover" />
        </div>

        <div v-if="poi.showTimes && poi.showTimes.showTimes && poi.showTimes.showTimes.length > 0" class="py-2 px-4">
          {{ $tc('Show om | Shows om:', poi.showTimes.showTimes.length) }}
          {{ poi.showTimes.showTimes.map((s) => s.localFromTime).join(', ') }}
        </div>

        <div v-if="openingTimes && openingTimes.length > 0" class="py-2 px-4">
          {{ $tc('Open van | Open:', openingTimes.length) }}
          {{
            openingTimes
              .map((s) => (s.closeTime ? `${s.openTime.slice(0, -3)} tot ${s.closeTime.slice(0, -3)}` : s.openTime.slice(0, -3)))
              .join(' en ')
          }}
        </div>

        <div v-if="!park.supports.supportsRideWaitTimesHistory">Dit park ondersteund geen wachttijden</div>

        <div v-else-if="poi.currentWaitTime || (poi.state && poi.category === 'ATTRACTION')" class="p-4">
          <div v-if="!pushLoaded">Push meldingen op dit moment niet beschikbaar, open dit scherm opnieuw of installeer als web-app.</div>

          <div v-else-if="!supportsPush">Dit device ondersteund geen pushberichten</div>

          <div v-else-if="!hasPush">
            <div class="text-sm">Accepteer pushberichten als je wachttijd-updates wilt krijgen</div>
            <button
              type="button"
              class="block mt-2 rounded bg-indigo-800 hover:bg-indigo-900 transition duration-100 text-white py-1 px-2"
              @click="enablePushMessages()"
            >
              Zet pushberichten aan
            </button>
          </div>

          <div v-else-if="pushMessagesForPoi && pushMessagesForPoi.length > 0" class="flex flex-col">
            <div>Je krijgt een pushbericht met {{ pushMessagesForPoi.map((p) => p.minutes).join(', ') }} minuten</div>
            <div v-if="pushMessagesForPoi.find((p) => p.downUp ?? false)" class="text-sm opacity-60">
              Of als de attractie down gaat of weer gerepareerd wordt
            </div>
            <div
              class="cursor-pointer text-sm mt-2 text-red-800 hover:text-red-900 underline hover:no-underline"
              @click="removePushNotification(pushMessagesForPoi[0].id)"
            >
              Verwijder push melding
            </div>
          </div>

          <div v-else>
            <div class="text-sm">Wanneer wil je een pushbericht krijgen?</div>

            <div class="grid grid-cols-4 gap-2 mt-2">
              <button
                v-for="mins of [0, 5, 10, 20, 30, 40, 50, 60]"
                :key="mins"
                type="button"
                class="rounded cursor-pointer bg-indigo-800 hover:bg-indigo-900 text-white py-1 px-2"
                :class="{ 'opacity-60': poi.currentWaitTime && poi.currentWaitTime <= mins }"
                @click="addPushNotification(mins)"
              >
                {{ mins }} min
              </button>
            </div>

            <div class="flex flex-row items-center text-sm mt-2">
              <input id="down-up-checkbox" v-model="downUpValue" type="checkbox" class="mr-2" />
              <label for="down-up-checkbox">Stuur me ook berichten als de attractie down/up is.</label>
            </div>
          </div>
        </div>

        <div v-else-if="poi.category === 'ATTRACTION'" class="px-4 py-2 text-sm">
          Geen wachttijd beschikbaar, dus er kunnen momenteel geen push-meldingen worden ingesteld voor deze attractie.
        </div>

        <article v-if="poi.description" class="max-h-40 overflow-auto text-sm py-2 px-4">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div
            v-if="park.supports.textType === 'MARKDOWN'"
            class="prose prose-sm max-w-none prose-a:text-indigo-700 prose-headings:mb-1 prose-headings:mt-2 hover:prose-a:no-underline"
            v-html="$md.render(poi.description)"
          ></div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div
            v-else
            class="prose prose-sm max-w-none prose-a:text-indigo-700 prose-headings:mb-1 prose-headings:mt-2 hover:prose-a:no-underline"
            v-html="poi.description"
          ></div>
        </article>

        <MapComponent v-if="poi.location" class="overflow-hidden" :lng="poi.location.lng" :lat="poi.location.lat" :zoom="17">
          <MapMarker :lng="poi.location.lng" :lat="poi.location.lat" />
        </MapComponent>

        <div v-if="poi.images && poi.images.length > 0" class="p-4 grid grid-cols-2 lg:grid-cols-3 gap-4 content-start">
          <img
            v-for="(img, i) of poi.images"
            :key="i"
            v-lazy-load
            alt="Image of this ride"
            :data-src="img"
            class="bg-white rounded shadow"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MapComponent from '~/components/maps/MapComponent.vue'
import MapMarker from '~/components/maps/MapMarker.vue'

export default {
  name: 'PoiPopup',
  components: { MapMarker, MapComponent },
  data() {
    return {
      downUpValue: true,
    }
  },
  computed: {
    pushLoaded() {
      return window.OneSignal !== undefined
    },
    supportsPush() {
      return window.OneSignal ? window.OneSignal.Notifications.isPushSupported() : false
    },
    hasPush() {
      return window.OneSignal.User.PushSubscription.optedIn
    },
    poi() {
      return this.$store.getters['popup/getCurrentPopup'].poi
    },
    park() {
      return this.$store.getters['popup/getCurrentPopup'].park
    },
    openingTimes() {
      return (this.poi.openingTimes ?? []).filter((openingTime) => new Date(openingTime.date).toDateString() === new Date().toDateString())
    },
    hasCheckedIn() {
      return this.$store.getters['auth/todaysCheckins'].filter((s) => s.rideId === this.poi.id).length > 0
    },
    hasFavorited() {
      return this.$store.state.planner.favorites.includes(this.poi.id)
    },
    pushMessagesForPoi() {
      return this.$store.state.planner.pushMessages.filter((pm) => pm.poiId === this.poi.id)
    },
  },
  methods: {
    enablePushMessages() {
      const context = this

      window.OneSignalDeferred.push((OneSignal) => {
        // TODO: Improve opt in/out flow
        // if (OneSignal.Notifications.permission) {
        //   OneSignal.User.PushSubscription.optIn()
        // } else {
        OneSignal.Notifications.requestPermission()
        // }

        OneSignal.login(this.$store.state.auth.user.id)
        context.$store.commit('popup/closePopup')
      })
    },
    addPushNotification(minutes) {
      this.$axios
        .post('/push', {
          parkId: this.park.id,
          poiId: this.poi.id,
          minutes,
          downUp: this.downUpValue,
        })
        .then((response) => {
          this.$store.commit('planner/addPushMessage', {
            id: response.data.identifiers[0].id,
            poiId: this.poi.id,
            parkId: this.park.id,
            minutes,
            downUp: this.downUpValue,
          })
        })
        .catch((exception) => {
          alert('Something went wrong while trying to create a push message alert, close and open the app again')
          this.$sentry.captureException(exception)
        })
    },
    removePushNotification(id) {
      this.$axios
        .delete('/push/' + id)
        .then(() => {
          this.$store.commit('planner/removePushMessage', id)
        })
        .catch((e) => {
          alert('Something went wrong while trying to remove the push message alert, close and open the app again')
          this.$sentry.captureException(e)
        })
    },
    toggleFavorite() {
      this.$store.commit('planner/toggleFavorite', this.poi.id)
    },
    checkin() {
      this.$store.commit('popup/addPopup', {
        type: 'addCheckin',
        ride: this.poi,
        park: this.park,
        parkId: this.park.id,
        rideId: this.poi.id,
        front: true,
      })
    },
  },
}
</script>
