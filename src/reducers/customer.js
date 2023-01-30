const defaultState = {
  customer: {},
  status: undefined,
  validationErrors: {},
  error: false,
}

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case "ADD_CUSTOMER_SUBMITTING":
      return { ...state, status: "SUBMITTING" }
    case "ADD_CUSTOMER_SUCCESSFUL":
      return { ...state, status: "SUCCESSFUL" }
    default:
      return state
  }
}
