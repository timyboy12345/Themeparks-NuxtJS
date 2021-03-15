<template>
  <div>
    <div v-if="parks" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <flag-card
        v-for="park of parks"
        :key="park.id"
        :link="'/parks/' + park.id"
        :title="park.name"
        :content="park.description"
        :country-code="park.countryCode"
      ></flag-card>
    </div>
  </div>
</template>

<script>
import FlagCard from '~/components/cards/FlagCard.vue'

export default {
  name: 'ParkCardList',
  components: { FlagCard },
  data() {
    return {
      parks: [],
    }
  },
  async fetch() {
    this.parks = await this.$axios.get('/parks').then((parks) => {
      return parks.data
    })
  },
}
</script>
