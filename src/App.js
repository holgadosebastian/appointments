import React from "react"
import { AppointmentsDayView } from "./components/AppointmentsDayView"
import { sampleAppointments } from "./sampleData"

export const App = () => <AppointmentsDayView appointments={sampleAppointments} />
