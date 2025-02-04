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

Vue.filter('formatTime', (value) => {
  const date = new Date(0, 0, 0, value.split(':')[0], value.split(':')[1])
  return date.toLocaleString(['nl-NL'], {
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

Vue.filter('limitText', (value) => {
  const limit = 160
  return value.length > limit ? value.substring(0, limit).trim() + '...' : value
})

Vue.filter('formatDateArray', (value) => {
  const dates = (value ?? []).map((d) => {
    const date = new Date(d)
    return date.toLocaleString(['nl-NL'], {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    })
  })

  return dates.join(', ')
})

Vue.filter('formatDistance', (value) => {
  if (value === undefined || value === null) {
    return undefined
  }

  if (value > 1000) {
    return `${(value / 1000).toFixed(1)}km`
  }

  return `${value}m`
})
