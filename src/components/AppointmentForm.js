import React, { useState, useCallback } from "react"

const timeIncrements = (numTimes, startTime, increment) =>
  Array(numTimes)
    .fill([startTime])
    .reduce((acc, _, i) => acc.concat([startTime + i * increment]))

const dailyTimeSlots = (salonOpensAt, salonClosesAt) => {
  const totalSlots = (salonClosesAt - salonOpensAt) * 2
  const startTime = new Date().setHours(salonOpensAt, 0, 0, 0)
  const increment = 30 * 60 * 1000

  return timeIncrements(totalSlots, startTime, increment)
}

const weeklyDayValues = startDate => {
  const midnight = startDate.setHours(0, 0, 0, 0)
  const increment = 24 * 60 * 60 * 1000

  return timeIncrements(7, midnight, increment)
}

const toShortDate = timestamp => {
  const [day, _, dayOfMonth] = new Date(timestamp).toDateString().split(" ")

  return `${day} ${dayOfMonth}`
}

const toTimeValue = timestamp => new Date(timestamp).toTimeString().substring(0, 5)

const mergeDateAndTime = (date, timeSlot) => {
  const time = new Date(timeSlot)
  return new Date(date).setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds())
}

const Error = ({ hasError }) => <p role="error">{hasError ? "An error ocurred" : ""}</p>

const RadioButtonIfAvailable = ({ availableTimeSlots, date, timeSlot, checkedTimeSlot, onChange }) => {
  const startsAt = mergeDateAndTime(date, timeSlot)

  if (availableTimeSlots.some(timeSlot => timeSlot.startsAt === startsAt)) {
    const isChecked = startsAt === checkedTimeSlot
    return <input name="startsAt" type="radio" value={startsAt} checked={isChecked} onChange={onChange}></input>
  }

  return null
}

const TimeSlotTable = ({ salonOpensAt, salonClosesAt, today, availableTimeSlots, checkedTimeSlot, onChange }) => {
  const dates = weeklyDayValues(today)
  const timeSlots = dailyTimeSlots(salonOpensAt, salonClosesAt)

  return (
    <table className="w-full table-fixed" id="time-slots">
      <thead className="bg-slate-50">
        <tr>
          <th />
          {dates.map(date => (
            <th className="font-light px-2 py-1" key={date}>
              {toShortDate(date)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map((timeSlot, index) => (
          <tr className={`hover:bg-slate-200 ${index % 2 === 1 ? "bg-slate-50" : ""}`} key={timeSlot}>
            <th className="font-light px-2 py-1">{toTimeValue(timeSlot)}</th>
            {dates.map(date => (
              <td className="px-2 py-1 text-center" key={date}>
                <RadioButtonIfAvailable
                  availableTimeSlots={availableTimeSlots}
                  date={date}
                  timeSlot={timeSlot}
                  checkedTimeSlot={checkedTimeSlot}
                  onChange={onChange}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export const AppointmentForm = ({
  selectableServices,
  original,
  salonOpensAt,
  salonClosesAt,
  today,
  availableTimeSlots,
  onSave,
}) => {
  const [appointment, setAppointment] = useState(original)
  const [error, setError] = useState(false)
  const handleStartsAtChange = useCallback(
    ({ target: { value } }) => setAppointment(appointment => ({ ...appointment, startsAt: parseInt(value) })),
    []
  )

  const handleSubmit = async event => {
    event.preventDefault()

    const result = await global.fetch("/customers", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointment),
    })

    if (result.ok) {
      onSave(appointment)
    } else {
      setError(true)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <select
        className="rounded-md h-10 mb-2 border border-slate-100 px-4"
        name="service"
        value={original.service}
        readOnly
      >
        <option></option>
        {selectableServices.map(service => (
          <option key={service}>{service}</option>
        ))}
      </select>
      <TimeSlotTable
        salonOpensAt={salonOpensAt}
        salonClosesAt={salonClosesAt}
        today={today}
        availableTimeSlots={availableTimeSlots}
        checkedTimeSlot={appointment.startsAt}
        onChange={handleStartsAtChange}
      />

      <Error hasError={error} />
      <input
        className="bg-teal-400 hover:bg-teal-300 cursor-pointer h-10 rounded-md text-white mt-2 px-4"
        type="submit"
        value="Add"
      />
    </form>
  )
}

AppointmentForm.defaultProps = {
  selectableServices: ["Cut", "Blow-dry", "Cut & color", "Beard trim", "Cut & beard trim", "Extensions"],
  salonOpensAt: 9,
  salonClosesAt: 19,
  today: new Date(),
}
