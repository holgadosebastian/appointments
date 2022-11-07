import { matcherHint, printExpected, printReceived } from "jest-matcher-utils";

export const toContainText = (received, expectedText) => {
  const pass = received.textContent.includes(expectedText)

  const sourceHint = () => matcherHint("toContainText", "element", printExpected(expectedText), { isNot: pass });
  const actualHint = () => `Actual text: ${printReceived(received.textContent)}
  `
  const message = () => [sourceHint(), actualHint()].join("\n\n");

  return { pass, message }
}