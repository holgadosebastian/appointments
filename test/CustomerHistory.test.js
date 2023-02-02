import React from "react"
import { act } from "react-dom/test-utils"
import {
  initializeReactContainer,
  render,
  renderAndWait,
  container,
  element,
  elements,
  textOf,
} from "./reactTestExtensions"
import { fetchQuery } from "relay-runtime"
import { CustomerHistory, query } from "../src/components/CustomerHistory"
import { getEnvironment } from "../src/relayEnvironment"
jest.mock("relay-runtime")
jest.mock("../src/relayEnvironment")

const date = new Date("February 16, 2019")
const appointments = [
  {
    startsAt: date.setHours(9, 0, 0, 0),
    stylist: "Jo",
    service: "Cut",
    notes: "Note one",
  },
  {
    startsAt: date.setHours(10, 0, 0, 0),
    stylist: "Stevie",
    service: "Cut & color",
    notes: "Note two",
  },
]

const customer = {
  firstName: "Ashley",
  lastName: "Jones",
  phoneNumber: "123",
  appointments,
}

describe("CustomerHistory", () => {
  let unsubscribeSpy = jest.fn()

  const sendCustomer = ({ next }) => {
    act(() => next({ customer }))
    return { unsubscribe: unsubscribeSpy }
  }

  beforeEach(() => {
    initializeReactContainer()
    fetchQuery.mockReturnValue({ subscribe: sendCustomer })
  })

  it("calls fetchQuery", async () => {
    await renderAndWait(<CustomerHistory id={123} />)
    expect(fetchQuery).toBeCalledWith(getEnvironment(), query, { id: 123 })
  })

  it("unsubscribes when id changes", async () => {
    await renderAndWait(<CustomerHistory id={123} />)
    await renderAndWait(<CustomerHistory id={234} />)
    expect(unsubscribeSpy).toBeCalled()
  })

  it("renders the first name and last name together in a h2", async () => {
    await renderAndWait(<CustomerHistory id={123} />)
    await new Promise(setTimeout)
    expect(element("h2")).toContainText("Ashley Jones")
  })

  it("renders the phone number", async () => {
    await renderAndWait(<CustomerHistory id={123} />)
    expect(document.body).toContainText("123")
  })
})
