<template>
  <div class="bg-white rounded shadow overflow-hidden" :class="[componentHeight]">
    <no-ssr>
      <l-map :no-wrap="true" :zoom="zoom" :center="[lat, lng]">
        <l-tile-layer :no-wrap="true" url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
        <slot></slot>
      </l-map>
    </no-ssr>
  </div>
</template>

<script>
export default {
  name: 'MapComponent',
  props: {
    zoom: {
      type: Number,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    componentHeight: {
      type: String,
      required: false,
      default: 'h-64',
    },
  },
}
</script>

<style scoped></style>
