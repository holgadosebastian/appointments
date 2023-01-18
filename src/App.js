import React, { useState, useCallback } from "react"
import { AppointmentsDayViewLoader } from "./components/AppointmentsDayViewLoader"
import { CustomerForm } from "./components/CustomerForm"

export const App = () => {
  const [view, setView] = useState("dayView")
  const transitionToAddCustomer = useCallback(() => setView("addCustomer"), [])

  return (
    <>
      <menu>
        <li>
          <button type="button" onClick={transitionToAddCustomer}>
            Add customer and appointment
          </button>
        </li>
      </menu>
      {view === "addCustomer" ? <CustomerForm /> : null}
      <AppointmentsDayViewLoader />
    </>
  )
}
