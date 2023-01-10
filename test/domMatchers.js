import { toContainText } from "./matchers/toContainText"
import { toHaveClass } from "./matchers/toHaveClass"
import { toBeInputFieldOfType } from "./matchers/toBeInputFieldOfType"
import { toBeElementWithTag } from "./matchers/toBeElementWithTag"

expect.extend({ toContainText, toHaveClass, toBeInputFieldOfType, toBeElementWithTag })

expect.extend({
  toBeCalledWith(recieved, ...expectedArguments) {
    if (recieved.recievedArguments() === undefined) {
      return {
        pass: false,
        message: () => "Spy was not called",
      }
    }

    const notMatch = !this.equals(recieved.recievedArguments(), expectedArguments)

    if (notMatch) {
      return {
        pass: false,
        message: () => `Spy called with the wrong arguments: ${recieved.recievedArguments()}.`,
      }
    }

    return {
      pass: true,
      message: () => "Spy was called",
    }
  },
})
