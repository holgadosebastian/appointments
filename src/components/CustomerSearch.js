import React, { useEffect, useState, useCallback } from "react"
import { objectToQueryString } from "../utils/objectToQueryString"

const CustomerRow = ({ customer, renderCustomerActions }) => (
  <tr>
    <td>{customer.firstName}</td>
    <td>{customer.lastName}</td>
    <td>{customer.phoneNumber}</td>
    <td>{renderCustomerActions(customer)}</td>
  </tr>
)

const SearchButtons = ({ handleNext, handlePrevious, isFirstPage, resultsCount }) => (
  <menu>
    <li>
      <button onClick={handlePrevious} disabled={isFirstPage}>
        Previous
      </button>
    </li>
    <li>
      <button onClick={handleNext} disabled={resultsCount < 10}>
        Next
      </button>
    </li>
  </menu>
)

export const CustomerSearch = ({ renderCustomerActions }) => {
  const [customers, setCustomers] = useState([])
  const [lastRowIds, setLastRowIds] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const getCustomers = async () => {
      const after = lastRowIds[lastRowIds.length - 1]
      const queryString = objectToQueryString({ after, searchTerm })

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

  const isFirstPage = lastRowIds.length === 0

  return (
    <>
      <input value={searchTerm} onChange={handleSearchTextChanged} placeholder="Enter filter text" />
      <SearchButtons
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        isFirstPage={isFirstPage}
        resultsCount={customers.length}
      />
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
            <CustomerRow key={customer.id} customer={customer} renderCustomerActions={renderCustomerActions} />
          ))}
        </tbody>
      </table>
    </>
  )
}

CustomerSearch.defaultProps = {
  renderCustomerActions: () => {},
}
