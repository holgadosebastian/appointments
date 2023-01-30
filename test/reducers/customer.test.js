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
  })
})
