<template>
  <div class="min-h-screen bg-gray-100">
    <div
      class="bg-indigo-800 text-white w-full flex flex-row items-center justify-between py-4 px-4 lg:px-8"
      :class="{ 'mb-4 lg:mb-8': !breadcrumbs || breadcrumbs.length === 0 }"
    >
      <NuxtLink :to="localePath('/')" class="lg:text-lg font-bold">Themeparks</NuxtLink>

      <div class="flex flex-row">
        <NuxtLink
          :to="localePath('/')"
          class="ml-3 lg:ml-4 text-sm md:text-base opacity-50 transition duration-100"
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
      </div>
    </div>

    <slot name="breadcrumbs"></slot>

    <div class="mx-4 md:mx-8 lg:max-w-6xl lg:mx-auto mt-4 mb-4">
      <Nuxt keep-alive />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    breadcrumbs() {
      return this.$store.state.breadcrumbs
    },
  },
}
</script>
