export const state = (): {
  parkId: string | null
  park: any
  openingTimes: null | any[]
  location: null | { lat: number; lng: number }
  locationStatus: 'unknown' | 'denied' | 'accepted'
  pois: any[] | null
  initialized: boolean
  favorites: string[]
  pushMessages: null | any[]
} => ({
  parkId: null,
  park: null,
  pois: null,
  openingTimes: null,
  location: null,
  locationStatus: 'unknown',
  initialized: false,
  favorites: [],
  pushMessages: null,
})

export const mutations = {
  setPark(state: any, park: any) {
    if (park) {
      state.park = park
      state.parkId = park.id
      localStorage.setItem('planner_park_id', park.id)
    } else {
      state.park = null
      state.parkId = null
      localStorage.removeItem('planner_park_id')
    }
  },
  setPois(state: any, pois: any[]) {
    state.pois = pois
  },
  setParkId(state: any, parkId: string) {
    state.parkId = parkId
    localStorage.setItem('planner_park_id', parkId)
  },
  setLocationStatus(state: any, status: 'denied' | 'accepted' | 'unknown') {
    state.locationStatus = status
  },
  setLocation(state: any, location: any) {
    state.location = location
  },
  setInitialized(state: any, initialized: boolean) {
    state.initialized = initialized
  },
  toggleFavorite(state: any, id: string) {
    if (state.favorites.includes(id)) {
      state.favorites = state.favorites.filter((d: string) => d !== id)
    } else {
      state.favorites.push(id)
    }

    localStorage.setItem('planner_favorites', JSON.stringify(state.favorites))
  },
  setFavorites(state: any, ids: string[]) {
    state.favorites = ids

    // localStorage.setItem('planner_favorites', JSON.stringify(state.favorites))
  },
  removeFavorite(state: any, id: string) {
    state.favorites = state.favorites.filter((d: string) => d !== id)
  },
  resetFavorites(state: any) {
    state.favorites = []
  },
  addPushMessage(state: any, message: any) {
    state.pushMessages.push(message)
  },
  removePushMessage(state: any, id: any) {
    state.pushMessages = state.pushMessages.filter((pm: any) => pm.id !== id)
  },
  setPushMessages(state: any, messages: any) {
    state.pushMessages = messages
  },
  setOpeningTimes(state: any, openingTimes: any[]) {
    state.openingTimes = openingTimes
  },
}

export const getters = {
  openingTimesToday(state: any) {
    return (state.openingTimes ?? []).find((ot: any) => new Date(ot.date).toDateString() === new Date().toDateString())
  },
}
