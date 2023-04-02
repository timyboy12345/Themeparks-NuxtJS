<template>
  <div class="flex flex-col">
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <h1 class="text-lg text-indigo-800 font-bold mb-2">
      {{ $t('general.checkins') }}
    </h1>

    <div class="grid items-start lg:grid-cols-2 gap-4">
      <Card :title="$t('general.checkins')">
        <template #content>
          <checkin-list class="-mx-4" :max-checkins="-1"></checkin-list>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import Card from '@/components/cards/Card'
import CheckinList from '@/views/CheckinList'
import Breadcrumbs from '@/components/Breadcrumbs'

export default {
  name: 'CheckinsIndex',
  components: { Breadcrumbs, CheckinList, Card },
  computed: {
    breadcrumbs() {
      return [
        {
          title: this.$t('general.account'),
          url: '/user/account/',
        },
        {
          title: this.$t('general.checkins'),
          url: '#',
        },
      ]
    },
  },
  methods: {},
}
</script>
