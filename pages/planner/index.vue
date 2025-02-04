<template>
  <div>
    <h1 class="text-2xl text-indigo-800 dark:text-indigo-300 font-bold">Planner</h1>

    <h2 v-if="$store.state.planner.park" class="dark:text-gray-100">Welkom in {{ $store.state.planner.park.name }}</h2>

    <ParkPicker v-if="!$store.state.planner.park" class="mt-4" @select="handleParkSelect" />

    <div v-else class="my-16 text-center text-gray-600 dark:text-gray-400">Deze pagina wordt later verder gevuld</div>
  </div>
</template>

<script>
import ParkPicker from '~/components/planner/ParkPicker.vue'

export default {
  name: 'PlannerIndex',
  components: { ParkPicker },
  layout: 'planner',
  methods: {
    handleParkSelect(park) {
      this.$store.commit('planner/setPark', park)
    },
  },
}
</script>
