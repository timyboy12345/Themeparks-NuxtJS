<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <animal-card v-for="animal of animals" :key="animal.id" :park="park" :animal="animal" :show-more="true"></animal-card>
  </div>
</template>

<script>
import AnimalCard from '@/components/cards/AnimalCard'

export default {
  components: { AnimalCard },
  props: {
    animals: {
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
