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
            class="lg:ml-4 text-sm md:text-base opacity-50 transition duration-100"
            exact-active-class="opacity-100"
          >
            {{ $t('general.home') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/parks')"
            class="ml-3 lg:ml-4 text-sm md:text-base opacity-50 transition duration-100"
            exact-active-class="opacity-100"
          >
            {{ $t('general.parks') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/parks/map')"
            class="ml-3 lg:ml-4 text-sm md:text-base opacity-50 transition duration-100"
            exact-active-class="opacity-100"
          >
            {{ $t('general.map') }}
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

    <div class="mx-4 md:mx-8 lg:max-w-6xl lg:mx-auto mt-4 mb-4">
      <Nuxt keep-alive />
    </div>

    <div class="text-gray-600 text-sm mx-4 md:mx-8 lg:max-w-6xl lg:mx-auto mt-4 pb-4">
      {{ $t('general.madeWithLove') }} -
      <a href="https://arendz.nl?utm_source=themeparkplanner&utm_campaign=backlink" target="_blank" class="underline text-gray-800"
        >Arendz.nl</a
      >
    </div>
  </div>
</template>

<script>
export default {
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
}
</script>
