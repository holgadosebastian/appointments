import React, { useState, useEffect } from "react"
import { fetchQuery, graphql } from "relay-runtime"
import { getEnvironment } from "../relayEnvironment"

export const query = graphql`
  query CustomerHistoryQuery($id: ID!) {
    customer(id: $id) {
      id
      firstName
      lastName
      phoneNumber
      appointments {
        startsAt
        stylist
        service
        notes
      }
    }
  }
`

export const CustomerHistory = ({ id }) => {
  const [customer, setCustomer] = useState(null)

  useEffect(() => {
    const subscription = fetchQuery(getEnvironment(), query, { id }).subscribe({
      next: ({ customer }) => setCustomer(customer),
    })

    return subscription.unsubscribe
  }, [id])

  if (!customer) return null

  const { firstName, lastName, phoneNumber } = customer

  return (
    <>
      <h2>
        {firstName} {lastName}
      </h2>
      <p>{phoneNumber}</p>
    </>
  )
}
