<template>
  <div class="grid items-start content-start justify-start lg:grid-cols-2 gap-4">
    <Card :title="$t('general.login')">
      <template #content>
        {{ $t('general.loginReason') }}
      </template>
    </Card>

    <Card :title="$t('general.login')">
      <template #content>
        <div v-if="error" class="text-red-800">Je gegevens waren incorrect. Probeer het opnieuw.</div>
        <form v-if="status === 'login'" class="flex flex-col gap-y-2" @submit.prevent="login">
          <CustomInput id="email" v-model="email" label="Email Adres" placeholder="Geldig Emailadres" />
          <CustomInput id="password" v-model="password" type="password" label="Wachtwoord" placeholder="Jouw Wachtwoord" />
          <button
            type="button"
            class="rounded bg-indigo-800 hover:bg-indigo-900 transition-colors duration-100 text-white py-2 px-4 mt-4"
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
import CustomInput from '@/components/form/CustomInput'
import Card from '@/components/cards/Card'

export default {
  components: { Card, CustomInput },
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
          alert('Something went wrong')
          this.error = exception
          this.status = 'login'
        })

      if (this.status === 'loading') {
        await this.fetchUser()
        this.$router.push(this.localePath('/user/account'))
      }
    },
    fetchUser() {
      const userPromise = this.$axios
        .get('/auth/account')
        .then((response) => {
          this.$store.commit('auth/setCheckins', response.data)
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
