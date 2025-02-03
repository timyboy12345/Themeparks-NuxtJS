<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="fixed z-10 shadow-lg bottom-0 bg-indigo-800 text-white w-full flex flex-row items-center justify-between py-4 px-4 lg:px-8">
      <div class="flex w-full items-center flex-row">
        <div class="flex flex-row items-center md:mt-0">
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
        </div>
      </div>
    </div>

    <div class="mx-4 md:mx-8 lg:max-w-4xl xl:max-w-6xl lg:mx-auto py-4">
      <Nuxt keep-alive />
    </div>

    <div class="mx-4 md:mx-8 lg:max-w-4xl xl:max-w-6xl lg:mx-auto mt-4 pb-4 flex flex-col">
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
          Reset
        </button>
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
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import AddCheckinPopup from '@/components/popups/AddCheckinPopup'
import EditCheckinPopup from '@/components/popups/EditCheckinPopup'

export default {
  components: { EditCheckinPopup, AddCheckinPopup },
  head() {
    return this.$nuxtI18nHead({ addSeoAttributes: true })
  },
  computed: {
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    },
    filteredLocales() {
      // const locales = this.availableLocales.filter((l) => !this.switchLocalePath(l.code).includes('non-existing-translation'))
      const locales = this.availableLocales

      return locales
    },
  },
  mounted() {
    if (localStorage.getItem('planner_park_id')) {
      this.$axios.get('/parks/' + localStorage.getItem('planner_park_id')).then((d) => {
        this.$store.commit('planner/setPark', d.data)
      })
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
            // alert('Login is not valid any more, please log in again')
            // this.$router.push(this.localePath('/user/login'))
            return
          }

          alert('Something went wrong while fetching user details')
          this.$sentry.captureException(exception)
        })
    }
  },
  methods: {
    closePopup() {
      this.$store.commit('popup/closePopup')
    },
    resetPlanner() {
      this.$store.commit('planner/setPark', null)
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
</style>
