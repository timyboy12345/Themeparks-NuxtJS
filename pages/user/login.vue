<template>
  <div class="grid items-start content-start justify-start lg:grid-cols-2 gap-4">
    <Card :title="$t('general.login')">
      <template #content>
        {{ $t('general.loginReason') }}
      </template>
    </Card>

    <Card :title="$t('general.login')">
      <template #content>
        <div v-if="error" class="text-red-800 dark:text-red-400 mb-2">Je gegevens waren incorrect. Probeer het opnieuw.</div>
        <form v-if="status === 'login'" class="flex flex-col gap-y-2" @submit.prevent="login">
          <CustomTextInput id="email" v-model="email" label="Email Adres" placeholder="Geldig Emailadres" @keypress.enter.self="login" />
          <CustomTextInput
            id="password"
            v-model="password"
            type="password"
            label="Wachtwoord"
            placeholder="Jouw Wachtwoord"
            @keypress.enter="login"
          />
          <button
            type="button"
            class="rounded bg-indigo-800 dark:bg-indigo-400 dark:hover:bg-indigo-500 hover:bg-indigo-900 transition-colors duration-100 text-white py-2 px-4 mt-4"
            @click="login"
          >
            {{ $t('general.login') }}
          </button>
        </form>
      </template>
    </Card>
  </div>
</template>

<script>
import Card from '@/components/cards/Card'
import CustomTextInput from '~/components/form/CustomTextInput.vue'

export default {
  components: { CustomTextInput, Card },
  data() {
    return {
      status: 'login',
      error: null,
      email: '',
      password: '',
    }
  },
  methods: {
    async login() {
      this.status = 'validating'

      await this.$axios
        .post('/auth/login', {
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          this.$store.commit('auth/setToken', response.data.access_token)
          this.status = 'loading'
        })
        .catch((exception) => {
          this.error = exception
          this.status = 'login'

          if (exception.response.status !== 401) {
            alert('Something went wrong on the server, try again tomorrow')
          }
        })

      await setTimeout(() => {}, 400)

      if (this.status === 'loading') {
        await this.fetchUser()
        this.status = 'login'
        this.password = ''
        this.error = null
        this.$router.push(this.localePath('/user/account'))
      }
    },
    fetchUser() {
      const userPromise = this.$axios
        .get('/auth/user')
        .then((response) => {
          this.$store.commit('auth/setUser', response.data)
        })
        .catch((exception) => {
          alert('Something went wrong while fetching user details')
          this.$sentry.captureException(exception)
        })

      const checkinsPromise = this.$axios
        .get('/checkins')
        .then((response) => {
          this.$store.commit('auth/setCheckins', response.data)
        })
        .catch((exception) => {
          alert('Something went wrong while fetching all checkins')
          this.$sentry.captureException(exception)
        })

      return Promise.all([userPromise, checkinsPromise])
    },
  },
}
</script>
