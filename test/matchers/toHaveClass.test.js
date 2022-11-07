import { toHaveClass } from "./toHaveClass"
import { stripTerminalColor } from "./matcherUtils"

describe("toContainText matcher", () => {
  it("returns pass is true when class is found in the given DOM element", () => {
    const div = document.createElement("div")
    div.classList.add("testClass")

    const result = toHaveClass(div, "testClass")
    expect(result.pass).toBe(true)
  })

  it("returns pass is false when text is found in the given DOM element", () => {
    const div = document.createElement("div")

    const result = toHaveClass(div, "testClass")
    expect(result.pass).toBe(false)
  })

  it("returns a message that contains the source line if no match", () => {
    const div = document.createElement("div")

    const result = toHaveClass(div, "testClass")
    expect(stripTerminalColor(result.message())).toContain(`expect(element).toHaveClass("testClass")`)
  })

  it("returns a message that contains the source line if negated match", () => {
    const div = document.createElement("div")
    div.classList.add("testClass")

    const result = toHaveClass(div, "testClass")
    expect(stripTerminalColor(result.message())).toContain(`expect(element).not.toHaveClass("testClass")`)
  })

  it("returns a message that contains the actual classes", () => {
    const div = document.createElement("div")
    div.classList.add("testClass")
    div.classList.add("testClass2")

    const result = toHaveClass(div, "testClass")
    expect(stripTerminalColor(result.message())).toContain(`Actual classes: "testClass testClass2"`)
  })
})
