<template>
  <component
    :is="componentType"
    class="bg-white rounded shadow overflow-hidden transition duration-100 relative"
    :class="{ 'hover:bg-gray-100 cursor-pointer hover:shadow-lg': link }"
    :to="localizedLink"
  >
    <img v-if="imageSrc" v-lazy-load :data-src="imageSrc" class="-z-1 w-full min-h-78 h-full object-center object-cover" />

    <div class="w-full flex flex-col bottom-0 absolute">
      <div class="p-4 m-4 rounded z-5 bg-white rounded">
        <h1 v-if="title" class="text-xl text-indigo-800 font-bold">{{ title }}</h1>
        <p v-if="subtitle" class="text-sm text-gray-600 -mt-1">{{ subtitle }}</p>

        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-if="description" class="mt-2 text-gray-800" v-html="description"></p>

        <slot name="content"></slot>

        <slot class="mt-auto" name="buttons" />
      </div>
    </div>
  </component>
</template>

<script>
export default {
  name: 'ImageCard',
  props: {
    title: {
      required: true,
      type: String,
    },
    subtitle: {
      required: false,
      type: String,
      default: null,
    },
    description: {
      required: false,
      type: String,
      default: null,
    },
    imageSrc: {
      required: false,
      type: String,
      default: null,
    },
    link: {
      required: false,
      type: String,
      default: null,
    },
  },
  computed: {
    componentType() {
      return this.link ? 'NuxtLink' : 'div'
    },
    localizedLink() {
      return this.link ? this.localePath(this.link) : null
    },
  },
}
</script>

<style scoped></style>
