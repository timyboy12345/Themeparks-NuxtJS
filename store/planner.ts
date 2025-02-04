export const state = (): {
  checkins: any[] | null
  parkId: string | null
  park: any
  location: null | { lat: number; lng: number }
  locationStatus: 'unknown' | 'denied' | 'accepted'
  pois: any[] | null
  initialized: boolean
} => ({
  checkins: null,
  parkId: null,
  park: null,
  pois: null,
  location: null,
  locationStatus: 'unknown',
  initialized: false,
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
  setCheckins(state: any, checkins: any) {
    state.checkins = checkins
  },
  addCheckin(state: any, checkin: any) {
    state.checkins.push(checkin)
  },
  setLocation(state: any, location: any) {
    state.location = location
  },
  setInitialized(state: any, initialized: boolean) {
    state.initialized = initialized
  },
}
