import "./styles/index.css"

import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import { App } from "./App"

const root = document.createElement("root")
document.body.appendChild(root)
ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
