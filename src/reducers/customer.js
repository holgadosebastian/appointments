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
      return { ...state, customer: action.customer, status: "SUCCESSFUL", error: false }
    case "ADD_CUSTOMER_FAILED":
      return { ...state, status: "FAILED", error: true }
    case "ADD_CUSTOMER_VALIDATION_FAILED":
      return { ...state, status: "VALIDATION_FAILED", validationErrors: action.validationErrors }
    default:
      return state
  }
}
