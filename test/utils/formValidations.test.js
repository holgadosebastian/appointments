import { required, match, list, validateMany, anyErrors, hasError } from "../../src/utils/formValidations"

describe("formValidations", () => {
  const validationErrors = {
    phoneNumber: "Phone must contain numbers",
  }

  describe("required", () => {
    it("returns a callback function", () => {
      const result = required("First name is required")
      console.log("result", result)
      expect(typeof result).toBe("function")
    })

    describe("passing an argument to callback function", () => {
      it("returns description text if value is empty", () => {
        const result = required("First name is required")("")
        expect(result).toEqual("First name is required")
      })

      it("returns description text if value is empty", () => {
        const result = required("First name is required")(" ")
        expect(result).toEqual("First name is required")
      })
    })
  })

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
