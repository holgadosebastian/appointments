import React from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import { MainScreen } from "./components/MainScreen"
import { CustomerForm } from "./components/CustomerForm"
import { AppointmentFormRoute } from "./components/AppointmentFormRoute"
import { CustomerSearchRoute } from "./components/CustomerSearchRoute"
import { blankCustomer } from "../test/builders/customer"
import { blankAppointment } from "../test/builders/appointment"

export const App = () => {
  const navigate = useNavigate()
  const searchActions = customer => (
    <button onClick={() => navigate(`/addAppointment?customerId=${customer.id}`)}>Create appointment</button>
  )
  const transitionToDayView = () => navigate("/")

  return (
    <div className="container mx-auto">
      <Routes>
        <Route path="/addCustomer" element={<CustomerForm original={blankCustomer} />} />
        <Route
          path="/addAppointment"
          element={<AppointmentFormRoute original={{ ...blankAppointment }} onSave={transitionToDayView} />}
        />
        <Route path="/searchCustomers" element={<CustomerSearchRoute renderCustomerActions={searchActions} />} />
        <Route path="/" element={<MainScreen />} />
      </Routes>
    </div>
  )
}
