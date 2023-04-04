<template>
  <div class="min-h-screen bg-gray-100">
    <div
      class="bg-indigo-800 text-white w-full flex flex-row items-center justify-between py-4 px-4 lg:px-8"
      :class="{ 'mb-4 lg:mb-8': !breadcrumbs || breadcrumbs.length === 0 }"
    >
      <div class="flex flex-col md:flex-row">
        <NuxtLink :to="localePath('/')" class="lg:text-lg font-bold">Themeparkplanner</NuxtLink>

        <div class="flex flex-row items-center mt-2 md:mt-0">
          <NuxtLink
            :to="localePath('/')"
            class="md:ml-3 lg:ml-4 text-sm md:text-base opacity-50 transition duration-100"
            exact-active-class="!opacity-100"
          >
            {{ $t('general.home') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/parks')"
            class="ml-3 lg:ml-4 text-sm md:text-base opacity-50 transition duration-100"
            exact-active-class="!opacity-100"
          >
            {{ $t('general.parks') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/parks/map')"
            class="ml-3 lg:ml-4 text-sm md:text-base opacity-50 transition duration-100"
            exact-active-class="!opacity-100"
          >
            {{ $t('general.map') }}
          </NuxtLink>
          <NuxtLink
            v-if="!$store.state.auth.user"
            :to="localePath('/user/login')"
            class="ml-3 lg:ml-4 text-sm md:text-base opacity-50 transition duration-100"
            exact-active-class="!opacity-100"
          >
            {{ $t('general.login') }}
          </NuxtLink>
          <NuxtLink
            v-else
            :to="localePath('/user/account')"
            class="ml-3 lg:ml-4 text-sm md:text-base opacity-50 transition duration-100"
            exact-active-class="!opacity-100"
          >
            {{ $t('general.account') }}
          </NuxtLink>
        </div>
      </div>

      <div class="flex flex-row">
        <nuxt-link
          v-for="locale in availableLocales"
          :key="locale.code"
          class="rounded-full bg-white overflow-hidden ml-4 w-6 h-6"
          :to="switchLocalePath(locale.code)"
        >
          <img alt="Link to other language" :src="`https://flagcdn.com/${locale.countryFlag}.svg`" class="object-cover w-full h-full" />
        </nuxt-link>
      </div>
    </div>

    <slot name="breadcrumbs"></slot>

    <div class="mx-4 md:mx-8 lg:max-w-4xl xl:max-w-6xl lg:mx-auto mt-4 mb-4">
      <Nuxt keep-alive />
    </div>

    <div class="text-gray-600 text-sm mx-4 md:mx-8 lg:max-w-4xl xl:max-w-6xl lg:mx-auto mt-4 pb-4">
      {{ $t('general.madeWithLove') }} -
      <a href="https://arendz.nl?utm_source=themeparkplanner&utm_campaign=backlink" target="_blank" class="underline text-gray-800">
        Arendz.nl
      </a>
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
    breadcrumbs() {
      return this.$store.state.breadcrumbs
    },
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    },
  },
  mounted() {
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
