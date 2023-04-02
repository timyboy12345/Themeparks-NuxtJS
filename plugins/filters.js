import Vue from 'vue'

Vue.filter('formatDateTime', (value) => {
  const date = new Date(value)
  return date.toLocaleString(['nl-NL'], {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

Vue.filter('formatDate', (value) => {
  const date = new Date(value)
  return date.toLocaleString(['nl-NL'], {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  })
})
