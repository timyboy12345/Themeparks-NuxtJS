<template>
  <div class="grid gap-4">
    <page-search v-model="query" :countries="countries" :country="queriedCountry" @selectCountry="handleSelectCountry" />

    <card :title="$t('general.allThemeParks')" :sub-title="$t('parks.subTitle')">
      <template #content>
        <div class="block pt-2">
          <router-link class="underline" :to="localePath('/parks/map/')">{{ $t('parks.content') }}</router-link>
        </div>
      </template>
    </card>

    <general-error v-if="error"></general-error>

    <park-list :queried-country="queriedCountry" :query="query" @fetch-error="catchError" />

    <card :title="$t('park.bottomSeoBlockTitle')" :content="$t('park.bottomSeoBlockContent')"></card>
  </div>
</template>

<script>
import Card from '@/components/cards/Card'
import GeneralError from '@/components/GeneralError'
import PageSearch from '@/components/PageSearch'
import ParkList from '../../views/ParkCardList'

export default {
  name: 'ParksIndex',
  components: { PageSearch, GeneralError, Card, ParkList },
  data() {
    return {
      error: null,
      query: '',
      queriedCountry: null,
      countries: ['us', 'nl', 'be', 'de', 'gb', 'es', 'fr', 'se', 'dk', 'pl'],
    }
  },
  head() {
    return {
      title: this.$t('parks.seoTitle'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Here you will find all the different theme parks that we support',
        },
      ],
    }
  },
  methods: {
    catchError(e) {
      this.error = e
    },
    handleSelectCountry(newCountry) {
      this.queriedCountry = newCountry
    },
  },
}
</script>
