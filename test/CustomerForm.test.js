import React from "react"
import {
  initializeReactContainer,
  render,
  form,
  field,
  click,
  submit,
  submitButton,
  change,
  labelFor,
} from "./reactTestExtensions"
import { CustomerForm } from "../src/components/CustomerForm"

describe("CustomerForm", () => {
  const blankCustomer = { firstName: "", lastName: "", phoneNumber: "" }

  beforeEach(() => {
    initializeReactContainer()
  })

  it("renders a form", () => {
    render(<CustomerForm original={blankCustomer} />)
    expect(form()).not.toBeNull()
  })

  it("renders a submit button", () => {
    render(<CustomerForm original={blankCustomer} />)
    expect(submitButton()).not.toBeNull()
  })

  const itRendersAsATextBox = fieldName => {
    it("renders as a text box", () => {
      render(<CustomerForm original={blankCustomer} />)
      expect(field(fieldName)).toBeTruthy()
      expect(field(fieldName).tagName).toEqual("INPUT")
      expect(field(fieldName)).toBeInputFieldOfType("text")
    })
  }

  const itIncludesTheExistingValue = (fieldName, existing) => {
    it("includes the existing value", () => {
      const customer = { [fieldName]: existing }
      render(<CustomerForm original={customer} />)
      expect(field(fieldName).value).toEqual(existing)
    })
  }

  const itRendersALabel = (fieldName, text) => {
    it("renders a label", () => {
      render(<CustomerForm original={blankCustomer} />)
      expect(labelFor(fieldName)).not.toBeNull()
    })

    it(`renders '${text}' as the first name label content`, () => {
      render(<CustomerForm original={blankCustomer} />)
      expect(labelFor(fieldName)).toContainText(text)
    })
  }

  const itAssignsAnIDThatMatchesTheLabelID = fieldName => {
    it("assigns an id that matches the label id", () => {
      render(<CustomerForm original={blankCustomer} />)
      expect(field(fieldName).id).toEqual(fieldName)
    })
  }

  const itSavesExistingValueWhenSubmitted = (fieldName, value) => {
    it("saves existing value when submitted", () => {
      expect.hasAssertions()
      const customer = { [fieldName]: value }
      render(<CustomerForm original={customer} onSubmit={props => expect(props[fieldName]).toEqual(value)} />)
      click(submitButton())
    })
  }

  const itSavesNewValueWhenSubmitted = (fieldName, newValue) => {
    it("saves new value when submitted", () => {
      expect.hasAssertions()
      render(<CustomerForm original={blankCustomer} onSubmit={props => expect(props[fieldName]).toEqual(newValue)} />)
      change(field(fieldName), newValue)
      click(submitButton())
    })
  }

  describe("first name field", () => {
    itRendersAsATextBox("firstName")
    itIncludesTheExistingValue("firstName", "Ashley")
    itRendersALabel("firstName", "First name")
    itAssignsAnIDThatMatchesTheLabelID("firstName")
    itSavesExistingValueWhenSubmitted("firstName", "Ashley")
    itSavesNewValueWhenSubmitted("firstName", "Jordan")
  })

  describe("last name field", () => {
    itRendersAsATextBox("lastName")
    itIncludesTheExistingValue("lastName", "Ashley")
    itRendersALabel("lastName", "Last name")
    itAssignsAnIDThatMatchesTheLabelID("lastName")
    itSavesExistingValueWhenSubmitted("lastName", "Ashley")
    itSavesNewValueWhenSubmitted("lastName", "Jordan")
  })

  describe("phone number field", () => {
    itRendersAsATextBox("phoneNumber")
    itIncludesTheExistingValue("phoneNumber", "0123456")
    itRendersALabel("phoneNumber", "Phone number")
    itAssignsAnIDThatMatchesTheLabelID("phoneNumber")
    itSavesExistingValueWhenSubmitted("phoneNumber", "0123456")
    itSavesNewValueWhenSubmitted("phoneNumber", "111333555")
  })

  it("prevents the default action when submitting the form", () => {
    render(<CustomerForm original={blankCustomer} onSubmit={() => {}} />)

    const event = submit(form())

    expect(event.defaultPrevented).toBe(true)
  })
})
