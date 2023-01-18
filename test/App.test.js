import React from "react"
import { initializeReactContainer, render, element } from "./reactTestExtensions"
import { App } from "../src/App"
import { AppointmentsDayViewLoader } from "../src/components/AppointmentsDayViewLoader"

jest.mock("../src/components/AppointmentsDayViewLoader", () => ({
  AppointmentsDayViewLoader: jest.fn(() => <div id="AppointmentsDayViewLoader" />),
}))

describe("App", () => {
  beforeEach(() => {
    initializeReactContainer()
  })

  it("initially renders AppointmentsDayViewLoader", () => {
    render(<App />)

    expect(element("#AppointmentsDayViewLoader")).not.toBeNull()
  })
})
