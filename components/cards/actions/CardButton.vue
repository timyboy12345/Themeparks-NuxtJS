<template>
  <NuxtLink
    :to="localePath(btnLink)"
    :class="{
      'text-white bg-indigo-800 hover:bg-indigo-900 dark:bg-indigo-500 dark:hover:bg-indigo-600': !thin,
      'border border-gray-300 bg-gray-300 bg-opacity-0 hover:bg-opacity-20 dark:text-gray-200': thin,
    }"
    class="py-2 px-4 rounded block cursor-pointer transition duration-100"
  >
    {{ btnTitle }}
  </NuxtLink>
</template>

<script>
export default {
  name: 'CardButton',
  props: {
    btnTitle: {
      type: String,
      required: true,
    },
    btnLink: {
      type: String,
      required: false,
      default: null,
    },
    thin: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
}
</script>
