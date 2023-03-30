<template>
  <div class="flex flex-col">
    <label class="text-gray-600 text-sm mb-1" :for="id">{{ label }}</label>
    <input
      :id="id"
      v-model="internalValue"
      :type="type"
      class="border border-gray-300 rounded focus:outline-none focus:shadow-outline focus:border-indigo-300"
      :name="id"
      :placeholder="placeholder"
    />

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
    placeholder: {
      required: false,
      type: String,
      default: null,
    },
    type: {
      required: false,
      type: String,
      default: 'text',
    },
    value: {
      required: false,
      type: [String, Number],
      default: null,
    },
  },
  computed: {
    internalValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
}
</script>
