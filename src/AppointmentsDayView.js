import React, { useState } from "react"

const appointmentTimeOfDay = startsAt => {
  const [h, m] = new Date(startsAt).toTimeString().split(":")

  return `${h}:${m}`
}

export const Appointment = ({ startsAt, customer, stylist, service, notes }) => (
  <div>
    <h1>Today's appointment at {appointmentTimeOfDay(startsAt)}</h1>
    <table>
      <tbody>
        <tr>
          <td>Customer</td>
          <td>
            {customer.firstName} {customer.lastName}
          </td>
        </tr>
        <tr>
          <td>Phone Number</td>
          <td>{customer.phoneNumber}</td>
        </tr>
        <tr>
          <td>Stylist</td>
          <td>{stylist}</td>
        </tr>
        <tr>
          <td>Service</td>
          <td>{service}</td>
        </tr>
        <tr>
          <td>Notes</td>
          <td>{notes}</td>
        </tr>
      </tbody>
    </table>
  </div>
)

export const AppointmentsDayView = ({ appointments }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(0)

  return (
    <div id="appointmentsDayView">
      <ol>
        {appointments.map(({ startsAt }, i) => (
          <li key={startsAt}>
            <button
              type="button"
              className={`${i === selectedAppointment ? "toggled" : ""}`}
              onClick={() => setSelectedAppointment(i)}
            >
              {appointmentTimeOfDay(startsAt)}
            </button>
          </li>
        ))}
      </ol>

      {appointments.length === 0 ? (
        <p>There are no appointments scheduled for today</p>
      ) : (
        <Appointment {...appointments[selectedAppointment]} />
      )}
    </div>
  )
}
