export const state = (): {
  parkId: string | null
  park: any
  location: null | { lat: number; lng: number }
  locationStatus: 'unknown' | 'denied' | 'accepted'
  pois: any[] | null
  initialized: boolean
  favorites: string[]
} => ({
  parkId: null,
  park: null,
  pois: null,
  location: null,
  locationStatus: 'unknown',
  initialized: false,
  favorites: [],
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
  },
  addFavorite(state: any, id: string) {
    state.favorites.push(id)
  },
  removeFavorite(state: any, id: string) {
    state.favorites = state.favorites.filter((d: string) => d !== id)
  },
  resetFavorites(state: any) {
    state.favorites = []
  },
}
