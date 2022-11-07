import { matcherHint, printExpected, printReceived } from "jest-matcher-utils";

export const toHaveClass = (received, expectedText) => {
  const pass = received.classList.contains(expectedText);

  const sourceHint = () => matcherHint("toHaveClass", "element", printExpected(expectedText), { isNot: pass });
  const actualHint = () => `Actual classes: ${printReceived(Array.from(received.classList).join(" "))}
  `
  const message = () => [sourceHint(), actualHint()].join("\n\n");

  return { pass, message }
}