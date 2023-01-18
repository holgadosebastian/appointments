import { equals } from "@jest/expect-utils"
import { matcherHint, printExpected, printReceived } from "jest-matcher-utils"

export const toBeRenderedWithProps = (mockedComponent, expectedProps) => {
  const mockedCall = mockedComponent.mock.calls[mockedComponent.mock.calls.length - 1]
  const actualProps = mockedCall ? mockedCall[0] : null
  const pass = equals(actualProps, expectedProps)

  const sourceHint = () =>
    matcherHint("toBeRenderedWithProps", "Component", printExpected(expectedProps), { isNot: pass })
  const actualHint = () => `Actual props: ${printReceived(actualProps)}
  `
  const message = () => [sourceHint(), actualHint()].join("\n\n")

  return { pass, message }
}
