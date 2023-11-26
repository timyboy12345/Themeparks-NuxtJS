<template>
  <div class="flex flex-col">
    <label class="text-gray-600 text-sm mb-1" :for="id">{{ label }}</label>

    <slot name="input"></slot>

    <div class="text-sm text-gray-400 flex flex-col py-2 -mt-2">
      <slot name="bottom"></slot>
    </div>

    <div v-if="description" class="text-gray-600 text-sm">
      {{ description }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      required: true,
      type: String,
    },
    label: {
      required: true,
      type: String,
    },
    description: {
      required: false,
      type: String,
      default: null,
    },
  },
}
</script>
