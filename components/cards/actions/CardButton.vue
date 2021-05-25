<template>
  <NuxtLink :to="localePath(btnLink)" class="py-2 px-4 text-white block rounded bg-indigo-800 hover:bg-indigo-900 cursor-pointer">
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
  },
}
</script>
