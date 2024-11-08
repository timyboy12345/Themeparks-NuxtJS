<template>
  <div class="flex flex-col">
    <h1 class="text-lg text-indigo-800 dark:text-indigo-300 font-bold mb-2">
      {{ $t('general.account') }}
    </h1>

    <div class="grid items-start lg:grid-cols-2 gap-4">
      <Card :title="$t('general.userData')">
        <template #content>
          <div v-if="$store.state.auth.user">
            <ul class="list-disc ml-4 my-4">
              <li>Email: {{ $store.state.auth.user.email }}</li>
              <li>Username: {{ $store.state.auth.user.userName }}</li>
              <li>Name: {{ $store.state.auth.user.firstName }} {{ $store.state.auth.user.lastName }}</li>
            </ul>
          </div>

          <LoadingSpinner v-else class="my-4" />

          <button
            type="button"
            class="rounded text-white bg-red-700 hover:bg-red-800 transition-colors duration-100 py-1 px-2"
            @click="logout"
          >
            {{ $t('general.logout') }}
          </button>
        </template>
      </Card>

      <Card :title="$t('checkins.checkedInDaysTitle')" :sub-title="$t('checkins.checkedInDaysSubtitle')">
        <template #content>
          <checkin-days-list class="-mx-4" :max-days="5"></checkin-days-list>
        </template>

        <template #buttons>
          <card-actions>
            <card-button btn-link="/user/checkins/days/" :btn-title="$t('checkins.allCheckedInDays')" />
          </card-actions>
        </template>
      </Card>

      <Card :title="$t('checkins.checkinsTitle')" :sub-title="$t('checkins.checkinsSubtitle')">
        <template #content>
          <checkin-list class="-mx-4" :max-checkins="5"></checkin-list>
        </template>

        <template #buttons>
          <card-actions>
            <card-button btn-link="/user/checkins/" :btn-title="$t('checkins.allCheckins')" />
          </card-actions>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import Card from '@/components/cards/Card'
import LoadingSpinner from '@/components/LoadingSpinner'
import CheckinList from '@/views/CheckinList'
import CardActions from '@/components/cards/actions/CardActions'
import CardButton from '@/components/cards/actions/CardButton'
import CheckinDaysList from '@/views/CheckinDaysList'

export default {
  name: 'Account',
  components: { CheckinDaysList, CardButton, CardActions, CheckinList, LoadingSpinner, Card },
  methods: {
    logout() {
      this.$store.commit('auth/setToken', null)
      this.$store.commit('auth/setUser', null)
      this.$store.commit('auth/setCheckins', null)

      this.$router.push(this.localePath('/user/login'))
    },
  },
}
</script>
