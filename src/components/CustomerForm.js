import React, { useState } from "react"

const required = description => value => (!value || value.trim() === "" ? description : undefined)

const Error = ({ hasError }) => <p role="alert">{hasError ? "An error occurred during save." : ""}</p>

export const CustomerForm = ({ original, onSave }) => {
  const [customer, setCustomer] = useState(original)
  const [error, setError] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

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

  const handleBlur = ({ target }) => {
    const validators = {
      firstName: required("First name is required"),
    }
    const result = validators[target.name](target.value)
    setValidationErrors({
      ...validationErrors,
      [target.name]: result,
    })
  }

  const hasError = fieldName => validationErrors[fieldName] !== undefined

  const renderFirstNameError = fieldName => (
    <span id={`${fieldName}Error`} role="alert">
      {hasError(fieldName) ? validationErrors[fieldName] : ""}
    </span>
  )

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
        onBlur={handleBlur}
        aria-describedby="firstNameError"
      />
      {renderFirstNameError("firstName")}

      <label htmlFor="lastName">Last name</label>
      <input type="text" name="lastName" id="lastName" value={customer.lastName} onChange={handleChange} />

      <label htmlFor="phoneNumber">Phone number</label>
      <input type="text" name="phoneNumber" id="phoneNumber" value={customer.phoneNumber} onChange={handleChange} />

      <input type="submit" value="Add" />
    </form>
  )
}
