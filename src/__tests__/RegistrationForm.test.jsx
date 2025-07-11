import { describe, it, expect, beforeEach, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
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
        const button = screen.getByRole("button", { name: /join us/i })
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
        fireEvent.change(screen.getByPlaceholderText("Prénom"), { target: { value: "123" } })
        fireEvent.change(screen.getByPlaceholderText("Nom"), { target: { value: "@@@" } })
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "badmail" } })
        fireEvent.change(screen.getByPlaceholderText("Ville"), { target: { value: "" } })
        fireEvent.change(screen.getByPlaceholderText("Code Postal"), { target: { value: "1234" } })

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
        expect(screen.getByTestId("error-city")).toHaveTextContent(/city is required/i)
    })

    it("saves valid data and resets the form", async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ message: "Utilisateur créé avec succès" }) });
        render(<RegistrationForm />)

        fireEvent.change(screen.getByPlaceholderText("Prénom"), { target: { value: "Alice" } })
        fireEvent.change(screen.getByPlaceholderText("Nom"), { target: { value: "Smith" } })
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "alice@example.com" } })
        fireEvent.change(screen.getByPlaceholderText("Ville"), { target: { value: "New York" } })
        fireEvent.change(screen.getByPlaceholderText("Code Postal"), { target: { value: "10001" } })

        const date = new Date()
        date.setFullYear(date.getFullYear() - 20)
        const birthDate = date.toISOString().split("T")[0]

        const dateInput = document.querySelector('input[type="date"]')
        fireEvent.change(dateInput, {
            target: { value: birthDate, name: "birthDate" },
        })

        const button = screen.getByRole("button", { name: /join us/i })
        expect(button).not.toBeDisabled()

        fireEvent.click(button)

        // Affiche le DOM pour debug si le test échoue
        // eslint-disable-next-line no-console
        // console.log(document.body.innerHTML);
        await waitFor(() => {
            const el = document.querySelector('p.success-message');
            expect(el).not.toBeNull();
            expect(el.textContent).toMatch(/registration successful/i);
        });

        // Check that form was reset
        expect(screen.getByPlaceholderText("Prénom")).toHaveValue("")
    })

    it("resets displayDate when birthDate is cleared", () => {
        render(<RegistrationForm />)

        // On renseigne d'abord une date
        const dateInput = document.querySelector('input[type="date"]')
        fireEvent.change(dateInput, {
            target: { value: "2000-01-01", name: "birthDate" },
        })

        // On l'efface
        fireEvent.change(dateInput, {
            target: { value: "", name: "birthDate" },
        })

        // Vérifie que le champ texte affiche bien "Date de naissance"
        const displayInput = screen.getByPlaceholderText("Date de naissance")
        expect(displayInput).toHaveValue("")
    })

    it("affiche une erreur serveur si fetch échoue", async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error("Server error"));
        render(<RegistrationForm />)
        fireEvent.change(screen.getByPlaceholderText("Prénom"), { target: { value: "Alice" } })
        fireEvent.change(screen.getByPlaceholderText("Nom"), { target: { value: "Smith" } })
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "alice@example.com" } })
        fireEvent.change(screen.getByPlaceholderText("Ville"), { target: { value: "New York" } })
        fireEvent.change(screen.getByPlaceholderText("Code Postal"), { target: { value: "10001" } })
        const date = new Date()
        date.setFullYear(date.getFullYear() - 20)
        const birthDate = date.toISOString().split("T")[0]
        const dateInput = document.querySelector('input[type="date"]')
        fireEvent.change(dateInput, {
            target: { value: birthDate, name: "birthDate" },
        })
        const button = screen.getByRole("button", { name: /join us/i })
        expect(button).not.toBeDisabled()
        fireEvent.click(button)
        await waitFor(() => {
            const el = document.querySelector('p.error-toast');
            expect(el).not.toBeNull();
            expect(el.textContent).toMatch(/server error/i);
            expect(document.querySelector('p.success-message')).toBeNull();
        });
    })

    it("affiche une erreur de validation si le formulaire est invalide", async () => {
        render(<RegistrationForm />)
        fireEvent.change(screen.getByPlaceholderText("Prénom"), { target: { value: "" } })
        fireEvent.change(screen.getByPlaceholderText("Nom"), { target: { value: "" } })
        fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "badmail" } })
        fireEvent.change(screen.getByPlaceholderText("Ville"), { target: { value: "" } })
        fireEvent.change(screen.getByPlaceholderText("Code Postal"), { target: { value: "1234" } })
        const dateInput = document.querySelector('input[type="date"]')
        fireEvent.change(dateInput, {
            target: { value: "2020-01-01", name: "birthDate" },
        })
        const button = screen.getByRole("button", { name: /join us/i })
        expect(button).toBeDisabled();
    })
})

