import React, { useEffect, useState } from "react"
import { AppointmentsDayView } from "./AppointmentsDayView"

export const AppointmentsDayViewLoader = ({ today }) => {
  const [appointments, setAppointments] = useState([])
  useEffect(() => {
    const from = today.setHours(0, 0, 0, 0)
    const to = today.setHours(23, 59, 59, 999)

    const fetchAppointments = async () => {
      const result = await global.fetch(`/appointments/${from}-${to}`, {
        method: "GET",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      })

      const newAppointments = await result.json()
      setAppointments(newAppointments)
    }

    fetchAppointments()
  }, [today])

  return <AppointmentsDayView appointments={appointments} />
}

AppointmentsDayViewLoader.defaultProps = {
  today: new Date(),
}
