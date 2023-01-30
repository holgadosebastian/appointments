const defaultState = {
  customer: {},
  status: undefined,
  validationErrors: {},
  error: false,
}

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case "ADD_CUSTOMER_SUBMITTING":
      return { status: "SUBMITTING" }
    default:
      return state
  }
}
