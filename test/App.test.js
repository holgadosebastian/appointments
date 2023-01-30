import React from "react"
import { act } from "react-dom/test-utils"
import {
  initializeReactContainer,
  renderAdditional,
  element,
  click,
  propsOf,
  renderWithRouter,
  linkFor,
} from "./reactTestExtensions"
import { blankCustomer } from "./builders/customer"
import { blankAppointment } from "./builders/appointment"
import { App } from "../src/App"
import { AppointmentsDayViewLoader } from "../src/components/AppointmentsDayViewLoader"
import { AppointmentFormLoader } from "../src/components/AppointmentFormLoader"
import { CustomerForm } from "../src/components/CustomerForm"
import { CustomerSearch } from "../src/components/CustomerSearch"

jest.mock("../src/components/AppointmentsDayViewLoader", () => ({
  AppointmentsDayViewLoader: jest.fn(() => <div id="AppointmentsDayViewLoader" />),
}))

jest.mock("../src/components/CustomerForm", () => ({
  CustomerForm: jest.fn(() => <div id="CustomerForm" />),
}))

jest.mock("../src/components/AppointmentFormLoader", () => ({
  AppointmentFormLoader: jest.fn(() => <div id="AppointmentFormLoader" />),
}))

jest.mock("../src/components/CustomerSearch", () => ({
  CustomerSearch: jest.fn(() => <div id="CustomerSearch" />),
}))

describe("App", () => {
  const beginAddingCustomerAndAppointment = () => click(linkFor("/addCustomer"))
  const exampleCustomer = { id: "123" }
  const saveCustomer = (customer = exampleCustomer) => act(() => propsOf(CustomerForm).onSave(customer))
  const saveAppointment = () => act(() => propsOf(AppointmentFormLoader).onSave())

  beforeEach(() => {
    initializeReactContainer()
  })

  it("initially shows the AppointmentsDayViewLoader", () => {
    renderWithRouter(<App />)

    expect(AppointmentsDayViewLoader).toBeRenderedWithProps({})
  })

  it("has a menu bar", () => {
    renderWithRouter(<App />)

    expect(element("menu")).not.toBeNull()
  })

  describe("when customer and appointment button is clicked", () => {
    it("displays the CustomerForm", () => {
      renderWithRouter(<App />)
      beginAddingCustomerAndAppointment()
      expect(CustomerForm).toBeRenderedWithProps(expect.anything())
    })

    it("passes a blank original customer object to CustomerForm", async () => {
      renderWithRouter(<App />)
      beginAddingCustomerAndAppointment()
      expect(CustomerForm).toBeRenderedWithProps(
        expect.objectContaining({
          original: blankCustomer,
        })
      )
    })

    it("hides the AppointmentsDayViewLoader when CustomerForm is being displayed", async () => {
      renderWithRouter(<App />)
      beginAddingCustomerAndAppointment()
      expect(element("menu")).toBeNull()
    })
  })

  it("displayes the AppointmentFormLoader after the CustomerForm is submitted", async () => {
    renderWithRouter(<App />)
    beginAddingCustomerAndAppointment()
    saveCustomer()

    expect(element("#AppointmentFormLoader")).not.toBeNull()
  })

  it("passes a blank original appointment object to Customer", async () => {
    renderWithRouter(<App />)
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

    renderWithRouter(<App />)
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
    renderWithRouter(<App />)
    beginAddingCustomerAndAppointment()
    saveCustomer()
    saveAppointment()

    expect(element("#AppointmentsDayViewLoader")).not.toBeNull()
  })

  describe("search customers", () => {
    it("has a button to search customers", () => {
      renderWithRouter(<App />)
      expect(linkFor("/searchCustomers")).not.toBeNull()
    })

    const searchFor = customer => propsOf(CustomerSearch).renderCustomerActions(customer)
    const navigateToSearchCustomers = () => click(linkFor("/searchCustomers"))

    it("passes a button to the CustomerSearch named Create appointment", async () => {
      renderWithRouter(<App />)
      navigateToSearchCustomers()
      const buttonContainer = renderAdditional(searchFor())
      expect(buttonContainer.firstChild.tagName).toEqual("BUTTON")
      expect(buttonContainer.firstChild).toContainText("Create appointment")
    })

    it("clicking appointment button shows the appointment form for that customer", async () => {
      const customer = { id: 123 }
      renderWithRouter(<App />)
      navigateToSearchCustomers()
      const buttonContainer = renderAdditional(searchFor(customer))
      click(buttonContainer.firstChild)

      expect(element("#AppointmentFormLoader")).not.toBeNull()
      expect(propsOf(AppointmentFormLoader).original).toMatchObject({ customer: 123 })
    })
  })
})
