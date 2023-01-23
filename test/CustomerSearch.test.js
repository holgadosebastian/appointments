import React from "react"
import { initializeReactContainer, elements, renderAndWait, textOf } from "./reactTestExtensions"
import { CustomerSearch } from "../src/components/CustomerSearch"

describe("CustomerSearch", () => {
  beforeEach(() => {
    initializeReactContainer()
  })

  it("renders a table with four headings", async () => {
    await renderAndWait(<CustomerSearch />)
    const headings = elements("table th")
    expect(textOf(headings)).toEqual(["First name", "Last name", "Phone number", "Actions"])
  })
})
