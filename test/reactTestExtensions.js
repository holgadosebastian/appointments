import ReactDOM from "react-dom/client"
import { act } from "react-dom/test-utils"

export let container

export const initializeReactContainer = () => {
  container = document.createElement("div")
  document.body.replaceChildren(container)
}

export const render = component => act(() => ReactDOM.createRoot(container).render(component))

export const click = element => act(() => element.click())

export const element = selector => document.querySelector(selector)

export const elements = selector => Array.from(document.querySelectorAll(selector))

export const typeOf = elements => elements.map(element => element.type)

export const textOf = elements => elements.map(element => element.textContent)

export const form = () => element("form")

export const field = fieldName => form().elements[fieldName]

export const labelFor = fieldName => element(`label[for=${fieldName}]`)

export const labelsOfAllOptions = field => Array.from(field.childNodes).map(option => option.textContent)

export const submit = formElement => {
  const event = new Event("submit", {
    bubbles: true,
    cancelable: true,
  })

  act(() => formElement.dispatchEvent(event))

  return event
}

export const originalValueProperty = reactElement => {
  const prototype = Object.getPrototypeOf(reactElement)

  return Object.getOwnPropertyDescriptor(prototype, "value")
}

export const change = (target, value) => {
  originalValueProperty(target).set.call(target, value)
  const event = new Event("change", {
    target,
    bubbles: true,
  })
  act(() => target.dispatchEvent(event))
}

export const submitButton = () => element("input[type=submit]")

export const clickAndWait = async element => act(async () => click(element))

export const submitAndWait = async formElement => act(async () => submit(formElement))

export const renderAndWait = component => act(async () => ReactDOM.createRoot(container).render(component))
