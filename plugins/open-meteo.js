export default function ({ $axios }, inject) {
  // Example: https://open-meteo.com/en/docs#current=temperature_2m,is_day,weather_code&hourly=temperature_2m,rain,weather_code,is_day&forecast_days=1

  // Create a custom axios instance
  const openMeteo = $axios.create({
    baseURL: 'https://api.open-meteo.com/',
    params: {
      // latitude: 52.52,
      // longitude: 13.41,
      hourly: 'temperature_2m,rain,weather_code,is_day',
      current: 'temperature_2m,weather_code,is_day',
      forecast_days: 1,
    },
    headers: {
      common: {
        Accept: 'application/json, */*',
      },
    },
  })

  inject('openMeteo', openMeteo)
}
