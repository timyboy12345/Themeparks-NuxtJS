<template>
  <CustomInput :id="id" :label="label" :description="description" class="flex flex-col">
    <template #input>
      <select
        :id="id"
        v-model="internalValue"
        class="form-select border border-gray-300 rounded focus:outline-none focus:shadow-outline focus:border-indigo-300 dark:text-gray-300"
        :name="id"
        :placeholder="placeholder"
        :disabled="typeof options === undefined"
      >
        <option value="" :disabled="required">Maak een keuze</option>
        <option v-for="option of options" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
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
    options: {
      required: false,
      default() {
        return []
      },
      type: Array,
    },
    value: {
      required: false,
      type: [String, Number],
      default: null,
    },
    required: {
      required: false,
      type: Boolean,
      default: false,
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
