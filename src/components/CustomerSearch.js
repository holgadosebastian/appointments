import React, { useEffect, useState } from "react"

const CustomerRow = ({ customer }) => (
  <tr>
    <td>{customer.firstName}</td>
    <td>{customer.lastName}</td>
    <td>{customer.phoneNumber}</td>
  </tr>
)

const SearchButtons = () => (
  <menu>
    <li>
      <button>Next</button>
    </li>
  </menu>
)

export const CustomerSearch = () => {
  const [costumers, setCostumers] = useState([])

  useEffect(() => {
    const getCustomers = async () => {
      const result = await global.fetch("/customers", {
        method: "GET",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      })

      const data = await result.json()
      setCostumers(data)
    }

    getCustomers()
  }, [])

  return (
    <>
      <SearchButtons />
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
          {costumers.map(customer => (
            <CustomerRow key={customer.id} customer={customer} />
          ))}
        </tbody>
      </table>
    </>
  )
}
