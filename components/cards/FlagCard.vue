<template>
  <card :link="link" :image-src="imageSrc" :content="content">
    <template #title>
      <div class="flex flex-row items-center">
        <div class="shrink-0 w-6 h-6 mr-2 bg-gray-300 rounded-full overflow-hidden">
          <img
            v-lazy-load
            alt="Flag depicting the country of this theme park"
            :data-src="flagUrl"
            class="w-full h-full object-center object-cover"
          />
        </div>
        <p v-if="title" class="break-words text-lg text-indigo-800 dark:text-indigo-500 font-bold">{{ title }}</p>
      </div>
    </template>

    <template v-for="(index, name) in $slots" #[name]>
      <slot :name="name" />
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
