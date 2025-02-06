<template>
  <component
    :is="componentType"
    class="bg-white rounded shadow overflow-hidden transition duration-100 relative"
    :class="{ 'hover:bg-gray-100 cursor-pointer hover:shadow-lg': link }"
    :to="localizedLink"
    :target="target"
  >
    <img
      v-if="imageSrc"
      v-lazy-load
      :class="{ 'min-h-78': size === 'md', 'min-h-60': size === 'sm' }"
      :data-src="imageSrc"
      class="-z-1 w-full h-full object-center object-cover"
    />

    <div class="w-full flex flex-col bottom-0 absolute">
      <div class="p-4 m-4 z-5 bg-white rounded">
        <component
          :is="h1 ? 'h1' : 'h2'"
          v-if="title"
          :class="{ 'text-xl': size === 'md', 'text-md leading-[1.3]': size === 'sm' }"
          class="text-indigo-800 font-bold"
          >{{ title }}</component
        >
        <p v-if="subtitle" class="text-sm text-gray-600 -mt-1">{{ subtitle }}</p>

        <!-- eslint-disable-next-line vue/no-v-html -->
        <p
          v-if="description"
          :class="{ 'mt-2': size === 'md', 'mt-1 text-sm': size === 'sm' }"
          class="text-gray-800"
          v-html="safeDescription"
        ></p>

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
    size: {
      required: false,
      type: String,
      default: 'md',
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
    h1: {
      required: false,
      type: Boolean,
      default: false,
    },
    target: {
      type: String,
      required: false,
      default: '_self',
      validator(value) {
        return ['_self', '_blank'].includes(value)
      },
    },
  },
  computed: {
    componentType() {
      return this.link ? 'NuxtLink' : 'div'
    },
    localizedLink() {
      return this.link ? this.localePath(this.link) : null
    },
    safeDescription() {
      const str = this.description.replace(/<\/?[^>]+(>|$)/g, '')

      const ending = '...'
      const lim = 120
      if (str.length <= lim) return str

      const lastSpace = str.slice(0, lim - ending.length + 1).lastIndexOf(' ')
      return str.slice(0, lastSpace > 0 ? lastSpace : lim - ending.length) + ending
    },
  },
}
</script>

<style scoped></style>
