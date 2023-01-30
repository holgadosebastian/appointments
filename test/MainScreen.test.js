import React from "react"
import { initializeReactContainer, renderWithRouter, linkFor } from "./reactTestExtensions"
import { MainScreen } from "../src/components/MainScreen"
import { AppointmentFormLoader } from "../src/components/AppointmentFormLoader"

jest.mock("../src/components/AppointmentFormLoader", () => ({
  AppointmentFormLoader: jest.fn(() => <div id="AppointmentFormLoader" />),
}))

describe("MainScreen", () => {
  beforeEach(() => {
    initializeReactContainer()
  })

  it("renders a link to the /addCustomer route", async () => {
    renderWithRouter(<MainScreen />)
    expect(linkFor("/addCustomer")).toBeDefined()
  })

  it("captions the /addCustomer link as 'Add customer and appointment'", async () => {
    renderWithRouter(<MainScreen />)
    expect(linkFor("/addCustomer")).toContainText("Add customer and appointment")
  })

  it("renders a link to the /searchCustomers route", async () => {
    renderWithRouter(<MainScreen />)
    expect(linkFor("/searchCustomers")).toBeDefined()
  })

  it("captions the /searchCustomers link as 'Add customer and appointment'", async () => {
    renderWithRouter(<MainScreen />)
    expect(linkFor("/searchCustomers")).toContainText("Search customers")
  })

  it("renders AppointmentFormLoader", async () => {
    renderWithRouter(<MainScreen />)

    expect(AppointmentFormLoader).toBeRenderedWithProps(null)
  })
})
