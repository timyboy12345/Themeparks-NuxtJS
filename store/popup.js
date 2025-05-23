export const state = () => ({
  popups: [],
})

export const mutations = {
  addPopup(state, popup) {
    if (popup.front ?? false) state.popups.unshift(popup)
    else state.popups.push(popup)
  },
  closePopup(state) {
    state.popups.shift()
  },
}

export const getters = {
  getCurrentPopup(state) {
    return state.popups.length > 0 ? state.popups[0] : null
  },
}
