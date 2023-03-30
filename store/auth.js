export const state = () => ({
  user: null,
  authToken: null,
  checkins: null,
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setCheckins(state, checkins) {
    state.checkins = checkins
  },
  setToken(state, token) {
    if (token) {
      localStorage.setItem('jwt_token', token)
    } else {
      localStorage.removeItem('jwt_token')
    }

    state.authToken = token
  },
}
