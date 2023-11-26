<template>
  <CustomInput :id="id" :label="label" :description="description" class="flex flex-col">
    <template #input>
      <input
        :id="id"
        v-model="internalValue"
        type="text"
        class="border border-gray-300 rounded focus:outline-none focus:shadow-outline focus:border-indigo-300"
        :name="id"
        :placeholder="placeholder"
      />
    </template>
  </CustomInput>
</template>

<script>
import CustomInput from '~/components/form/CustomInput.vue'

export default {
  components: { CustomInput },
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
        const slug = value
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')

        this.$emit('input', slug)
      },
    },
  },
}
</script>
