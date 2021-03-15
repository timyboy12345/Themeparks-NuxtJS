<template>
  <div class="grid gap-4">
    <card
      title="All themeparks"
      sub-title="With Themeparks you can track waiting times across many theme parks in across the globe and see live wait times and recommendations."
      content="Click on the button below to see all available theme parks. "
    ></card>

    <card-button btn-link="/parks" btn-title="See all available theme parks" />

    <card title="Over Themeparks">
      <template #content>
        <h3 class="text-indigo-700 mt-4">Wachttijden van alle pretparken</h3>
        <p class="text-gray-800">
          Het doel is om uiteindelijk van veel pretparken ter wereld de wachttijden te tonen. Momenteel ligt de focus op parken in
          Nederland, de Benelux en Europa, maar parken uit andere regio's worden ook af en toe aangesloten.
        </p>

        <h3 class="text-indigo-700 mt-2">Waar komt de data vandaan?</h3>
        <p class="text-gray-800">
          De data is afkomstig van de officiële apps van de parken. De API's die hierbij worden gebruikt worden door ons uitgelezen om
          vervolgens hier te tonen.
        </p>
      </template>
    </card>
  </div>
</template>

<script lang="ts">
import Card from '~/components/cards/Card.vue'
import CardButton from '~/components/cards/actions/CardButton.vue'
export default {
  name: 'Index',
  components: { CardButton, Card },
  created() {
    // this.$store.commit('CHANGE_BREADCRUMBS', [])
  },
}
</script>
