import React, { useEffect, useState } from "react"
import { AppointmentForm } from "./AppointmentForm"

export const AppointmentFormLoader = ({ original, today }) => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])

  useEffect(() => {
    const from = today.setHours(0, 0, 0, 0)
    const to = today.setHours(23, 59, 59, 999)

    const fetchAvailableTimesSlots = async () => {
      const result = await global.fetch(`/availableTimeSlots/${from}-${to}`, {
        method: "GET",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      })

      const newAvailableTimeSlots = await result.json()
      setAvailableTimeSlots(newAvailableTimeSlots)
    }

    fetchAvailableTimesSlots()
  }, [today])

  return <AppointmentForm availableTimeSlots={availableTimeSlots} original={original} />
}

AppointmentFormLoader.defaultProps = {
  today: new Date(),
}
