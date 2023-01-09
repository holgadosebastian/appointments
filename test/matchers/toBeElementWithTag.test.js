import { toBeElementWithTag } from "./toBeElementWithTag"
import { stripTerminalColor } from "./matcherUtils"

describe("toBeInputFieldOfType matcher", () => {
  it("returns pass is true when tagName matches DOM element's tagName", () => {
    const element = document.createElement("div")

    const result = toBeElementWithTag(element, "DIV")
    expect(result.pass).toBe(true)
  })

  it("returns pass is false when tagName is different in the given DOM element", () => {
    const element = document.createElement("div")

    const result = toBeElementWithTag(element, "SPAN")
    expect(result.pass).toBe(false)
  })

  it("returns a message that contains the source line if no match", () => {
    const element = document.createElement("div")

    const result = toBeElementWithTag(element, "SPAN")
    expect(stripTerminalColor(result.message())).toContain(`expect(element).toBeElementWithTag("SPAN")`)
  })

  it("returns a message that contains the source line if negated match", () => {
    const element = document.createElement("div")

    const result = toBeElementWithTag(element, "DIV")
    expect(stripTerminalColor(result.message())).toContain(`expect(element).not.toBeElementWithTag("DIV")`)
  })

  it("returns a message that contains the actual tagName", () => {
    const element = document.createElement("div")

    const result = toBeElementWithTag(element, "SPAN")
    expect(stripTerminalColor(result.message())).toContain(`Actual tagName: "DIV"`)
  })
})
