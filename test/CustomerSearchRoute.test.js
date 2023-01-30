import React from "react"
import { initializeReactContainer, renderWithRouter } from "./reactTestExtensions"
import { CustomerSearchRoute } from "../src/components/CustomerSearchRoute"
import { CustomerSearch } from "../src/components/CustomerSearch"

jest.mock("../src/components/CustomerSearch", () => ({
  CustomerSearch: jest.fn(() => <div id="CustomerSearch" />),
}))

describe("AppointmentFormLoader", () => {
  beforeEach(() => {
    initializeReactContainer()
  })

  it("parses lastRowIds from query string", () => {
    const location = `?lastRowIds=${encodeURIComponent("1,2,3")}`
    renderWithRouter(<CustomerSearchRoute />, { location })

    expect(CustomerSearch).toBeRenderedWithProps(expect.objectContaining({ lastRowIds: ["1", "2", "3"] }))
  })
})
