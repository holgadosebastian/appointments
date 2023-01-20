import React, { useState } from "react"

const required = description => value => (!value || value.trim() === "" ? description : undefined)
const match = (re, description) => value => (!value.match(re) ? description : undefined)
const list = (...validators) => value => validators.reduce((result, validator) => result || validator(value), undefined)

const Error = ({ hasError }) => <p role="alert">{hasError ? "An error occurred during save." : ""}</p>

export const CustomerForm = ({ original, onSave }) => {
  const [customer, setCustomer] = useState(original)
  const [error, setError] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  const validators = {
    firstName: required("First name is required"),
    lastName: required("Last name is required"),
    phoneNumber: list(
      required("Phone number is required"),
      match(/^[0-9+()\- ]*$/, "Only numbers, spaces and the symbols are allowed: ( ) + -")
    ),
  }

  const handleSubmit = async event => {
    event.preventDefault()

    setError(false)

    const validationResult = validateMany(customer)
    if (!anyErrors(validationResult)) {
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
    } else {
      setValidationErrors(validationResult)
    }
  }

  const handleChange = ({ target }) => {
    setCustomer(customer => ({
      ...customer,
      [target.name]: target.value,
    }))
  }

  const handleBlur = ({ target }) => {
    const result = validators[target.name](target.value)
    setValidationErrors({
      ...validationErrors,
      [target.name]: result,
    })
  }

  const hasError = fieldName => validationErrors[fieldName] !== undefined

  const renderError = fieldName => (
    <span id={`${fieldName}Error`} role="alert">
      {hasError(fieldName) ? validationErrors[fieldName] : ""}
    </span>
  )

  const validateMany = fields =>
    Object.entries(fields).reduce((result, [name, value]) => ({ ...result, [name]: validators[name](value) }), {})

  const anyErrors = errors => Object.values(errors).some(error => error !== undefined)

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
      {renderError("firstName")}

      <label htmlFor="lastName">Last name</label>
      <input
        type="text"
        name="lastName"
        id="lastName"
        value={customer.lastName}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-describedby="lastNameError"
      />
      {renderError("lastName")}

      <label htmlFor="phoneNumber">Phone number</label>
      <input
        type="text"
        name="phoneNumber"
        id="phoneNumber"
        value={customer.phoneNumber}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-describedby="phoneNumberError"
      />
      {renderError("phoneNumber")}

      <input type="submit" value="Add" />
    </form>
  )
}
