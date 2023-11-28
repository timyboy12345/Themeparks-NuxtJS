<template>
  <CustomInput :id="id" :label="label" :description="description" class="flex flex-col">
    <template #input>
      <input
        :id="id"
        v-model="internalValue"
        :type="type"
        class="form-input border border-gray-300 rounded focus:outline-none focus:shadow-outline focus:border-indigo-300"
        :name="id"
        :placeholder="placeholder"
        @keypress.enter="$emit('keypress', $event)"
      />
    </template>

    <template v-if="minLength || maxLength" #bottom>
      {{ charLengthMessage }}
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
    type: {
      required: false,
      type: String,
      default: 'text',
      validator(value) {
        // The value must match one of these strings
        return ['text', 'number', 'email', 'password'].includes(value)
      },
    },
    value: {
      required: false,
      type: [String, Number],
      default: null,
    },
    minLength: {
      required: false,
      type: Number,
      default: null,
    },
    maxLength: {
      required: false,
      type: Number,
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
    charLengthMessage() {
      let m = `Karakters: ${this.value ? this.value.length : 0}, `

      if (this.minLength) {
        m += `Min: ${this.minLength}`
      }

      if (this.minLength) {
        m += ` / `
      }

      if (this.minLength) {
        m += `Max: ${this.maxLength}`
      }

      return m
    },
  },
}
</script>
