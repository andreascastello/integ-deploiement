import { describe, it, expect, beforeEach, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import RegistrationForm from "../components/RegistrationForm"
import { isValidName, isValidEmail, isValidPostalCode, isValidAge } from "../utils/validation"

// Mock the validation functions to ensure they're called with the right arguments
vi.mock("../utils/validation", () => ({
    isValidName: vi.fn(),
    isValidEmail: vi.fn(),
    isValidPostalCode: vi.fn(),
    isValidAge: vi.fn(),
}))

describe("RegistrationForm", () => {
    beforeEach(() => {
        localStorage.clear()
        vi.clearAllMocks()

        // Default mock implementations
        isValidName.mockImplementation(() => true)
        isValidEmail.mockImplementation(() => true)
        isValidPostalCode.mockImplementation(() => true)
        isValidAge.mockImplementation(() => true)
    })

    it("button is disabled if all fields are not filled", () => {
        render(<RegistrationForm />)
        const button = screen.getByRole("button", { name: /save/i })
        expect(button).toBeDisabled()
    })

    it("displays errors if fields are invalid", () => {
        // Set up validation functions to return false (invalid)
        isValidName.mockImplementation(() => false)
        isValidEmail.mockImplementation(() => false)
        isValidPostalCode.mockImplementation(() => false)
        isValidAge.mockImplementation(() => false)

        const { container } = render(<RegistrationForm />)

        // Fill in all fields with invalid data
        fireEvent.change(screen.getByPlaceholderText("First Name"), { target: { value: "123" } })
        fireEvent.change(screen.getByPlaceholderText("Last Name"), { target: { value: "@@@" } })
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "badmail" } })
        fireEvent.change(screen.getByPlaceholderText("City"), { target: { value: "Paris" } })
        fireEvent.change(screen.getByPlaceholderText("Postal Code"), { target: { value: "1234" } })

        const dateInput = document.querySelector('input[type="date"]')
        fireEvent.change(dateInput, {
            target: { value: "2020-01-01", name: "birthDate" },
        })

        // Get the form and submit it
        const form = container.querySelector("form")
        fireEvent.submit(form)

        // Check that validation functions were called
        expect(isValidName).toHaveBeenCalledTimes(2) // Called for first name and last name
        expect(isValidEmail).toHaveBeenCalledTimes(1)
        expect(isValidPostalCode).toHaveBeenCalledTimes(1)
        expect(isValidAge).toHaveBeenCalledTimes(1)

        // Check for error toast message
        expect(screen.getByText(/please correct the errors/i)).toBeInTheDocument()
        expect(screen.getByTestId("error-firstname")).toHaveTextContent(/invalid first name/i)
        expect(screen.getByTestId("error-lastname")).toHaveTextContent(/invalid last name/i)
        expect(screen.getByTestId("error-email")).toHaveTextContent(/invalid email/i)
        expect(screen.getByTestId("error-postalcode")).toHaveTextContent(/invalid postal code/i)
        expect(screen.getByTestId("error-birthdate")).toHaveTextContent(/age requirement/i)
    })

    it("saves valid data and resets the form", () => {
        render(<RegistrationForm />)

        fireEvent.change(screen.getByPlaceholderText("First Name"), { target: { value: "Alice" } })
        fireEvent.change(screen.getByPlaceholderText("Last Name"), { target: { value: "Smith" } })
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "alice@example.com" } })
        fireEvent.change(screen.getByPlaceholderText("City"), { target: { value: "New York" } })
        fireEvent.change(screen.getByPlaceholderText("Postal Code"), { target: { value: "10001" } })

        const date = new Date()
        date.setFullYear(date.getFullYear() - 20)
        const birthDate = date.toISOString().split("T")[0]

        const dateInput = document.querySelector('input[type="date"]')
        fireEvent.change(dateInput, {
            target: { value: birthDate, name: "birthDate" },
        })

        const button = screen.getByRole("button", { name: /save/i })
        expect(button).not.toBeDisabled()

        fireEvent.click(button)

        // Check that data was saved to localStorage
        expect(localStorage.getItem("registration")).toContain("Alice")

        // Check for success message
        expect(screen.getByText(/registration successful/i)).toBeInTheDocument()

        // Check that form was reset
        expect(screen.getByPlaceholderText("First Name")).toHaveValue("")
    })
})

