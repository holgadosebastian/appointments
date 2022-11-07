import React from "react"
import ReactDOM from "react-dom/client"
import { sampleAppointments } from "./sampleData"
import { AppointmentsDayView } from "./AppointmentsDayView"

ReactDOM.createRoot(document.getElementById("root")).render(<AppointmentsDayView appointments={sampleAppointments} />)
