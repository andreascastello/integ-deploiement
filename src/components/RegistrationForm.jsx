"use client"

import { useState } from "react"
import { isValidName, isValidEmail, isValidPostalCode, isValidAge } from "../utils/validation"
import "./RegistrationForm.css"

/**
 * État initial du formulaire d'inscription.
 * Contient les champs requis pour l'utilisateur.
 *
 * @typedef {Object} FormData
 * @property {string} firstName - Prénom de l'utilisateur.
 * @property {string} lastName - Nom de l'utilisateur.
 * @property {string} email - Adresse email.
 * @property {string} birthDate - Date de naissance (YYYY-MM-DD).
 * @property {string} city - Ville de résidence.
 * @property {string} postalCode - Code postal français (5 chiffres).
 */
const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    city: "",
    postalCode: "",
}

const CalendarIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
)

export default function RegistrationForm() {
    const [formData, setFormData] = useState(initialState)
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState("")
    const [errorToast, setErrorToast] = useState("")
    const [displayDate, setDisplayDate] = useState("Date de naissance")

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })

        // Update display date when birthDate changes
        if (name === "birthDate" && value) {
            const date = new Date(value)
            const day = date.getDate().toString().padStart(2, "0")
            const month = (date.getMonth() + 1).toString().padStart(2, "0")
            const year = date.getFullYear()
            setDisplayDate(`${day}/${month}/${year}`)
        } else if (name === "birthDate" && !value) {
            setDisplayDate("Date de naissance")
        }
    }

    const validate = () => {
        const newErrors = {}
        if (!isValidName(formData.firstName)) newErrors.firstName = "invalid first name"
        if (!isValidName(formData.lastName)) newErrors.lastName = "invalid last name"
        if (!isValidEmail(formData.email)) newErrors.email = "invalid email"
        if (!isValidAge(formData.birthDate)) newErrors.birthDate = "age requirement: 18+"
        if (!formData.city) newErrors.city = "city is required"
        if (!isValidPostalCode(formData.postalCode)) newErrors.postalCode = "invalid postal code"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            localStorage.setItem("registration", JSON.stringify(formData))
            setSuccess("Registration successful!")
            setErrorToast("")
            setFormData(initialState)
            setDisplayDate("Date de naissance")
        } else {
            setSuccess("")
            setErrorToast("Please correct the errors.")
        }
    }

    const isFormComplete = Object.values(formData).every((value) => typeof value === "string" && value.trim() !== "")

    return (
        <div className="form-container">
            <div className="form-panel">
                <div className="form-content">
                    <h1 className="form-title">REJOINS SA BRIGADE</h1>

                    <form onSubmit={handleSubmit} data-testid="registration-form">
                        {success && <p className="success-message">{success}</p>}
                        {errorToast && <p className="error-toast">{errorToast}</p>}

                        <div className="form-field">
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Nom"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={errors.lastName ? "input-error" : ""}
                            />
                            {errors.lastName && (
                                <p data-testid="error-lastname" className="error-message">
                                    {errors.lastName}
                                </p>
                            )}
                        </div>

                        <div className="form-field">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Prénom"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={errors.firstName ? "input-error" : ""}
                            />
                            {errors.firstName && (
                                <p data-testid="error-firstname" className="error-message">
                                    {errors.firstName}
                                </p>
                            )}
                        </div>

                        <div className="form-field">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? "input-error" : ""}
                            />
                            {errors.email && (
                                <p data-testid="error-email" className="error-message">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="form-field">
                            <div className="date-input-wrapper">
                                <input
                                    type="text"
                                    readOnly
                                    placeholder="Date de naissance"
                                    value={displayDate !== "Date de naissance" ? displayDate : ""}
                                    className={errors.birthDate ? "input-error" : ""}
                                />
                                <div className="calendar-button">
                                    <CalendarIcon />
                                </div>
                                <input
                                    type="date"
                                    name="birthDate"
                                    aria-label="birthdate"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.birthDate && (
                                <p data-testid="error-birthdate" className="error-message">
                                    {errors.birthDate}
                                </p>
                            )}
                        </div>

                        <div className="form-row">
                            <div className="form-field half">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Ville"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className={errors.city ? "input-error" : ""}
                                />
                                {errors.city && (
                                    <p data-testid="error-city" className="error-message">
                                        {errors.city}
                                    </p>
                                )}
                            </div>

                            <div className="form-field half">
                                <input
                                    type="text"
                                    name="postalCode"
                                    placeholder="Code Postal"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    className={errors.postalCode ? "input-error" : ""}
                                />
                                {errors.postalCode && (
                                    <p data-testid="error-postalcode" className="error-message">
                                        {errors.postalCode}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button type="submit" disabled={!isFormComplete} className="submit-button">
                            JOINS US
                        </button>
                    </form>
                </div>
                <div className="octopus-chef"></div>
            </div>
        </div>
    )
}

// Export for testing
export { initialState }
