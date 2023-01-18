import React from "react"
import { initializeReactContainer, renderAndWait, element } from "./reactTestExtensions"
import { today, todayAt, tomorrow, tomorrowAt } from "./builders/time"
import { fetchResponseOk } from "./builders/fetch"
import { AppointmentFormLoader } from "../src/components/AppointmentFormLoader"
import { AppointmentForm } from "../src/components/AppointmentForm"

jest.mock("../src/components/AppointmentForm", () => ({
  AppointmentForm: jest.fn(() => <div id="AppointmentForm" />),
}))

describe("AppointmentFormLoader", () => {
  const availableTimeSlots = [{ startsAt: today.setHours(9, 0, 0, 0) }, { startsAt: today.setHours(9, 30, 0, 0) }]

  beforeEach(() => {
    initializeReactContainer()
    jest.spyOn(global, "fetch").mockResolvedValue(fetchResponseOk(availableTimeSlots))
  })

  it("renders an AppointmentForm", async () => {
    await renderAndWait(<AppointmentFormLoader />)
    expect(element("#AppointmentForm")).not.toBeNull()
  })

  it("initially passes an empty array of availableTimeSlots to AppointmentForm", async () => {
    await renderAndWait(<AppointmentFormLoader />)
    expect(AppointmentForm).toBeFirstRenderedWithProps({ availableTimeSlots: [] })
  })

  it("fetches availabeTimesSlots on component mount", async () => {
    const from = todayAt(0)
    const to = todayAt(23, 59, 59, 999)
    await renderAndWait(<AppointmentFormLoader />)

    expect(global.fetch).toBeCalledWith(`/availableTimeSlots/${from}-${to}`, expect.anything())
  })

  it("updates availableTimeSlots prop after successful fetch", async () => {
    await renderAndWait(<AppointmentFormLoader />)

    expect(AppointmentForm).toBeRenderedWithProps({ availableTimeSlots })
  })

  it("updates availableTimeSlots prop after date change", async () => {
    const from = tomorrowAt(0)
    const to = tomorrowAt(23, 59, 59, 999)

    await renderAndWait(<AppointmentFormLoader />)
    await renderAndWait(<AppointmentFormLoader today={tomorrow} />)

    expect(global.fetch).toHaveBeenLastCalledWith(`/availableTimeSlots/${from}-${to}`, expect.anything())
  })
})
