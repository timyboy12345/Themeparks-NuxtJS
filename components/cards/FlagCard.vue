<template>
  <card :link="link" :image-src="imageSrc" :content="content">
    <template #title>
      <div class="flex flex-row items-center">
        <div class="w-6 h-6 mr-2 bg-gray-300 rounded-full overflow-hidden">
          <img :src="flagUrl" class="w-full h-full object-center object-cover" />
        </div>
        <h1 v-if="title" class="text-lg text-indigo-800 font-bold">{{ title }}</h1>
      </div>
    </template>
  </card>
</template>

<script>
import Card from '@/components/cards/Card'
export default {
  name: 'FlagCard',
  components: { Card },
  props: {
    title: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
      default: 'nl',
    },
    link: {
      type: String,
      required: false,
      default: null,
    },
    imageSrc: {
      type: String,
      required: false,
      default: null,
    },
    content: {
      type: String,
      required: false,
      default: null,
    },
  },
  computed: {
    flagUrl() {
      return `https://flagcdn.com/${this.countryCode}.svg`
    },
  },
}
</script>

<style scoped></style>
