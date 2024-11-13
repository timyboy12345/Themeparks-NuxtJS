<template>
  <div>
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>

    <loading-spinner v-if="$fetchState.pending" class="mt-8"></loading-spinner>
    <p v-else-if="$fetchState.error">
      <general-error title="Park not found" sub-title="This park could not be found" />
    </p>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <park-card :park="park" :uses-link="false"></park-card>

      <card v-if="park && park.supports.supportsRides" :title="$t('general.rides')" :sub-title="$t('park.allRidesSubtitle')">
        <template #content>
          <ride-list class="-mx-4" :max-rides="5" :park-id="parkId"></ride-list>
        </template>

        <template #buttons>
          <card-actions>
            <card-button :btn-link="ridesButtonLink" :btn-title="$t('park.allRides')" />
            <card-button
              v-if="park && park.supports.supportsPoiLocations"
              :btn-link="mapButtonLink"
              :btn-title="$t('park.showRidesOnMap')"
              thin
            />
          </card-actions>
        </template>
      </card>

      <card
        v-if="park && park.supports.supportsRestaurants"
        :title="$t('general.restaurants')"
        :sub-title="$t('park.allRestaurantsSubtitle')"
      >
        <template #content>
          <restaurant-list class="-mx-4" :max-restaurants="5" :park-id="parkId"></restaurant-list>
        </template>

        <template #buttons>
          <card-actions>
            <card-button :btn-link="restaurantsButtonLink" :btn-title="$t('park.allRestaurants')" />
            <card-button
              v-if="park && park.supports.supportsPoiLocations"
              :btn-link="mapButtonLink"
              :btn-title="$t('park.showRestaurantsOnMap')"
              thin
            />
          </card-actions>
        </template>
      </card>

      <card v-if="park && park.supports.supportsShows" :title="$t('general.shows')" :sub-title="$t('park.allShowsSubtitle')">
        <template #content>
          <show-list class="-mx-4" :max-shows="5" :park-id="parkId"></show-list>
        </template>

        <template #buttons>
          <card-actions>
            <card-button :btn-link="'/parks/' + parkId + '/shows'" :btn-title="$t('park.allShows')" />
            <card-button
              v-if="park && park.supports.supportsPoiLocations"
              :btn-link="mapButtonLink"
              :btn-title="$t('park.showShowsOnMap')"
              thin
            />
          </card-actions>
        </template>
      </card>

      <card v-if="park && park.supports.supportsAnimals" :title="$t('general.animals')" :sub-title="$t('park.allAnimalsSubtitle')">
        <template #content>
          <animal-list class="-mx-4" :max-animals="5" :park-id="parkId"></animal-list>
        </template>

        <template #buttons>
          <card-actions>
            <card-button :btn-link="'/parks/' + parkId + '/animals'" :btn-title="$t('park.allAnimals')" />
            <card-button v-if="park && park.supports.supportsPoiLocations" :btn-link="mapButtonLink" :btn-title="$t('park.showMap')" thin />
          </card-actions>
        </template>
      </card>

      <card v-if="park && park.supports.supportsEvents" :title="$t('general.events')" :sub-title="$t('park.allEventsSubtitle')">
        <template #content>
          <event-list class="-mx-4" :max-events="5" :park-id="parkId" />
        </template>

        <template #buttons>
          <card-actions>
            <card-button :btn-link="'/parks/' + parkId + '/events'" :btn-title="$t('park.allEvents')" />
          </card-actions>
        </template>
      </card>

      <card
        v-if="park && park.supports.supportsOpeningTimes"
        :title="$t('general.openingHours')"
        :sub-title="$t('park.openingHoursSubtitle')"
      >
        <template #content>
          <opening-hours-list class="-mx-4" :max-opening-hours="7" :park-id="parkId"></opening-hours-list>
        </template>
      </card>

      <ClientOnly>
        <card v-if="park && park.location" :title="$t('general.weather')">
          <template #content>
            <weather-list class="-mx-4" :lat="park.location.lat" :lng="park.location.lng" />
          </template>
        </card>
      </ClientOnly>

      <AdCard v-if="park" />

      <card v-if="park && blogPosts && blogPosts.length > 0" :title="$t('general.blog')" :sub-title="$t('park.allBlogPostsSubtitle')">
        <template #content>
          <blog-post-list class="-mx-4" :blog-posts="blogPosts"></blog-post-list>
        </template>

        <template #buttons>
          <card-actions>
            <card-button :btn-link="'/blog?park=' + parkId" :btn-title="$t('park.allBlogPosts')" />
          </card-actions>
        </template>
      </card>

      <div
        v-if="park && park.supports.supportsRideWaitTimesHistory"
        class="py-2 px-4 bg-yellow-200 relative text-yellow-900 shadow-sm self-start rounded"
      >
        <div class="absolute rounded-l bg-yellow-600 left-0 top-0 h-full w-1"></div>
        <div class="flex flex-col">
          <h4 class="text-yellow-900 capitalize font-bold">{{ $t('statistics.goToTitle') }}</h4>
          <p class="text-sm text-yellow-800">{{ $t('statistics.goToDescription') }}</p>
          <router-link class="underline text-sm mt-2 text-yellow-600" :to="localePath('/parks/' + parkId + '/stats/')">
            {{ $t('statistics.goToLink') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ParkCard from '../../../components/cards/ParkCard'
import Card from '../../../components/cards/Card'
import CardButton from '../../../components/cards/actions/CardButton'
import CardActions from '@/components/cards/actions/CardActions'
import RestaurantList from '@/views/RestaurantList'
import Breadcrumbs from '@/components/Breadcrumbs'
import RideList from '@/views/RideList'
import LoadingSpinner from '@/components/LoadingSpinner'
import ShowList from '@/views/ShowList'
import AnimalList from '@/views/AnimalList'
import AdCard from '@/components/cards/AdCard'
import OpeningHoursList from '~/views/OpeningHoursList'
import BlogPostList from '~/views/BlogPostList.vue'
import EventList from '~/views/EventList.vue'
import GeneralError from '~/components/GeneralError.vue'
import WeatherList from '~/views/WeatherList.vue'

export default {
  components: {
    WeatherList,
    GeneralError,
    EventList,
    BlogPostList,
    OpeningHoursList,
    AdCard,
    AnimalList,
    ShowList,
    LoadingSpinner,
    RideList,
    Breadcrumbs,
    RestaurantList,
    CardActions,
    CardButton,
    Card,
    ParkCard,
  },
  data() {
    return {
      parkId: this.$route.params.id,
      park: null,
      openingTimes: null,
      blogPosts: null,
    }
  },
  async fetch() {
    await this.$axios
      .get('/parks/' + this.parkId)
      .then((park) => {
        this.park = park.data
      })
      .catch((e) => {
        throw e
      })
  },
  head() {
    const title = this.park ? this.park.name : undefined
    let description = 'See rides, restaurants, shows, shops and more from'

    if (this.park) {
      if (this.park.description) {
        description = this.park.description
      } else {
        description += this.park.name
      }
    } else {
      description += ' this theme park.'
    }

    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
      ],
    }
  },
  computed: {
    ridesButtonLink() {
      return `/parks/${this.parkId}/rides`
    },
    mapButtonLink() {
      return `/parks/${this.parkId}/map`
    },
    restaurantsButtonLink() {
      return `/parks/${this.parkId}/restaurants`
    },
    breadcrumbs() {
      if (!this.park) {
        return []
      }

      return [
        {
          title: this.$t('general.parks'),
          url: '/parks',
        },
        {
          title: this.park.name,
          url: '#',
        },
      ]
    },
  },
  async created() {
    const isoLocale = this.$i18n.locales.find((l) => l.code === this.$i18n.getLocaleCookie()).iso

    await this.$axios
      .get(
        `https://data.arendz.nl/items/tp_blogpost?filter[park_id][_eq]=${this.parkId}&deep[translations][_filter][languages_code][_eq]=${isoLocale}&fields=*,translations.*,header.*,user_created.*&limit=3&sort=-date_updated`
      )
      .then((blogPosts) => {
        this.blogPosts = blogPosts.data.data.filter((p) => p.translations.length > 0)
      })
      .catch((reason) => {
        this.$emit('fetchError', reason)
        this.$sentry.captureException(reason)
        throw reason
      })
  },
}
</script>
