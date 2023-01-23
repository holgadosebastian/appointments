import React from "react"
import { initializeReactContainer, elements, renderAndWait, textOf } from "./reactTestExtensions"
import { fetchResponseOk } from "./builders/fetch"
import { CustomerSearch } from "../src/components/CustomerSearch"

const oneCustomer = [
  {
    id: 1,
    firstName: "A",
    lastName: "B",
    phoneNumber: "1",
  },
]

describe("CustomerSearch", () => {
  beforeEach(() => {
    initializeReactContainer()
    jest.spyOn(global, "fetch").mockResolvedValue(fetchResponseOk([]))
  })

  it("renders a table with four headings", async () => {
    await renderAndWait(<CustomerSearch />)
    const headings = elements("table th")
    expect(textOf(headings)).toEqual(["First name", "Last name", "Phone number", "Actions"])
  })

  it("fetches all customer data when component mounts", async () => {
    await renderAndWait(<CustomerSearch />)
    expect(global.fetch).toBeCalledWith("/customers", {
      method: "GET",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
    })
  })

  it("renders all customer data in a table row", async () => {
    global.fetch.mockResolvedValue(fetchResponseOk(oneCustomer))
    await renderAndWait(<CustomerSearch />)
    const columns = elements("table > tbody > tr > td")
    expect(columns[0]).toContainText("A")
    expect(columns[1]).toContainText("B")
    expect(columns[2]).toContainText("1")
  })
})
