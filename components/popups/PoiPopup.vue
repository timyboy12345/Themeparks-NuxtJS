<template>
  <div class="absolute shadow w-full bottom-0 left-0 z-10">
    <div class="flex justify-end mx-4 mb-2">
      <div
        :class="{
          'bg-red-700 text-white': $store.state.planner.favorites.includes(poi.id),
          'bg-white text-indigo-800': !$store.state.planner.favorites.includes(poi.id),
        }"
        class="rounded-full p-2 transition duration-100 cursor-pointer hover:bg-indigo-800 active:bg-indigo-900 hover:text-white"
        @click="toggleFavorite"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </div>
    </div>

    <div class="bg-white rounded shadow m-4 divide-y divide-gray-200">
      <div class="p-4">
        <h1 class="text-indigo-800 text-lg font-bold">{{ poi.title }}</h1>
        <p v-if="poi.subTitle" class="opacity-60 text-sm">{{ poi.subTitle }}</p>
      </div>

      <div class="px-4 py-4">
        <img v-if="poi.image_url" v-lazy-load :data-src="poi.image_url" class="rounded w-full max-h-96 object-cover" />
      </div>

      <div v-if="poi.showTimes" class="py-2 px-4">
        {{ $tc('Show om | Shows om:', poi.showTimes.showTimes.length) }}
        {{ poi.showTimes.showTimes.map((s) => s.localFromTime).join(', ') }}
      </div>

      <article v-if="poi.description" class="max-h-40 overflow-auto text-sm py-2 px-4">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div
          v-if="park.supports.textType === 'MARKDOWN'"
          class="prose prose-sm max-w-none prose-a:text-indigo-700 prose-headings:mb-1 prose-headings:mt-2 hover:prose-a:no-underline"
          v-html="$md.render(poi.description)"
        ></div>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div
          v-else
          class="prose prose-sm max-w-none prose-a:text-indigo-700 prose-headings:mb-1 prose-headings:mt-2 hover:prose-a:no-underline"
          v-html="poi.description"
        ></div>
      </article>

      <MapComponent v-if="poi.location" class="my-2" :lng="poi.location.lng" :lat="poi.location.lat" :zoom="17">
        <MapMarker :lng="poi.location.lng" :lat="poi.location.lat" />
      </MapComponent>
    </div>
  </div>
</template>

<script>
import MapComponent from '~/components/maps/MapComponent.vue'
import MapMarker from '~/components/maps/MapMarker.vue'

export default {
  name: 'PoiPopup',
  components: { MapMarker, MapComponent },
  data() {
    return {}
  },
  computed: {
    poi() {
      return this.$store.getters['popup/getCurrentPopup'].poi
    },
    park() {
      return this.$store.getters['popup/getCurrentPopup'].park
    },
  },
  methods: {
    toggleFavorite() {
      this.$store.commit('planner/toggleFavorite', this.poi.id)
    },
  },
}
</script>
