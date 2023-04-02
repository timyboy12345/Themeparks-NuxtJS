<template>
  <div class="flex flex-col">
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <h1 class="text-lg text-indigo-800 font-bold mb-2">
      {{ $t('checkins.checkinsByDayTitle') }}
    </h1>

    <div class="grid items-start lg:grid-cols-2 gap-4">
      <Card :title="$t('checkins.allCheckedInDays')">
        <template #content>
          <checkin-days-list class="-mx-4" :max-days="-1"></checkin-days-list>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import Card from '@/components/cards/Card'
import Breadcrumbs from '@/components/Breadcrumbs'
import CheckinDaysList from '@/views/CheckinDaysList'

export default {
  components: { CheckinDaysList, Breadcrumbs, Card },
  computed: {
    breadcrumbs() {
      return [
        {
          title: this.$t('general.account'),
          url: '/user/account/',
        },
        {
          title: this.$t('general.checkins'),
          url: '/user/checkins/',
        },
        {
          title: this.$t('checkins.checkinsByDayTitle'),
          url: '#',
        },
      ]
    },
  },
  methods: {},
}
</script>
