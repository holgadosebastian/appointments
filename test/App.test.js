import React from "react"
import { initializeReactContainer, render, element, click } from "./reactTestExtensions"
import { App } from "../src/App"
import { AppointmentsDayViewLoader } from "../src/components/AppointmentsDayViewLoader"
import { CustomerForm } from "../src/components/CustomerForm"
import { blankCustomer } from "./builders/customer"

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

  describe("when customer and appointment button is clicked", () => {
    it("displays the CustomerForm", () => {
      render(<App />)
      beginAddingCustomerAndAppointment()
      expect(CustomerForm).toBeRenderedWithProps(expect.anything())
    })

    it("passes a blank original customer object to CustomerForm", async () => {
      render(<App />)
      beginAddingCustomerAndAppointment()
      expect(CustomerForm).toBeRenderedWithProps(
        expect.objectContaining({
          original: blankCustomer,
        })
      )
    })

    it("hides the AppointmentsDayViewLoader when CustomerForm is being displayed", async () => {
      render(<App />)
      beginAddingCustomerAndAppointment()
      expect(element("menu")).toBeNull()
    })
  })
})
