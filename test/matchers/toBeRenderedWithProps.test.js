import React from "react"
import { toBeRenderedWithProps } from "./toBeRenderedWithProps"
import { initializeReactContainer, render } from "../reactTestExtensions"
import { stripTerminalColor } from "./matcherUtils"

describe("toBeRenderedWithProps", () => {
  let Component

  beforeEach(() => {
    initializeReactContainer()
    Component = jest.fn(() => <div />)
  })

  it("returns pass is true when mock has been rendered", () => {
    render(<Component />)
    const result = toBeRenderedWithProps(Component, {})
    expect(result.pass).toBe(true)
  })

  it("returns pass is false when the mock has not been rendered", () => {
    const result = toBeRenderedWithProps(Component, {})
    expect(result.pass).toBe(false)
  })

  it("returns pass is false when the properties do not match", () => {
    render(<Component a="b" />)
    const result = toBeRenderedWithProps(Component, { c: "d" })
    expect(result.pass).toBe(false)
  })

  it("returns pass is true when the properties of the last render match", () => {
    render(<Component a="b" />)
    render(<Component c="d" />)

    const result = toBeRenderedWithProps(Component, { c: "d" })
    expect(result.pass).toBe(true)
  })

  it("returns a message if no match", () => {
    render(<Component a="b" />)
    const result = toBeRenderedWithProps(Component, { c: "d" })

    expect(stripTerminalColor(result.message())).toContain(`expect(Component).toBeRenderedWithProps({\"c\": \"d\"})`)
  })

  it("returns a message that contains the source line if negated match", () => {
    render(<Component a="b" />)
    const result = toBeRenderedWithProps(Component, { a: "b" })

    expect(stripTerminalColor(result.message())).not.toContain(
      `expect(element).not.toBeRenderedWithProps({\"c\": \"d\"})`
    )
  })

  it("returns a message that contains the actual text", () => {
    render(<Component a="b" />)
    const result = toBeRenderedWithProps(Component, { a: "b" })

    expect(stripTerminalColor(result.message())).toContain(`Actual props: {\"a\": \"b\"}`)
  })
})
