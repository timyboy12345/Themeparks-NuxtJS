export function measurePoints(lat1, lon1, lat2, lon2) {
  const R = 6378.137
  const dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180
  const dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c
  return d * 1000 // meters
}

export function measureLatLngPoints(point1, point2) {
  if (!point1 || !point2) return undefined

  return measurePoints(point1.lat, point2.lng, point2.lat, point2.lng)
}
