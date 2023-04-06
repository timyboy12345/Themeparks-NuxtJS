<template>
  <div class="flex flex-col">
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <h1 class="text-lg text-indigo-800 font-bold mb-2">
      {{ $t('checkins.checkinsForDate', { date: date }) }}
    </h1>

    <div class="grid items-start lg:grid-cols-2 gap-4">
      <Card :title="$t('general.checkins')">
        <template #content>
          <checkin-list class="-mx-4" :max-checkins="-1" :date="date" />
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/Breadcrumbs'
import Card from '@/components/cards/Card'
import CheckinList from '@/views/CheckinList'
export default {
  name: 'CheckinsForDate',
  components: { CheckinList, Card, Breadcrumbs },
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
          url: '/user/checkins/days/',
        },
        {
          title: this.$route.params.year,
          url: `/user/checkins/${this.$route.params.year}/`,
        },
        {
          title: new Date(2000, this.$route.params.month, 10).toLocaleString('default', { month: 'long' }),
          url: `/user/checkins/${this.$route.params.year}/${this.$route.params.month}/`,
        },
        {
          title: this.$route.params.day,
          url: `#`,
        },
      ]
    },
    date() {
      return `${this.$route.params.year}-${this.$route.params.month}-${this.$route.params.day}`
    },
  },
}
</script>
