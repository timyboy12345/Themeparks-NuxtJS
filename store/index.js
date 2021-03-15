export const state = () => ({
  breadcrumbs: [],
})

export const mutations = {
  CHANGE_BREADCRUMBS(state, breacrumbs) {
    state.breadcrumbs = breacrumbs
  },
}
