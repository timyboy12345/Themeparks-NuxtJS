<template>
  <div class="grid gap-4">
    <card title="All Theme Parks" sub-title="See the list of available themeparks below"></card>

    <general-error v-if="error"></general-error>

    <park-list @fetch-error="catchError" />
  </div>
</template>

<script>
import Card from '@/components/cards/Card'
import GeneralError from '@/components/GeneralError'
import ParkList from '../../views/ParkCardList'

export default {
  name: 'ParksIndex',
  components: { GeneralError, Card, ParkList },
  data() {
    return {
      error: null,
    }
  },
  head: {
    title: 'All theme parks',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Here you will find all the different theme parks that we support.',
      },
    ],
  },
  methods: {
    catchError(e) {
      this.error = e
    },
  },
}
</script>
