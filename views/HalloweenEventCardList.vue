<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <halloween-event-card
      v-for="halloweenEvent of halloweenEvents"
      :key="halloweenEvent.id"
      :park="park"
      :halloween-event="halloweenEvent"
      :show-more="true"
    ></halloween-event-card>

    <AdCard class="md:col-span-2" />
  </div>
</template>

<script>
import AdCard from '@/components/cards/AdCard'
import HalloweenEventCard from '@/components/cards/HalloweenEventCard.vue'

export default {
  components: { HalloweenEventCard, AdCard },
  props: {
    halloweenEvents: {
      type: Array,
      required: true,
    },
    park: {
      type: Object,
      required: false,
      default: null,
    },
  },
}
</script>
