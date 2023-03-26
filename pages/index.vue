<template>
  <div class="grid gap-4">
    <card :title="$t('home.title')" :sub-title="$t('home.subtitle')" :content="$t('home.action')"></card>

    <card-button btn-link="/parks" :btn-title="$t('home.actionButton')" />

    <card :title="$t('home.infoTitle')">
      <template #content>
        <h3 class="text-indigo-700 mt-4">{{ $t('home.infoWaitTimes') }}</h3>
        <p class="text-gray-800">{{ $t('home.infoWaitTimesContent') }}</p>

        <h3 class="text-indigo-700 mt-2">{{ $t('home.infoData') }}</h3>
        <p class="text-gray-800">
          {{ $t('home.infoDataContent') }}
        </p>

        <h3 class="text-indigo-700 mt-2">{{ $t('home.apiInfo') }}</h3>
        <p class="text-gray-800">
          {{ $t('home.apiInfoContent') }}
        </p>
      </template>
    </card>

    <AdCard />
  </div>
</template>

<script lang="ts">
import Card from '~/components/cards/Card.vue'
import CardButton from '~/components/cards/actions/CardButton.vue'
import AdCard from '~/components/cards/AdCard.vue'
export default {
  name: 'Index',
  components: { AdCard, CardButton, Card },
  created() {
    // this.$store.commit('CHANGE_BREADCRUMBS', [])
  },
}
</script>
