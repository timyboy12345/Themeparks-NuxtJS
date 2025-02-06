<template>
  <div>
    <h1 class="text-lg text-indigo-800 dark:text-indigo-300 font-bold mb-2">
      {{ $t('general.planner') }}
    </h1>

    <p class="my-4">
      Plan je dagje uit met de ThemeparkPlanner Dagplanner. Houdt over de dag bij waar je naartoe wilt, welke shows er binnenkort aankomen,
      welke attracties en restaurants in de buurt zijn en waar je al bent geweest. Zo wordt jouw dagje pretpark super overzichtelijk!
    </p>

    <div class="my-4 grid gap-4 grid-cols-2">
      <div class="min-h-40 w-full bg-gray-200 rounded"></div>
      <div class="min-h-40 w-full bg-gray-200 rounded"></div>
    </div>

    <p class="my-4">
      Naast alle bovenstaande features, kan je ook alerts instellen. Zo kan je op de hoogte gehouden worden van shows die er aan komen, en
      kan je een bericht krijgen als de wachttijd van een attractie laag is.
    </p>

    <div v-if="!$store.state.auth.user" class="text-center my-4">
      <p class="mb-2 opacity-60">Je moet ingelogd zijn om de planner te kunnen gebruiken, log hieronder in.</p>

      <NuxtLink
        :to="localePath('/user/login')"
        class="bg-indigo-800 hover:bg-indigo-900 dark:hover:bg-indigo-400 dark:bg-indigo-300 text-white block rounded py-2 text-center transition duration-100"
        exact-active-class="!opacity-100"
      >
        {{ $t('general.login') }}
      </NuxtLink>
    </div>

    <div v-else class="text-center my-4">
      <NuxtLink
        :to="localePath('/planner')"
        class="bg-indigo-800 hover:bg-indigo-900 dark:hover:bg-indigo-400 dark:bg-indigo-300 text-white block rounded py-2 text-center transition duration-100"
        exact-active-class="!opacity-100"
      >
        {{ $t('general.planner') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlannerInfo',
}
</script>
