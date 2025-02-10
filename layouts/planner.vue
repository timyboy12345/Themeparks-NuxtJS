<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="bottom-nav fixed z-10 shadow-lg bottom-0 bg-indigo-800 text-white w-full flex flex-row items-center justify-between">
      <div class="flex w-full items-center flex-row">
        <div class="py-4 px-4 lg:px-8 flex flex-row items-center md:mt-0 whitespace-nowrap overflow-x-auto">
          <NuxtLink
            :to="localePath('/planner')"
            class="md:ml-3 lg:ml-4 text-sm md:text-base opacity-50 transition duration-100"
            exact-active-class="!opacity-100"
          >
            {{ $t('planner.menu.home') }}
          </NuxtLink>
          <NuxtLink
            :class="{ 'opacity-20 cursor-not-allowed': !$store.state.planner.park }"
            :to="localePath('/planner/pois')"
            class="ml-3 lg:ml-4 text-sm md:text-base opacity-50 transition duration-100"
            exact-active-class="!opacity-100"
          >
            {{ $t('planner.menu.pois') }}
          </NuxtLink>
          <NuxtLink
            :class="{ 'opacity-20 cursor-not-allowed': !$store.state.planner.park }"
            :to="localePath('/planner/history')"
            class="ml-3 lg:ml-4 text-sm md:text-base opacity-50 transition duration-100"
            exact-active-class="!opacity-100"
          >
            {{ $t('planner.menu.history') }}
          </NuxtLink>
          <NuxtLink
            :class="{ 'opacity-20 cursor-not-allowed': !$store.state.planner.park }"
            :to="localePath('/planner/news')"
            class="ml-3 lg:ml-4 text-sm md:text-base opacity-50 transition duration-100"
            exact-active-class="!opacity-100"
          >
            {{ $t('planner.menu.news') }}
          </NuxtLink>
          <NuxtLink
            :class="{ 'opacity-20 cursor-not-allowed': !$store.state.planner.park }"
            :to="localePath('/planner/user')"
            class="ml-3 lg:ml-4 text-sm md:text-base opacity-50 transition duration-100"
            exact-active-class="!opacity-100"
          >
            {{ $t('planner.menu.user') }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="mx-4 md:mx-8 lg:max-w-4xl xl:max-w-6xl lg:mx-auto py-4">
      <Nuxt v-if="$store.state.planner.initialized" keep-alive />
      <div v-else>
        <LoadingSpinner class="my-8" />
      </div>
    </div>

    <div class="bottom-nav fixed flex flex-row gap-2 bottom-16 right-4">
      <!-- POI Reload Button -->
      <div
        class="shadow cursor-pointer p-2 rounded-full bg-indigo-800 text-white dark:bg-indigo-300 hover:bg-indigo-900 transition duration-100 dark:hover:bg-indigo-400"
        title="Haal gegevens opnieuw op"
        @click="reloadPois"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </div>

      <!-- Location Reload Button -->
      <div
        class="shadow cursor-pointer p-2 rounded-full bg-indigo-800 text-white dark:bg-indigo-300 hover:bg-indigo-900 transition duration-100 dark:hover:bg-indigo-400"
        title="Haal je geolocatie opnieuw op"
        @click="getLocation"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>
      </div>
    </div>

    <div class="mx-4 md:mx-8 lg:max-w-4xl xl:max-w-6xl lg:mx-auto mt-4 pb-12 flex flex-col">
      <div class="flex flex-row items-center mb-4 gap-2">
        <NuxtLink
          v-for="locale in availableLocales"
          :key="locale.code"
          class="rounded-full bg-white overflow-hidden w-6 h-6"
          :to="switchLocalePath(locale.code)"
        >
          <img alt="Link to other language" :src="`https://flagcdn.com/${locale.countryFlag}.svg`" class="object-cover w-full h-full" />
        </NuxtLink>

        <button
          v-if="$store.state.planner.parkId"
          type="button"
          class="bg-red-700 hover:bg-red-800 transition duration-100 text-white text-sm py-1 px-2 rounded"
          @click="resetPlanner"
        >
          Park Verlaten
        </button>

        <NuxtLink
          class="rounded py-1 px-2 text-sm bg-indigo-800 text-white hover:bg-indigo-900 transition duration-100"
          :to="localePath('/')"
        >
          Home
        </NuxtLink>
      </div>
    </div>

    <Transition>
      <div v-if="$store.getters['popup/getCurrentPopup']">
        <div class="fixed w-full h-full left-0 top-0 z-10">
          <div class="absolute opacity-75 bg-gray-700 -z-1 w-full h-full" @click="closePopup"></div>

          <AddCheckinPopup v-if="$store.getters['popup/getCurrentPopup'].type === 'addCheckin'" />
          <EditCheckinPopup
            v-if="$store.getters['popup/getCurrentPopup'].type === 'editCheckin'"
            :checkin="$store.getters['popup/getCurrentPopup'].checkin"
          />
          <PoiPopup v-if="$store.getters['popup/getCurrentPopup'].type === 'poi'" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import AddCheckinPopup from '@/components/popups/AddCheckinPopup'
import EditCheckinPopup from '@/components/popups/EditCheckinPopup'
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import PoiPopup from '~/components/popups/PoiPopup.vue'

export default {
  name: 'PlannerLayout',
  components: { PoiPopup, LoadingSpinner, EditCheckinPopup, AddCheckinPopup },
  head() {
    return {
      ...this.$nuxtI18nHead({ addSeoAttributes: true }),
      script: [
        {
          vmid: 'envsetter',
          innerHTML: 'window.nodeEnv = "' + process.env.NODE_ENV + '"',
        },
        {
          src: 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js',
          defer: true,
        },
        {
          src: '/onesignal.client.js',
        },
      ],
      __dangerouslyDisableSanitizersByTagID: {
        envsetter: ['innerHTML'],
      },
    }
  },
  computed: {
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    },
  },
  mounted() {
    // window.OneSignalDeferred.push(['showNativePrompt'])

    const plann = this
    window.OneSignalDeferred.push(function (OneSignal) {
      console.log('Push Supported: ' + OneSignal.Notifications.isPushSupported())
      console.log('Opted in: ' + OneSignal.User.PushSubscription.optedIn)

      if (OneSignal.User.PushSubscription.optedIn) {
        console.log('Set User ID for push messages')
        OneSignal.login(plann.$store.state.auth.user.id)
      } else {
        console.log('Not opted in')
      }
    })

    if (!localStorage.getItem('jwt_token')) {
      this.$router.push(this.localePath('/user/login'))
      return
    }

    if (localStorage.getItem('planner_park_id')) {
      Promise.all([
        this.$axios.get('/parks/' + localStorage.getItem('planner_park_id')).then((d) => {
          this.$store.commit('planner/setPark', d.data)

          if (d.data.supports.supportsOpeningTimes)
            this.$axios
              .get('/parks/' + d.data.id + '/opening-hours')
              .then((openingHours) => {
                this.$store.commit('planner/setOpeningTimes', openingHours.data)
              })
              .catch((e) => {
                this.$sentry.captureException(e)
              })
        }),
        this.$axios.get('/parks/' + localStorage.getItem('planner_park_id') + '/pois').then((d) => {
          this.$store.commit('planner/setPois', d.data)
        }),
        this.$axios.get('/push').then((pushes) => {
          this.$store.commit(
            'planner/setPushMessages',
            pushes.data.filter((date) => new Date(date.createdAt).toDateString() === new Date().toDateString())
          )
        }),
      ]).then(() => this.$store.commit('planner/setInitialized', true))
    } else {
      this.$store.commit('planner/setInitialized', true)
    }

    if (localStorage.getItem('jwt_token')) {
      this.$store.commit('auth/setToken', localStorage.getItem('jwt_token'))

      this.$axios
        .get('/auth/user')
        .then((response) => {
          this.$store.commit('auth/setUser', response.data)

          this.$axios
            .get('/checkins')
            .then((response) => {
              this.$store.commit('auth/setCheckins', response.data)
            })
            .catch((exception) => {
              alert('Something went wrong while fetching all checkins')
              this.$sentry.captureException(exception)
            })
        })
        .catch((exception) => {
          // Unauthenticated
          if (exception.response.status === 401) {
            this.$store.commit('auth/setToken', null)

            window.OneSignalDeferred.push((OneSignal) => {
              OneSignal.logout()
            })

            alert('Login is not valid anymore, please log in again')
            this.$router.push(this.localePath('/user/login'))
            return
          }

          alert('Something went wrong while fetching user details')
          this.$sentry.captureException(exception)
        })
    }
  },
  methods: {
    getLocation() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          this.$store.commit('planner/setLocationStatus', 'accepted')
          this.$store.commit('planner/setLocation', {
            lat,
            lng,
          })
        },
        (err) => {
          this.$sentry.captureException(err)
          // console.error(err)
        }
      )
    },
    reloadPois() {
      this.$axios.get('/parks/' + localStorage.getItem('planner_park_id') + '/pois').then((d) => {
        this.$store.commit('planner/setPois', d.data)
      })

      this.$axios.get('/push').then((pushes) => {
        this.$store.commit(
          'planner/setPushMessages',
          pushes.data.filter((date) => new Date(date.createdAt).toDateString() === new Date().toDateString())
        )
      })
    },
    closePopup() {
      this.$store.commit('popup/closePopup')
    },
    resetPlanner() {
      this.$store.commit('planner/setPark', null)
      this.$store.commit('planner/setPois', null)
      this.$store.commit('planner/resetFavorites')
      this.$store.commit('planner/setInitialized', true)
    },
  },
}
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
