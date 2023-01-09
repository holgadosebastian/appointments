import { matcherHint, printExpected, printReceived } from "jest-matcher-utils"

export const toBeElementWithTag = (received, expectedTag) => {
  const pass = received.tagName === expectedTag

  const sourceHint = () => matcherHint("toBeElementWithTag", "element", printExpected(expectedTag), { isNot: pass })
  const actualHint = () => `Actual tagName: ${printReceived(received.tagName)}
  `
  const message = () => [sourceHint(), actualHint()].join("\n\n")

  return { pass, message }
}
