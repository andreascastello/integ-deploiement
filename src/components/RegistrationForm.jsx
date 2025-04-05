"use client"

import { useState } from "react"
import { isValidName, isValidEmail, isValidPostalCode, isValidAge } from "../utils/validation"

const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    city: "",
    postalCode: "",
}

export default function RegistrationForm() {
    const [formData, setFormData] = useState(initialState)
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState("")
    const [errorToast, setErrorToast] = useState("")

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Export validate function for testing
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
        } else {
            setSuccess("")
            setErrorToast("Please correct the errors.")
        }
    }

    const isFormComplete = Object.values(formData).every((value) => typeof value === "string" && value.trim() !== "")

    return (
        <form onSubmit={handleSubmit} data-testid="registration-form">
            {success && <p style={{ color: "green" }}>{success}</p>}
            {errorToast && <p style={{ color: "red" }}>{errorToast}</p>}

            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
            {errors.firstName && (
                <p data-testid="error-firstname" style={{ color: "red" }}>
                    {errors.firstName}
                </p>
            )}

            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
            {errors.lastName && (
                <p data-testid="error-lastname" style={{ color: "red" }}>
                    {errors.lastName}
                </p>
            )}

            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            {errors.email && (
                <p data-testid="error-email" style={{ color: "red" }}>
                    {errors.email}
                </p>
            )}

            <input type="date" name="birthDate" aria-label="birthdate" value={formData.birthDate} onChange={handleChange} />
            {errors.birthDate && (
                <p data-testid="error-birthdate" style={{ color: "red" }}>
                    {errors.birthDate}
                </p>
            )}

            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
            {errors.city && (
                <p data-testid="error-city" style={{ color: "red" }}>
                    {errors.city}
                </p>
            )}

            <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={handleChange}
            />
            {errors.postalCode && (
                <p data-testid="error-postalcode" style={{ color: "red" }}>
                    {errors.postalCode}
                </p>
            )}

            <button type="submit" disabled={!isFormComplete}>
                Save
            </button>
        </form>
    )
}

// Export for testing
export { initialState }

