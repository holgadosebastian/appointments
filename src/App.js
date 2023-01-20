import React, { useState, useCallback } from "react"
import { AppointmentsDayViewLoader } from "./components/AppointmentsDayViewLoader"
import { CustomerForm } from "./components/CustomerForm"
import { AppointmentFormLoader } from "./components/AppointmentFormLoader"
import { blankCustomer } from "../test/builders/customer"
import { blankAppointment } from "../test/builders/appointment"

export const App = () => {
  const [view, setView] = useState("dayView")
  const [customer, setCustomer] = useState()

  const transitionToDayView = useCallback(() => setView("dayView"), [])
  const transitionToAddCustomer = useCallback(() => setView("addCustomer"), [])
  const transitionToAddAppointment = useCallback(customer => {
    setCustomer(customer)
    setView("addAppointment")
  }, [])

  const Content = () => {
    switch (view) {
      case "addCustomer":
        return <CustomerForm original={blankCustomer} onSave={transitionToAddAppointment} />
      case "addAppointment":
        return (
          <AppointmentFormLoader
            original={{ ...blankAppointment, customer: customer.id }}
            onSave={transitionToDayView}
          />
        )
      default:
        return (
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
  }

  return (
    <div className="container mx-auto">
      <Content />
    </div>
  )
}
