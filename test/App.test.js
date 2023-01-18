import React from "react"
import { act } from "react-dom/test-utils"
import { initializeReactContainer, render, element, click, propsOf } from "./reactTestExtensions"
import { App } from "../src/App"
import { AppointmentsDayViewLoader } from "../src/components/AppointmentsDayViewLoader"
import { AppointmentFormLoader } from "../src/components/AppointmentFormLoader"
import { CustomerForm } from "../src/components/CustomerForm"
import { blankCustomer } from "./builders/customer"
import { blankAppointment } from "./builders/appointment"

jest.mock("../src/components/AppointmentsDayViewLoader", () => ({
  AppointmentsDayViewLoader: jest.fn(() => <div id="AppointmentsDayViewLoader" />),
}))

jest.mock("../src/components/CustomerForm", () => ({
  CustomerForm: jest.fn(() => <div id="CustomerForm" />),
}))

jest.mock("../src/components/AppointmentFormLoader", () => ({
  AppointmentFormLoader: jest.fn(() => <div id="AppointmentFormLoader" />),
}))

describe("App", () => {
  const beginAddingCustomerAndAppointment = () => click(element("menu > li > button:first-of-type"))
  const exampleCustomer = { id: "123" }
  const saveCustomer = (customer = exampleCustomer) => act(() => propsOf(CustomerForm).onSave(customer))
  const saveAppointment = () => act(() => propsOf(AppointmentFormLoader).onSave())

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

  it("displayes the AppointmentFormLoader after the CustomerForm is submitted", async () => {
    render(<App />)
    beginAddingCustomerAndAppointment()
    saveCustomer()

    expect(element("#AppointmentFormLoader")).not.toBeNull()
  })

  it("passes a blank original appointment object to Customer", async () => {
    render(<App />)
    beginAddingCustomerAndAppointment()
    saveCustomer()

    expect(AppointmentFormLoader).toBeRenderedWithProps(
      expect.objectContaining({
        original: expect.objectContaining(blankAppointment),
      })
    )
  })

  it("passes the customer to the AppointmentForm", async () => {
    const customer = { id: 123 }

    render(<App />)
    beginAddingCustomerAndAppointment()
    saveCustomer(customer)

    expect(AppointmentFormLoader).toBeRenderedWithProps(
      expect.objectContaining({
        original: expect.objectContaining({
          customer: customer.id,
        }),
      })
    )
  })

  it("renders AppointmentDayViewLoader after AppointmentForm is submitted", async () => {
    render(<App />)
    beginAddingCustomerAndAppointment()
    saveCustomer()
    saveAppointment()

    expect(element("#AppointmentsDayViewLoader")).not.toBeNull()
  })
})
