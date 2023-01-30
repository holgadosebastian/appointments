import { reducer } from "../../src/reducers/customer"

describe("customer reducer", () => {
  it("returns a default state for an unefined existing state", () => {
    expect(reducer(undefined, {})).toEqual({
      customer: {},
      status: undefined,
      validationErrors: {},
      error: false,
    })
  })

  describe("ADD_CUSTOMER_SUBMITTING action", () => {
    const action = { type: "ADD_CUSTOMER_SUBMITTING" }

    it("sets status to SUBMITTING", () => {
      expect(reducer(undefined, action)).toMatchObject({
        status: "SUBMITTING",
      })
    })

    it("mantains existing state", () => {
      expect(reducer({ a: 123 }, action)).toMatchObject({ a: 123 })
    })
  })

  describe("ADD_CUSTOMER_SUCCESSFUL action", () => {
    const customer = { id: 123 }
    const action = {
      type: "ADD_CUSTOMER_SUCCESSFUL",
      customer,
    }

    it("sets status to SUCCESSFUL", () => {
      expect(reducer(undefined, action)).toMatchObject({
        status: "SUCCESSFUL",
      })
    })

    it("mantains existing state", () => {
      expect(reducer({ a: 123 }, action)).toMatchObject({
        a: 123,
      })
    })

    it("sets customer to provided customer", () => {
      expect(reducer(undefined, action)).toMatchObject({
        customer,
      })
    })
  })
})
