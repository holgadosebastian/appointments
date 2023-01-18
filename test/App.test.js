import React from "react"
import { initializeReactContainer, render, element, click } from "./reactTestExtensions"
import { App } from "../src/App"
import { AppointmentsDayViewLoader } from "../src/components/AppointmentsDayViewLoader"
import { CustomerForm } from "../src/components/CustomerForm"

jest.mock("../src/components/AppointmentsDayViewLoader", () => ({
  AppointmentsDayViewLoader: jest.fn(() => <div id="AppointmentsDayViewLoader" />),
}))

jest.mock("../src/components/CustomerForm", () => ({
  CustomerForm: jest.fn(() => <div id="CustomerForm" />),
}))

describe("App", () => {
  const beginAddingCustomerAndAppointment = () => click(element("menu > li > button:first-of-type"))

  beforeEach(() => {
    initializeReactContainer()
  })

  it("initially renders AppointmentsDayViewLoader", () => {
    render(<App />)

    expect(AppointmentsDayViewLoader).toBeRenderedWithProps({})
  })

  it("has a menu bar", () => {
    render(<App />)

    expect(element("menu")).not.toBeNull()
  })

  it("has a button to initiate add customer and appointment action", () => {
    render(<App />)
    const firstButton = element("menu > li > button:first-of-type")

    expect(firstButton).toContainText("Add customer and appointment")
  })

  it("displays the CustomerForm when button is clicked", () => {
    render(<App />)
    beginAddingCustomerAndAppointment()
    expect(CustomerForm).toBeRenderedWithProps({})
  })
})
