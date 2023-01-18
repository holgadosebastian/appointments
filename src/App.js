import React, { useState, useCallback } from "react"
import { AppointmentsDayViewLoader } from "./components/AppointmentsDayViewLoader"
import { CustomerForm } from "./components/CustomerForm"
import { blankCustomer } from "../test/builders/customer"

export const App = () => {
  const [view, setView] = useState("dayView")
  const transitionToAddCustomer = useCallback(() => setView("addCustomer"), [])

  return view === "addCustomer" ? (
    <CustomerForm original={blankCustomer} />
  ) : (
    <>
      <menu>
        <li>
          <button type="button" onClick={transitionToAddCustomer}>
            Add customer and appointment
          </button>
        </li>
      </menu>
      <AppointmentsDayViewLoader />
    </>
  )
}
