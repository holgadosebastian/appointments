import React from "react"
import { AppointmentForm } from "./components/AppointmentForm"
import { sampleAppointments } from "./sampleData"

const today = new Date()
const availableTimeSlots = [{ startsAt: today.setHours(9, 0, 0, 0) }, { startsAt: today.setHours(9, 30, 0, 0) }]
const appointment = { startsAt: availableTimeSlots[0].startsAt }

export const App = () => (
  <div className="container mx-auto font-light">
    <AppointmentForm
      original={appointment}
      availableTimeSlots={availableTimeSlots}
      today={today}
      onSubmit={({ startsAt }) => console.log("startsAt", startsAt)}
    />
  </div>
)
