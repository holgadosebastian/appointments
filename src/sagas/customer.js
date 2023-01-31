import { put, call } from "redux-saga/effects"

const fetch = (url, data) => {
  global.fetch(url, {
    method: "POST",
  })
}

export function* addCustomer({ customer }) {
  yield put({ type: "ADD_CUSTOMER_SUBMITTING" })
  yield call(fetch, "/customers", customer)
}
