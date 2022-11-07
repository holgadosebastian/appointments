import { matcherHint, printExpected, printReceived } from "jest-matcher-utils"

export const toBeInputFieldOfType = (received, expectedText) => {
  const pass = received.type === expectedText

  const sourceHint = () => matcherHint("toBeInputFieldOfType", "element", printExpected(expectedText), { isNot: pass })
  const actualHint = () => `Actual type: ${printReceived(received.type)}
  `
  const message = () => [sourceHint(), actualHint()].join("\n\n")

  return { pass, message }
}
