export default {
  computed: {
    parsedData() {
      if (!this.data) {
        return []
      }

      const rides = []

      if (!this.dayOfWeek) {
        for (const [rideId, waitingTimes] of Object.entries(this.data.averaged)) {
          const data = []

          waitingTimes
            .filter((d) => d.wait !== null)
            .filter((d) => this.parkIsOpen(d.hour))
            .forEach((dataPoint) => {
              data.push([new Date().setHours(dataPoint.hour), dataPoint.average])
            })

          const ride = this.rides.find((r) => r.id === rideId)
          rides.push({
            name: ride ? ride.title : rideId,
            rideId,
            data,
          })
        }
      } else {
        for (const [rideId, waitingTimes] of Object.entries(this.data.byDay)) {
          const data = []

          waitingTimes
            .filter((d) => d.wait !== null)
            .filter((d) => this.parkIsOpen(d.hour))
            .filter((d) => parseInt(d.day) === parseInt(this.dayOfWeek))
            .forEach((dataPoint) => {
              data.push([new Date().setHours(dataPoint.hour), dataPoint.average])
            })

          const ride = this.rides.find((r) => r.id === rideId)
          rides.push({
            name: ride ? ride.title : rideId,
            rideId,
            data,
          })
        }
      }

      return rides.filter((r) => this.filteredRides(r.rideId))
    },
  },
  methods: {
    parkIsOpen(hour) {
      return hour > 9 && hour < 23
    },
    filteredRides(rideId) {
      if (this.rideId) {
        return rideId === this.rideId
      }

      return true
    },
  },
}
