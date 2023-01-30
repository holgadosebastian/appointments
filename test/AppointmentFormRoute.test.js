import React from "react"
import { initializeReactContainer, renderWithRouter } from "./reactTestExtensions"
import { AppointmentFormRoute } from "../src/components/AppointmentFormRoute"
import { AppointmentFormLoader } from "../src/components/AppointmentFormLoader"

jest.mock("../src/components/AppointmentFormLoader", () => ({
  AppointmentFormLoader: jest.fn(() => <div id="AppointmentFormLoader" />),
}))

describe("AppointmentFormLoader", () => {
  beforeEach(() => {
    initializeReactContainer()
  })

  it("adds the customer id into the original appointment object", () => {
    renderWithRouter(<AppointmentFormRoute />, { location: "?customerId=123" })

    expect(AppointmentFormLoader).toBeRenderedWithProps({
      original: expect.objectContaining({
        customer: 123,
      }),
    })
  })

  it("passes all other props through to AppointmentForm", () => {
    const props = { a: "123", b: "456" }
    renderWithRouter(<AppointmentFormRoute {...props} />)

    expect(AppointmentFormLoader).toBeRenderedWithProps(expect.objectContaining({ a: "123", b: "456" }))
  })
})
