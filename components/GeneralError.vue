<template>
  <div class="text-center flex flex-col items-center justify-center">
    <h2 class="text-red-700 font-bold">{{ title }}</h2>
    <p class="text-gray-600">{{ subTitle }}</p>
  </div>
</template>

<script>
export default {
  name: 'GeneralError',
  props: {
    title: {
      type: String,
      required: false,
      default: 'Something went wrong...',
    },
    subTitle: {
      type: String,
      required: false,
      default: 'Please try again...',
    },
  },
}
</script>

<style scoped></style>
