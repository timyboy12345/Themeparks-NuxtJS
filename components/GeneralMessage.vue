<template>
  <div class="text-center flex flex-col items-center justify-center">
    <h2 class="text-indigo-700 dark:text-indigo-300 font-bold">{{ title }}</h2>
    <p class="text-gray-600 dark:text-gray-400">{{ subTitle }}</p>
  </div>
</template>

<script>
export default {
  name: 'GeneralMessage',
  props: {
    title: {
      type: String,
      required: false,
      default: 'No data was found...',
    },
    subTitle: {
      type: String,
      required: false,
      default: "We couldn't find any data right now, try again later",
    },
  },
}
</script>

<style scoped></style>
