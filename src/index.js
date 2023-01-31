import "./styles/index.css"

import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { unstable_HistoryRouter as HistoryRouter } from "./history"
import { appHistory } from "./history"
import { configureStore } from "./store"

import { App } from "./App"

const root = document.createElement("root")
document.body.appendChild(root)
ReactDOM.createRoot(root).render(
  <Provider store={configureStore()}>
    <HistoryRouter history={appHistory}>
      <App />
    </HistoryRouter>
  </Provider>
)
