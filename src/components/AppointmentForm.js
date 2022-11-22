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
    <table id="time-slots">
      <thead>
        <tr>
          <th />
          {dates.map(date => (
            <th key={date}>{toShortDate(date)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map(timeSlot => (
          <tr key={timeSlot}>
            <th>{toTimeValue(timeSlot)}</th>
            {dates.map(date => (
              <td key={date}>
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
  onSubmit,
}) => {
  const [appointment, setAppointment] = useState(original)
  const handleStartsAtChange = useCallback(
    ({ target: { value } }) => setAppointment(appointment => ({ ...appointment, startsAt: parseInt(value) })),
    []
  )

  const handleSubmit = event => {
    event.preventDefault()
    onSubmit(appointment)
  }

  return (
    <form onSubmit={handleSubmit}>
      <select name="service" value={original.service} readOnly>
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
      <input type="submit" value="Add" />
    </form>
  )
}

AppointmentForm.defaultProps = {
  selectableServices: ["Cut", "Blow-dry", "Cut & color", "Beard trim", "Cut & beard trim", "Extensions"],
  salonOpensAt: 9,
  salonClosesAt: 19,
  today: new Date(),
}
