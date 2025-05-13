<template>
  <div class="flex flex-col gap-4">
    <div>
      <h1 class="text-2xl text-indigo-800 dark:text-indigo-300 font-bold">
        {{ $t('general.planner') }}
      </h1>
      <p class="opacity-60 dark:text-white">
        {{ $t('Plan je ideale dagje uit met onze handige pretpark planner') }}
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-4 text-justify">
      <div>
        <h2 class="text-indigo-800 dark:text-indigo-300">Handige Planner</h2>
        <p class="dark:text-gray-300">
          Plan je dagje uit met de ThemeparkPlanner pretpark planner. Houdt over de dag bij waar je naartoe wilt, welke shows er binnenkort
          aankomen, welke attracties en restaurants in de buurt zijn en waar je al bent geweest. Zo wordt jouw dagje pretpark super
          overzichtelijk!
        </p>
      </div>

      <div>
        <h2 class="text-indigo-800 dark:text-indigo-300">Afgestemd op jullie behoeften</h2>
        <p class="dark:text-gray-300">
          Door toestemming te geven om pushberichten te sturen en je locatie te krijgen is het mogelijk de dag af te stemmen op waar jij
          bent en wat je wilt doen. Krijg berichten als een attractie weer open gaat na een storing, de wachttijd erg laag is of
        </p>
      </div>
    </div>

    <div class="flex flex-row overflow-x-auto gap-4 lg:justify-center">
      <div
        v-for="(img, i) in plannerImages"
        :key="i"
        class="flex-shrink-0 flex flex-col text-center gap-y-1 dark:bg-gray-800 bg-gray-200 p-4 rounded"
      >
        <img v-lazy-load :data-src="img.img" class="max-w-64 object-contain w-full rounded overflow-hidden" />
        <div class="opacity-80 dark:text-white max-w-64 mx-auto text-sm">{{ img.title }}</div>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-4 text-center">
      <div v-for="(f, i) in plannerFeatures" :key="i" class="flex flex-col">
        <div class="rounded text-indigo-800 dark:text-indigo-300 text-lg">
          {{ f.title }}
        </div>

        <div class="opacity-60 dark:text-white">
          {{ f.content }}
        </div>
      </div>
    </div>

    <div v-if="!$store.state.auth.user" class="text-center dark:text-gray-300">
      <p class="mb-2 opacity-60">Je moet ingelogd zijn om de planner te kunnen gebruiken, log hieronder in.</p>

      <NuxtLink
        :to="localePath('/user/login')"
        class="bg-indigo-800 hover:bg-indigo-900 dark:hover:bg-indigo-400 dark:bg-indigo-300 text-white block rounded py-2 text-center transition duration-100"
        exact-active-class="!opacity-100"
      >
        {{ $t('Log in om de planner te openen') }}
      </NuxtLink>
    </div>

    <div v-else class="text-center">
      <NuxtLink
        :to="localePath('/planner')"
        class="bg-indigo-800 hover:bg-indigo-900 dark:hover:bg-indigo-400 dark:bg-indigo-300 text-white block rounded py-2 text-center transition duration-100"
        exact-active-class="!opacity-100"
      >
        {{ $t('Open de Planner') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlannerInfo',
  data() {
    return {
      plannerImages: [
        { img: '/planner/planner-home.png', title: 'Overzichtelijke homepagina' },
        {
          img: '/planner/planner-point-of-interest.png',
          title: 'Informatie van alle attracties, shows en restaurants',
        },
        { img: '/planner/planner-rides-restaurants-shows.png', title: 'Zoek snel naar jouw volgende attractie' },
      ],
      plannerFeatures: [
        {
          title: this.$t('Live Data'),
          content: this.$t('Ben altijd op de hoogte van de nieuwste wachttijden, showtijden en andere evenementen'),
        },
        {
          title: this.$t('Pushberichten'),
          content: this.$t('Krijg een pushbericht wanneer de wachttijd laag is, als een show bijna begint of als een attractie kapot gaat'),
        },
        {
          title: this.$t('Aanbevelingen'),
          content: this.$t('Laat weten wat je graag wilt zien en meemaken, en wij geven je een planning die je kan volgen'),
        },
      ],
    }
  },
}
</script>
