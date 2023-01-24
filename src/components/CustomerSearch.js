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

const searchParams = (after, searchTerm) => {
  let pairs = []
  if (after) {
    pairs.push(`after=${after}`)
  }
  if (searchTerm) {
    pairs.push(`searchTerm=${searchTerm}`)
  }
  if (pairs.length > 0) {
    return `?${pairs.join("&")}`
  }

  return ""
}

export const CustomerSearch = () => {
  const [customers, setCustomers] = useState([])
  const [lastRowIds, setLastRowIds] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const getCustomers = async () => {
      const after = lastRowIds[lastRowIds.length - 1]
      const queryString = searchParams(after, searchTerm)

      const result = await global.fetch(`/customers${queryString}`, {
        method: "GET",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      })

      const data = await result.json()
      setCustomers(data)
    }

    getCustomers()
  }, [lastRowIds, searchTerm])

  const handleNext = useCallback(async () => {
    const currentRowLastId = customers[customers.length - 1].id
    setLastRowIds([...lastRowIds, currentRowLastId])
  }, [customers, lastRowIds])

  const handlePrevious = useCallback(() => setLastRowIds(lastRowIds.slice(0, -1)), [lastRowIds])

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
