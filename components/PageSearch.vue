<template>
  <div class="-mx-4 md:-mx-8 -mt-4 lg:-mt-8">
    <div
      class="bg-gray-300 dark:bg-gray-800 text-gray-800 flex flex-row py-2 whitespace-no-wrap overflow-x-auto text-sm md:text-base lg:absolute min-w-full lg:left-0 lg:px-8 mb-4 lg:mb-8"
    >
      <div class="flex w-full flex-col lg:flex-row lg:items-center ml-4 lg:ml-0">
        <div class="flex flex-row items-center">
          <label for="page-search" class="text-sm dark:text-gray-500 mr-2">{{ $t('general.search') }}</label>
          <input
            id="page-search"
            v-model="internalValue"
            name="page-search"
            type="text"
            class="form-input rounded py-1 px-2 bg-transparent border-gray-400 dark:text-gray-300"
            :placeholder="$t('general.enterSearchTerm')"
          />
        </div>

        <div v-if="countries" class="mt-2 lg:mt-0 lg:ml-4 flex items-center gap-x-2">
          <div
            v-for="c of countries"
            :key="c"
            class="rounded-full cursor-pointer w-6 h-6 bg-gray-500 overflow-hidden"
            :class="{ 'opacity-25': country && country !== c }"
            @click="selectCountry(c)"
          >
            <img
              v-lazy-load
              :alt="`Flag of ${c}`"
              :data-src="`https://flagcdn.com/${c}.svg`"
              class="w-full h-full object-center object-cover"
            />
          </div>
        </div>

        <div v-if="parks" class="flex flex-row items-center mt-2 lg:mt-0 lg:ml-4">
          <label for="page-search-park" class="text-sm mr-2">{{ $t('general.park') }}</label>

          <select
            id="page-search-park"
            name="page-search-park"
            class="form-select rounded py-1 px-2 bg-transparent border-gray-400"
            :value="park"
            @change="selectPark"
          >
            <option value="">-</option>
            <option v-for="p of parks" :key="p.id" :value="p.id">
              {{ p.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="hidden lg:block lg:h-14"></div>
  </div>
</template>

<script>
export default {
  name: 'PageSearch',
  props: {
    value: {
      type: String,
      required: false,
      default: null,
    },
    country: {
      type: String,
      required: false,
      default: null,
    },
    countries: {
      type: Array,
      required: false,
      default: null,
    },
    park: {
      type: String,
      required: false,
      default: null,
    },
    parks: {
      type: Array,
      required: false,
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
  methods: {
    selectCountry(countryCode) {
      if (countryCode === this.country) {
        this.$emit('selectCountry', null)
        return
      }

      this.$emit('selectCountry', countryCode)
    },
    selectPark(elem) {
      if (elem.target.value === null || elem.target.value === '') {
        this.$emit('selectPark', null)
        return
      }

      this.$emit('selectPark', elem.target.value)
    },
  },
}
</script>

<style scoped></style>
