<template>
  <div v-if="breadcrumbs && breadcrumbs.length > 0" class="-mx-4 md:-mx-8 -mt-4 lg:-mt-8 lg:max-w-6xl lg:mx-auto">
    <div
      v-if="breadcrumbs && breadcrumbs.length > 0"
      class="bg-gray-300 text-gray-800 flex flex-row py-2 px-4 whitespace-no-wrap overflow-x-auto text-sm md:text-base lg:absolute min-w-full lg:left-0 lg:px-8 mb-4 lg:mb-8"
    >
      <div v-for="(breadcrumb, i) of breadcrumbs" :key="i" class="mr-1">
        <NuxtLink :to="breadcrumb.url">
          <span :class="{ 'underline hover:no-underline': breadcrumb.url !== '#', 'mr-2': i === breadcrumbs.length - 1 }">{{
            breadcrumb.title
          }}</span>
          <span v-if="i + 1 !== breadcrumbs.length" class="text-gray-500">/</span></NuxtLink
        >
      </div>
    </div>

    <div class="hidden lg:block lg:h-16"></div>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumbs',
  props: {
    breadcrumbs: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style scoped></style>
