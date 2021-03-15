<template>
  <div class="grid gap-4">
    <card title="All Theme Parks" sub-title="See the list of available themeparks below"></card>

    <park-list />
  </div>
</template>

<script>
import Card from '@/components/cards/Card'
import ParkList from '../../views/ParkCardList'

export default {
  name: 'ParksIndex',
  components: { Card, ParkList },
  head: {
    title: 'All theme parks',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Take a look at all the theme parks we support.',
      },
    ],
  },
}
</script>
