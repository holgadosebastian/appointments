import React from "react"
import { initializeReactContainer, render, element } from "./reactTestExtensions"
import { AppointmentsDayViewLoader } from "../src/components/AppointmentsDayViewLoader"
import { AppointmentsDayView } from "../src/components/AppointmentsDayView"

jest.mock("../src/components/AppointmentsDayView", () => ({
  AppointmentsDayView: jest.fn(() => <div id="AppointmentsDayView" />),
}))

describe("AppointmentsDayViewLoader", () => {
  beforeEach(() => {
    initializeReactContainer()
  })

  it("renders an AppointmentsDayView", () => {
    render(<AppointmentsDayViewLoader />)

    expect(element("#AppointmentsDayView")).not.toBeNull()
  })
})
