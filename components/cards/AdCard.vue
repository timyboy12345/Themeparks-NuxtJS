<template>
  <card v-if="!$store.state.auth.authToken" :subtitle="$t('general.ad')">
    <template #content>
      <div class="relative" :class="`${height}`">
        <adsbygoogle ad-slot="9200028200" />
      </div>
    </template>
  </card>
</template>

<script>
import Card from '~/components/cards/Card'

export default {
  name: 'AdCard',
  components: { Card },
  props: {
    height: {
      type: String,
      default: 'h-64',
      required: false,
    },
  },
}
</script>
