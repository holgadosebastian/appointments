import React from "react"
import { initializeReactContainer, render, click, element, elements, typeOf, textOf } from "./reactTestExtensions"
import { Appointment, AppointmentsDayView } from "../src/AppointmentsDayView"

describe("Appointment", () => {
  let customer

  beforeEach(() => {
    initializeReactContainer()
  })

  it("renders the customer first name", () => {
    customer = { firstName: "Ashley" }
    render(<Appointment customer={customer} />)
    expect(document.body).toContainText("Ashley")
  })

  it("renders another customer first name", () => {
    customer = { firstName: "Jordan" }
    render(<Appointment customer={customer} />)
    expect(document.body).toContainText("Jordan")
  })
})

describe("AppointmentsDayView", () => {
  const today = new Date()
  const twoAppointments = [
    {
      startsAt: today.setHours(12, 0),
      customer: { firstName: "Ashley" },
    },
    { startsAt: today.setHours(13, 0), customer: { firstName: "Jordan" } },
  ]

  beforeEach(() => {
    initializeReactContainer()
  })

  it("renders a div with the right id", () => {
    render(<AppointmentsDayView appointments={[]} />)
    expect(element("div#appointmentsDayView")).not.toBeNull()
  })

  it("renders an ol element to display appointments", () => {
    render(<AppointmentsDayView appointments={[]} />)
    expect(elements("ol")).not.toBeNull()
  })

  it("renders a li for each appointment", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />)
    expect(elements("ol > li")).toHaveLength(2)
  })

  it("renders the time of each appointment", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />)
    expect(textOf(elements("ol > li"))).toEqual(["12:00", "13:00"])
  })

  it("initially shows a message saying there are no appointments today", () => {
    render(<AppointmentsDayView appointments={[]} />)
    expect(document.body).toContainText("There are no appointments scheduled for today")
  })

  it("selects the first appointment by default", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />)
    expect(document.body).toContainText("Ashley")
  })

  it("has a button element on each li", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />)

    expect(elements("li > button")).toHaveLength(2)
    expect(typeOf(elements("li > button"))).toEqual(["button", "button"])
  })

  it("renders another appointment when selected", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />)
    const secondButton = elements("button")[1]
    click(secondButton)
    expect(document.body).toContainText("Jordan")
  })

  it("adds a toggle class when button is clicked", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />)
    const secondButton = elements("button")[1]
    click(secondButton)
    expect(secondButton).toHaveClass("toggled")
  })
})
