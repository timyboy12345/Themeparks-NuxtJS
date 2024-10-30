<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <event-card v-for="event of events" :key="event.id" :park="park" :event="event" :show-more="true"></event-card>

    <AdCard class="md:col-span-2" />
  </div>
</template>

<script>
import AdCard from '@/components/cards/AdCard'
import EventCard from '@/components/cards/EventCard.vue'

export default {
  components: { EventCard, AdCard },
  props: {
    events: {
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
