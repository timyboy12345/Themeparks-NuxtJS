<template>
  <component
    :is="componentType"
    :target="target"
    class="bg-white dark:bg-gray-700 rounded shadow overflow-hidden transition duration-100 d-flex flex-col relative"
    :class="{ 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer': link }"
    :to="localizedLink"
  >
    <img v-if="imageSrc" :alt="imageAlt" :src="imageSrc" class="w-full h-32 object-center object-cover" />

    <div class="p-4 h-full">
      <div class="flex flex-col justify-between h-full">
        <div class="text-gray-800 dark:text-gray-300">
          <slot name="title">
            <compontent :is="h1 ? 'h1' : 'h2'" v-if="title" class="text-lg text-indigo-800 dark:text-indigo-300 font-bold"
              >{{ title }}
            </compontent>
            <p v-if="subtitle" class="text-sm text-gray-600 dark:text-gray-400">{{ subtitle }}</p>
          </slot>

          <slot name="content">
            <p v-if="content" class="mt-4">{{ content }}</p>
          </slot>
        </div>

        <slot name="buttons" />
      </div>
    </div>
  </component>
</template>

<script>
export default {
  name: 'Card',
  props: {
    title: {
      required: false,
      type: String,
      default: null,
    },
    subtitle: {
      required: false,
      type: String,
      default: null,
    },
    content: {
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
    imageAlt: {
      required: false,
      type: String,
      default: 'Image',
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
  },
}
</script>

<style scoped></style>
