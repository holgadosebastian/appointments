import React from "react"
import {
  initializeReactContainer,
  render,
  element,
  form,
  field,
  submitButton,
  change,
  labelFor,
  clickAndWait,
  submitAndWait,
  withFocus,
} from "./reactTestExtensions"
import { bodyOfLastFetchRequest } from "./spyHelpers"
import { fetchResponseOk, fetchResponseError } from "./builders/fetch"
import { blankCustomer } from "./builders/customer"
import { CustomerForm } from "../src/components/CustomerForm"
import { blankAppointment } from "./builders/appointment"
import { util } from "webpack"

describe("CustomerForm", () => {
  beforeEach(() => {
    initializeReactContainer()
    jest.spyOn(global, "fetch").mockResolvedValue(fetchResponseOk({}))
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
    expect(global.fetch).toBeCalledWith("/customers", expect.objectContaining({ method: "POST" }))
  })

  it("calls fetch with the right configuration", async () => {
    render(<CustomerForm original={blankCustomer} onSave={() => {}} />)
    clickAndWait(submitButton())
    expect(global.fetch).toBeCalledWith(
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
    global.fetch.mockResolvedValue(fetchResponseOk(customer))
    const saveSpy = jest.fn()

    render(<CustomerForm original={customer} onSave={saveSpy} />)
    await clickAndWait(submitButton())

    expect(saveSpy).toBeCalledWith(customer)
  })

  it("renders an alert space", () => {
    render(<CustomerForm original={blankCustomer} />)
    expect(element("[role=alert]")).not.toBeNull()
  })

  it("initially has no text in the alert space", async () => {
    render(<CustomerForm original={blankCustomer} />)
    expect(element("[role=alert]")).not.toContainText("error occurred")
  })

  describe("when POST request returns an error", () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue(fetchResponseError())
    })

    it("does not notify onSave ", async () => {
      const saveSpy = jest.fn()

      render(<CustomerForm original={blankCustomer} onSave={saveSpy} />)
      await clickAndWait(submitButton())

      expect(saveSpy).not.toBeCalled()
    })

    it("renders an error message", async () => {
      render(<CustomerForm original={blankCustomer} />)
      await clickAndWait(submitButton())

      expect(element("[role=alert]")).toContainText("error occurred")
    })

    it("clears error message after successful submit", async () => {
      render(<CustomerForm original={blankCustomer} onSave={() => {}} />)
      await clickAndWait(submitButton())

      global.fetch.mockResolvedValue(fetchResponseOk())
      await clickAndWait(submitButton())

      expect(element("[role=alert]")).not.toContainText("error occurred")
    })
  })

  describe("validation", () => {
    const errorFor = fieldName => element(`#${fieldName}Error[role=alert]`)

    const itRendersAlertForFieldValidation = fieldName => {
      it(`renders an alert space for ${fieldName} validation errors`, async () => {
        render(<CustomerForm original={blankAppointment} />)
        expect(errorFor(fieldName)).not.toBeNull()
      })
    }

    const itSetsAlertAsAccessibleDescriptionForField = fieldName => {
      it(`sets alert as the accessible description for the ${fieldName} field`, async () => {
        render(<CustomerForm original={blankCustomer} />)
        expect(field(fieldName).getAttribute("aria-describedby")).toEqual(`${fieldName}Error`)
      })
    }

    const itValidatesFieldWithValue = (fieldName, value, description) => {
      it(`displays error after blur when ${fieldName} field is blank`, () => {
        render(<CustomerForm original={blankCustomer} />)

        withFocus(field(fieldName), () => change(field(fieldName), value))

        expect(errorFor(fieldName)).toContainText(description)
      })
    }

    const itInitiallyHasNoTextInTheAlertSpace = fieldName => {
      it(`initially has no text in the ${fieldName} field alert space`, async () => {
        render(<CustomerForm original={blankCustomer} />)
        expect(errorFor(fieldName).textContent).toEqual("")
      })
    }

    itRendersAlertForFieldValidation("firstName")
    itSetsAlertAsAccessibleDescriptionForField("firstName")
    itValidatesFieldWithValue("firstName", " ", "First name is required")
    itInitiallyHasNoTextInTheAlertSpace("firstName")

    itRendersAlertForFieldValidation("lastName")
    itSetsAlertAsAccessibleDescriptionForField("lastName")
    itValidatesFieldWithValue("lastName", " ", "Last name is required")
    itInitiallyHasNoTextInTheAlertSpace("lastName")

    itRendersAlertForFieldValidation("phoneNumber")
    itSetsAlertAsAccessibleDescriptionForField("phoneNumber")
    itValidatesFieldWithValue("phoneNumber", " ", "Phone number is required")
    itInitiallyHasNoTextInTheAlertSpace("phoneNumber")
  })
})
