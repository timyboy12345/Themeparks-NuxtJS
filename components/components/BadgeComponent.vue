<template>
  <div class="bg-indigo-800 text-white py-1 px-2 rounded text-sm">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: 'BadgeComponent',
  props: {
    text: {
      required: true,
      type: String,
    },
  },
}
</script>

<style scoped></style>
