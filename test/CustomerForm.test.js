import React from "react"
import { act } from "react-dom/test-utils"
import { expectRedux } from "expect-redux"
import {
  initializeReactContainer,
  renderWithStore,
  dispatchToStore,
  store,
  element,
  form,
  field,
  submitButton,
  change,
  labelFor,
  clickAndWait,
  submitAndWait,
  withFocus,
  textOf,
  elements,
} from "./reactTestExtensions"
import { bodyOfLastFetchRequest } from "./spyHelpers"
import { fetchResponseOk, fetchResponseError } from "./builders/fetch"
import { blankCustomer, validCustomer } from "./builders/customer"
import { CustomerForm } from "../src/components/CustomerForm"

describe("CustomerForm", () => {
  const errorFor = fieldName => element(`#${fieldName}Error[role=alert]`)

  beforeEach(() => {
    initializeReactContainer()
    jest.spyOn(global, "fetch").mockResolvedValue(fetchResponseOk({}))
  })

  it("renders a form", () => {
    renderWithStore(<CustomerForm original={blankCustomer} />)
    expect(form()).not.toBeNull()
  })

  it("renders a submit button", () => {
    renderWithStore(<CustomerForm original={blankCustomer} />)
    expect(submitButton()).not.toBeNull()
  })

  const itRendersAsATextBox = fieldName => {
    it("renders as a text box", () => {
      renderWithStore(<CustomerForm original={blankCustomer} />)
      expect(field(fieldName)).toBeTruthy()
      expect(field(fieldName)).toBeElementWithTag("INPUT")
      expect(field(fieldName)).toBeInputFieldOfType("text")
    })
  }

  const itIncludesTheExistingValue = (fieldName, existing) => {
    it("includes the existing value", () => {
      const customer = { [fieldName]: existing }
      renderWithStore(<CustomerForm original={customer} />)
      expect(field(fieldName).value).toEqual(existing)
    })
  }

  const itRendersALabel = (fieldName, text) => {
    it("renders a label", () => {
      renderWithStore(<CustomerForm original={blankCustomer} />)
      expect(labelFor(fieldName)).not.toBeNull()
    })

    it(`renders '${text}' as the first name label content`, () => {
      renderWithStore(<CustomerForm original={blankCustomer} />)
      expect(labelFor(fieldName)).toContainText(text)
    })
  }

  const itAssignsAnIDThatMatchesTheLabelID = fieldName => {
    it("assigns an id that matches the label id", () => {
      renderWithStore(<CustomerForm original={blankCustomer} />)
      expect(field(fieldName).id).toEqual(fieldName)
    })
  }

  const itSavesExistingValueWhenSubmitted = (fieldName, value) => {
    it("saves existing value when submitted", async () => {
      const customer = { [fieldName]: value }
      renderWithStore(<CustomerForm original={validCustomer} />)
      clickAndWait(submitButton())

      expect(bodyOfLastFetchRequest()).toMatchObject(validCustomer)
    })
  }

  const itSavesNewValueWhenSubmitted = (fieldName, newValue) => {
    it("saves new value when submitted", async () => {
      renderWithStore(<CustomerForm original={validCustomer} />)
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
    renderWithStore(<CustomerForm original={blankCustomer} />)

    const event = await submitAndWait(form())

    expect(event.defaultPrevented).toBe(true)
  })

  it("dispatches ADD_CUSTOMER_REQUEST when submitting data", async () => {
    renderWithStore(<CustomerForm original={validCustomer} />)
    await clickAndWait(submitButton())
    return expectRedux(store).toDispatchAnAction().matching({
      type: "ADD_CUSTOMER_REQUEST",
      customer: validCustomer,
    })
  })

  it("renders an alert space", () => {
    renderWithStore(<CustomerForm original={blankCustomer} />)
    expect(element("[role=alert]")).not.toBeNull()
  })

  it("initially has no text in the alert space", async () => {
    renderWithStore(<CustomerForm original={blankCustomer} />)
    expect(element("[role=alert]")).not.toContainText("error occurred")
  })

  describe("when POST request returns an error", () => {
    it("renders an error message when error prop is true", async () => {
      renderWithStore(<CustomerForm original={validCustomer} />)
      dispatchToStore({ type: "ADD_CUSTOMER_FAILED" })
      expect(element("[role=alert]")).toContainText("error occurred")
    })

    it("renders field validation errors from server", () => {
      const errors = {
        phoneNumber: "Phone number already exists in the system",
      }

      renderWithStore(<CustomerForm original={validCustomer} />)
      dispatchToStore({
        type: "ADD_CUSTOMER_VALIDATION_FAILED",
        validationErrors: errors,
      })
      expect(errorFor("phoneNumber")).toContainText(errors.phoneNumber)
    })
  })

  describe("validation", () => {
    const itSetsAlertAsAccessibleDescriptionForField = fieldName => {
      it(`sets alert as the accessible description for the ${fieldName} field`, async () => {
        renderWithStore(<CustomerForm original={blankCustomer} />)
        expect(field(fieldName).getAttribute("aria-describedby")).toEqual(`${fieldName}Error`)
      })
    }

    const itInvalidatesFieldWithValue = (fieldName, value, description) => {
      it(`displays error after blur when ${fieldName} field is blank`, () => {
        renderWithStore(<CustomerForm original={blankCustomer} />)

        withFocus(field(fieldName), () => change(field(fieldName), value))

        expect(errorFor(fieldName)).toContainText(description)
      })
    }

    const itInitiallydDoesNotRenderAlertSpace = fieldName => {
      it(`initially has no text in the ${fieldName} field alert space`, async () => {
        renderWithStore(<CustomerForm original={blankCustomer} />)
        expect(errorFor(fieldName)).toBeNull()
      })
    }

    itSetsAlertAsAccessibleDescriptionForField("firstName")
    itInvalidatesFieldWithValue("firstName", " ", "First name is required")
    itInitiallydDoesNotRenderAlertSpace("firstName")

    itSetsAlertAsAccessibleDescriptionForField("lastName")
    itInvalidatesFieldWithValue("lastName", " ", "Last name is required")
    itInitiallydDoesNotRenderAlertSpace("lastName")

    itSetsAlertAsAccessibleDescriptionForField("phoneNumber")
    itInvalidatesFieldWithValue("phoneNumber", " ", "Phone number is required")
    itInitiallydDoesNotRenderAlertSpace("phoneNumber")
    itInvalidatesFieldWithValue("phoneNumber", "invalid", "Only numbers, spaces and the symbols are allowed: ( ) + -")
    it("accepts standard phone number characters when validating", () => {
      renderWithStore(<CustomerForm original={blankCustomer} />)

      withFocus(field("phoneNumber"), () => change(field("phoneNumber"), "0123456789+()- "))

      expect(errorFor("phoneNumber")).toBeNull()
    })
  })

  it("does not asubmit the form when there are validation errors", async () => {
    renderWithStore(<CustomerForm original={blankCustomer} />)

    await clickAndWait(submitButton())
    return expectRedux(store).toNotDispatchAnAction(100).ofType("ADD_CUSTOMER_REQUEST")
  })

  it("renders validation error after submission fails", async () => {
    renderWithStore(<CustomerForm original={blankCustomer} />)
    await clickAndWait(submitButton())
    expect(textOf(elements("[role=alert]"))).not.toEqual(["", "", "", ""])
  })

  describe("submitting indicator", () => {
    it("displays when form is submitting", () => {
      renderWithStore(<CustomerForm original={validCustomer} />)

      dispatchToStore({ type: "ADD_CUSTOMER_SUBMITTING" })
      expect(element("span.submittingIndicator")).not.toBeNull()
    })

    it("initially does not display the submitting indicator", () => {
      renderWithStore(<CustomerForm original={validCustomer} />)
      expect(element("span.submittingIndicator")).toBeNull()
    })

    it("hides after submission", () => {
      renderWithStore(<CustomerForm original={validCustomer} />)

      dispatchToStore({ type: "ADD_CUSTOMER_SUCCESSFUL" })
      expect(element("span.submittingIndicator")).toBeNull()
    })
  })

  it("disables the submit button when form is submitted", () => {
    renderWithStore(<CustomerForm original={validCustomer} />)
    dispatchToStore({ type: "ADD_CUSTOMER_SUCCESSFUL" })
    expect(submitButton().disabled).toBe(true)
  })
})
