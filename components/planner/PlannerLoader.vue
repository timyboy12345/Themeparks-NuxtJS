<template>
  <div class="flex flex-col mx-auto gap-y-2 w-80">
    <div v-for="(state, name) of loaders" :key="name" class="flex flex-col gap-y-2">
      <div class="dark:text-white dark:text-opacity-60 text-opacity-60 flex flex-row gap-x-2 items-center">
        <svg
          v-if="!state"
          class="animate-spin ml-0.5 mr-0.5 h-5 w-5 text-indigo-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>

        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 text-green-600"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
          />
        </svg>

        {{ name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlannerLoader',
  computed: {
    loaders() {
      return {
        'Park wordt geladen': Boolean(this.$store.state.planner.park),
        'Attracties worden geladen': Boolean(this.$store.state.planner.pois),
        'Openingstijden worden geladen': Boolean(this.$store.state.planner.openingTimes),
        'Pushmeldingen worden geladen': Boolean(this.$store.state.planner.pushMessages),
        'Jouw informatie wordt opgehaald': Boolean(this.$store.state.auth.user),
      }
    },
  },
}
</script>
