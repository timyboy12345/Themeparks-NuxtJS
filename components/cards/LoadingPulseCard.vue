<template>
  <div class="bg-white dark:bg-gray-700 rounded shadow p-4 space-y-4">
    <div class="w-full h-32 bg-gray-200 rounded animate-pulse"></div>
    <div class="space-y-2 animate-pulse">
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingPulseCard',
}
</script>

<style scoped></style>
