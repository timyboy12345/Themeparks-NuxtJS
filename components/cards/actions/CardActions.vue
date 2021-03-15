<template>
  <div class="mt-4 flex flex-row items-start">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'CardActions',
}
</script>

<style scoped>
* {
  @apply mr-2;
}
</style>
