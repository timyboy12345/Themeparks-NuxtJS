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

export const getters = {
  individualDays(state) {
    const arrayUniqueByKey = [...new Map(state.checkins.map((ci) => [ci.dateTime.substr(0, 10), ci])).values()]

    return arrayUniqueByKey.map((day) => {
      return {
        ...day,
        year: day.dateTime.substr(0, 4),
        month: day.dateTime.substr(5, 2),
        day: day.dateTime.substr(8, 2),
      }
    })
  },
}
