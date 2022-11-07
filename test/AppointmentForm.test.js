import React from "react"
import { initializeReactContainer, render, field, form, labelsOfAllOptions } from "./reactTestExtensions"
import { AppointmentForm } from "../src/AppointmentForm"

describe("AppointmentForm", () => {
  beforeEach(() => {
    initializeReactContainer()
  })

  it("renders a form", () => {
    render(<AppointmentForm />)
    expect(form()).not.toBeNull()
  })

  describe("service field", () => {
    it("renders as a select box", () => {
      render(<AppointmentForm />)
      expect(field("service")).not.toBeNull()
      expect(field("service").tagName).toEqual("SELECT")
    })

    it("has a blank value as the first value", () => {
      render(<AppointmentForm />)

      const firstOption = field("service").childNodes[0]
      expect(firstOption.value).toEqual("")
    })

    it("lists all salon services", () => {
      const services = ["Cut", "Blow-dry"]
      render(<AppointmentForm selectableServices={services} />)

      expect(labelsOfAllOptions(field("service"))).toEqual(expect.arrayContaining(services))
    })
  })
})
