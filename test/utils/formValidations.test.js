import { required, match, list, validateMany, anyErrors, hasError } from "../../src/utils/formValidations"

describe("formValidations", () => {
  const validators = {
    firstName: required("First name is required"),
    lastName: required("Last name is required"),
    phoneNumber: list(
      required("Phone number is required"),
      match(/^[0-9+()\- ]*$/, "Only numbers, spaces and the symbols are allowed: ( ) + -")
    ),
  }

  const validationErrors = {
    phoneNumber: "Phone must contain numbers",
  }

  describe("hasError", () => {
    it("returns true if validation for fieldName is not empty", () => {
      const result = hasError(validationErrors, "phoneNumber")
      expect(result).toBe(true)
    })

    it("returns false if validation for fieldName is empty", () => {
      const result = hasError(validationErrors, "firstName")
      expect(result).toBe(false)
    })
  })
})
