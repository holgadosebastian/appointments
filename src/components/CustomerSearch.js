import React, { useEffect, useState, useCallback } from "react"

const CustomerRow = ({ customer }) => (
  <tr>
    <td>{customer.firstName}</td>
    <td>{customer.lastName}</td>
    <td>{customer.phoneNumber}</td>
  </tr>
)

const SearchButtons = ({ handleNext, handlePrevious }) => (
  <menu>
    <li>
      <button onClick={handlePrevious}>Previous</button>
    </li>
    <li>
      <button onClick={handleNext}>Next</button>
    </li>
  </menu>
)

export const CustomerSearch = () => {
  const [customers, setCustomers] = useState([])
  const [queryStrings, setQueryStrings] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const getCustomers = async () => {
      let queryString = ""
      if (queryStrings.length > 0 && searchTerm !== "") {
        queryString = queryStrings[queryStrings.length - 1] + `&searchTerm=${searchTerm}`
      } else if (searchTerm !== "") {
        queryString = `?searchTerm=${searchTerm}`
      } else if (queryStrings.length > 0) {
        queryString = queryStrings[queryStrings.length - 1]
      }

      const result = await global.fetch(`/customers${queryString}`, {
        method: "GET",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      })

      const data = await result.json()
      setCustomers(data)
    }

    getCustomers()
  }, [queryStrings, searchTerm])

  const handleNext = useCallback(async () => {
    const after = customers[customers.length - 1].id
    const newQueryString = `?after=${after}`
    setQueryStrings([...queryStrings, newQueryString])
  }, [customers, queryStrings])

  const handlePrevious = useCallback(() => setQueryStrings(queryStrings.slice(0, -1)), [queryStrings])

  const handleSearchTextChanged = ({ target: { value } }) => setSearchTerm(value)

  return (
    <>
      <input value={searchTerm} onChange={handleSearchTextChanged} placeholder="Enter filter text" />
      <SearchButtons handleNext={handleNext} handlePrevious={handlePrevious} />
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
