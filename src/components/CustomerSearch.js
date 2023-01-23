import React, { useEffect, useState, useCallback } from "react"

const CustomerRow = ({ customer }) => (
  <tr>
    <td>{customer.firstName}</td>
    <td>{customer.lastName}</td>
    <td>{customer.phoneNumber}</td>
  </tr>
)

const SearchButtons = ({ handleNext }) => (
  <menu>
    <li>
      <button onClick={handleNext}>Next</button>
    </li>
  </menu>
)

export const CustomerSearch = () => {
  const [customers, setCustomers] = useState([])
  const [queryString, setQueryString] = useState("")

  useEffect(() => {
    const getCustomers = async () => {
      const result = await global.fetch(`/customers${queryString}`, {
        method: "GET",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      })

      const data = await result.json()
      setCustomers(data)
    }

    getCustomers()
  }, [queryString])

  const handleNext = useCallback(async () => {
    const after = customers[customers.length - 1].id
    const newQueryString = `?after=${after}`
    setQueryString(newQueryString)
  }, [customers])

  return (
    <>
      <SearchButtons handleNext={handleNext} />
      <table>
        <thead>
          <tr>
            <th>First name</th>
            <th>Last name</th>
            <th>Phone number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <CustomerRow key={customer.id} customer={customer} />
          ))}
        </tbody>
      </table>
    </>
  )
}
