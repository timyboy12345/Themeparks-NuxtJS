<template>
  <l-marker :lat-lng="[lat, lng]">
    <l-popup v-if="popup">
      <slot>{{ popup }}</slot>
    </l-popup>

    <l-icon
      v-if="icon === 'blue'"
      :icon-size="[25, 41]"
      :icon-anchor="[12, 41]"
      :popup-anchor="[1, -34]"
      :shadow-size="[41, 41]"
      icon-url="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png"
      shadow-url="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png"
    />

    <l-icon
      v-if="icon === 'red'"
      :icon-size="[25, 41]"
      :icon-anchor="[12, 41]"
      :popup-anchor="[1, -34]"
      :shadow-size="[41, 41]"
      icon-url="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png"
      shadow-url="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png"
    />

    <l-icon
      v-if="icon === 'yellow'"
      :icon-size="[25, 41]"
      :icon-anchor="[12, 41]"
      :popup-anchor="[1, -34]"
      :shadow-size="[41, 41]"
      icon-url="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png"
      shadow-url="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png"
    />

    <l-icon
      v-if="icon === 'orange'"
      :icon-size="[25, 41]"
      :icon-anchor="[12, 41]"
      :popup-anchor="[1, -34]"
      :shadow-size="[41, 41]"
      icon-url="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png"
      shadow-url="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png"
    />

    <l-icon
      v-if="icon === 'purple'"
      :icon-size="[25, 41]"
      :icon-anchor="[12, 41]"
      :popup-anchor="[1, -34]"
      :shadow-size="[41, 41]"
      icon-url="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png"
      shadow-url="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png"
    />
  </l-marker>
</template>

<script>
export default {
  name: 'MapMarker',
  props: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    popup: {
      type: String,
      required: false,
      default: null,
    },
    icon: {
      type: String,
      required: false,
      default: 'blue',
    },
  },
}
</script>

<style scoped></style>
