import React, { useState } from "react"
import { required, match, list, hasError, validateMany, anyErrors } from "../utils/formValidations"

const Error = ({ hasError }) => (
  <p className="text-sm text-red-500" role="alert">
    {hasError ? "An error occurred during save." : ""}
  </p>
)

export const CustomerForm = ({ original, onSave }) => {
  const [customer, setCustomer] = useState(original)
  const [error, setError] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validators = {
    firstName: required("First name is required"),
    lastName: required("Last name is required"),
    phoneNumber: list(
      required("Phone number is required"),
      match(/^[0-9+()\- ]*$/, "Only numbers, spaces and the symbols are allowed: ( ) + -")
    ),
  }

  const doSave = async () => {
    const result = await global.fetch("/customers", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    })

    if (result.ok) {
      const customerWithId = await result.json()
      onSave(customerWithId)
      setIsSubmitted(true)
    } else if (result.status === 422) {
      const response = await result.json()
      setValidationErrors(response.errors)
    } else {
      setError(true)
    }
  }

  const handleSubmit = async event => {
    event.preventDefault()

    setSubmitting(true)
    setError(false)

    const validationResult = validateMany(validators, customer)
    if (!anyErrors(validationResult)) {
      await doSave()
    } else {
      setValidationErrors(validationResult)
    }

    setSubmitting(false)
  }

  const validateField = (name, value) => {
    const result = validateMany(validators, {
      [name]: value,
    })

    setValidationErrors({
      ...validationErrors,
      ...result,
    })
  }

  const handleChange = ({ target }) => {
    setCustomer(customer => ({
      ...customer,
      [target.name]: target.value,
    }))
    validateField(target.name, target.value)
  }

  const handleBlur = ({ target }) => {
    validateField(target.name, target.value)
  }

  const renderError = fieldName => {
    return hasError(validationErrors, fieldName) ? (
      <p className="mt-2 text-sm text-red-500" id={`${fieldName}Error`} role="alert">
        {validationErrors[fieldName]}
      </p>
    ) : null
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label className="block mb-2" htmlFor="firstName">
          First name
        </label>
        <input
          className="block w-full border border-slate-300 rounded text-md px-2 py-1"
          type="text"
          name="firstName"
          id="firstName"
          value={customer.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-describedby="firstNameError"
        />
        {renderError("firstName")}
      </div>

      <div>
        <label className="block mb-2" htmlFor="lastName">
          Last name
        </label>
        <input
          className="block w-full border border-slate-300 rounded text-md px-2 py-1"
          type="text"
          name="lastName"
          id="lastName"
          value={customer.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-describedby="lastNameError"
        />
        {renderError("lastName")}
      </div>

      <div>
        <label className="block mb-2" htmlFor="phoneNumber">
          Phone number
        </label>
        <input
          className="block w-full border border-slate-300 rounded text-md px-2 py-1"
          type="text"
          name="phoneNumber"
          id="phoneNumber"
          value={customer.phoneNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-describedby="phoneNumberError"
        />
        {renderError("phoneNumber")}
      </div>

      <Error hasError={error} />

      <input
        className="mt-2 block w-full px-2 py-1 bg-teal-500 text-white rounded text-sm cursor-pointer"
        type="submit"
        value="Add"
        disabled={isSubmitted}
      />
      {submitting && <span className="submittingIndicator">Loading</span>}
    </form>
  )
}
