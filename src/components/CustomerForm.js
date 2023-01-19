import React, { useState } from "react"

const Error = ({ hasError }) => <p role="alert">{hasError ? "An error occurred during save." : ""}</p>

export const CustomerForm = ({ original, onSave }) => {
  const [customer, setCustomer] = useState(original)
  const [error, setError] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()

    setError(false)

    const result = await global.fetch("/customers", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    })

    if (result.ok) {
      const customerWithId = await result.json()
      onSave(customerWithId)
    } else {
      setError(true)
    }
  }

  const handleChange = ({ target }) => {
    setCustomer(customer => ({
      ...customer,
      [target.name]: target.value,
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <Error hasError={error} />

      <label htmlFor="firstName">First name</label>
      <input
        type="text"
        name="firstName"
        id="firstName"
        value={customer.firstName}
        onChange={handleChange}
        aria-describedby="firstNameError"
      />
      <span id="firstNameError" role="alert"></span>

      <label htmlFor="lastName">Last name</label>
      <input type="text" name="lastName" id="lastName" value={customer.lastName} onChange={handleChange} />

      <label htmlFor="phoneNumber">Phone number</label>
      <input type="text" name="phoneNumber" id="phoneNumber" value={customer.phoneNumber} onChange={handleChange} />

      <input type="submit" value="Add" />
    </form>
  )
}
