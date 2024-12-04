<template>
  <card h1 :title="park.name" :sub-title="park.countryCode" :image-src="park.image" :link="link">
    <template #content>
      <p class="mt-4">
        {{ park.description }}
      </p>

      <div v-if="tickets" class="-mx-4 mt-4 flex flex-col divide-y divide-gray-200 dark:bg-gray-700">
        <div v-for="ticket of tickets" :key="ticket.id" class="py-2 px-4 text-gray-600">
          Koop jouw tickets via
          <a :href="ticket.url" target="_blank" class="underline hover:no-underline text-indigo-800 dark:text-indigo-300">
            {{ ticket.preview_url }}
          </a>
        </div>
      </div>
    </template>
  </card>
</template>

<script>
import Card from '@/components/cards/Card'

export default {
  name: 'ParkCard',
  components: { Card },
  props: {
    park: {
      type: Object,
      required: true,
    },
    usesLink: {
      type: Boolean,
      default: true,
    },
    tickets: {
      type: Array,
      required: false,
      default: null,
    },
  },
  computed: {
    link() {
      return this.usesLink ? '/parks/' + this.park.id : null
    },
  },
}
</script>

<style scoped></style>
