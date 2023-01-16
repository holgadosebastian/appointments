import React from "react"
import {
  initializeReactContainer,
  render,
  form,
  field,
  submit,
  submitButton,
  change,
  labelFor,
  clickAndWait,
  submitAndWait,
} from "./reactTestExtensions"
import { CustomerForm } from "../src/components/CustomerForm"

describe("CustomerForm", () => {
  const originalFetch = global.fetch
  let fetchSpy
  let returnValue
  const blankCustomer = { firstName: "", lastName: "", phoneNumber: "" }
  const spy = () => {
    let recievedArguments
    return {
      fn: (...args) => {
        recievedArguments = args
        return returnValue
      },
      recievedArguments: () => recievedArguments,
      recievedArgument: n => recievedArguments[n],
      stubReturnValue: value => (returnValue = value),
    }
  }

  const bodyOfLastFetchRequest = () => JSON.parse(fetchSpy.recievedArgument(1).body)

  const fetchResponseOk = body =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(body),
    })

  beforeEach(() => {
    initializeReactContainer()
    fetchSpy = spy()
    global.fetch = fetchSpy.fn
    fetchSpy.stubReturnValue(fetchResponseOk({}))
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it("renders a form", () => {
    render(<CustomerForm original={blankCustomer} onSave={() => {}} />)
    expect(form()).not.toBeNull()
  })

  it("renders a submit button", () => {
    render(<CustomerForm original={blankCustomer} onSave={() => {}} />)
    expect(submitButton()).not.toBeNull()
  })

  const itRendersAsATextBox = fieldName => {
    it("renders as a text box", () => {
      render(<CustomerForm original={blankCustomer} onSave={() => {}} />)
      expect(field(fieldName)).toBeTruthy()
      expect(field(fieldName)).toBeElementWithTag("INPUT")
      expect(field(fieldName)).toBeInputFieldOfType("text")
    })
  }

  const itIncludesTheExistingValue = (fieldName, existing) => {
    it("includes the existing value", () => {
      const customer = { [fieldName]: existing }
      render(<CustomerForm original={customer} onSave={() => {}} />)
      expect(field(fieldName).value).toEqual(existing)
    })
  }

  const itRendersALabel = (fieldName, text) => {
    it("renders a label", () => {
      render(<CustomerForm original={blankCustomer} onSave={() => {}} />)
      expect(labelFor(fieldName)).not.toBeNull()
    })

    it(`renders '${text}' as the first name label content`, () => {
      render(<CustomerForm original={blankCustomer} onSave={() => {}} />)
      expect(labelFor(fieldName)).toContainText(text)
    })
  }

  const itAssignsAnIDThatMatchesTheLabelID = fieldName => {
    it("assigns an id that matches the label id", () => {
      render(<CustomerForm original={blankCustomer} onSave={() => {}} />)
      expect(field(fieldName).id).toEqual(fieldName)
    })
  }

  const itSavesExistingValueWhenSubmitted = (fieldName, value) => {
    it("saves existing value when submitted", async () => {
      const customer = { [fieldName]: value }
      render(<CustomerForm original={customer} onSave={() => {}} />)
      clickAndWait(submitButton())

      expect(bodyOfLastFetchRequest()).toMatchObject(customer)
    })
  }

  const itSavesNewValueWhenSubmitted = (fieldName, newValue) => {
    it("saves new value when submitted", async () => {
      render(<CustomerForm original={blankCustomer} onSave={() => {}} />)
      change(field(fieldName), newValue)
      clickAndWait(submitButton())

      expect(bodyOfLastFetchRequest()).toMatchObject({ [fieldName]: newValue })
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

  it("prevents the default action when submitting the form", async () => {
    render(<CustomerForm original={blankCustomer} onSave={() => {}} />)

    const event = await submitAndWait(form())

    expect(event.defaultPrevented).toBe(true)
  })

  it("sends request to POST /customers when submitting the form", async () => {
    render(<CustomerForm original={blankCustomer} onSave={() => {}} />)
    clickAndWait(submitButton())
    expect(fetchSpy).toBeCalledWith("/customers", expect.objectContaining({ method: "POST" }))
  })

  it("calls fetch with the right configuration", async () => {
    render(<CustomerForm original={blankCustomer} onSave={() => {}} />)
    clickAndWait(submitButton())
    expect(fetchSpy).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      })
    )
  })

  it("notifies onSave when form is submitted", async () => {
    const customer = { id: 123 }
    fetchSpy.stubReturnValue(fetchResponseOk(customer))
    const saveSpy = spy()

    render(<CustomerForm original={customer} onSave={saveSpy.fn} />)
    await clickAndWait(submitButton())

    expect(saveSpy).toBeCalledWith(customer)
  })
})
