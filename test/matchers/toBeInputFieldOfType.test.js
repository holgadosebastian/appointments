import { toBeInputFieldOfType } from "./toBeInputFieldOfType"
import { stripTerminalColor } from "./matcherUtils"

describe("toBeInputFieldOfType matcher", () => {
  it("returns pass is true when type of field matches DOM element", () => {
    const input = document.createElement("input")
    input.type = "text"

    const result = toBeInputFieldOfType(input, "text")
    expect(result.pass).toBe(true)
  })

  it("returns pass is false when type is different in the given DOM element", () => {
    const input = document.createElement("input")
    input.type = "text"

    const result = toBeInputFieldOfType(input, "password")
    expect(result.pass).toBe(false)
  })

  it("returns a message that contains the source line if no match", () => {
    const input = document.createElement("input")
    input.type = "text"

    const result = toBeInputFieldOfType(input, "password")
    expect(stripTerminalColor(result.message())).toContain(`expect(element).toBeInputFieldOfType("password")`)
  })

  it("returns a message that contains the source line if negated match", () => {
    const input = document.createElement("input")
    input.type = "text"

    const result = toBeInputFieldOfType(input, "text")
    expect(stripTerminalColor(result.message())).toContain(`expect(element).not.toBeInputFieldOfType("text")`)
  })

  it("returns a message that contains the actual type", () => {
    const input = document.createElement("input")
    input.type = "text"

    const result = toBeInputFieldOfType(input, "password")
    expect(stripTerminalColor(result.message())).toContain(`Actual type: "text"`)
  })
})
