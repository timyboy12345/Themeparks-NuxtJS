<template>
  <div>
    <h1 class="text-2xl text-indigo-800 dark:text-indigo-300 font-bold">Eerder Gedaan vandaag</h1>

    <div class="my-16 text-center text-gray-600 dark:text-gray-400">Deze functie wordt later geïmplementeerd</div>
  </div>
</template>

<script>
export default {
  name: 'PlannerHistory',
  layout: 'planner',
  head() {
    return {
      title: this.$t('planner.historyTitle'),
    }
  },
}
</script>
