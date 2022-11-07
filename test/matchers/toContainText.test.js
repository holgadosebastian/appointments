import { toContainText } from "./toContainText"
import { stripTerminalColor } from "./matcherUtils"

describe("toContainText matcher", () => {
  it("returns pass is true when text is found in the given DOM element", () => {
    const domElement = {
      textContent: "text to find",
    }

    const result = toContainText(domElement, "text to find")
    expect(result.pass).toBe(true)
  })

  it("returns pass is true when text is found in the given DOM element", () => {
    const domElement = {
      textContent: "",
    }

    const result = toContainText(domElement, "text to find")
    expect(result.pass).toBe(false)
  })

  it("returns a message that contains the source line if no match", () => {
    const domElement = {
      textContent: "",
    }

    const result = toContainText(domElement, "text to find")
    expect(stripTerminalColor(result.message())).toContain(`expect(element).toContainText("text to find")`)
  })

  it("returns a message that contains the source line if negated match", () => {
    const domElement = {
      textContent: "text to find",
    }

    const result = toContainText(domElement, "text to find")
    expect(stripTerminalColor(result.message())).toContain(`expect(element).not.toContainText("text to find")`)
  })

  it("returns a message that contains the actual text", () => {
    const domElement = {
      textContent: "text to find",
    }

    const result = toContainText(domElement, "text to find")
    expect(stripTerminalColor(result.message())).toContain(`Actual text: "text to find"`)
  })
})
