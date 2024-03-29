import React from "react"
import {
  initializeReactContainer,
  render,
  field,
  form,
  element,
  elements,
  labelsOfAllOptions,
  submitButton,
  clickAndWait,
} from "./reactTestExtensions"
import { today, todayAt, tomorrowAt } from "./builders/time"
import { fetchResponseOk, fetchResponseError } from "./builders/fetch"
import { blankAppointment } from "./builders/appointment"
import { bodyOfLastFetchRequest } from "./spyHelpers"
import { AppointmentForm } from "../src/components/AppointmentForm"

describe("AppointmentForm", () => {
  const availableTimeSlots = [{ startsAt: todayAt(9) }, { startsAt: todayAt(9, 30) }]
  const services = ["Cut", "Blow-dry"]
  const testProps = {
    today,
    selectableServices: services,
    availableTimeSlots,
    original: blankAppointment,
  }
  const findOption = (selectBox, textContent) => {
    const options = Array.from(selectBox.childNodes)
    return options.find(option => option.textContent === textContent)
  }
  const cellsWithRadioButtons = () => elements("input[type=radio]").map(el => elements("td").indexOf(el.parentNode))

  beforeEach(() => {
    initializeReactContainer()
    jest.spyOn(global, "fetch").mockResolvedValue(fetchResponseOk({}))
  })

  it("renders a form", () => {
    render(<AppointmentForm {...testProps} />)
    expect(form()).not.toBeNull()
  })

  describe("service field", () => {
    it("renders as a select box", () => {
      render(<AppointmentForm {...testProps} />)
      expect(field("service")).not.toBeNull()
      expect(field("service")).toBeElementWithTag("SELECT")
    })

    it("has a blank value as the first value", () => {
      render(<AppointmentForm {...testProps} original={blankAppointment} />)

      const firstOption = field("service").childNodes[0]
      expect(firstOption.value).toEqual("")
    })

    it("lists all salon services", () => {
      render(<AppointmentForm {...testProps} selectableServices={services} />)

      expect(labelsOfAllOptions(field("service"))).toEqual(expect.arrayContaining(services))
    })

    it("preselects the existing value", () => {
      const appointment = { service: "Blow-dry" }

      render(<AppointmentForm {...testProps} selectableServices={services} original={appointment} />)
      const option = findOption(field("service"), "Blow-dry")

      expect(option.selected).toBe(true)
    })
  })

  describe("time slot table", () => {
    const startsAtField = index => elements("input[name=startsAt]")[index]

    it("renders a table for time slots with an id", () => {
      render(<AppointmentForm original={blankAppointment} availableTimeSlots={availableTimeSlots} />)
      expect(element("table#time-slots")).not.toBeNull()
    })

    it("renders a time slot for every half an hour between open and close times", () => {
      render(
        <AppointmentForm {...testProps} salonOpensAt={9} salonClosesAt={11} availableTimeSlots={availableTimeSlots} />
      )
      const timesOfDayHeadings = elements("tbody >* th")
      expect(timesOfDayHeadings[0]).toContainText("09:00")
      expect(timesOfDayHeadings[1]).toContainText("09:30")
      expect(timesOfDayHeadings[3]).toContainText("10:30")
    })

    it("renders an empty cell at the start of the header row", () => {
      render(<AppointmentForm {...testProps} />)
      const headerRow = element("thead > tr")
      expect(headerRow.firstChild).toContainText("")
    })

    it("renders a week of available dates", () => {
      const specificDate = new Date(2018, 11, 1)
      render(<AppointmentForm {...testProps} today={specificDate} />)
      const dates = elements("thead >* th:not(:first-child)")
      expect(dates).toHaveLength(7)
      expect(dates[0]).toContainText("Sat 01")
      expect(dates[1]).toContainText("Sun 02")
      expect(dates[6]).toContainText("Fri 07")
    })

    it("renders radio buttons in the correct table cell positions", () => {
      const availableTimeSlots = [
        { startsAt: todayAt(9) },
        { startsAt: todayAt(9, 30) },
        { startsAt: tomorrowAt(9, 30) },
      ]

      render(<AppointmentForm {...testProps} availableTimeSlots={availableTimeSlots} today={today} />)
      expect(cellsWithRadioButtons()).toEqual([0, 7, 8])
    })

    it("does not render radio buttons for unavailable time slots", () => {
      render(<AppointmentForm original={blankAppointment} availableTimeSlots={[]} />)
      expect(elements("input[type=radio]")).toHaveLength(0)
    })

    it("sets radio button values to the startsAt value of the corresponding appointments", () => {
      render(<AppointmentForm original={blankAppointment} availableTimeSlots={availableTimeSlots} today={today} />)

      const allRadioValues = elements("input[type=radio").map(({ value }) => parseInt(value))
      const allSlotTimes = availableTimeSlots.map(({ startsAt }) => startsAt)
      expect(allRadioValues).toEqual(allSlotTimes)
    })

    it("preselects the existing value", () => {
      const appointment = { startsAt: availableTimeSlots[1].startsAt }

      render(<AppointmentForm original={appointment} availableTimeSlots={availableTimeSlots} today={today} />)

      expect(startsAtField(1).checked).toEqual(true)
    })

    it("renders a submit button", () => {
      render(<AppointmentForm {...testProps} />)

      expect(submitButton()).not.toBeNull()
    })

    it("saves existing value when submitted", async () => {
      const appointment = { startsAt: availableTimeSlots[1].startsAt }
      const saveSpy = jest.fn()

      render(
        <AppointmentForm
          original={appointment}
          availableTimeSlots={availableTimeSlots}
          today={today}
          onSave={saveSpy}
        />
      )

      await clickAndWait(submitButton())
      expect(saveSpy).toBeCalled()
      expect(bodyOfLastFetchRequest()).toMatchObject(appointment)
    })

    it("saves a new value when submitted", async () => {
      const appointment = { startsAt: availableTimeSlots[0].startsAt }
      const saveSpy = jest.fn()

      render(
        <AppointmentForm
          original={appointment}
          availableTimeSlots={availableTimeSlots}
          today={today}
          onSave={saveSpy}
        />
      )

      await clickAndWait(startsAtField(1))
      await clickAndWait(submitButton())

      expect(saveSpy).toBeCalledWith(availableTimeSlots[1])
      expect(bodyOfLastFetchRequest()).toMatchObject(availableTimeSlots[1])
    })

    describe("when POST returns an error", () => {
      beforeEach(() => {
        global.fetch.mockResolvedValue(fetchResponseError())
      })

      it("does not save", async () => {
        const appointment = { startsAt: availableTimeSlots[1].startsAt }
        const saveSpy = jest.fn()

        render(
          <AppointmentForm
            original={appointment}
            availableTimeSlots={availableTimeSlots}
            today={today}
            onSave={saveSpy}
          />
        )

        await clickAndWait(submitButton())
        expect(saveSpy).not.toBeCalled()
      })

      it("displays an error message", async () => {
        const appointment = { startsAt: availableTimeSlots[0].startsAt }

        render(<AppointmentForm original={appointment} availableTimeSlots={availableTimeSlots} today={today} />)

        await clickAndWait(submitButton())
        expect(element("[role=error]")).toContainText("error ocurred")
      })
    })
  })
})
