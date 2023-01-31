import { storeSpy, expectRedux } from "expect-redux"
import { configureStore } from "../../src/store"

describe("addCustomer", () => {
  let store

  beforeEach(() => {
    jest.spyOn(global, "fetch")
    store = configureStore([storeSpy])
  })

  const addCustomerRequest = customer => ({
    type: "ADD_CUSTOMER_REQUEST",
    customer,
  })

  it("sets current status to submitting", () => {
    store.dispatch(addCustomerRequest())

    return expectRedux(store).toDispatchAnAction().matching({ type: "ADD_CUSTOMER_SUBMITTING" })
  })

  it("sends HTTP request to POST /customers", async () => {
    const inputCustomer = { firstName: "Ashley" }
    store.dispatch(addCustomerRequest(inputCustomer))

    expect(global.fetch).toBeCalledWith(
      "/customers",
      expect.objectContaining({
        method: "POST",
      })
    )
  })
})
