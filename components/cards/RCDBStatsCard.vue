<template>
  <Card v-if="loaded" :title="$t('ride.stats.rcdbStatsTitle')" :sub-title="$t('ride.stats.rcdbStatsSubTitle')">
    <template #content>
      <div class="flex flex-col gap-y-2 mt-2">
        <div v-if="stats.height">
          <h3 class="font-bold text-indigo-700">{{ $t('ride.stats.heightTitle', [ride.title]) }}</h3>
          {{ $t('ride.stats.height', [stats.height, ride.title]) }}
        </div>

        <div v-if="stats.speed">
          <h3 class="font-bold text-indigo-700">{{ $t('ride.stats.speedTitle', [ride.title]) }}</h3>
          {{ $t('ride.stats.speed', [stats.speed, ride.title]) }}
        </div>

        <div v-if="stats.manufacturer">
          <h3 class="font-bold text-indigo-700">{{ $t('ride.stats.manufacturerTitle', [ride.title]) }}</h3>
          {{ $t('ride.stats.manufacturer', [stats.manufacturer, ride.title]) }}
        </div>

        <div v-if="stats.build_in">
          <h3 class="font-bold text-indigo-700">{{ $t('ride.stats.buildInTitle', [ride.title]) }}</h3>
          {{ $t('ride.stats.buildIn', [stats.build_in, ride.title]) }}
        </div>

        <a target="_blank" v-if="link" :href="link" class="text-sm underline text-indigo-700 hover:text-indigo-800">
          {{ $t('ride.stats.rcdbSeeMore', [link]) }}
        </a>
      </div>
    </template>
  </Card>

  <LoadingSpinner v-else/>
</template>

<script>
import Card from '@/components/cards/Card';
import LoadingSpinner from '~/components/LoadingSpinner';

export default {
  name: 'RCDBStatsCard',
  components: { LoadingSpinner, Card },
  props: {
    ride: {
      type: Object,
      required: true,
    },
    park: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      loaded: false,
      raw: null,
      link: null,
      stats: {
        height: null,
        length: null,
        manufacturer: null,
        capacity: null,
        model: null,
        type: null,
        speed: null,
        build_in: null,
      },
    };
  },
  fetch() {
    this.$rcdb.get('/api/coasters/search?q=' + this.ride.title)
      .then((response) => {
        if (response.data.coasters.length > 0) {
          const coaster = response.data.coasters[0];
          this.stats = {
            height: Array.isArray(coaster.stats.height) ? coaster.stats.height[0] : coaster.stats.height,
            length: Array.isArray(coaster.stats.length) ? coaster.stats.length[0] : coaster.stats.length,
            speed: Array.isArray(coaster.stats.speed) ? coaster.stats.speed[0] : coaster.stats.speed,
            capacity: coaster.stats.capacity,
            manufacturer: coaster.make,
            model: coaster.model,
            type: coaster.type,
            build_in: coaster.status?.date.opened.split('-')[0],
          };

          this.raw = coaster;
          this.link = `https://rcdb.com${coaster.link}`;
        }
      })
      .catch((exception) => {
        console.error(exception);
        this.$sentry.captureException(exception);
      })
      .then(() => {
        this.loaded = true;
      });
  },
};
</script>

<style scoped></style>
